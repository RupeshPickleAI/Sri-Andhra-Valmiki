import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import templeImg from "../assets/1.jpeg";
import bgImg from "../assets/bg.jpg";
import Articles from "./Articles";
import Gallery from "./Gallery";
import { Link } from "react-router-dom";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import PlayCircleFilledIcon from "@mui/icons-material/PlayCircleFilled";
import CloseIcon from "@mui/icons-material/Close";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import InfoIcon from "@mui/icons-material/Info";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../components/LanguageSwitcher";

const API_BASE_URL = "http://localhost:5000/api";
const VIDEOS_API_URL = "http://localhost:5000/api/videos/";
const VIDEOS_STORAGE_KEY = "bhaktiVideos";

const DEFAULT_MARQUEE =
  "🌸 Hare Krishna Hare Rama — Chant the name of the Lord and find peace within your heart. 🌸";

function extractYouTubeId(url = "") {
  try {
    if (url.includes("youtu.be/")) return url.split("youtu.be/")[1].split(/[?&/]/)[0];
    if (url.includes("/embed/")) return url.split("/embed/")[1].split(/[?&/]/)[0];
    const match = url.match(/[?&]v=([^&]+)/);
    if (match) return match[1];
    return /^[A-Za-z0-9_-]{6,}$/.test(url.trim()) ? url.trim() : null;
  } catch {
    return null;
  }
}

