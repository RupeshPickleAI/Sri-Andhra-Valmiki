import React from "react";
import god1 from "../assets/one.png";
import god2 from "../assets/two.png";
import god3 from "../assets/three.png";
import god4 from "../assets/one.png";
import god5 from "../assets/two.png";
import god6 from "../assets/three.png";
import god7 from "../assets/one.png";
import god8 from "../assets/two.png";
import god9 from "../assets/three.png";
import god10 from "../assets/one.png";
import god11 from "../assets/two.png";
import god12 from "../assets/three.png";

const Gallery = () => {
  const images = [god1, god2, god3, god4, god5, god6 , god7, god8, god9, god10, god11, god12    ];

  return (
    <section className="py-20 px-6 sm:px-10 bg-gradient-to-b from-yellow-100 via-orange-50 to-yellow-100 text-center">
      {/* Heading */}
      <h2 className="text-4xl font-bold text-orange-600 mb-4 drop-shadow-md">
        🌺 Divine Gallery 🌺
      </h2>
      <p className="text-gray-700 max-w-2xl mx-auto text-lg mb-12">
        Experience the divine aura through sacred images of deities and temples.
      </p>

      {/* Flex Gallery */}
      <div className="flex flex-wrap justify-center gap-8">
        {images.map((img, i) => (
          <div
            key={i}
            className="relative w-64 h-64 rounded-2xl overflow-hidden shadow-lg bg-white hover:shadow-2xl hover:scale-105 transition-transform duration-300"
          >
            <img
              src={img}
              alt={`Divine ${i + 1}`}
              className="w-full h-full object-cover"
            />
            {/* Caption overlay on hover */}
            <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 flex items-center justify-center text-white text-lg font-semibold transition-opacity duration-300">
               
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Gallery;
