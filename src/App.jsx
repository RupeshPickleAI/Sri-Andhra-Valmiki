// src/App.jsx
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";

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

// ✅ Inline MainLayout (Header for all user pages)
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
        {/* ✅ Always start on Splash (NO login automatically) */}
        <Route path="/" element={<Navigate to="/splash" replace />} />

        {/* ✅ Splash is public */}
        <Route path="/splash" element={<Splash />} />

        {/* ✅ Login is public but only opened when user clicks Login button */}
        <Route path="/login" element={<Login />} />

        {/* ✅ USER pages are PUBLIC now (no forced login) */}
        <Route path="/home" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="articles" element={<Articles />} />
          <Route path="gallery" element={<Gallery />} />
          <Route path="videos" element={<Videos />} />
          <Route path="about" element={<About />} />
        </Route>

        {/* ✅ ADMIN stays protected */}
        <Route element={<RequireAuth allowRoles={["admin"]} />}>
          <Route path="/admin" element={<HomeAdmin />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/splash" replace />} />
      </Routes>
    </Router>
  );
}
