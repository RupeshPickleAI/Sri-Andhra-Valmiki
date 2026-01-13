// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";

import Login from "./pages/Login";
import Splash from "./pages/Splash";
import HomeAdmin from "./pages/HomeAdmin";
import RequireAuth from "./components/RequireAuth";

// ✅ Your existing user header
import Header from "./components/Header";

// User pages you already have
import Home from "./pages/Home";

import Articles from "./pages/Articles";
import Gallery from "./pages/Gallery";
import About from "./pages/About";
import Videos from "./pages/Videos";

// ✅ Inline MainLayout (fixes the Vite error)
function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-yellow-50 to-orange-100">
      <Header />
      <Outlet />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Public */}
        <Route path="/login" element={<Login />} />

        {/* ✅ Any logged-in user/admin can go splash */}
        <Route element={<RequireAuth allowRoles={["user", "admin"]} />}>
          <Route path="/splash" element={<Splash />} />
        </Route>

        {/* ✅ USER protected area */}
        <Route element={<RequireAuth allowRoles={["user"]} />}>
          <Route path="/home" element={<MainLayout />}>
            <Route index element={<Home />} />

           
        <Route path="articles" element={<Articles />} /> 
            <Route path="gallery" element={<Gallery />} /> 
            <Route path="videos" element={<Videos />} />
            <Route path="about" element={<About />} /> 
          </Route>
        </Route>

        {/* ✅ ADMIN protected area */}
        <Route element={<RequireAuth allowRoles={["admin"]} />}>
          <Route path="/admin" element={<HomeAdmin />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}
