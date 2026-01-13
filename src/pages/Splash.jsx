import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import templeImg from "../assets/splash.png";

const Splash = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      const role = localStorage.getItem("role");

      if (role === "admin") {
        navigate("/admin");
      } else {
        navigate("/home");
      }
    }, 3500);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-orange-100 via-amber-50 to-orange-100">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src={templeImg}
          alt="Temple Background"
          className="w-full h-full object-cover"
        />
        {/* Gentle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-orange-900/40 via-amber-900/30 to-orange-900/50 backdrop-blur-[2px]"></div>
      </div>

      {/* Decorative animated circles */}
      <motion.div
        className="absolute top-20 left-20 w-64 h-64 bg-orange-300/20 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-20 right-20 w-80 h-80 bg-amber-300/20 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5,
        }}
      />

      {/* Main Content */}
      <motion.div
        className="relative z-10 flex flex-col items-center text-center px-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {/* Om Symbol with Rotation */}
        <motion.div
          className="relative mb-8"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="w-32 h-32 sm:w-40 sm:h-40 border-4 border-white/30 rounded-full flex items-center justify-center shadow-2xl backdrop-blur-sm bg-white/10"
          >
            <motion.span
              className="text-6xl sm:text-7xl text-white drop-shadow-2xl"
              animate={{
                textShadow: [
                  "0 0 20px rgba(255,255,255,0.5)",
                  "0 0 40px rgba(255,255,255,0.8)",
                  "0 0 20px rgba(255,255,255,0.5)",
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              ॐ
            </motion.span>
          </motion.div>

          {/* Outer glow ring */}
          <motion.div
            className="absolute inset-0 border-2 border-orange-300/40 rounded-full"
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>

        {/* Title in Devanagari */}
        <motion.h1
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="text-5xl sm:text-6xl md:text-7xl font-bold text-white drop-shadow-2xl mb-3"
          style={{ textShadow: "0 4px 20px rgba(0,0,0,0.3)" }}
        >
         
        </motion.h1>

        {/* English Title */}
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="text-2xl sm:text-3xl font-semibold text-orange-100 mb-6 tracking-wide"
        >
          Sri Andhra Valmiki
        </motion.h2>

        {/* Decorative Divider */}
        <motion.div
          className="flex items-center gap-4 mb-6"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          <div className="h-px w-12 sm:w-20 bg-gradient-to-r from-transparent to-white/50"></div>
          <span className="text-2xl text-white/80">✦</span>
          <div className="h-px w-12 sm:w-20 bg-gradient-to-l from-transparent to-white/50"></div>
        </motion.div>

        {/* Quote */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 1 }}
          className="max-w-2xl text-lg sm:text-xl text-white/95 italic leading-relaxed px-4"
          style={{ textShadow: "0 2px 10px rgba(0,0,0,0.3)" }}
        >
          "May the divine light of Lord Rama guide your soul towards eternal
          peace and wisdom."
        </motion.p>

        {/* Loading Indicator */}
        <motion.div
          className="mt-10 flex flex-col items-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 0.8 }}
        >
          <div className="flex gap-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-3 h-3 bg-white rounded-full"
                animate={{
                  y: [0, -10, 0],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>
          <p className="text-white/70 text-sm tracking-wider">Loading...</p>
        </motion.div>
      </motion.div>

      {/* Bottom decorative pattern */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/30 to-transparent"></div>
    </div>
  );
};
  
export default Splash;