const Home = () => {
  const { t, i18n } = useTranslation();

  const [heroImg, setHeroImg] = useState(templeImg);
  const [marqueeText, setMarqueeText] = useState(DEFAULT_MARQUEE);

  // ✅ Videos (Top 5)
  const [videos, setVideos] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [floating, setFloating] = useState(null);

  const fallbackDefaults = [
    { id: 1, title: "Sri Rama Bhajan", url: "https://www.youtube.com/watch?v=tBgNNFazxKo8" },
    { id: 2, title: "Govinda Jai Jai – Evening Kirtan", url: "https://youtu.be/hpNNFazxKo8" },
    { id: 3, title: "Meditation Through Bhajan", url: "https://youtu.be/EuAT7iywR_0" },
    { id: 4, title: "Radhe Shyam Devotional Chant", url: "https://youtu.be/Qf0xHSB656w" },
    { id: 5, title: "Krishna Leela Kirtan", url: "https://youtu.be/tZKHQD6oC2s" },
    { id: 6, title: "Morning Aarti – Harati Bhajan", url: "https://www.youtube.com/watch?v=QbKQy2dZ7sw" },
  ];

  useEffect(() => {
    const loadHomeSettings = async () => {
      const savedMarquee = localStorage.getItem("mainMarqueeText");
      if (savedMarquee && savedMarquee.trim()) setMarqueeText(savedMarquee);

      try {
        const res = await fetch(`${API_BASE_URL}/settings/home`, { cache: "no-store" });
        const json = await res.json();
        const poster = json?.data?.posterUrl;

        if (poster && String(poster).trim()) {
          setHeroImg(`${poster}?t=${Date.now()}`);
          return;
        }
      } catch {}

      const savedPoster = localStorage.getItem("mainPosterUrl");
      if (savedPoster && savedPoster.trim()) {
        setHeroImg(`${savedPoster}?t=${Date.now()}`);
        return;
      }

      setHeroImg(templeImg);
    };

    loadHomeSettings();
  }, []);

  // ✅ Load videos for home preview
  useEffect(() => {
    const loadVideos = async () => {
      try {
        const res = await fetch(VIDEOS_API_URL);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length) {
            setVideos(
              data.map((v, idx) => ({
                id: v.id ?? idx + 1,
                title: v.title,
                url: v.url,
              }))
            );
            return;
          }
        }
      } catch {}

      try {
        const saved = JSON.parse(localStorage.getItem(VIDEOS_STORAGE_KEY) || "[]");
        if (Array.isArray(saved) && saved.length) {
          setVideos(saved);
          return;
        }
      } catch {}

      setVideos(fallbackDefaults);
    };

    loadVideos();
  }, []);

  const marqueeToShow = useMemo(() => {
    if (marqueeText === DEFAULT_MARQUEE) return t("marquee_default");
    return marqueeText;
  }, [marqueeText, t, i18n.language]);

  const toggleInline = (id) => setActiveId((prev) => (prev === id ? null : id));
  const openFloating = (video, fullscreen = false) => {
    setActiveId(null);
    setFloating({ video, fullscreen });
  };
  const closeFloating = () => setFloating(null);

  const top5Videos = useMemo(() => videos.slice(0, 5), [videos]);

  return (
    <motion.div
      className="flex flex-col"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 1.2, ease: "easeInOut" }}
    >
      {/* ✅ HERO (Image only - no black band) */}
      <div className="w-full">
        <div className="relative w-full">
          <img
            src={heroImg}
            alt="Temple"
            className="w-full h-auto block object-contain object-top"
            style={{ background: "transparent" }}
            onError={() => setHeroImg(templeImg)}
          />

          <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-30">
            <LanguageSwitcher />
          </div>
        </div>

        {/* ✅ Marquee BELOW image */}
        <div className="px-3 sm:px-6 md:px-8 lg:px-16 py-4 sm:py-6 bg-gradient-to-b from-white via-amber-50/40 to-amber-50/10">
          <div className="bg-gradient-to-r from-orange-600 via-amber-500 to-orange-600 rounded-full py-2.5 sm:py-3 md:py-4 px-3 sm:px-4 shadow-2xl overflow-hidden border-2 border-orange-300/60 backdrop-blur-sm">
            <marquee
              behavior="scroll"
              direction="left"
              scrollamount="5"
              className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl font-bold tracking-wide text-white"
              style={{ textShadow: "0 1px 3px rgba(0,0,0,0.25)" }}
            >
              {marqueeToShow}
            </marquee>
          </div>
        </div>

        {/* ✅ ENHANCED: About Him info with Devotional Background IMAGE */}
        <div className="px-4 sm:px-6 md:px-8 lg:px-16 pb-10 sm:pb-12 bg-gradient-to-b from-amber-50/10 via-white to-slate-50">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative rounded-3xl shadow-2xl overflow-hidden"
            >
              {/* ✨ Devotional Background Image Layer */}
              <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{
                  backgroundImage: `url('${bgImg}')`,
                }}
              >
                {/* Dark overlay for readability */}
                <div className="absolute inset-0 bg-gradient-to-br from-orange-900/85 via-amber-900/80 to-orange-800/85"></div>
                
                {/* Additional texture overlay */}
                <div className="absolute inset-0 bg-black/20"></div>
              </div>

              {/* Decorative pattern overlay */}
              <div 
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M50 10 L60 40 L90 40 L67 57 L77 87 L50 70 L23 87 L33 57 L10 40 L40 40 Z' fill='%23ffffff' fill-opacity='0.3'/%3E%3C/svg%3E")`,
                  backgroundSize: '80px 80px'
                }}
              ></div>

              {/* Content with backdrop blur for readability */}
              <div className="relative">
                {/* Top decorative stripe */}
                <div className="h-2 bg-gradient-to-r from-orange-400 via-amber-400 to-orange-400 shadow-lg"></div>

                <div className="p-5 sm:p-7 md:p-8">
                  {/* header */}
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div>
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-xl border-2 border-white/30">
                        <InfoIcon sx={{ fontSize: 18 }} />
                        <span className="text-xs sm:text-sm font-bold">
                          {t("home_subbarao_badge")}
                        </span>
                      </div>

                      <h3 className="mt-4 text-xl sm:text-2xl md:text-3xl font-extrabold text-white leading-tight drop-shadow-lg">
                        {t("home_subbarao_title")}
                      </h3>

                      <p className="mt-3 text-sm sm:text-base text-orange-50 leading-relaxed font-medium drop-shadow-md">
                        {t("home_subbarao_subtitle")}
                      </p>
                    </div>

                    {/* meta chips with enhanced styling */}
                    <div className="flex flex-wrap gap-2 sm:justify-end">
                      <span className="text-xs sm:text-sm px-3 py-2 rounded-full bg-white/95 backdrop-blur-md border-2 border-orange-200 text-orange-800 font-semibold shadow-lg">
                        {t("home_subbarao_meta_born")}
                      </span>
                      <span className="text-xs sm:text-sm px-3 py-2 rounded-full bg-white/95 backdrop-blur-md border-2 border-orange-200 text-orange-800 font-semibold shadow-lg">
                        {t("home_subbarao_meta_place")}
                      </span>
                      <span className="text-xs sm:text-sm px-3 py-2 rounded-full bg-white/95 backdrop-blur-md border-2 border-orange-200 text-orange-800 font-semibold shadow-lg">
                        {t("home_subbarao_meta_mahasamadhi")}
                      </span>
                    </div>
                  </div>

                  {/* body with enhanced readability */}
                  <div className="mt-6 grid grid-cols-1 gap-4">
                    <p className="text-sm sm:text-base text-white leading-relaxed bg-black/30 backdrop-blur-md p-4 rounded-xl border border-white/20 shadow-lg">
                      {t("home_subbarao_para_1")}
                    </p>
                    <p className="text-sm sm:text-base text-white leading-relaxed bg-black/30 backdrop-blur-md p-4 rounded-xl border border-white/20 shadow-lg">
                      {t("home_subbarao_para_2")}
                    </p>
                    <p className="text-sm sm:text-base text-white leading-relaxed bg-black/30 backdrop-blur-md p-4 rounded-xl border border-white/20 shadow-lg">
                      {t("home_subbarao_para_3")}
                    </p>
                    <p className="text-sm sm:text-base text-white leading-relaxed bg-black/30 backdrop-blur-md p-4 rounded-xl border border-white/20 shadow-lg">
                      {t("home_subbarao_para_4")}
                    </p>
                  </div>

                  {/* footer CTA with enhanced design */}
                  <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-black/30 backdrop-blur-md p-4 rounded-xl border border-white/20 shadow-lg">
                    <div className="text-xs sm:text-sm text-orange-100 font-medium italic">
                      {t("home_subbarao_footer_note")}
                    </div>

                    <Link
                      to="/home/about"
                      className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-white to-orange-50 hover:from-orange-50 hover:to-white text-orange-700 font-bold px-6 py-3 rounded-full shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 text-xs sm:text-sm border-2 border-white/50"
                    >
                      <span>{t("learn_more") || "Learn More"}</span>
                      <InfoIcon sx={{ fontSize: 18 }} />
                    </Link>
                  </div>
                </div>

                {/* Bottom decorative stripe */}
                <div className="h-2 bg-gradient-to-r from-orange-400 via-amber-400 to-orange-400 shadow-lg"></div>
              </div>

              {/* Floating decorative elements with glow */}
              <div className="absolute top-8 right-8 w-32 h-32 bg-orange-400/30 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute bottom-8 left-8 w-40 h-40 bg-amber-400/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-orange-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }}></div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Articles */}
      <motion.div
        id="articles"
        className="scroll-mt-20"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
      >
        <Articles />
      </motion.div>

      {/* ✅ VIDEOS PREVIEW (TOP 5) */}
      <motion.section
        id="videos-preview"
        className="px-4 sm:px-6 lg:px-12 xl:px-16 py-12 sm:py-16 bg-gradient-to-b from-amber-50/30 via-orange-50/40 to-slate-50"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
      >
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-3 px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full shadow-lg">
            <VideoLibraryIcon />
            <span className="font-semibold text-sm sm:text-base">
              {t("videos_badge") || "Videos"}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-pink-600">
            {t("videos_title") || "Bhakti Videos"}
          </h2>

          <p className="mt-2 max-w-2xl mx-auto text-sm sm:text-base text-slate-600">
            {t("videos_desc") || "Watch devotional bhajans and sacred teachings."}
          </p>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {top5Videos.map((v, index) => {
            const vid = extractYouTubeId(v.url) || "";
            const thumb = vid ? `https://img.youtube.com/vi/${vid}/hqdefault.jpg` : "/placeholder.png";
            const isActive = activeId === v.id;

            return (
              <motion.div
                key={v.id}
                className="group bg-white rounded-2xl overflow-hidden border-2 border-slate-200 hover:border-orange-300 shadow-lg hover:shadow-2xl transition-all duration-300"
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
                viewport={{ once: true }}
                whileHover={{ y: -6 }}
              >
                <div className="relative w-full aspect-video bg-black">
                  {isActive && vid ? (
                    <iframe
                      src={`https://www.youtube.com/embed/${vid}?autoplay=1&rel=0&modestbranding=1`}
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
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <motion.button
                          onClick={() => toggleInline(v.id)}
                          whileHover={{ scale: 1.08 }}
                          whileTap={{ scale: 0.95 }}
                          className="relative"
                        >
                          <PlayCircleFilledIcon className="!text-7xl text-white drop-shadow-2xl hover:text-orange-300 transition-colors" />
                        </motion.button>
                      </div>
                    </>
                  )}

                  <div className="absolute top-3 right-3 flex gap-2">
                    {isActive ? (
                      <>
                        <motion.button
                          onClick={() => openFloating(v, true)}
                          className="bg-white/90 hover:bg-white text-orange-600 rounded-full w-9 h-9 flex items-center justify-center shadow-lg"
                          title="Open fullscreen"
                          whileHover={{ scale: 1.08 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <OpenInNewIcon fontSize="small" />
                        </motion.button>
                        <motion.button
                          onClick={() => setActiveId(null)}
                          className="bg-white/90 hover:bg-white text-orange-600 rounded-full w-9 h-9 flex items-center justify-center shadow-lg"
                          title="Stop"
                          whileHover={{ scale: 1.08 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <CloseIcon fontSize="small" />
                        </motion.button>
                      </>
                    ) : (
                      <motion.button
                        onClick={() => openFloating(v, false)}
                        className="bg-white/90 hover:bg-white text-orange-600 rounded-full w-9 h-9 flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Open player"
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <OpenInNewIcon fontSize="small" />
                      </motion.button>
                    )}
                  </div>
                </div>

                <div className="p-5 bg-gradient-to-b from-white to-orange-50/30">
                  <h3 className="text-lg font-bold text-slate-800 mb-1 line-clamp-2 group-hover:text-orange-600 transition-colors">
                    {v.title}
                  </h3>
                  <p className="text-sm text-slate-500">{vid ? "Devotional Content" : "Invalid URL"}</p>
                </div>

                <div className="h-1 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </motion.div>
            );
          })}
        </div>

        <div className="text-center mt-10">
          <Link
            to="/home/videos"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition"
          >
            <VideoLibraryIcon fontSize="small" />
            View All Videos
          </Link>
        </div>
      </motion.section>

      {/* Gallery Section */}
      <motion.section
        id="gallery"
        className="py-12 sm:py-16 lg:py-20 xl:py-24 bg-gradient-to-b from-slate-50 via-orange-50/40 to-amber-50/30"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
        viewport={{ once: true }}
      >
        <Gallery limit={5} />
      </motion.section>

      {/* About Preview */}
      <motion.section
        id="about"
        className="px-4 sm:px-6 lg:px-12 xl:px-16 py-12 sm:py-16 lg:py-20 xl:py-24 text-center bg-gradient-to-b from-slate-50 via-orange-50/30 to-amber-50"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
        viewport={{ once: true }}
      >
        <motion.div
          className="inline-flex items-center gap-1.5 sm:gap-2 mb-3 sm:mb-4 px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-slate-700 to-slate-600 text-white rounded-full shadow-lg"
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <InfoIcon sx={{ fontSize: { xs: 18, sm: 20, md: 24 } }} />
          <span className="font-semibold text-xs sm:text-sm md:text-base">
            {t("about_badge") || "About Us"}
          </span>
        </motion.div>

        <motion.h2
          className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-slate-700 to-slate-600 mb-4 sm:mb-6 px-2"
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          {t("about_title") || "Our Mission"}
        </motion.h2>

        <motion.p
          className="max-w-2xl mx-auto text-xs sm:text-sm md:text-base lg:text-lg text-slate-600 mb-6 sm:mb-8 leading-relaxed px-4"
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          {t("about_desc") || "Learn about our dedication to spreading spiritual knowledge"}
        </motion.p>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <Link
            to="/home/about"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold px-6 sm:px-8 py-2.5 sm:py-3 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-xs sm:text-sm md:text-base"
          >
            <span>{t("learn_more") || "Learn More"}</span>
            <InfoIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />
          </Link>
        </motion.div>
      </motion.section>

      {/* Floating Player (Home) */}
      {floating && (
        <motion.div
          className={`fixed z-50 shadow-2xl border-4 border-orange-300 bg-black transition-all duration-300 ${
            floating.fullscreen
              ? "top-0 left-0 w-screen h-screen"
              : "bottom-6 right-6 w-[380px] h-[215px] rounded-2xl"
          }`}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
        >
          <iframe
            src={`https://www.youtube.com/embed/${extractYouTubeId(
              floating.video.url
            )}?autoplay=1&rel=0&modestbranding=1`}
            title={floating.video.title}
            className={`w-full h-full ${floating.fullscreen ? "" : "rounded-2xl"}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />

          <div className="absolute top-3 right-3 flex gap-2">
            <motion.button
              onClick={closeFloating}
              className="bg-white/90 hover:bg-white text-orange-600 font-bold rounded-full w-10 h-10 flex items-center justify-center shadow-lg"
              title="Close"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.9 }}
            >
              <CloseIcon />
            </motion.button>

            <motion.button
              onClick={() => setFloating((f) => ({ ...f, fullscreen: !f.fullscreen }))}
              className="bg-white/90 hover:bg-white text-orange-600 font-bold rounded-full w-10 h-10 flex items-center justify-center shadow-lg"
              title={floating.fullscreen ? "Exit fullscreen" : "Fullscreen"}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.9 }}
            >
              {floating.fullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
            </motion.button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Home;