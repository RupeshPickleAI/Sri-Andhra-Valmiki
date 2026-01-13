// src/pages/Gallery.jsx
import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  PhotoLibrary,
  Folder,
  ArrowBack,
  Close,
  Image as ImageIcon,
} from "@mui/icons-material";

// API CONFIG
const API_BASE_URL = "http://localhost:5000/api";
const SERVER_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, ""); // => http://localhost:5000

const GALLERY_FOLDERS_URL = `${API_BASE_URL}/gallery/folders`;
const folderImagesUrl = (id) => `${API_BASE_URL}/gallery/folders/${id}/images`;

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

const getId = (item) =>
  item?.id ?? item?._id ?? item?.folderId ?? item?.imageId ?? null;

const getFolderName = (f) => f?.name || f?.title || f?.folderName || "Untitled Folder";

const normalizeMediaUrl = (src) => {
  if (!src) return null;
  if (typeof src !== "string") return null;

  // already absolute
  if (/^https?:\/\//i.test(src) || src.startsWith("data:") || src.startsWith("blob:")) {
    return src;
  }

  // relative path
  if (src.startsWith("/")) return `${SERVER_ORIGIN}${src}`;
  return `${SERVER_ORIGIN}/${src}`;
};

const getFolderThumbnailSrc = (folder) => {
  // supports many backend naming styles
  const raw =
    folder?.thumbnailUrl ||
    folder?.thumbnail_url ||
    folder?.thumbnail ||
    folder?.thumb ||
    folder?.cover ||
    folder?.coverImage ||
    folder?.cover_image ||
    folder?.image ||
    folder?.folderThumbnail ||
    folder?.folder_thumbnail ||
    (folder?.thumbnail && typeof folder.thumbnail === "object"
      ? folder.thumbnail.url || folder.thumbnail.path || folder.thumbnail.image
      : null);

  return normalizeMediaUrl(raw);
};

const getImageSrc = (img) => {
  const raw =
    img?.url ||
    img?.imageUrl ||
    img?.image_url ||
    img?.image ||
    img?.path ||
    img?.fileUrl ||
    img?.file_url ||
    (img?.file && typeof img.file === "object" ? img.file.url || img.file.path : null);

  return normalizeMediaUrl(raw);
};

const getCaption = (img) => img?.caption || img?.title || img?.name || "";

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
    const msg = json?.message || json?.error || `Request failed: ${res.status} ${res.statusText}`;
    throw new Error(msg);
  }
  return json ?? {};
}

