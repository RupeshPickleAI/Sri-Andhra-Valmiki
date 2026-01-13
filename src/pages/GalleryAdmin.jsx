// src/pages/GalleryAdmin.jsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const IMAGE_UPLOAD_URL = "http://localhost:5000/upload/image/";

const GalleryAdmin = () => {
  const [galleryImages, setGalleryImages] = useState([]);
  const [message, setMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const navigate = useNavigate();

  // Load saved gallery images
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("galleryImages") || "[]");
      if (Array.isArray(saved)) {
        setGalleryImages(saved);
      }
    } catch (err) {
      console.error("Error loading galleryImages:", err);
    }
  }, []);

  const saveToStorage = (imagesArr) => {
    localStorage.setItem("galleryImages", JSON.stringify(imagesArr));
  };

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const imageFiles = files.filter((f) => f.type.startsWith("image/"));
    if (!imageFiles.length) {
      setMessage("Please select valid image files only.");
      setTimeout(() => setMessage(""), 3000);
      return;
    }

    setIsUploading(true);
    setMessage("");

    const fileToDataUrl = (file) =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

    try {
      // Upload each image to backend
      const uploadedUrls = await Promise.all(
        imageFiles.map(async (file) => {
          try {
            const formData = new FormData();
            // 👇 field name "image" – change if your backend expects a different key
            formData.append("image", file);

            const res = await fetch(IMAGE_UPLOAD_URL, {
              method: "POST",
              body: formData,
            });

            if (!res.ok) {
              console.error(
                `Upload failed for ${file.name} with status ${res.status}`
              );
              // fallback to local DataURL
              return await fileToDataUrl(file);
            }

            const data = (await res.json().catch(() => ({}))) || {};
            const url =
              data.imageUrl ||
              data.url ||
              data.image_url ||
              data.image ||
              data.path ||
              null;

            if (!url) {
              // if API doesn't return URL, still show locally
              return await fileToDataUrl(file);
            }

            return url;
          } catch (err) {
            console.error("Error uploading file:", file.name, err);
            // fallback to local DataURL for that file
            return await fileToDataUrl(file);
          }
        })
      );

      setGalleryImages((prev) => {
        const updated = [...prev, ...uploadedUrls];
        saveToStorage(updated);
        return updated;
      });

      setMessage("Gallery images uploaded and updated successfully ✨");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error("Error uploading images:", err);
      setMessage("Something went wrong while uploading images.");
      setTimeout(() => setMessage(""), 3000);
    } finally {
      setIsUploading(false);
      // allow selecting same file again if needed
      e.target.value = "";
    }
  };

  const handleRemove = (index) => {
    setGalleryImages((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      saveToStorage(updated);
      return updated;
    });
  };

  return (
    <motion.div
      className="min-h-screen flex flex-col bg-gradient-to-b from-yellow-100 to-orange-100"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 1.0, ease: "easeInOut" }}
    >
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-4 bg-gradient-to-r from-orange-700 to-yellow-600 text-white shadow-md">
        <div>
          <h1 className="text-2xl font-bold">Sri Andhra Valmiki – Gallery Admin</h1>
          <p className="text-sm opacity-90">
            Manage the divine gallery images that devotees see on their home page.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/admin")}
            className="text-sm bg-white/10 hover:bg-white/20 border border-white/40 px-3 py-1 rounded-full"
          >
            Admin Home
          </button>
          <button
            onClick={() => navigate("/home/gallery")}
            className="text-sm bg-white/10 hover:bg-white/20 border border-white/40 px-3 py-1 rounded-full"
          >
            View User Gallery
          </button>
          <button
            onClick={() => navigate("/login")}
            className="text-sm bg-red-500 hover:bg-red-600 px-3 py-1 rounded-full shadow"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 px-8 py-10 space-y-8">
        {/* Upload Card */}
        <motion.section
          className="bg-white/80 rounded-2xl shadow-lg p-6 border border-orange-100 flex flex-col gap-4"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl font-semibold text-orange-700 mb-1">
            Gallery Manager
          </h2>
          <p className="text-gray-700 mb-3">
            Upload new divine images to be displayed in the user gallery. These
            will be saved and shown along with default images.
          </p>

          <label className="inline-flex items-center gap-2 cursor-pointer bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white font-semibold px-5 py-2 rounded-full shadow-md">
            <span>{isUploading ? "Uploading..." : "Upload Gallery Images"}</span>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleUpload}
              className="hidden"
              disabled={isUploading}
            />
          </label>

          {message && (
            <p className="mt-2 text-sm text-green-700 font-medium">{message}</p>
          )}

          <p className="mt-1 text-xs text-gray-500">
            Tip: You can select multiple images at once. Formats: JPG/PNG/WebP.
          </p>
        </motion.section>

        {/* Current Gallery Preview */}
        <motion.section
          className="bg-white/80 rounded-2xl shadow-lg p-6 border border-orange-100"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.05 }}
          viewport={{ once: true }}
        >
          <h3 className="text-xl font-semibold text-orange-700 mb-4">
            Current Admin Gallery Images
          </h3>

          {galleryImages.length === 0 ? (
            <p className="text-gray-600 text-sm">
              No custom gallery images uploaded yet. Upload some images to get started.
            </p>
          ) : (
            <div className="flex flex-wrap gap-6">
              {galleryImages.map((img, idx) => (
                <div
                  key={idx}
                  className="relative w-48 h-48 rounded-xl overflow-hidden shadow-md border border-orange-100 bg-white"
                >
                  <img
                    src={img}
                    alt={`Gallery ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => handleRemove(idx)}
                    className="absolute top-2 right-2 bg-red-500/90 hover:bg-red-600 text-white text-xs px-2 py-1 rounded-full shadow"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </motion.section>
      </main>
    </motion.div>
  );
};

export default GalleryAdmin;
