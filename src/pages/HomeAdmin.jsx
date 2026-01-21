// src/pages/HomeAdmin.jsx
import React, { useEffect, useRef, useState, useMemo } from "react";
import { motion } from "framer-motion";
import templeImg from "../assets/1.jpeg";
import { useNavigate } from "react-router-dom";
import AdminTwo from "./admintwo";
import { adminLoginGet } from "../utils/authApi";
import { authSession } from "../utils/authSession";



const DEFAULT_MARQUEE =
  '🌸 "Hare Krishna Hare Rama — Chant the name of the Lord and find peace within your heart." 🌸';

// ------------------------------
// BASE URLS
// ------------------------------
const API_BASE_URL = "https://sriandhravalmiki-merge.onrender.com/api";

// ✅ Notifications CRUD API
const NOTIFICATIONS_URL = `${API_BASE_URL}/notifications`; // GET/POST
const notifUrl = (id) => `${NOTIFICATIONS_URL}/${encodeURIComponent(id)}`; // PUT/DELETE

// ✅ Your content APIs are under /api/content/...
const CONTENT_API_BASE_URL = `${API_BASE_URL}/content`;
const PDF_API_URL = `${CONTENT_API_BASE_URL}/pdfs`;

// Media routes
const BANNER_UPLOAD_URL = `${API_BASE_URL}/upload/banner`;
const VIDEOS_API_URL = `${API_BASE_URL}/videos`;
const AUDIO_UPLOAD_URL = `${API_BASE_URL}/upload/audio`;
const AUDIO_LIST_URL = `${API_BASE_URL}/audio`;

// const VIDEOS_STORAGE_KEY = "bhaktiVideos";

// ✅ NEW: Gallery Folder/Image APIs
const GALLERY_FOLDERS_URL = `${API_BASE_URL}/gallery/folders`; // GET/POST
const folderUrl = (id) => `${GALLERY_FOLDERS_URL}/${encodeURIComponent(id)}`; // PUT/DELETE
const folderThumbUrl = (id) => `${GALLERY_FOLDERS_URL}/${encodeURIComponent(id)}/thumbnail`; // POST
const folderImagesUrl = (id) => `${GALLERY_FOLDERS_URL}/${encodeURIComponent(id)}/images`; // GET/POST
const imageUrl = (imageId) => `${API_BASE_URL}/gallery/images/${encodeURIComponent(imageId)}`; // PUT/DELETE



 
// ------------------------------
// Helpers
// ------------------------------
const normalizeArrayResponse = (raw) => {
  if (Array.isArray(raw)) return raw;
  if (raw && Array.isArray(raw.data)) return raw.data;
  if (raw && Array.isArray(raw.items)) return raw.items;
  if (raw && Array.isArray(raw.results)) return raw.results;
  return [];
};

const normalizeItemResponse = (raw) => {
  if (!raw) return raw;
  if (raw.data && typeof raw.data === "object") return raw.data;
  return raw;
};

const getId = (item) => {
  if (!item) return null;
  return (
    item.id ??
    item._id ??
    item.folderId ??
    item.imageId ??
    item.articleId ??
    item.chapterId ??
    item.topicId ??
    item.contentId ??
    null
  );
};

const getName = (item) =>
  item?.name || item?.title || item?.folderName || item?.label || "Untitled Folder";

const getImageSrc = (item) =>
  item?.url ||
  item?.imageUrl ||
  item?.image_url ||
  item?.image ||
  item?.path ||
  item?.thumbnailUrl ||
  item?.thumbnail ||
  null;

const getCaption = (item) => item?.caption || item?.title || item?.name || "";

async function apiFetch(url, options = {}) {
  const token = localStorage.getItem("token");

  // ✅ Always attach Authorization Bearer token (backend needs it for POST/PUT/DELETE)
  const headers = new Headers(options.headers || {});
  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  // ✅ Do NOT set Content-Type for FormData (browser adds correct boundary)
  const finalOptions = {
    ...options,
    headers,
  };

  const res = await fetch(url, finalOptions);
  const text = await res.text();

  let json = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = null;
  }

  if (!res.ok) {
    const msg =
      json?.message ||
      json?.error ||
      `Request failed: ${res.status} ${res.statusText}`;

    const err = new Error(msg);
    err.status = res.status;
    err.url = url;
    err.payload = json ?? text;
    throw err;
  }

  return json ?? {};
}


