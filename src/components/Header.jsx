import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import Avatar from "@mui/material/Avatar";
import Popover from "@mui/material/Popover";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import HomeIcon from "@mui/icons-material/Home";
import ArticleIcon from "@mui/icons-material/Article";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import InfoIcon from "@mui/icons-material/Info";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";

import bhajan from "../assets/dev.mp3"; // 🎵 place your devotional song here

const Header = () => {
  const [anchorNotif, setAnchorNotif] = useState(null);
  const [anchorUser, setAnchorUser] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const audioRef = useRef(new Audio(bhajan));

  const handleNotifClick = (event) => setAnchorNotif(event.currentTarget);
  const handleUserClick = (event) => setAnchorUser(event.currentTarget);
  const handleClose = () => {
    setAnchorNotif(null);
    setAnchorUser(null);
  };

  const openNotif = Boolean(anchorNotif);
  const openUser = Boolean(anchorUser);

  // 🎶 Play/Pause Handler
  const handleMusicToggle = () => {
    const audio = audioRef.current;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.loop = true; // keep looping bhajan
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <header className="bg-gradient-to-r from-orange-500 to-yellow-400 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
        {/* Logo + Title */}
        <div className="flex items-center gap-3">
          <img src={logo} alt="Bhakti Logo" className="w-12 h-12 object-contain" />
          <h1 className="text-2xl font-bold text-white tracking-wide">
            Bhakti Portal
          </h1>
        </div>

        {/* Navigation + Icons */}
        <nav className="flex items-center gap-4">
          <Stack direction="row" spacing={2}>
            <Tooltip title="Go to Home" arrow>
              <Button
                component={Link}
                to="/"
                variant="contained"
                startIcon={<HomeIcon />}
                sx={{
                  bgcolor: "white",
                  color: "#f97316",
                  fontWeight: "bold",
                  "&:hover": { bgcolor: "#ffe0b2" },
                }}
              >
                Home
              </Button>
            </Tooltip>

            <Tooltip title="Read Spiritual Articles" arrow>
              <Button
                component={Link}
                to="/articles"
                variant="contained"
                startIcon={<ArticleIcon />}
                sx={{
                  bgcolor: "white",
                  color: "#f97316",
                  fontWeight: "bold",
                  "&:hover": { bgcolor: "#ffe0b2" },
                }}
              >
                Articles
              </Button>
            </Tooltip>

            <Tooltip title="Explore Gallery" arrow>
              <Button
                component={Link}
                to="/gallery"
                variant="contained"
                startIcon={<PhotoLibraryIcon />}
                sx={{
                  bgcolor: "white",
                  color: "#f97316",
                  fontWeight: "bold",
                  "&:hover": { bgcolor: "#ffe0b2" },
                }}
              >
                Gallery
              </Button>
            </Tooltip>

            <Tooltip title="Watch Devotional Videos" arrow>
              <Button
                component={Link}
                to="/videos"
                variant="contained"
                startIcon={<PlayCircleIcon />}
                sx={{
                  bgcolor: "white",
                  color: "#f97316",
                  fontWeight: "bold",
                  "&:hover": { bgcolor: "#ffe0b2" },
                }}
              >
                Videos
              </Button>
            </Tooltip>

            <Tooltip title="About Bhakti Portal" arrow>
              <Button
                component={Link}
                to="/about"
                variant="contained"
                startIcon={<InfoIcon />}
                sx={{
                  bgcolor: "white",
                  color: "#f97316",
                  fontWeight: "bold",
                  "&:hover": { bgcolor: "#ffe0b2" },
                }}
              >
                About Us
              </Button>
            </Tooltip>
          </Stack>

          {/* Right-side icons */}
          <div className="ml-8 flex items-center gap-2">
            {/* 🔔 Notification */}
            <Tooltip title="Notifications" arrow>
              <IconButton color="inherit" onClick={handleNotifClick}>
                <Badge badgeContent={0} color="error">
                  <NotificationsIcon sx={{ color: "white", fontSize: 22 }} />
                </Badge>
              </IconButton>
            </Tooltip>

            {/* 👤 Admin */}
            <Tooltip title="Admin Profile" arrow>
              <IconButton color="inherit" onClick={handleUserClick}>
                <AccountCircleIcon sx={{ color: "white", fontSize: 22 }} />
              </IconButton>
            </Tooltip>

        
              {/* 🎵 Play/Pause Music */}
            <Tooltip title={isPlaying ? "Pause Music" : "Play Music"} arrow>
              <IconButton color="inherit" onClick={handleMusicToggle}>
                {isPlaying ? (
                  <PauseIcon sx={{ color: "white", fontSize: 24, marginLet:10}} />
                ) : (
                  <PlayArrowIcon sx={{ color: "white", fontSize: 24 }} />
                )}
              </IconButton>
            </Tooltip>
          </div>
        </nav>
      </div>

      {/* Notification Popover */}
      <Popover
        open={openNotif}
        anchorEl={anchorNotif}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <div className="p-4 w-56 text-center">
          <Typography variant="subtitle1" color="textSecondary">
            No new notifications
          </Typography>
        </div>
      </Popover>

      {/* User Popover */}
      <Popover
        open={openUser}
        anchorEl={anchorUser}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <div className="p-4 w-64">
          <div className="flex items-center gap-3 mb-3">
            <Avatar
              alt="Rupesh R"
              src="https://i.pravatar.cc/150?img=3"
              sx={{ width: 50, height: 50 }}
            />
            <div>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                Rupesh R
              </Typography>
              <Typography variant="body2" color="textSecondary">
                rupesh@indusvision.ai
              </Typography>
              <Typography variant="caption" color="textSecondary">
                User ID: 68e7add37a338ea099572b1
              </Typography>
            </div>
          </div>
          <Divider sx={{ my: 1 }} />
          <Button
            variant="outlined"
            startIcon={<LogoutIcon />}
            fullWidth
            color="error"
            sx={{
              textTransform: "none",
              fontWeight: "bold",
              "&:hover": { bgcolor: "#ffebee" },
            }}
          >
            Logout
          </Button>
        </div>
      </Popover>
    </header>
  );
};

export default Header;
