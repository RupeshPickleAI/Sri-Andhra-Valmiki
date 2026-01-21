// src/pages/Videos.jsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import PlayCircleFilledIcon from "@mui/icons-material/PlayCircleFilled";
import CloseIcon from "@mui/icons-material/Close";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

const VIDEOS_API_URL = "https://sriandhravalmiki-merge.onrender.com/api/videos"; // no need trailing /

function extractYouTubeId(url = "") {
  try {
    if (url.includes("youtu.be/"))
      return url.split("youtu.be/")[1].split(/[?&/]/)[0];
    if (url.includes("/embed/"))
      return url.split("/embed/")[1].split(/[?&/]/)[0];
    const match = url.match(/[?&]v=([^&]+)/);
    if (match) return match[1];
    return /^[A-Za-z0-9_-]{6,}$/.test(url.trim()) ? url.trim() : null;
  } catch {
    return null;
  }
}

export default function Videos() {
  const [videos, setVideos] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [floating, setFloating] = useState(null);
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    const loadVideos = async () => {
      setErrMsg("");
      try {
        const res = await fetch(VIDEOS_API_URL);
        const json = await res.json();

        // ✅ backend returns: { success:true, data:[...] }
        const list = Array.isArray(json) ? json : Array.isArray(json?.data) ? json.data : [];

        if (list.length) {
          setVideos(
            list.map((v, idx) => ({
              id: v._id || v.id || idx + 1,
              title: v.title || "Untitled",
              url: v.url || "",
              embedUrl: v.embedUrl || "",
              videoId: v.videoId || null,
            }))
          );
          return;
        }

        setVideos([]); // no videos in DB
      } catch (e) {
        console.error("Error fetching videos:", e);
        setErrMsg("Failed to load videos from server.");
        setVideos([]);
      }
    };

    loadVideos();
  }, []);

  const toggleInline = (id) => {
    setActiveId((prev) => (prev === id ? null : id));
  };

  const openFloating = (video, fullscreen = false) => {
    setActiveId(null);
    setFloating({ video, fullscreen });
  };

  const closeFloating = () => setFloating(null);

  return (
    <main className="relative min-h-screen bg-gradient-to-b from-slate-50 via-orange-50/20 to-slate-50 pb-16">
      {/* Header */}
      <div className="relative bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 py-16 px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-2xl"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-white rounded-full blur-3xl"></div>
        </div>

        <motion.div
          className="relative z-10 max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 mb-4 px-5 py-2 bg-white/20 backdrop-blur-sm text-white rounded-full shadow-lg border border-white/30"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <VideoLibraryIcon />
            <span className="font-semibold text-sm">Devotional Videos</span>
          </motion.div>

          <motion.h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 drop-shadow-2xl"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            Bhakti Videos
          </motion.h1>

          <motion.p
            className="text-base sm:text-lg lg:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
          >
            Divine chants, devotional bhajans, and sacred teachings to elevate your spiritual journey
          </motion.p>

          <motion.div
            className="flex items-center justify-center gap-3 mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.8 }}
          >
            <div className="h-px w-16 bg-white/40"></div>
            <span className="text-2xl text-white/80">🕉️</span>
            <div className="h-px w-16 bg-white/40"></div>
          </motion.div>
        </motion.div>
      </div>

      {/* Error */}
      {errMsg ? (
        <div className="max-w-5xl mx-auto mt-6 px-4">
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
            {errMsg}
          </div>
        </div>
      ) : null}

      {/* Videos Grid */}
      <div className="max-w-7xl mx-auto mt-12 px-4 sm:px-6 lg:px-8">
        {videos.length === 0 ? (
          <div className="text-center text-slate-600">
            <p className="font-semibold">No videos uploaded yet.</p>
            <p className="text-sm mt-1">Admin uploads will appear here automatically.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {videos.map((v, index) => {
              const vid = v.videoId || extractYouTubeId(v.url) || "";
              const thumb = vid ? `https://img.youtube.com/vi/${vid}/hqdefault.jpg` : "/placeholder.png";
              const isActive = activeId === v.id;

              const iframeSrc =
                v.embedUrl && v.embedUrl.includes("youtube")
                  ? `${v.embedUrl}?autoplay=1&rel=0&modestbranding=1`
                  : vid
                  ? `https://www.youtube.com/embed/${vid}?autoplay=1&rel=0&modestbranding=1`
                  : "";

              return (
                <motion.div
                  key={v.id}
                  className="group bg-white rounded-2xl overflow-hidden border-2 border-slate-200 hover:border-orange-300 shadow-lg hover:shadow-2xl transition-all duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  whileHover={{ y: -8 }}
                >
                  <div className="relative w-full aspect-video bg-black">
                    {isActive && iframeSrc ? (
                      <iframe
                        src={iframeSrc}
                        title={v.title}
                        className="absolute top-0 left-0 w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    ) : (
                      <>
                        <img
                          src={thumb}
                          alt={v.title}
                          className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <motion.button
                            onClick={() => toggleInline(v.id)}
                            className="relative"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <PlayCircleFilledIcon className="!text-7xl text-white drop-shadow-2xl hover:text-orange-400 transition-colors" />
                          </motion.button>
                        </div>
                      </>
                    )}

                    <div className="absolute top-3 right-3 flex gap-2">
                      {isActive ? (
                        <>
                          <motion.button
                            onClick={() => openFloating(v, true)}
                            className="bg-white/90 hover:bg-white text-orange-600 font-bold rounded-full w-9 h-9 flex items-center justify-center shadow-lg backdrop-blur-sm"
                            title="Pop-out fullscreen"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <OpenInNewIcon fontSize="small" />
                          </motion.button>
                          <motion.button
                            onClick={() => setActiveId(null)}
                            className="bg-white/90 hover:bg-white text-orange-600 font-bold rounded-full w-9 h-9 flex items-center justify-center shadow-lg backdrop-blur-sm"
                            title="Stop"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <CloseIcon fontSize="small" />
                          </motion.button>
                        </>
                      ) : (
                        <motion.button
                          onClick={() => openFloating(v, false)}
                          className="bg-white/90 hover:bg-white text-orange-600 font-bold rounded-full w-9 h-9 flex items-center justify-center shadow-lg backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Open floating player"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <OpenInNewIcon fontSize="small" />
                        </motion.button>
                      )}
                    </div>

                    {!isActive && (
                      <div className="absolute bottom-3 right-3 bg-black/80 text-white text-xs font-semibold px-2 py-1 rounded backdrop-blur-sm">
                        Video
                      </div>
                    )}
                  </div>

                  <div className="p-5 bg-gradient-to-b from-white to-orange-50/30">
                    <h2 className="text-lg font-bold text-slate-800 mb-1 line-clamp-2 group-hover:text-orange-600 transition-colors">
                      {v.title}
                    </h2>
                    <p className="text-sm text-slate-500">{vid ? "Devotional Content" : "Invalid URL"}</p>
                  </div>

                  <div className="h-1 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      <motion.div
        className="text-center mt-16 px-4"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-orange-100 to-pink-100 rounded-full border border-orange-200">
          <span className="text-2xl">🕉️</span>
          <p className="text-slate-700 font-medium">May these sacred vibrations bless every soul</p>
          <span className="text-2xl">🕉️</span>
        </div>
      </motion.div>

      {/* Floating Player */}
      {floating && (
        <motion.div
          className={`fixed z-50 shadow-2xl border-4 border-orange-300 bg-black transition-all duration-300 ${
            floating.fullscreen ? "top-0 left-0 w-screen h-screen" : "bottom-6 right-6 w-[400px] h-[225px] rounded-2xl"
          }`}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
        >
          <iframe
            src={`${
              floating.video.embedUrl
                ? floating.video.embedUrl
                : `https://www.youtube.com/embed/${extractYouTubeId(floating.video.url)}`
            }?autoplay=1&rel=0&modestbranding=1`}
            title={floating.video.title}
            className={`w-full h-full ${floating.fullscreen ? "" : "rounded-2xl"}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />

          <div className="absolute top-3 right-3 flex gap-2">
            <motion.button
              onClick={closeFloating}
              className="bg-white/90 hover:bg-white text-orange-600 font-bold rounded-full w-10 h-10 flex items-center justify-center shadow-lg backdrop-blur-sm"
              title="Close"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <CloseIcon />
            </motion.button>

            <motion.button
              onClick={() => setFloating((f) => ({ ...f, fullscreen: !f.fullscreen }))}
              className="bg-white/90 hover:bg-white text-orange-600 font-bold rounded-full w-10 h-10 flex items-center justify-center shadow-lg backdrop-blur-sm"
              title={floating.fullscreen ? "Exit fullscreen" : "Fullscreen"}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {floating.fullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
            </motion.button>
          </div>

          {!floating.fullscreen && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 rounded-b-2xl">
              <p className="text-white text-sm font-semibold line-clamp-1">{floating.video.title}</p>
            </div>
          )}
        </motion.div>
      )}
    </main>
  );
}
