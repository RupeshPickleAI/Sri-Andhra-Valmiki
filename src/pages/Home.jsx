import React, { useEffect, useRef } from "react";
import templeImg from "../assets/two.png";
import Articles from "./Articles";
import Gallery from "./Gallery";
import { Link } from "react-router-dom";
import bhajan from "../assets/dev.mp3"; // 🎵 Make sure this file exists in src/assets/

const Home = () => {
  const audioRef = useRef(new Audio(bhajan));

  // 🎶 Auto-play bhajan when Home loads
  useEffect(() => {
    const audio = audioRef.current;
    audio.loop = true;
    audio.volume = 0.7;

    const tryPlay = async () => {
      try {
        await audio.play();
      } catch {
        // if autoplay blocked, try muted trick
        audio.muted = true;
        await audio.play();
        setTimeout(() => (audio.muted = false), 800);
      }
    };
    tryPlay();

    return () => {
      audio.pause();
    };
  }, []);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <div className="relative w-full aspect-[16/9] overflow-hidden">
        <img
          src={templeImg}
          alt="Temple"
          className="w-full h-full object-cover brightness-90"
        />

        {/* Overlay text */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex flex-col justify-center pl-12 text-white">
          <h2 className="text-5xl font-bold mb-3 drop-shadow-lg">
            Some Important Lessons From Gita
          </h2>
          <p className="max-w-xl text-lg opacity-90 mb-5">
            Discover the timeless wisdom that guides humanity towards peace,
            devotion, and understanding.
          </p>

          {/* ✨ Devotional Marquee instead of button */}
          <div className="bg-orange-600 bg-opacity-90 rounded-full py-2 px-4 w-[60%] sm:w-[100%] shadow-lg overflow-hidden border border-orange-300">
            <marquee
              behavior="scroll"
              direction="left"
              scrollamount="6"
              className="text-white font-semibold text-lg tracking-wide"
            >
              🌸 "Hare Krishna Hare Rama — Chant the name of the Lord and find peace within your heart." 🌸
            </marquee>
          </div>
        </div>
      </div>

      {/* Articles Section */}
      <div id="articles" className="scroll-mt-20">
        <Articles />
      </div>

      {/* Gallery Section */}
      <section
        id="gallery"
        className="px-10 py-20 text-center bg-gradient-to-b from-yellow-100 to-orange-50"
      >
        <h2 className="text-3xl font-bold text-orange-600 mb-8">
          Spiritual Gallery
        </h2>
        <p className="max-w-3xl mx-auto text-gray-700 text-lg mb-10">
          Explore a divine collection of temple architectures, deities, and
          festivals.
        </p>
        <Gallery />
      </section>

      {/* Videos Section */}
      <section
        id="videos"
        className="px-10 py-20 text-center bg-gradient-to-b from-orange-50 to-yellow-50"
      >
        <h2 className="text-3xl font-bold text-orange-600 mb-8">
          Devotional Videos
        </h2>
        <p className="max-w-3xl mx-auto text-gray-700 text-lg">
          Watch inspiring videos about teachings, rituals, and ancient stories.
        </p>
      </section>

      {/* About Section Preview */}
      <section
        id="about"
        className="px-10 py-20 text-center bg-gradient-to-b from-yellow-50 to-orange-100"
      >
        <h2 className="text-3xl font-bold text-orange-600 mb-8">
          About Sri Ram Portal
        </h2>
        <p className="max-w-3xl mx-auto text-gray-700 text-lg mb-6">
          Sri Ram Portal is dedicated to spreading spiritual knowledge,
          devotion, and moral values inspired by ancient Indian scriptures.
        </p>
        <Link
          to="/about"
          className="inline-block mt-4 bg-orange-600 hover:bg-orange-700 text-white font-semibold px-6 py-2 rounded-full transition"
        >
          Learn More
        </Link>
      </section>
    </div>
  );
};

export default Home;
