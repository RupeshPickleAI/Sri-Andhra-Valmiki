import React from "react";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const articlesData = [
  {
    title: "Jai Sree Ram",
    description: "Chant the divine name of Lord Rama for eternal bliss...",
  },
  {
    title: "Ramayana – The Epic Journey",
    description:
      "The complete story of Lord Ram’s life, his trials, triumphs, and divine teachings...",
  },
  {
    title: "Teachings of Sri Ram",
    description:
      "Moral and spiritual lessons from the life of Lord Ram that inspire us even today...",
  },
  {
    title: "Hanuman Chalisa",
    description:
      "Sacred verses in praise of Hanuman, the devoted follower of Lord Ram...",
  },
  {
    title: "Ram Navami Celebrations",
    description:
      "Understanding and celebrating the birth of Lord Ram with devotion and joy...",
  },
];

const Articles = () => {
  return (
    <section className="px-10 py-16">
      <h2 className="text-3xl font-bold text-orange-600 text-center mb-12">
        Sacred Texts & Articles
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {articlesData.map((article, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all p-6 border border-orange-100 flex flex-col justify-between"
          >
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {article.title}
              </h3>
              <p className="text-gray-600 text-sm mb-4">{article.description}</p>
            </div>
            <div className="text-orange-500 flex justify-end">
              <ArrowForwardIosIcon fontSize="small" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Articles;
