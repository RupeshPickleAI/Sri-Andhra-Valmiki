import React from "react";
import { FaBookOpen, FaHeart, FaUsers } from "react-icons/fa";

const About = () => {
  return (
    <div className="bg-gradient-to-b from-yellow-50 to-orange-50 py-20 px-6 sm:px-12 text-center">
      {/* Main Header */}
      <h2 className="text-4xl font-bold text-orange-600 mb-4">
        About Bhakti Portal
      </h2>
      <p className="text-gray-700 max-w-3xl mx-auto text-lg mb-14">
        A sacred digital sanctuary dedicated to preserving and sharing the divine
        teachings of Sri Ram.
      </p>

      {/* Mission + Community */}
      <div className="flex flex-col md:flex-row justify-center gap-10 mb-14 text-left">
        {/* Mission */}
        <div className="bg-white shadow-md rounded-xl p-6 flex-1">
          <h3 className="flex items-center gap-2 text-xl font-semibold text-gray-800 mb-3">
            <FaHeart className="text-red-500" /> Our Mission
          </h3>
          <p className="text-gray-700 leading-relaxed">
            Bhakti Portal is dedicated to preserving and sharing the timeless wisdom,
            divine stories, and spiritual teachings of Lord Ram. Our mission is to
            create a comprehensive digital repository that serves devotees worldwide.
          </p>
          <p className="mt-3 text-gray-700 leading-relaxed">
            We believe in making sacred knowledge accessible to all, fostering
            spiritual growth, and building a community united by devotion and faith.
          </p>
        </div>

        {/* Community */}
        <div className="bg-white shadow-md rounded-xl p-6 flex-1">
          <h3 className="flex items-center gap-2 text-xl font-semibold text-gray-800 mb-3">
            <FaUsers className="text-blue-500" /> Our Community
          </h3>
          <p className="text-gray-700 leading-relaxed">
            Join thousands of devotees from around the world who visit our portal daily
            to read sacred texts, view divine imagery, and listen to devotional songs.
          </p>
          <p className="mt-3 text-gray-700 leading-relaxed">
            Our community is built on the principles of respect, devotion, and shared
            spiritual growth. Together, we celebrate the eternal values taught by
            Sri Ram.
          </p>
        </div>
      </div>

      {/* Key Features */}
      <div className="flex flex-wrap justify-center gap-8 mb-20">
        <div className="bg-white shadow-md rounded-xl p-6 w-72 hover:shadow-xl transition">
          <FaBookOpen className="text-4xl text-orange-500 mx-auto mb-3" />
          <h4 className="font-semibold text-lg text-gray-800">Sacred Texts</h4>
          <p className="text-gray-600 text-sm">
            Comprehensive collection of divine teachings and spiritual stories
          </p>
        </div>

        <div className="bg-white shadow-md rounded-xl p-6 w-72 hover:shadow-xl transition">
          <FaHeart className="text-4xl text-red-500 mx-auto mb-3" />
          <h4 className="font-semibold text-lg text-gray-800">Divine Gallery</h4>
          <p className="text-gray-600 text-sm">
            Beautiful collection of sacred images and divine moments
          </p>
        </div>

        <div className="bg-white shadow-md rounded-xl p-6 w-72 hover:shadow-xl transition">
          <FaUsers className="text-4xl text-blue-500 mx-auto mb-3" />
          <h4 className="font-semibold text-lg text-gray-800">Bhakti Songs</h4>
          <p className="text-gray-600 text-sm">
            Devotional music and spiritual songs to elevate your soul
          </p>
        </div>
      </div>

      {/* Collections Section */}
      <div className="max-w-4xl mx-auto text-left bg-white shadow-md rounded-xl p-8">
        <h3 className="text-2xl font-bold text-orange-600 mb-3">
          Sacred Texts & Articles
        </h3>
        <p className="text-gray-700 leading-relaxed">
          Our comprehensive collection includes ancient scriptures, contemporary
          interpretations, and spiritual commentaries. Each text is carefully curated
          and organized into topics and chapters for easy navigation and study.
        </p>
      </div>
    </div>
  );
};

export default About;