const HomeAdmin = () => {

   

  // ✅ Admin Auth Gate (MOVE HERE)
  const ADMIN_EMAIL = "sriandhravalmiki@gmail.com";
  const [adminAuthed, setAdminAuthed] = useState(false);
  const [adminPass, setAdminPass] = useState("");
  const [adminLoading, setAdminLoading] = useState(false);
  const [adminErr, setAdminErr] = useState("");

   // ✅ Restore session
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (token && role === "admin") setAdminAuthed(true);
  }, []);
  
  // Poster / banner
  const [posterPreview, setPosterPreview] = useState(templeImg);
  const [uploadMessage, setUploadMessage] = useState("");
  const [posterUploading, setPosterUploading] = useState(false);

  // Marquee
  const [marqueeText, setMarqueeText] = useState(DEFAULT_MARQUEE);
  const [marqueeDraft, setMarqueeDraft] = useState(DEFAULT_MARQUEE);
  const [marqueeMessage, setMarqueeMessage] = useState("");

  // ✅ NEW: Gallery Folders + Images (API-based)
  const [folders, setFolders] = useState([]);
  const [foldersLoading, setFoldersLoading] = useState(false);
  const [foldersMessage, setFoldersMessage] = useState("");

  const [selectedFolderId, setSelectedFolderId] = useState(null);

  const [createFolderName, setCreateFolderName] = useState("");
  const [createFolderThumb, setCreateFolderThumb] = useState(null);
  const createFolderThumbRef = useRef(null);

  const [images, setImages] = useState([]);
  const [imagesLoading, setImagesLoading] = useState(false);
  const [galleryUploading, setGalleryUploading] = useState(false);
  const [galleryMessage, setGalleryMessage] = useState("");

  const galleryUploadInputRef = useRef(null);
  const folderThumbInputRef = useRef(null);

  // Videos
  const [videoTitle, setVideoTitle] = useState("");
  const [videoUrlState, setVideoUrlState] = useState("");
  const [videoMessage, setVideoMessage] = useState("");
  const [videoUploading, setVideoUploading] = useState(false);
  const [savedVideos, setSavedVideos] = useState([]);

  // Audio library
  const [audioList, setAudioList] = useState([]);
  const [audioLoading, setAudioLoading] = useState(false);
  const [audioMessage, setAudioMessage] = useState("");
  const audioFileInputRef = useRef(null);

  const navigate = useNavigate();
  const handleAdminLogout = () => {
  // ✅ clear token/role/me (keep otp_verified_once for users)
  authSession.logout({ keepOtpVerifiedOnce: true });

  // ✅ go to login
  navigate("/login", { replace: true });

  // ✅ (optional) also reset local admin gate state
  setAdminAuthed(false);
  setAdminPass("");
};


  // ✅ Notifications manager
  const [notifList, setNotifList] = useState([]);
  const [notifLoading, setNotifLoading] = useState(false);
  const [notifMessage, setNotifMessage] = useState("");
  const [notifText, setNotifText] = useState("");


  const fetchHomeSettings = async () => {
  try {
    const json = await apiFetch(HOME_SETTINGS_URL);
    const s = json?.data || {};

    // ✅ marquee
    if (typeof s.marqueeText === "string" && s.marqueeText.trim()) {
      setMarqueeText(s.marqueeText);
      setMarqueeDraft(s.marqueeText);
    }

    // ✅ poster (optional, but good)
    if (typeof s.posterUrl === "string" && s.posterUrl.trim()) {
      setPosterPreview(s.posterUrl);
    }
  } catch (err) {
    console.warn("fetchHomeSettings failed:", err?.message);
  }
};


  const fetchVideos = async () => {
  try {
    const json = await apiFetch(VIDEOS_API_URL);
    const list = normalizeArrayResponse(json);
    setSavedVideos(list);
  } catch (err) {
    console.error("Fetch videos failed:", err);
    setVideoMessage(err.message || "Failed to load videos");
    setTimeout(() => setVideoMessage(""), 3000);
  }
};


  // ------------------------------
  // Storage helpers (Videos only)
  // ------------------------------
  // const saveVideosToStorage = (videosArr) => {
  //   localStorage.setItem(VIDEOS_STORAGE_KEY, JSON.stringify(videosArr));
  // };

  // ------------------------------
  // Initial load
  // ------------------------------
  useEffect(() => {
    const savedPoster = localStorage.getItem("mainPosterUrl");
    if (savedPoster) setPosterPreview(savedPoster);

    const savedMarquee = localStorage.getItem("mainMarqueeText");
    if (savedMarquee) {
      setMarqueeText(savedMarquee);
      setMarqueeDraft(savedMarquee);
    } else {
      setMarqueeDraft(DEFAULT_MARQUEE);
    }

    try {
      // const savedVids = JSON.parse(localStorage.getItem(VIDEOS_STORAGE_KEY) || "[]");
      // if (Array.isArray(savedVids)) setSavedVideos(savedVids);
    } catch (err) {
      console.error("Error loading videos:", err);
    }
      fetchHomeSettings();
    fetchVideos();
    fetchFolders();
    fetchAudioList();
    fetchNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //   useEffect(() => {
  //   const token = localStorage.getItem("token");
  //   const role = localStorage.getItem("role");
  //   if (token && role === "admin") setAdminAuthed(true);
  // }, []);


  // ------------------------------
  // Auto-load images when folder changes
  // ------------------------------
  useEffect(() => {
    if (!selectedFolderId) {
      setImages([]);
      return;
    }
    fetchImages(selectedFolderId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFolderId]);

  const selectedFolder = useMemo(() => {
    if (!selectedFolderId) return null;
    return folders.find((f) => getId(f) === selectedFolderId) || null;
  }, [folders, selectedFolderId]);



  //login 


    const handleAdminLogin = async (e) => {
    e.preventDefault();
    setAdminErr("");
    setAdminLoading(true);

    try {
     if (!adminPass) {
  throw new Error("Password is required.");
}


      const resp = await adminLoginGet({
        email: ADMIN_EMAIL,
        password: adminPass,
      });

      const token = resp?.token;
      if (!token) throw new Error("Token missing from server response.");

      localStorage.setItem("token", token);
      localStorage.setItem("role", "admin");
      localStorage.setItem("auth_provider", "admin_static");

      setAdminAuthed(true);
    } catch (err) {
      setAdminErr(err?.message || "Admin login failed");
    } finally {
      setAdminLoading(false);
    }
  };


  // ------------------------------
  // Poster upload
  // ------------------------------
  const handlePosterUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setUploadMessage("Please upload a valid image file.");
      return;
    }

    setUploadMessage("");
    setPosterUploading(true);

    try {
      const formData = new FormData();
      formData.append("banner", file);

      const data = await apiFetch(BANNER_UPLOAD_URL, {
        method: "POST",
        body: formData,
      });

      const apiUrl =
        data?.data?.url ||
        data.posterUrl ||
        data.bannerUrl ||
        data.url ||
        data.image_url ||
        data.image ||
        data.path ||
        null;

      if (!apiUrl) throw new Error("No banner URL returned from backend");

      setPosterPreview(apiUrl);
      localStorage.setItem("mainPosterUrl", apiUrl);

      setUploadMessage("Poster uploaded and updated successfully ✨");
      setTimeout(() => setUploadMessage(""), 3000);
    } catch (err) {
      console.error("Banner upload error:", err);
      setUploadMessage(err.message || "Poster upload failed. Please try again.");
      setTimeout(() => setUploadMessage(""), 4000);
    } finally {
      setPosterUploading(false);
      e.target.value = "";
    }
  };

  // ------------------------------
  // Marquee
  // ------------------------------
const handleApplyMarquee = async () => {
  const trimmed = marqueeDraft.trim();
  if (!trimmed) return;

  try {
    await apiFetch(HOME_SETTINGS_URL, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ marqueeText: trimmed }),
    });

    setMarqueeText(trimmed);
    setMarqueeMessage("Updated for all users ✅");
  } catch (e) {
    setMarqueeMessage(e.message);
  }
};

  // ===========================================================================
  // ✅ GALLERY (Folders + Images) — CRUD
  // ===========================================================================
  const fetchFolders = async () => {
    setFoldersLoading(true);
    setFoldersMessage("");
    try {
      const json = await apiFetch(GALLERY_FOLDERS_URL);
      const list = normalizeArrayResponse(json);
      setFolders(list);

      // Auto-select first folder if none selected
      const firstId = getId(list?.[0]);
      if (!selectedFolderId && firstId) setSelectedFolderId(firstId);
      if (selectedFolderId && !list.some((x) => getId(x) === selectedFolderId)) {
        // selected folder deleted
        setSelectedFolderId(firstId || null);
      }
    } catch (err) {
      console.error(err);
      setFoldersMessage(err.message || "Failed to load folders.");
    } finally {
      setFoldersLoading(false);
    }
  };

  const handleCreateFolder = async () => {
    const title = createFolderName.trim();
    if (!title) {
      setFoldersMessage("Folder title is required.");
      setTimeout(() => setFoldersMessage(""), 3000);
      return;
    }

    setFoldersLoading(true);
    setFoldersMessage("");

    try {
      const fd = new FormData();
      fd.append("title", title); // backend-required
      fd.append("name", title); // harmless fallback

      if (createFolderThumb) {
        fd.append("thumbnail", createFolderThumb);
      }

      const json = await apiFetch(GALLERY_FOLDERS_URL, {
        method: "POST",
        body: fd,
      });

      const created = normalizeItemResponse(json);
      const createdId = getId(created);

      setFoldersMessage("Folder created ✨");
      setCreateFolderName("");
      setCreateFolderThumb(null);
      if (createFolderThumbRef.current) createFolderThumbRef.current.value = "";

      await fetchFolders();
      if (createdId) setSelectedFolderId(createdId);

      setTimeout(() => setFoldersMessage(""), 2500);
    } catch (err) {
      console.error(err);
      setFoldersMessage(err.message || "Failed to create folder.");
      setTimeout(() => setFoldersMessage(""), 3500);
    } finally {
      setFoldersLoading(false);
    }
  };

  const handleRenameFolder = async (folder) => {
    const id = getId(folder);
    if (!id) return;

    const newTitle = window.prompt("Enter new folder title:", getName(folder));
    if (newTitle == null) return;

    const trimmed = newTitle.trim();
    if (!trimmed) return;

    setFoldersLoading(true);
    setFoldersMessage("");

    try {
      await apiFetch(folderUrl(id), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: trimmed, // backend expected
          name: trimmed, // fallback
        }),
      });

      setFoldersMessage("Folder updated ✨");
      await fetchFolders();
      setTimeout(() => setFoldersMessage(""), 2500);
    } catch (err) {
      console.error(err);
      setFoldersMessage(err.message || "Failed to update folder.");
      setTimeout(() => setFoldersMessage(""), 3500);
    } finally {
      setFoldersLoading(false);
    }
  };

  const handleDeleteFolder = async (folder) => {
    const id = getId(folder);
    if (!id) return;

    const ok = window.confirm(
      `Delete folder "${getName(folder)}"?\n\nThis may also delete all images inside it.`
    );
    if (!ok) return;

    setFoldersLoading(true);
    setFoldersMessage("");
    try {
      await apiFetch(folderUrl(id), { method: "DELETE" });
      setFoldersMessage("Folder deleted ✅");
      await fetchFolders();
      setTimeout(() => setFoldersMessage(""), 2500);
    } catch (err) {
      console.error(err);
      setFoldersMessage(err.message || "Failed to delete folder.");
      setTimeout(() => setFoldersMessage(""), 3500);
    } finally {
      setFoldersLoading(false);
    }
  };

  const handleUpdateFolderThumbnailClick = () => {
    if (!selectedFolderId) {
      setFoldersMessage("Please select a folder first.");
      setTimeout(() => setFoldersMessage(""), 2500);
      return;
    }
    folderThumbInputRef.current?.click();
  };

  const handleUpdateFolderThumbnail = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !selectedFolderId) return;

    if (!file.type.startsWith("image/")) {
      setFoldersMessage("Please select a valid image thumbnail.");
      setTimeout(() => setFoldersMessage(""), 2500);
      return;
    }

    setFoldersLoading(true);
    setFoldersMessage("");
    try {
      const fd = new FormData();
      fd.append("thumbnail", file);

      await apiFetch(folderThumbUrl(selectedFolderId), {
        method: "POST",
        body: fd,
      });

      setFoldersMessage("Thumbnail updated ✨");
      await fetchFolders();
      setTimeout(() => setFoldersMessage(""), 2500);
    } catch (err) {
      console.error(err);
      setFoldersMessage(err.message || "Failed to update thumbnail.");
      setTimeout(() => setFoldersMessage(""), 3500);
    } finally {
      setFoldersLoading(false);
      e.target.value = "";
    }
  };

  const fetchImages = async (folderId) => {
    setImagesLoading(true);
    setGalleryMessage("");
    try {
      const json = await apiFetch(folderImagesUrl(folderId));
      const list = normalizeArrayResponse(json);
      setImages(list);
    } catch (err) {
      console.error(err);
      setGalleryMessage(err.message || "Failed to load folder images.");
    } finally {
      setImagesLoading(false);
    }
  };

  const handleUploadImagesClick = () => {
    if (!selectedFolderId) {
      setGalleryMessage("Please select a folder first.");
      setTimeout(() => setGalleryMessage(""), 2500);
      return;
    }
    galleryUploadInputRef.current?.click();
  };

  const handleUploadImagesToFolder = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    if (!selectedFolderId) {
      setGalleryMessage("Please select a folder first.");
      setTimeout(() => setGalleryMessage(""), 2500);
      e.target.value = "";
      return;
    }

    const imageFiles = files.filter((f) => f.type.startsWith("image/"));
    if (!imageFiles.length) {
      setGalleryMessage("Please select valid image files only.");
      setTimeout(() => setGalleryMessage(""), 3000);
      e.target.value = "";
      return;
    }

    setGalleryUploading(true);
    setGalleryMessage("");

    try {
      const fd = new FormData();
      imageFiles.forEach((file) => fd.append("images", file));

      await apiFetch(folderImagesUrl(selectedFolderId), {
        method: "POST",
        body: fd,
      });

      setGalleryMessage("Images uploaded successfully ✨");
      await fetchImages(selectedFolderId);
      setTimeout(() => setGalleryMessage(""), 2500);
    } catch (err) {
      console.error(err);
      setGalleryMessage(err.message || "Failed to upload images.");
      setTimeout(() => setGalleryMessage(""), 3500);
    } finally {
      setGalleryUploading(false);
      e.target.value = "";
    }
  };

  const handleUpdateCaption = async (imgItem) => {
    const imgId = getId(imgItem);
    if (!imgId) return;

    const current = getCaption(imgItem);
    const next = window.prompt("Enter caption:", current);
    if (next == null) return;

    setGalleryMessage("");
    try {
      await apiFetch(imageUrl(imgId), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ caption: next }),
      });
      setGalleryMessage("Caption updated ✨");
      if (selectedFolderId) await fetchImages(selectedFolderId);
      setTimeout(() => setGalleryMessage(""), 2500);
    } catch (err) {
      console.error(err);
      setGalleryMessage(err.message || "Failed to update caption.");
      setTimeout(() => setGalleryMessage(""), 3500);
    }
  };

  const handleDeleteImage = async (imgItem) => {
    const imgId = getId(imgItem);
    if (!imgId) return;

    const ok = window.confirm("Delete this image?");
    if (!ok) return;

    setGalleryMessage("");
    try {
      await apiFetch(imageUrl(imgId), { method: "DELETE" });
      setGalleryMessage("Image deleted ✅");
      if (selectedFolderId) await fetchImages(selectedFolderId);
      setTimeout(() => setGalleryMessage(""), 2500);
    } catch (err) {
      console.error(err);
      setGalleryMessage(err.message || "Failed to delete image.");
      setTimeout(() => setGalleryMessage(""), 3500);
    }
  };

  const HOME_SETTINGS_URL = `${API_BASE_URL}/settings/home`;


  // ===========================================================================
  // ✅ NOTIFICATIONS — CRUD
  // ===========================================================================
  const fetchNotifications = async () => {
    setNotifLoading(true);
    setNotifMessage("");
    try {
      const json = await apiFetch(NOTIFICATIONS_URL);
      const list = normalizeArrayResponse(json);
      setNotifList(list);
    } catch (err) {
      console.error(err);
      setNotifMessage(err.message || "Failed to load notifications.");
    } finally {
      setNotifLoading(false);
    }
  };

  const handleCreateNotification = async () => {
    const text = notifText.trim();
    if (!text) {
      setNotifMessage("Notification text is required.");
      setTimeout(() => setNotifMessage(""), 2500);
      return;
    }

    setNotifLoading(true);
    setNotifMessage("");
    try {
      await apiFetch(NOTIFICATIONS_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      setNotifText("");
      setNotifMessage("Notification created ✨");
      await fetchNotifications();
      setTimeout(() => setNotifMessage(""), 2500);
    } catch (err) {
      console.error(err);
      setNotifMessage(err.message || "Failed to create notification.");
      setTimeout(() => setNotifMessage(""), 3500);
    } finally {
      setNotifLoading(false);
    }
  };

  const handleEditNotification = async (n) => {
    const id = getId(n);
    if (!id) return;

    const next = window.prompt("Edit notification text:", n?.text || "");
    if (next == null) return;

    const text = next.trim();
    if (!text) return;

    setNotifLoading(true);
    setNotifMessage("");
    try {
      await apiFetch(notifUrl(id), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      setNotifMessage("Notification updated ✅");
      await fetchNotifications();
      setTimeout(() => setNotifMessage(""), 2500);
    } catch (err) {
      console.error(err);
      setNotifMessage(err.message || "Failed to update notification.");
      setTimeout(() => setNotifMessage(""), 3500);
    } finally {
      setNotifLoading(false);
    }
  };

  const handleToggleReadNotification = async (n) => {
    const id = getId(n);
    if (!id) return;

    const nextRead = !n?.isRead;

    // optimistic
    setNotifList((prev) =>
      prev.map((x) => (getId(x) === id ? { ...x, isRead: nextRead } : x))
    );

    try {
      await apiFetch(notifUrl(id), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isRead: nextRead }),
      });
    } catch (err) {
      console.error(err);
      // rollback
      setNotifList((prev) =>
        prev.map((x) => (getId(x) === id ? { ...x, isRead: n?.isRead } : x))
      );
    }
  };

  const handleDeleteNotification = async (n) => {
    const id = getId(n);
    if (!id) return;

    const ok = window.confirm("Delete this notification?");
    if (!ok) return;

    setNotifLoading(true);
    setNotifMessage("");
    try {
      await apiFetch(notifUrl(id), { method: "DELETE" });
      setNotifMessage("Notification deleted ✅");
      await fetchNotifications();
      setTimeout(() => setNotifMessage(""), 2500);
    } catch (err) {
      console.error(err);
      setNotifMessage(err.message || "Failed to delete notification.");
      setTimeout(() => setNotifMessage(""), 3500);
    } finally {
      setNotifLoading(false);
    }
  };

  // ===========================================================================
  // VIDEO
  // ===========================================================================
