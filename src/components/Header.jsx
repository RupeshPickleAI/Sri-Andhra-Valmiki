// src/components/Header.jsx
import React, { useState, useRef, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/2.jpeg";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import Avatar from "@mui/material/Avatar";
import Popover from "@mui/material/Popover";
import Drawer from "@mui/material/Drawer";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

import HomeIcon from "@mui/icons-material/Home";
import ArticleIcon from "@mui/icons-material/Article";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import InfoIcon from "@mui/icons-material/Info";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";

import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DoneAllIcon from "@mui/icons-material/DoneAll";

// ✅ ADDED: authSession
import { authSession } from "../utils/authSession";

const API_BASE = "http://localhost:5000";
const NOTIF_API_BASE = `${API_BASE}/api/notifications`;

async function apiFetch(url, options = {}) {
  const res = await fetch(url, options);
  const text = await res.text();
  let json = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = null;
  }

  if (!res.ok) {
    const msg = json?.message || json?.error || `Request failed: ${res.status}`;
    const err = new Error(msg);
    err.status = res.status;
    err.url = url;
    err.payload = json ?? text;
    throw err;
  }
  return json ?? {};
}

const timeAgo = (iso) => {
  if (!iso) return "";
  const t = new Date(iso).getTime();
  const diff = Date.now() - t;
  const sec = Math.floor(diff / 1000);
  if (sec < 60) return `${sec}s ago`;
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.floor(hr / 24);
  return `${day}d ago`;
};

// ✅ ADDED: build display profile from localStorage.me + role
function buildProfile() {
  const role = localStorage.getItem("role") || "user";
  let me = null;
  try {
    me = JSON.parse(localStorage.getItem("me") || "null");
  } catch {
    me = null;
  }

  // supports shapes: {user:{...}} OR {...}
  const u = me?.user ? me.user : me;

  const email = u?.email || (role === "admin" ? "admin" : "");
  const first = (u?.firstName || "").trim();
  const last = (u?.lastName || "").trim();
  const fullName = `${first} ${last}`.trim();

  const name =
    fullName ||
    (role === "admin" ? "Admin" : "User");

  return {
    role,
    name,
    email: email || "—",
  };
}