const Gallery = () => {
  const [folders, setFolders] = useState([]);
  const [foldersLoading, setFoldersLoading] = useState(false);

  const [selectedFolderId, setSelectedFolderId] = useState(null);

  const [images, setImages] = useState([]);
  const [imagesLoading, setImagesLoading] = useState(false);

  const [selectedImage, setSelectedImage] = useState(null);
  const [message, setMessage] = useState("");

  const selectedFolder = useMemo(() => {
    if (!selectedFolderId) return null;
    return folders.find((f) => getId(f) === selectedFolderId) || null;
  }, [folders, selectedFolderId]);

  // Fetch folders
  const fetchFolders = async () => {
    setFoldersLoading(true);
    setMessage("");
    try {
      const json = await apiFetch(GALLERY_FOLDERS_URL);
      const list = normalizeArrayResponse(json);
      setFolders(list);
    } catch (err) {
      console.error(err);
      setMessage(err.message || "Failed to load folders.");
    } finally {
      setFoldersLoading(false);
    }
  };

  // Fetch images in folder
  const fetchImages = async (folderId) => {
    if (!folderId) {
      setImages([]);
      return;
    }
    setImagesLoading(true);
    setMessage("");
    try {
      const json = await apiFetch(folderImagesUrl(encodeURIComponent(folderId)));
      const list = normalizeArrayResponse(json);
      const cleaned = list.filter((img) => !!getImageSrc(img));
      setImages(cleaned);
    } catch (err) {
      console.error(err);
      setMessage(err.message || "Failed to load images.");
      setImages([]);
    } finally {
      setImagesLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchFolders();
  }, []);

  // Auto-refresh in background
  useEffect(() => {
    const foldersTimer = setInterval(() => fetchFolders(), 30000);
    const imagesTimer = setInterval(() => {
      if (selectedFolderId) fetchImages(selectedFolderId);
    }, 10000);

    const onFocus = () => {
      fetchFolders();
      if (selectedFolderId) fetchImages(selectedFolderId);
    };
    window.addEventListener("focus", onFocus);

    return () => {
      clearInterval(foldersTimer);
      clearInterval(imagesTimer);
      window.removeEventListener("focus", onFocus);
    };
  }, [selectedFolderId]);

  // Handle folder click
  const handleFolderClick = (folderId) => {
    setSelectedFolderId(folderId);
    fetchImages(folderId);
  };

  // Handle back to folders
  const handleBackToFolders = () => {
    setSelectedFolderId(null);
    setImages([]);
  };

  return (
    <>
      <section className="min-h-screen px-4 sm:px-8 lg:px-16 pt-[110px] sm:pt-[120px] pb-16 bg-gradient-to-br from-orange-50 via-amber-50 to-white">
        <AnimatePresence mode="wait">
          {!selectedFolderId ? (
            // FOLDERS VIEW
            <motion.div
              key="folders"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              {/* Header */}
              <div className="text-center mb-12">
                <motion.div
                  className="inline-flex items-center justify-center gap-3 mb-4"
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  >
                    <PhotoLibrary className="!text-5xl sm:!text-6xl text-orange-500" />
                  </motion.div>

                  <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-orange-600 via-amber-500 to-orange-600 bg-clip-text text-transparent">
                    Gallery
                  </h1>
                </motion.div>

                <motion.p
                  className="text-slate-600 text-base sm:text-lg max-w-2xl mx-auto"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  Explore your beautiful collection organized in folders
                </motion.p>

                <motion.div
                  className="mt-6 h-1 w-32 mx-auto bg-gradient-to-r from-orange-500 to-amber-500 rounded-full"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                />
              </div>

              {/* Message */}
              {message && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="max-w-3xl mx-auto mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-center text-red-600 font-medium"
                >
                  {message}
                </motion.div>
              )}

              {/* Folders Grid */}
              {foldersLoading && folders.length === 0 ? (
                <div className="flex items-center justify-center py-20">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full"
                  />
                </div>
              ) : folders.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="max-w-md mx-auto mt-20 bg-white rounded-3xl shadow-xl p-12 text-center border-2 border-dashed border-orange-200"
                >
                  <Folder className="!text-8xl text-orange-200 mb-6 mx-auto" />
                  <h3 className="text-2xl font-bold text-slate-800 mb-3">No Folders Yet</h3>
                  <p className="text-slate-500">Admin will create folders and upload images soon</p>
                </motion.div>
              ) : (
                <div className="max-w-7xl mx-auto">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {folders.map((folder, i) => {
                      const id = getId(folder);
                      const name = getFolderName(folder);
                      const thumb = getFolderThumbnailSrc(folder);

                      return (
                        <motion.div
                          key={id || i}
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: i * 0.05 }}
                          whileHover={{ y: -8, transition: { duration: 0.2 } }}
                          onClick={() => handleFolderClick(id)}
                          className="group cursor-pointer"
                        >
                          <div className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-orange-100">
                            {/* ✅ THUMBNAIL AREA */}
                            <div className="relative h-48 overflow-hidden bg-gradient-to-br from-orange-100 via-amber-100 to-orange-50">
                              {thumb ? (
                                <>
                                  <img
                                    src={thumb}
                                    alt={`${name} thumbnail`}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    loading="lazy"
                                  />

                                  {/* overlay for readability */}
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />

                                  {/* little label */}
                                  <div className="absolute bottom-3 left-3 right-3">
                                    <div className="text-white font-semibold text-sm line-clamp-2 drop-shadow">
                                      {name}
                                    </div>
                                  </div>
                                </>
                              ) : (
                                // fallback icon if no thumbnail
                                <div className="h-full flex items-center justify-center">
                                  <motion.div
                                    className="absolute inset-0 bg-gradient-to-br from-orange-400/0 via-amber-400/0 to-orange-400/0 group-hover:from-orange-400/20 group-hover:via-amber-400/20 group-hover:to-orange-400/20 transition-all duration-500"
                                  />
                                  <motion.div whileHover={{ scale: 1.1, rotate: 5 }} transition={{ duration: 0.3 }}>
                                    <Folder className="!text-9xl text-orange-400 drop-shadow-lg" />
                                  </motion.div>
                                  <div className="absolute top-4 right-4 w-16 h-16 bg-amber-200/30 rounded-full blur-2xl" />
                                  <div className="absolute bottom-4 left-4 w-20 h-20 bg-orange-200/30 rounded-full blur-2xl" />
                                </div>
                              )}
                            </div>

                            {/* Folder Name */}
                            {/* <div className="p-6">
                              <h3 className="text-lg font-bold text-slate-800 text-center mb-2 group-hover:text-orange-600 transition-colors line-clamp-2">
                                {}
                              </h3>
                              <p className="text-sm text-slate-500 text-center">Tap to explore</p>
                            </div> */}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              )}
            </motion.div>
          ) : (
            // IMAGES VIEW
            <motion.div
              key="images"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              {/* Header with Back Button */}
              <div className="mb-8">
                <motion.button
                  onClick={handleBackToFolders}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white rounded-full shadow-lg hover:shadow-xl text-orange-600 font-semibold transition-all duration-300 hover:scale-105 mb-6 border border-orange-100"
                  whileHover={{ x: -5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ArrowBack />
                  <span>Back to Folders</span>
                </motion.button>

                <div className="text-center">
                  <motion.h2
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent mb-3"
                  >
                    {selectedFolder ? getFolderName(selectedFolder) : ""}
                  </motion.h2>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="text-slate-600"
                  >
                    {images.length} {images.length === 1 ? "image" : "images"}
                  </motion.p>
                </div>
              </div>

              {/* Message */}
              {message && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="max-w-3xl mx-auto mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-center text-red-600 font-medium"
                >
                  {message}
                </motion.div>
              )}

              {/* Images Grid */}
              {imagesLoading && images.length === 0 ? (
                <div className="flex items-center justify-center py-20">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full"
                  />
                </div>
              ) : images.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="max-w-md mx-auto mt-20 bg-white rounded-3xl shadow-xl p-12 text-center border-2 border-dashed border-orange-200"
                >
                  <ImageIcon className="!text-8xl text-orange-200 mb-6 mx-auto" />
                  <h3 className="text-2xl font-bold text-slate-800 mb-3">No Images Yet</h3>
                  <p className="text-slate-500">
                    This folder is empty. Admin will upload images soon.
                  </p>
                </motion.div>
              ) : (
                <div className="max-w-7xl mx-auto">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {images.map((imgObj, i) => {
                      const src = getImageSrc(imgObj);
                      const caption = getCaption(imgObj);

                      return (
                        <motion.div
                          key={getId(imgObj) || src || i}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.4, delay: i * 0.03 }}
                          whileHover={{ y: -8, transition: { duration: 0.2 } }}
                          onClick={() => setSelectedImage(imgObj)}
                          className="group cursor-pointer"
                        >
                          <div className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-orange-100">
                            <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-orange-100 to-amber-100">
                              <img
                                src={src}
                                alt={caption || `Image ${i + 1}`}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                loading="lazy"
                              />

                              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                                <span className="text-white font-semibold text-sm">Click to view</span>
                              </div>

                              <div className="absolute inset-0 border-4 border-transparent group-hover:border-orange-400 rounded-3xl transition-colors duration-300" />
                            </div>

                            {caption && (
                              <div className="p-4">
                                <h4 className="text-sm font-semibold text-slate-800 text-center line-clamp-2">
                                  {caption}
                                </h4>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
          >
            <motion.button
              type="button"
              onClick={() => setSelectedImage(null)}
              className="absolute top-6 right-6 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white rounded-full p-3 transition-all duration-200 z-10"
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
            >
              <Close className="!text-2xl" />
            </motion.button>

            <motion.div
              className="max-w-6xl w-full max-h-[90vh] relative"
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ type: "spring", damping: 25 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-white rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src={getImageSrc(selectedImage)}
                  alt={getCaption(selectedImage) || "Preview"}
                  className="w-full h-full max-h-[80vh] object-contain"
                />

                {getCaption(selectedImage) && (
                  <div className="p-6 bg-gradient-to-r from-orange-50 to-amber-50">
                    <h3 className="text-xl font-bold text-slate-800 text-center">
                      {getCaption(selectedImage)}
                    </h3>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Gallery;