const handleVideoSubmit = async (e) => {
  e.preventDefault();

  const title = videoTitle.trim();
  const url = videoUrlState.trim();

  if (!title || !url) {
    setVideoMessage("Please enter both title and YouTube URL.");
    setTimeout(() => setVideoMessage(""), 3000);
    return;
  }

  setVideoUploading(true);
  setVideoMessage("");

  try {
    // ✅ correct body: { title, url }
    const json = await apiFetch(VIDEOS_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, url }),
    });

    const created = normalizeItemResponse(json);

    setVideoMessage("Video saved for all users ✅");
    setVideoTitle("");
    setVideoUrlState("");

    // ✅ refresh list from DB so admin/user always match
    await fetchVideos();

    setTimeout(() => setVideoMessage(""), 2500);
  } catch (err) {
    console.error("Create video failed:", err);
    setVideoMessage(err.message || "Failed to save video");
    setTimeout(() => setVideoMessage(""), 3500);
  } finally {
    setVideoUploading(false);
  }
};


const handleRemoveVideo = async (videoItem) => {
  const id = getId(videoItem);
  if (!id) return;

  const ok = window.confirm("Delete this video?");
  if (!ok) return;

  try {
    await apiFetch(`${VIDEOS_API_URL}/${encodeURIComponent(id)}`, {
      method: "DELETE",
    });

    setVideoMessage("Video deleted ✅");
    await fetchVideos();
    setTimeout(() => setVideoMessage(""), 2500);
  } catch (err) {
    console.error("Delete video failed:", err);
    setVideoMessage(err.message || "Failed to delete video");
    setTimeout(() => setVideoMessage(""), 3500);
  }
};


  // ===========================================================================
  // AUDIO
  // ===========================================================================
  const fetchAudioList = async () => {
    setAudioLoading(true);
    setAudioMessage("");
    try {
      const json = await apiFetch(AUDIO_LIST_URL);
      setAudioList(normalizeArrayResponse(json));
    } catch (err) {
      console.error(err);
      setAudioMessage(err.message || "Failed to load audio list from API.");
    } finally {
      setAudioLoading(false);
    }
  };

  const handleAudioUploadClick = () => {
    audioFileInputRef.current?.click();
  };

  const handleAudioFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("audio/")) {
      setAudioMessage("Please upload a valid audio file.");
      setTimeout(() => setAudioMessage(""), 3000);
      return;
    }

    //logout
    

    const formData = new FormData();
    formData.append("audio", file);

    try {
      setAudioLoading(true);
      setAudioMessage("");

      const json = await apiFetch(AUDIO_UPLOAD_URL, {
        method: "POST",
        body: formData,
      });

      if (!json.success && !json.data) throw new Error(json.error || "Failed to upload audio");

      setAudioMessage("Audio uploaded successfully ✨ (latest upload becomes default)");
      await fetchAudioList();
    } catch (err) {
      console.error("Audio upload error:", err);
      setAudioMessage(err.message || "Failed to upload audio");
    } finally {
      setAudioLoading(false);
      if (e.target) e.target.value = "";
      setTimeout(() => setAudioMessage(""), 4000);
    }
  };

  const handleRenameAudio = async (audioItem) => {
    const id = getId(audioItem);
    if (!id) return;

    const newName = window.prompt(
      "Enter a new name for this song:",
      audioItem.originalName || audioItem.fileName || "Bhajan"
    );
    if (newName == null) return;

    try {
      setAudioMessage("");
      await apiFetch(`${API_BASE_URL}/audio/${encodeURIComponent(id)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ originalName: newName }),
      });

      setAudioMessage("Song name updated ✨");
      await fetchAudioList();
    } catch (err) {
      console.error("Audio update error:", err);
      setAudioMessage(err.message || "Failed to update audio");
    } finally {
      setTimeout(() => setAudioMessage(""), 4000);
    }
  };

  const handleDeleteAudio = async (audioItem) => {
    const id = getId(audioItem);
    if (!id) return;

    const confirmed = window.confirm("Delete this song from library?");
    if (!confirmed) return;

    try {
      setAudioMessage("");
      await apiFetch(`${API_BASE_URL}/audio/${encodeURIComponent(id)}`, {
        method: "DELETE",
      });

      setAudioMessage("Song deleted successfully.");
      await fetchAudioList();
    } catch (err) {
      console.error("Audio delete error:", err);
      setAudioMessage(err.message || "Failed to delete audio");
    } finally {
      setTimeout(() => setAudioMessage(""), 4000);
    }
  };

  // ===========================================================================
  // UI
    if (!adminAuthed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-500 via-yellow-200 to-orange-400 relative overflow-hidden">
        <img
          src={templeImg}
          alt="Temple Background"
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/40 to-transparent"></div>

        <div className="relative z-10 bg-white/20 backdrop-blur-lg rounded-2xl shadow-2xl w-[92%] sm:w-[460px] p-8 border border-white/40 text-center">
          <h1 className="text-3xl font-bold text-white drop-shadow-lg mb-2">
            🔐 Admin Login
          </h1>
          <p className="text-yellow-100 text-sm mb-6">
            Static Admin: {ADMIN_EMAIL}
          </p>

          <form onSubmit={handleAdminLogin} className="text-left space-y-4">
            <div>
              <label className="block text-white text-sm font-semibold mb-1">
                Email
              </label>
              <input
                value={ADMIN_EMAIL}
                readOnly
                className="w-full px-4 py-2 rounded-lg bg-white/70 text-gray-800 border border-gray-300 outline-none"
              />
            </div>

            <div>
              <label className="block text-white text-sm font-semibold mb-1">
                Password
              </label>
              <input
                type="password"
                value={adminPass}
                onChange={(e) => setAdminPass(e.target.value)}
                placeholder="Admin password"
                className="w-full px-4 py-2 rounded-lg bg-white/80 focus:bg-white text-gray-800 placeholder-gray-500 border border-gray-300 focus:ring-2 focus:ring-orange-400 outline-none transition"
              />
             <p className="text-[11px] text-yellow-50/90 mt-1">
  Static password: <b>Admin</b>
</p>

            </div>

            {adminErr ? <p className="text-red-200 text-sm">{adminErr}</p> : null}

            <button
              type="submit"
              disabled={adminLoading}
              className={`w-full py-2 bg-gradient-to-r from-orange-600 to-yellow-500 hover:from-orange-700 hover:to-yellow-600 text-white font-bold rounded-full shadow-lg transition ${
                adminLoading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {adminLoading ? "Logging in..." : "Login"}
            </button>

            <button
              type="button"
              onClick={handleAdminLogout}

              className="w-full text-xs text-white/90 underline hover:text-white"
            >
              Back to User Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ===========================================================================
  return (
    <motion.div
      className="min-h-screen flex flex-col bg-gradient-to-b from-yellow-100 to-orange-100"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 1.2, ease: "easeInOut" }}
    >
      {/* small media query for extra mobile polish */}
      <style>{`
        @media (max-width: 640px) {
          .admin-header { padding-left: 1rem !important; padding-right: 1rem !important; }
          .admin-hero-overlay { padding-left: 1rem !important; }
          .admin-hero-overlay h2 { font-size: 2rem !important; line-height: 2.4rem !important; }
          .admin-hero-overlay p { font-size: 0.95rem !important; }
        }
      `}</style>

      {/* Header */}
      <header className="admin-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-8 py-4 bg-gradient-to-r from-orange-700 to-yellow-600 text-white shadow-md">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">🙏 Sri Andhra Valmiki – Admin</h1>
          <p className="text-xs sm:text-sm opacity-90">
            Manage main posters, gallery folders/images, videos, marquee text, articles, and spiritual content.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-4">
          <button
            onClick={() => navigate("/home")}
            className="text-xs sm:text-sm bg-white/10 hover:bg-white/20 border border-white/40 px-3 py-1 rounded-full"
          >
            View User Home
          </button>
          <button
            onClick={() => navigate("/home/articles")}
            className="text-xs sm:text-sm bg-white/10 hover:bg-white/20 border border-white/40 px-3 py-1 rounded-full"
          >
            View User Articles
          </button>
         <button
  onClick={handleAdminLogout}
  className="text-xs sm:text-sm bg-red-500 hover:bg-red-600 px-3 py-1 rounded-full shadow"
>
  Logout
</button>


        </div>
      </header>

      {/* Hero */}
      <div className="relative w-full aspect-[16/9] overflow-hidden">
        <img
          src={posterPreview}
          alt="Main Poster"
          className="w-full h-full object-cover brightness-90"
        />

        {/* ✅ Marquee at bottom of banner */}
        <div className="absolute bottom-0 left-0 w-full px-3 sm:px-6 pb-3 sm:pb-4 z-20">
          <div className="bg-orange-600/90 rounded-full py-2 px-4 w-full sm:w-[70%] shadow-lg border border-orange-300 mx-auto sm:mx-0">
            <marquee
              behavior="scroll"
              direction="left"
              scrollamount="6"
              className="text-white font-semibold text-sm sm:text-lg tracking-wide -mt-1"
            >
              {marqueeText}
            </marquee>
          </div>
        </div>

        {/* overlay (kept empty like your current file) */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex flex-col justify-center pl-12 text-white"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 1 }}
        />
      </div>

      {/* Main */}
      <main className="flex-1 px-4 sm:px-8 py-8 sm:py-10 space-y-10">
        {/* Poster Upload */}
        <motion.section
          className="bg-white/80 rounded-2xl shadow-lg p-4 sm:p-6 border border-orange-100 flex flex-col md:flex-row gap-6"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="flex-1">
            <h3 className="text-xl sm:text-2xl font-semibold text-orange-700 mb-2">
              Main Poster Manager
            </h3>
            <p className="text-gray-700 mb-4 text-sm">
              This poster appears on the top of the user&apos;s home dashboard. Upload a new image to instantly refresh
              the spiritual look for all users.
            </p>

            <label className="inline-flex items-center gap-2 cursor-pointer bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white font-semibold px-5 py-2 rounded-full shadow-md">
              <span>{posterUploading ? "Uploading..." : "Upload New Poster"}</span>
              <input
                type="file"
                accept="image/*"
                onChange={handlePosterUpload}
                className="hidden"
                disabled={posterUploading}
              />
            </label>

            {uploadMessage && (
              <p className="mt-3 text-sm text-green-700 font-medium">{uploadMessage}</p>
            )}

            <p className="mt-3 text-xs text-gray-500">
              Recommended size: 16:9 ratio (e.g., 1920x1080). Formats: JPG/PNG/WebP.
            </p>
          </div>

          <div className="w-full md:w-72 h-40 rounded-xl overflow-hidden border border-orange-200 shadow-inner">
            <img src={posterPreview} alt="Poster Preview" className="w-full h-full object-cover" />
          </div>
        </motion.section>

        {/* Marquee */}
        <motion.section
          className="bg-white/80 rounded-2xl shadow-lg p-4 sm:p-6 border border-orange-100"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.05 }}
          viewport={{ once: true }}
        >
          <h3 className="text-xl sm:text-2xl font-semibold text-orange-700 mb-2">
            Marquee Text Manager
          </h3>
          <p className="text-gray-700 mb-4 text-sm">
            Update the devotional line that scrolls on the user&apos;s home hero section.
          </p>

          <textarea
            rows={3}
            className="w-full px-4 py-2 rounded-lg border border-orange-200 focus:ring-2 focus:ring-orange-400 outline-none bg-white"
            value={marqueeDraft}
            onChange={(e) => setMarqueeDraft(e.target.value)}
          />

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              onClick={handleApplyMarquee}
              className="px-5 py-2 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white font-semibold rounded-full shadow-md"
            >
              Apply Marquee Text
            </button>
            {marqueeMessage && (
              <span className="text-sm text-green-700 font-medium">{marqueeMessage}</span>
            )}
          </div>
        </motion.section>

        {/* ✅ Gallery (Folders + Images) */}
        <motion.section
          className="bg-white/80 rounded-2xl shadow-lg p-4 sm:p-6 border border-orange-100"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.1 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-semibold text-orange-700 mb-1">
                Gallery Manager (Folders + Images)
              </h2>
              <p className="text-gray-700 text-sm">
                Create folders, set thumbnails, and upload images into a selected folder using your new gallery APIs.
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={fetchFolders}
                disabled={foldersLoading}
                className="px-4 py-2 rounded-full border border-orange-200 bg-white hover:bg-orange-50 text-sm font-semibold text-orange-700 disabled:opacity-60"
              >
                {foldersLoading ? "Refreshing..." : "Refresh"}
              </button>
            </div>
          </div>

          {(foldersMessage || galleryMessage) && (
            <div className="mb-4 space-y-1">
              {foldersMessage && (
                <div className="text-sm text-green-700 font-medium">{foldersMessage}</div>
              )}
              {galleryMessage && (
                <div className="text-sm text-green-700 font-medium">{galleryMessage}</div>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* LEFT: Folder list + create */}
            <div className="lg:col-span-4">
              <div className="bg-white rounded-2xl border border-orange-100 shadow-sm p-4">
                <h3 className="text-lg font-semibold text-orange-700 mb-3">Folders</h3>

                {/* Create folder */}
                <div className="space-y-2 mb-4">
                  <input
                    value={createFolderName}
                    onChange={(e) => setCreateFolderName(e.target.value)}
                    placeholder="New folder name"
                    className="w-full px-3 py-2 rounded-lg border border-orange-200 focus:ring-2 focus:ring-orange-400 outline-none bg-white text-sm"
                  />

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => createFolderThumbRef.current?.click()}
                      className="px-3 py-2 rounded-lg border border-orange-200 bg-white hover:bg-orange-50 text-sm font-semibold text-orange-700"
                    >
                      {createFolderThumb ? "Change Thumb" : "Add Thumb (optional)"}
                    </button>

                    <input
                      ref={createFolderThumbRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => setCreateFolderThumb(e.target.files?.[0] || null)}
                    />

                    <button
                      type="button"
                      onClick={handleCreateFolder}
                      disabled={foldersLoading}
                      className="ml-auto px-4 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white text-sm font-semibold shadow disabled:opacity-60"
                    >
                      {foldersLoading ? "Creating..." : "Create"}
                    </button>
                  </div>

                  {createFolderThumb && (
                    <div className="text-[11px] text-slate-600 truncate">
                      Thumb: <span className="font-semibold">{createFolderThumb.name}</span>
                    </div>
                  )}
                </div>

                {/* Folder list */}
                {foldersLoading && folders.length === 0 ? (
                  <p className="text-sm text-gray-600">Loading folders...</p>
                ) : folders.length === 0 ? (
                  <p className="text-sm text-gray-600">No folders yet. Create one above.</p>
                ) : (
                  <div className="space-y-2 max-h-[420px] overflow-y-auto custom-scrollbar pr-1">
                    {folders.map((f) => {
                      const id = getId(f);
                      const isActive = id === selectedFolderId;
                      const thumb = getImageSrc(f);

                      return (
                        <button
                          key={id || getName(f)}
                          onClick={() => id && setSelectedFolderId(id)}
                          className={`w-full text-left flex items-center gap-3 p-2 rounded-xl border transition ${
                            isActive
                              ? "bg-orange-50 border-orange-200"
                              : "bg-white border-orange-100 hover:bg-orange-50/60"
                          }`}
                        >
                          <div className="w-12 h-12 rounded-lg overflow-hidden border border-orange-100 bg-white flex items-center justify-center">
                            {thumb ? (
                              <img src={thumb} alt="thumb" className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-[10px] text-slate-500">No Thumb</span>
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-orange-800 text-sm truncate">
                              {getName(f)}
                            </div>
                            <div className="text-[11px] text-slate-600 truncate">
                              ID: {String(id || "").slice(0, 12)}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT: Selected folder details + images */}
            <div className="lg:col-span-8">
              <div className="bg-white rounded-2xl border border-orange-100 shadow-sm p-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-orange-700">
                      {selectedFolder ? `Folder: ${getName(selectedFolder)}` : "Select a folder"}
                    </h3>
                    <p className="text-xs text-slate-600">
                      {selectedFolderId ? `Folder ID: ${selectedFolderId}` : "Create a folder and select it."}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => selectedFolder && handleRenameFolder(selectedFolder)}
                      disabled={!selectedFolder || foldersLoading}
                      className="px-3 py-2 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-sm"
                    >
                      Rename
                    </button>

                    <button
                      onClick={handleUpdateFolderThumbnailClick}
                      disabled={!selectedFolder || foldersLoading}
                      className="px-3 py-2 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-sm"
                    >
                      Update Thumbnail
                    </button>

                    <button
                      onClick={() => selectedFolder && handleDeleteFolder(selectedFolder)}
                      disabled={!selectedFolder || foldersLoading}
                      className="px-3 py-2 rounded-full bg-red-500 hover:bg-red-600 text-white text-sm"
                    >
                      Delete Folder
                    </button>

                    <input
                      ref={folderThumbInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleUpdateFolderThumbnail}
                    />
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <button
                    onClick={handleUploadImagesClick}
                    disabled={!selectedFolderId || galleryUploading}
                    className="px-5 py-2 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 disabled:opacity-60 text-white font-semibold rounded-full shadow-md"
                  >
                    {galleryUploading ? "Uploading..." : "Upload Images to Folder"}
                  </button>

                  <button
                    onClick={() => selectedFolderId && fetchImages(selectedFolderId)}
                    disabled={!selectedFolderId || imagesLoading}
                    className="px-4 py-2 rounded-full border border-orange-200 bg-white hover:bg-orange-50 text-sm font-semibold text-orange-700 disabled:opacity-60"
                  >
                    {imagesLoading ? "Loading..." : "Reload Images"}
                  </button>

                  <input
                    ref={galleryUploadInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleUploadImagesToFolder}
                  />
                </div>

                {/* Images grid */}
                {!selectedFolderId ? (
                  <p className="text-sm text-gray-600">Select a folder to view / upload images.</p>
                ) : imagesLoading && images.length === 0 ? (
                  <p className="text-sm text-gray-600">Loading images...</p>
                ) : images.length === 0 ? (
                  <p className="text-sm text-gray-600">No images in this folder yet.</p>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {images.map((img) => {
                      const imgId = getId(img);
                      const src = getImageSrc(img);
                      const caption = getCaption(img);

                      return (
                        <div
                          key={imgId || src || Math.random()}
                          className="relative w-full aspect-square rounded-xl overflow-hidden shadow-md border border-orange-100 bg-white"
                        >
                          {src ? (
                            <img
                              src={src}
                              alt={caption || "Gallery"}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs text-slate-500">
                              No image url
                            </div>
                          )}

                          {/* Caption badge */}
                          <div className="absolute left-2 bottom-2 right-2">
                            <div className="bg-black/55 text-white text-[11px] px-2 py-1 rounded-lg line-clamp-2">
                              {caption || "No caption"}
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="absolute top-2 right-2 flex flex-col gap-2">
                            <button
                              onClick={() => handleUpdateCaption(img)}
                              className="bg-white/90 hover:bg-white text-slate-800 text-[11px] px-2 py-1 rounded-full shadow"
                            >
                              Caption
                            </button>
                            <button
                              onClick={() => handleDeleteImage(img)}
                              className="bg-red-500/90 hover:bg-red-600 text-white text-[11px] px-2 py-1 rounded-full shadow"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                <p className="mt-4 text-[11px] text-slate-600">
                  ✅ This Gallery section uses your APIs: folders CRUD + folder images CRUD + caption update.
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Video Manager */}
        <motion.section
          className="bg-white/80 rounded-2xl shadow-lg p-4 sm:p-6 border border-orange-100 flex flex-col gap-4"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.12 }}
          viewport={{ once: true }}
        >
          <h2 className="text-xl sm:text-2xl font-semibold text-orange-700 mb-1">Video Manager</h2>

          <form onSubmit={handleVideoSubmit} className="space-y-4 max-w-xl">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Video Title</label>
              <input
                type="text"
                className="w-full px-4 py-2 rounded-lg border border-orange-200 focus:ring-2 focus:ring-orange-400 outline-none bg-white"
                value={videoTitle}
                onChange={(e) => setVideoTitle(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">YouTube URL</label>
              <input
                type="text"
                className="w-full px-4 py-2 rounded-lg border border-orange-200 focus:ring-2 focus:ring-orange-400 outline-none bg-white"
                value={videoUrlState}
                onChange={(e) => setVideoUrlState(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={videoUploading}
                className="px-5 py-2 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 disabled:opacity-60 text-white font-semibold rounded-full shadow-md"
              >
                {videoUploading ? "Saving..." : "Save Video"}
              </button>
              {videoMessage && (
                <span className="text-sm text-green-700 font-medium">{videoMessage}</span>
              )}
            </div>
          </form>

          <div className="mt-6">
            <h3 className="text-lg font-semibold text-orange-700 mb-2">Saved Videos</h3>
            {savedVideos.length === 0 ? (
              <p className="text-sm text-gray-600">No videos added yet.</p>
            ) : (
              <ul className="space-y-2">
               {savedVideos.map((v) => {
  const id = getId(v);
  return (
    <li key={id} className="bg-orange-50 border border-orange-100 rounded-xl px-3 py-3">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-orange-800 text-sm line-clamp-1">{v.title}</div>
          <div className="text-xs text-gray-600 break-all sm:break-words sm:truncate">{v.url}</div>
        </div>

        <div className="sm:ml-auto flex items-center justify-end">
          <button
            onClick={() => handleRemoveVideo(v)}
            className="whitespace-nowrap text-xs bg-red-500 hover:bg-red-600 text-white rounded-full px-4 py-1.5 shadow-sm"
          >
            Remove
          </button>
        </div>
      </div>
    </li>
  );
})}

              </ul>
            )}
          </div>
        </motion.section>

        {/* ✅ Content + PDF moved to AdminTwo */}
        <AdminTwo
          apiFetch={apiFetch}
          normalizeArrayResponse={normalizeArrayResponse}
          normalizeItemResponse={normalizeItemResponse}
          getId={getId}
          CONTENT_API_BASE_URL={CONTENT_API_BASE_URL}
          PDF_API_URL={PDF_API_URL}
        />

        {/* Audio + Notifications (2-column) */}
        <motion.section
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.18 }}
          viewport={{ once: true }}
        >
          {/* Audio Library */}
          <div className="bg-white/80 rounded-2xl shadow p-5 border border-orange-100">
            <h4 className="text-xl font-semibold text-orange-700 mb-2">Audio Library (Header Bhajans)</h4>
            <p className="text-gray-700 text-sm mb-3">
              Upload bhajans here. The <span className="font-semibold">latest uploaded song</span> becomes the default
              background music on the user Header.
            </p>

            <div className="flex items-center gap-3 mb-3">
              <button
                onClick={handleAudioUploadClick}
                disabled={audioLoading}
                className="px-4 py-2 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white text-sm font-semibold rounded-full shadow disabled:opacity-60"
              >
                {audioLoading ? "Uploading..." : "Upload / Change Song"}
              </button>
              {audioMessage && <span className="text-xs text-green-700 font-medium">{audioMessage}</span>}
            </div>

            <input
              ref={audioFileInputRef}
              type="file"
              accept="audio/*"
              style={{ display: "none" }}
              onChange={handleAudioFileChange}
            />

            <div className="mt-3">
              <h5 className="text-sm font-semibold text-orange-700 mb-1">Songs in Library</h5>

              {audioLoading && audioList.length === 0 ? (
                <p className="text-xs text-gray-600">Loading songs...</p>
              ) : audioList.length === 0 ? (
                <p className="text-xs text-gray-600">No songs uploaded yet.</p>
              ) : (
                <ul className="space-y-2 max-h-56 overflow-y-auto custom-scrollbar">
                  {audioList.map((item, index) => {
                    const id = getId(item);
                    const isDefault = index === 0;

                    return (
                      <li
                        key={id || item.fileName}
                        className="bg-orange-50 border border-orange-100 rounded-xl px-3 py-3"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center flex-wrap gap-2">
                              <span className="font-semibold text-orange-800 text-sm line-clamp-1">
                                {item.originalName || item.fileName || "Song"}
                              </span>

                              {isDefault && (
                                <span className="text-[10px] text-green-700 font-bold uppercase bg-green-100 border border-green-200 px-2 py-0.5 rounded-full">
                                  Default
                                </span>
                              )}
                            </div>

                            {item.url && (
                              <a
                                href={item.url}
                                target="_blank"
                                rel="noreferrer"
                                className="text-[11px] text-blue-600 underline mt-1 inline-block"
                              >
                                Play / Open
                              </a>
                            )}
                          </div>

                          <div className="sm:ml-auto flex flex-wrap sm:flex-nowrap items-center justify-end gap-2">
                            <button
                              onClick={() => handleRenameAudio(item)}
                              className="whitespace-nowrap px-3 py-1.5 rounded-full border border-slate-200 text-slate-700 text-[11px] bg-white hover:bg-slate-50"
                            >
                              Rename
                            </button>
                            <button
                              onClick={() => handleDeleteAudio(item)}
                              className="whitespace-nowrap px-3 py-1.5 rounded-full bg-red-500 hover:bg-red-600 text-white text-[11px]"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}

              <p className="mt-2 text-[10px] text-gray-500">
                The top item is the latest and is used as the Header&apos;s default background bhajan.
              </p>
            </div>
          </div>

          {/* ✅ Notifications Manager */}
          {/* <div className="bg-white/80 rounded-2xl shadow-lg p-4 sm:p-6 border border-orange-100">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-4">
              <div>
                <h3 className="text-xl sm:text-2xl font-semibold text-orange-700 mb-1">
                  Notification Manager
                </h3>
                <p className="text-gray-700 text-sm">
                  Create, edit, delete notifications and they will appear in the user Header bell icon.
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={fetchNotifications}
                  disabled={notifLoading}
                  className="px-4 py-2 rounded-full border border-orange-200 bg-white hover:bg-orange-50 text-sm font-semibold text-orange-700 disabled:opacity-60"
                >
                  {notifLoading ? "Refreshing..." : "Refresh"}
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <input
                value={notifText}
                onChange={(e) => setNotifText(e.target.value)}
                placeholder="Enter notification text..."
                className="flex-1 px-4 py-2 rounded-lg border border-orange-200 focus:ring-2 focus:ring-orange-400 outline-none bg-white text-sm"
              />
              <button
                onClick={handleCreateNotification}
                disabled={notifLoading || !notifText.trim()}
                className="px-5 py-2 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 disabled:opacity-60 text-white font-semibold rounded-full shadow-md"
              >
                Add Notification
              </button>
            </div>

            {notifMessage ? (
              <div className="mt-3 text-sm text-green-700 font-medium">{notifMessage}</div>
            ) : null}

            <div className="mt-5">
              <h4 className="text-lg font-semibold text-orange-700 mb-2">
                Notifications List
                <span className="ml-2 text-xs text-slate-600">
                  ({notifList.filter((n) => !n?.isRead).length} unread)
                </span>
              </h4>

              {notifLoading && notifList.length === 0 ? (
                <p className="text-sm text-gray-600">Loading notifications...</p>
              ) : notifList.length === 0 ? (
                <p className="text-sm text-gray-600">No notifications yet.</p>
              ) : (
                <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
                  {notifList.map((n) => {
                    const id = getId(n);
                    const unread = !n?.isRead;

                    return (
                      <div
                        key={id}
                        className={`rounded-xl border p-3 flex items-start justify-between gap-3 ${
                          unread ? "border-orange-200 bg-orange-50" : "border-slate-200 bg-white"
                        }`}
                      >
                        <div className="flex-1">
                          <div className="text-sm font-extrabold text-slate-900">
                            {n?.text || "—"}
                          </div>
                          <div className="text-[11px] text-slate-500 mt-1">
                            {unread ? "Unread" : "Read"} •{" "}
                            {n?.createdAt ? new Date(n.createdAt).toLocaleString() : ""}
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center justify-end gap-2">
                          <button
                            onClick={() => handleToggleReadNotification(n)}
                            className="px-3 py-1.5 rounded-full border border-slate-200 text-slate-700 text-[11px] bg-white hover:bg-slate-50"
                          >
                            {unread ? "Mark Read" : "Mark Unread"}
                          </button>

                          <button
                            onClick={() => handleEditNotification(n)}
                            className="px-3 py-1.5 rounded-full border border-slate-200 text-slate-700 text-[11px] bg-white hover:bg-slate-50"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => handleDeleteNotification(n)}
                            className="px-3 py-1.5 rounded-full bg-red-500 hover:bg-red-600 text-white text-[11px]"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              <p className="mt-3 text-[11px] text-slate-600">
                ✅ Uses API: <span className="font-semibold">{NOTIFICATIONS_URL}</span>
              </p>
            </div>
          </div> */}
        </motion.section>
      </main>
    </motion.div>
  );
};

export default HomeAdmin;