const Header = () => {
  const [anchorNotif, setAnchorNotif] = useState(null);
  const [anchorUser, setAnchorUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // ✅ ADDED: profile state
  const [profile, setProfile] = useState(() => buildProfile());

  // ✅ Audio state
  const [isMuted, setIsMuted] = useState(false);
  const [currentAudio, setCurrentAudio] = useState(null);
  const [loadingAudio, setLoadingAudio] = useState(false);
  const [audioError, setAudioError] = useState("");

  // ✅ Notifications state (CRUD)
  const [notifications, setNotifications] = useState([]);
  const [notifLoading, setNotifLoading] = useState(false);
  const [notifError, setNotifError] = useState("");
  const [notifDraft, setNotifDraft] = useState("");

  const wasPlayingBeforeHideRef = useRef(false);

  const navigate = useNavigate();
  const audioRef = useRef(null);

  // ✅ ADDED: keep profile synced when storage changes (login/logout in another tab)
  useEffect(() => {
    const sync = () => setProfile(buildProfile());
    sync();
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  const handleNotifClick = async (event) => {
    setAnchorNotif(event.currentTarget);
    await loadNotifications();
  };

  const handleUserClick = (event) => setAnchorUser(event.currentTarget);
  const handleClose = () => {
    setAnchorNotif(null);
    setAnchorUser(null);
  };

  // ✅ CHANGED: real logout
  const handleLogout = () => {
    handleClose();

    // stop audio
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }

    // ✅ clear auth but KEEP otp_verified_once
    authSession.logout({ keepOtpVerifiedOnce: true });

    // update UI state
    setProfile(buildProfile());

    // ✅ redirect to login
    navigate("/login", { replace: true });
  };

  const toggleMobileMenu = () => setMobileMenuOpen((p) => !p);

  const handleNavClick = (path) => {
    setMobileMenuOpen(false);
    navigate(path);
  };

  // ---------------------------
  // ✅ Notifications helpers
  // ---------------------------
  const unreadCount = useMemo(
    () => notifications.filter((n) => !n?.isRead).length,
    [notifications]
  );

  const loadNotifications = async () => {
    try {
      setNotifLoading(true);
      setNotifError("");
      const json = await apiFetch(NOTIF_API_BASE);
      const list = Array.isArray(json?.data) ? json.data : [];
      setNotifications(list);
    } catch (e) {
      console.error(e);
      setNotifError(e.message || "Failed to load notifications");
    } finally {
      setNotifLoading(false);
    }
  };

  const markOneRead = async (n) => {
    const id = n?._id || n?.id;
    if (!id) return;

    setNotifications((prev) =>
      prev.map((x) => ((x._id || x.id) === id ? { ...x, isRead: true } : x))
    );

    try {
      await apiFetch(`${NOTIF_API_BASE}/${encodeURIComponent(id)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isRead: true }),
      });
    } catch (e) {
      console.error(e);
      setNotifications((prev) =>
        prev.map((x) => ((x._id || x.id) === id ? { ...x, isRead: n.isRead } : x))
      );
    }
  };

  const toggleRead = async (n) => {
    const id = n?._id || n?.id;
    if (!id) return;
    const nextRead = !n?.isRead;

    setNotifications((prev) =>
      prev.map((x) => ((x._id || x.id) === id ? { ...x, isRead: nextRead } : x))
    );

    try {
      await apiFetch(`${NOTIF_API_BASE}/${encodeURIComponent(id)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isRead: nextRead }),
      });
    } catch (e) {
      console.error(e);
      setNotifications((prev) =>
        prev.map((x) => ((x._id || x.id) === id ? { ...x, isRead: n.isRead } : x))
      );
    }
  };

  const markAllRead = async () => {
    const unread = notifications.filter((n) => !n.isRead);
    if (unread.length === 0) return;

    setNotifications((prev) => prev.map((x) => ({ ...x, isRead: true })));

    try {
      for (const n of unread) {
        const id = n?._id || n?.id;
        if (!id) continue;
        // eslint-disable-next-line no-await-in-loop
        await apiFetch(`${NOTIF_API_BASE}/${encodeURIComponent(id)}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ isRead: true }),
        });
      }
    } catch (e) {
      console.error(e);
      await loadNotifications();
    }
  };

  const createNotificationQuick = async () => {
    const text = notifDraft.trim();
    if (!text) return;

    try {
      setNotifLoading(true);
      setNotifError("");
      await apiFetch(NOTIF_API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      setNotifDraft("");
      await loadNotifications();
    } catch (e) {
      console.error(e);
      setNotifError(e.message || "Failed to create notification");
    } finally {
      setNotifLoading(false);
    }
  };

  const editNotification = async (n) => {
    const id = n?._id || n?.id;
    if (!id) return;

    const nextText = window.prompt("Edit notification text:", n?.text || "");
    if (nextText == null) return;

    const text = nextText.trim();
    if (!text) return;

    const prevText = n.text;
    setNotifications((prev) =>
      prev.map((x) => ((x._id || x.id) === id ? { ...x, text } : x))
    );

    try {
      await apiFetch(`${NOTIF_API_BASE}/${encodeURIComponent(id)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
    } catch (e) {
      console.error(e);
      setNotifications((prev) =>
        prev.map((x) => ((x._id || x.id) === id ? { ...x, text: prevText } : x))
      );
    }
  };

  const deleteNotification = async (n) => {
    const id = n?._id || n?.id;
    if (!id) return;
    const ok = window.confirm("Delete this notification?");
    if (!ok) return;

    const prev = notifications;
    setNotifications((p) => p.filter((x) => (x._id || x.id) !== id));

    try {
      await apiFetch(`${NOTIF_API_BASE}/${encodeURIComponent(id)}`, { method: "DELETE" });
    } catch (e) {
      console.error(e);
      setNotifications(prev);
    }
  };

  useEffect(() => {
    loadNotifications();
    const t = setInterval(loadNotifications, 20000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---------------------------
  // Audio fetch default on mount
  // ---------------------------
  useEffect(() => {
    const fetchDefaultAudio = async () => {
      try {
        setLoadingAudio(true);
        setAudioError("");
        const res = await fetch(`${API_BASE}/api/audio/default`);
        const json = await res.json();

        if (!res.ok || !json.success || !json.data) {
          throw new Error(json.error || "No default audio available");
        }

        setCurrentAudio(json.data);
      } catch (err) {
        console.error("Error fetching default audio:", err);
        setAudioError(err.message || "Error fetching default audio");
      } finally {
        setLoadingAudio(false);
      }
    };

    fetchDefaultAudio();
  }, []);

  const safePlay = async () => {
    const audio = audioRef.current;
    if (!audio || !currentAudio?.url) return;

    try {
      audio.muted = false;
      audio.volume = 1;
      await audio.play();
      setAudioError("");
    } catch (err) {
      console.warn("Play blocked:", err);
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (currentAudio?.url) {
      audio.src = currentAudio.url;
      audio.loop = true;
      audio.load();

      const onCanPlay = async () => {
        if (!isMuted && !document.hidden) {
          await safePlay();
        }
      };

      audio.addEventListener("canplay", onCanPlay);

      return () => {
        audio.removeEventListener("canplay", onCanPlay);
      };
    } else {
      audio.pause();
      audio.src = "";
    }
  }, [currentAudio]); // keep only currentAudio

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleVisibility = async () => {
      const isHidden = document.hidden;

      if (isHidden) {
        wasPlayingBeforeHideRef.current = !audio.paused && !audio.ended;
        audio.pause();
      } else {
        if (!isMuted && wasPlayingBeforeHideRef.current) {
          await safePlay();
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("blur", handleVisibility);
    window.addEventListener("focus", handleVisibility);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("blur", handleVisibility);
      window.removeEventListener("focus", handleVisibility);
    };
  }, [isMuted, currentAudio]);

  const handleMuteToggle = async () => {
    const audio = audioRef.current;
    if (!audio || !currentAudio?.url) return;

    if (isMuted) {
      setIsMuted(false);
      if (!document.hidden) {
        await safePlay();
      }
    } else {
      audio.pause();
      setIsMuted(true);
    }
  };

  const navItems = [
    { label: "Home", icon: <HomeIcon />, path: "/home" },
    { label: "Articles", icon: <ArticleIcon />, path: "/home/articles" },
    { label: "Gallery", icon: <PhotoLibraryIcon />, path: "/home/gallery" },
    { label: "Videos", icon: <PlayCircleIcon />, path: "/home/videos" },
    { label: "About", icon: <InfoIcon />, path: "/home/about" },
  ];

  return (
    <header className="bg-gradient-to-r from-orange-500 to-yellow-400 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Left: Logo + Title */}
          <div className="flex items-center gap-2 sm:gap-3">
            <img
              src={logo}
              alt="Bhakti Logo"
              className="w-12 h-12 sm:w-16 sm:h-16 object-contain drop-shadow-lg rounded-full"
            />
            <div className="flex flex-col leading-tight">
              <h1 className="text-base sm:text-2xl md:text-3xl font-extrabold text-white tracking-wide drop-shadow-[0_2px_6px_rgba(0,0,0,0.3)]">
                Sri Andhra Valmiki
              </h1>
            </div>
          </div>

          {/* Right: Desktop Navigation + Actions */}
          <div className="flex items-center gap-2">
            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-2">
              <Stack direction="row" spacing={1}>
                {navItems.map((item) => (
                  <Tooltip key={item.label} title={item.label} arrow>
                    <Button
                      component={Link}
                      to={item.path}
                      startIcon={React.cloneElement(item.icon, { fontSize: "small" })}
                      size="small"
                      sx={{
                        bgcolor: "white",
                        color: "#f97316",
                        fontWeight: 700,
                        fontSize: "0.8rem",
                        px: 1.5,
                        py: 0.6,
                        minWidth: "auto",
                        borderRadius: 2,
                        textTransform: "none",
                        "&:hover": {
                          bgcolor: "#ffe0b2",
                          transform: "translateY(-2px)",
                          boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
                        },
                        transition: "all 0.2s ease",
                      }}
                    >
                      {item.label}
                    </Button>
                  </Tooltip>
                ))}
              </Stack>
            </nav>

            {/* Action Icons */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Audio Control */}
              <Tooltip
                title={
                  loadingAudio
                    ? "Loading audio..."
                    : !currentAudio
                    ? audioError || "No song configured"
                    : isMuted
                    ? "Play Music"
                    : "Pause Music"
                }
                arrow
              >
                <span>
                  <IconButton
                    onClick={handleMuteToggle}
                    size="small"
                    disabled={loadingAudio || !currentAudio}
                    sx={{
                      bgcolor: "rgba(255,255,255,0.2)",
                      "&:hover": { bgcolor: "rgba(255,255,255,0.3)" },
                      "&:disabled": { bgcolor: "rgba(255,255,255,0.1)" },
                    }}
                  >
                    {isMuted ? (
                      <VolumeOffIcon fontSize="small" sx={{ color: "white" }} />
                    ) : (
                      <VolumeUpIcon fontSize="small" sx={{ color: "white" }} />
                    )}
                  </IconButton>
                </span>
              </Tooltip>

              {/* Notifications */}
              <Tooltip title="Notifications" arrow>
                <IconButton
                  onClick={handleNotifClick}
                  size="small"
                  sx={{
                    bgcolor: "rgba(255,255,255,0.2)",
                    "&:hover": { bgcolor: "rgba(255,255,255,0.3)" },
                  }}
                >
                  <Badge badgeContent={unreadCount} color="error">
                    <NotificationsIcon fontSize="small" sx={{ color: "white" }} />
                  </Badge>
                </IconButton>
              </Tooltip>

              {/* Profile */}
              <Tooltip title="Profile" arrow>
                <IconButton
                  onClick={handleUserClick}
                  size="small"
                  sx={{
                    bgcolor: "rgba(255,255,255,0.2)",
                    "&:hover": { bgcolor: "rgba(255,255,255,0.3)" },
                  }}
                >
                  <AccountCircleIcon fontSize="small" sx={{ color: "white" }} />
                </IconButton>
              </Tooltip>

              {/* Mobile Menu Toggle */}
              <IconButton
                onClick={toggleMobileMenu}
                size="small"
                className="lg:hidden"
                sx={{
                  bgcolor: "rgba(255,255,255,0.2)",
                  "&:hover": { bgcolor: "rgba(255,255,255,0.3)" },
                }}
              >
                <MenuIcon fontSize="medium" sx={{ color: "white" }} />
              </IconButton>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden audio element */}
      <audio ref={audioRef} style={{ display: "none" }} />

      {/* Mobile Navigation Drawer */}
      <Drawer
        anchor="right"
        open={mobileMenuOpen}
        onClose={toggleMobileMenu}
        sx={{
          "& .MuiDrawer-paper": {
            width: 280,
            background: "linear-gradient(to bottom, #f97316, #fbbf24)",
          },
        }}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 bg-white/10">
            <Typography variant="h6" sx={{ color: "white", fontWeight: "bold" }}>
              Menu
            </Typography>
            <IconButton onClick={toggleMobileMenu} size="small">
              <CloseIcon sx={{ color: "white" }} />
            </IconButton>
          </div>

          <Divider sx={{ bgcolor: "rgba(255,255,255,0.2)" }} />

          <List sx={{ flexGrow: 1, py: 2 }}>
            {navItems.map((item) => (
              <ListItem key={item.label} disablePadding>
                <ListItemButton
                  onClick={() => handleNavClick(item.path)}
                  sx={{
                    py: 1.5,
                    px: 3,
                    "&:hover": { bgcolor: "rgba(255,255,255,0.15)" },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40, color: "white" }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{ fontWeight: 600, color: "white" }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </div>
      </Drawer>

      {/* ✅ User Popover (CHANGED: shows logged-in user) */}
      <Popover
        open={Boolean(anchorUser)}
        anchorEl={anchorUser}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        sx={{
          "& .MuiPopover-paper": {
            borderRadius: 2,
            boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
          },
        }}
      >
        <div className="p-4 w-64">
          <div className="flex items-center gap-3 mb-3">
            <Avatar sx={{ width: 48, height: 48 }}>
              {String(profile?.name || "U").slice(0, 1).toUpperCase()}
            </Avatar>

            <div>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                {profile?.name || "User"}
              </Typography>

              <Typography variant="body2" color="textSecondary" sx={{ fontSize: "0.75rem" }}>
                {profile?.email || "—"}
              </Typography>

              <Typography variant="caption" sx={{ display: "block", mt: 0.5, fontWeight: 800, color: "#f97316" }}>
                {String(profile?.role || "user").toUpperCase()}
              </Typography>
            </div>
          </div>

          <Divider sx={{ my: 1 }} />

          <Button
            variant="outlined"
            startIcon={<LogoutIcon fontSize="small" />}
            fullWidth
            color="error"
            onClick={handleLogout}
            sx={{
              textTransform: "none",
              fontWeight: "bold",
              borderRadius: 2,
              "&:hover": { bgcolor: "#ffebee", borderColor: "#d32f2f" },
            }}
          >
            Logout
          </Button>
        </div>
      </Popover>

      {/* Notifications Popover (your existing code unchanged below) */}
      <Popover
        open={Boolean(anchorNotif)}
        anchorEl={anchorNotif}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        sx={{
          "& .MuiPopover-paper": {
            borderRadius: 2,
            boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
          },
        }}
      >
        <div className="p-4 w-[360px]">
          <div className="flex items-center justify-between gap-2">
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              Notifications
            </Typography>

            <div className="flex items-center gap-1">
              <Tooltip title="Mark all as read" arrow>
                <span>
                  <IconButton size="small" onClick={markAllRead} disabled={notifications.length === 0}>
                    <DoneAllIcon fontSize="small" />
                  </IconButton>
                </span>
              </Tooltip>

              <Button size="small" onClick={loadNotifications} sx={{ textTransform: "none", fontWeight: 700 }}>
                Refresh
              </Button>
            </div>
          </div>

          <Divider sx={{ my: 1.5 }} />

          <div className="flex gap-2">
            <input
              value={notifDraft}
              onChange={(e) => setNotifDraft(e.target.value)}
              placeholder="Create a notification..."
              className="flex-1 px-3 py-2 rounded-lg border border-slate-200 outline-none text-sm"
            />
            <Button
              size="small"
              variant="contained"
              onClick={createNotificationQuick}
              disabled={notifLoading || !notifDraft.trim()}
              sx={{ textTransform: "none", fontWeight: 800 }}
            >
              Add
            </Button>
          </div>

          {notifError ? (
            <Typography variant="body2" color="error" sx={{ mt: 1 }}>
              {notifError}
            </Typography>
          ) : null}

          <Divider sx={{ my: 1.5 }} />

          {notifLoading ? (
            <Typography variant="body2" color="textSecondary" align="center" sx={{ py: 2 }}>
              Loading...
            </Typography>
          ) : notifications.length === 0 ? (
            <Typography variant="body2" color="textSecondary" align="center" sx={{ py: 2 }}>
              No notifications
            </Typography>
          ) : (
            <div className="max-h-[360px] overflow-y-auto pr-1">
              {notifications.slice(0, 30).map((n) => {
                const id = n?._id || n?.id;
                const unread = !n?.isRead;

                return (
                  <div
                    key={id}
                    className={`rounded-xl border p-3 mb-2 ${
                      unread ? "border-orange-200 bg-orange-50" : "border-slate-200 bg-white"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <button onClick={() => markOneRead(n)} className="text-left flex-1" title="Click to mark as read">
                        <div className="flex items-center gap-2">
                          <span
                            className={`inline-block w-2 h-2 rounded-full ${
                              unread ? "bg-red-500" : "bg-slate-300"
                            }`}
                          />
                          <div
                            className={`text-sm ${
                              unread ? "font-extrabold text-slate-900" : "font-semibold text-slate-800"
                            }`}
                          >
                            {n?.text || "—"}
                          </div>
                        </div>
                        <div className="text-[11px] text-slate-500 mt-1">
                          {timeAgo(n?.createdAt)} {unread ? "• Unread" : "• Read"}
                        </div>
                      </button>

                      <div className="flex items-center gap-1">
                        <Tooltip title={n?.isRead ? "Mark unread" : "Mark read"} arrow>
                          <IconButton size="small" onClick={() => toggleRead(n)}>
                            <span className="text-[11px] font-bold">{n?.isRead ? "U" : "R"}</span>
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Edit" arrow>
                          <IconButton size="small" onClick={() => editNotification(n)}>
                            <EditOutlinedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Delete" arrow>
                          <IconButton size="small" onClick={() => deleteNotification(n)}>
                            <DeleteOutlineIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="text-[11px] text-slate-500 mt-2">
            API: <span className="font-semibold">{NOTIF_API_BASE}</span>
          </div>
        </div>
      </Popover>
    </header>
  );
};

export default Header;
