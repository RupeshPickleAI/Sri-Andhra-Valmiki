import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import Articles from "./pages/Articles";
import Gallery from "./pages/Gallery";
import About from "./pages/About";
import Login from "./pages/Login";

const Videos = () => <div className="p-10 text-2xl">Videos Page</div>;

function App() {
  return (
    <Router>
      <Routes>
        {/* Login page (no header here) */}
        <Route path="/login" element={<Login />} />

        {/* Main pages with Header */}
        <Route
          path="/*"
          element={
            <div className="min-h-screen flex flex-col bg-gradient-to-b from-yellow-50 to-orange-100">
              <Header />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/articles" element={<Articles />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/videos" element={<Videos />} />
                <Route path="/about" element={<About />} />
              </Routes>
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
