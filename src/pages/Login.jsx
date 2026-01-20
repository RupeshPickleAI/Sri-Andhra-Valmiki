// src/pages/Login.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import templeImg from "../assets/1.jpeg";

import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

import {
  signupUser,
  requestOtp,
  verifyOtp,
  loginWithPassword,
  adminLoginGet,
  getMe,
} from "../utils/authApi";

const USER_HOME = "/splash";
const ADMIN_HOME = "/admin";

const ADMIN_EMAIL = "sriandhravalmiki@gmail.com";
const ADMIN_PASSWORD = "rama@2026";

function isEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v || "").trim());
}

// ✅ user password rule
function validateUserPassword(pass) {
  const p = String(pass || "");
  if (p.length < 8) throw new Error("Password must be at least 8 characters.");
}

// ✅ admin password rule (only required non-empty)
function validateAdminPassword(pass) {
  const p = String(pass || "");
  if (!p.trim()) throw new Error("Admin password is required.");
}

// ✅ token finder (supports many response shapes)
function extractToken(resp) {
  return (
    resp?.token ||
    resp?.access ||
    resp?.access_token ||
    resp?.data?.token ||
    resp?.data?.access ||
    resp?.data?.access_token ||
    resp?.data?.data?.token ||
    resp?.data?.data?.access ||
    null
  );
}

// ✅ NEW: download helper
function forceDownload(url, filename = "file.pdf") {
  try {
    const a = document.createElement("a");
    a.href = url;
    a.download = filename; // might be ignored cross-origin, still ok
    a.rel = "noopener noreferrer";
    document.body.appendChild(a);
    a.click();
    a.remove();
  } catch {
    window.open(url, "_blank", "noopener,noreferrer");
  }
}

// ✅ NEW: after-login handler (download + redirect)
function runAfterLoginAction(navigate, role = "user") {
  const dlRaw = sessionStorage.getItem("after_login_download");
  const redirect =
    sessionStorage.getItem("after_login_redirect") ||
    (role === "admin" ? ADMIN_HOME : USER_HOME);

  if (!dlRaw) {
    navigate(role === "admin" ? ADMIN_HOME : USER_HOME, { replace: true });
    return;
  }

  try {
    const { url, filename } = JSON.parse(dlRaw);

    // download now
    if (url) forceDownload(url, filename || "file.pdf");
  } catch {}

  // clear session keys
  sessionStorage.removeItem("after_login_download");
  sessionStorage.removeItem("after_login_redirect");

  // go back to the page user came from
  navigate(redirect, { replace: true });
}

export default function Login() {
  const navigate = useNavigate();

  // view: login / signup
  const [view, setView] = useState("login"); // "login" | "signup"

  // login fields
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginShowPass, setLoginShowPass] = useState(false);

  // signup fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupShowPass, setSignupShowPass] = useState(false);

  // signup steps (OTP only here)
  const [signupStep, setSignupStep] = useState("form"); // "form" | "otp"
  const [signupOtp, setSignupOtp] = useState("");

  // common UI
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  // cooldown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setInterval(() => setCooldown((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [cooldown]);

  // auto-redirect if token exists
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (token) {
      // ✅ if already logged in and a download is pending, run it
      runAfterLoginAction(navigate, role === "admin" ? "admin" : "user");
    }
  }, [navigate]);

  function resetMessages() {
    setError("");
    setInfo("");
  }

  function setAuthSuccess(token, provider = "password", role = "user") {
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
    localStorage.setItem("auth_provider", provider);
  }

  // -------------------------
  // ✅ USER LOGIN (NO OTP)
  // -------------------------
  async function handleUserLoginDirect(email, password) {
    const resp = await loginWithPassword({ email, password });
    const token = extractToken(resp);
    if (!token) throw new Error("Token missing from server response.");

    setAuthSuccess(token, "password", "user");

    try {
      const me = await getMe(token);
      if (me) localStorage.setItem("me", JSON.stringify(me.user || me));
    } catch {}

    // ✅ NEW: download after login if pending, else go normal
    runAfterLoginAction(navigate, "user");
  }

  // -------------------------
  // ✅ ADMIN LOGIN (GET ONLY)
  // -------------------------
  async function handleAdminLoginGet(email, password) {
    const resp = await adminLoginGet({ email, password });
    const token = extractToken(resp);
    if (!token) throw new Error("Token missing from server response.");

    setAuthSuccess(token, "admin_get", "admin");

    try {
      const me = await getMe(token);
      if (me) localStorage.setItem("me", JSON.stringify(me.user || me));
    } catch {}

    // ✅ NEW: if download was pending, do it then redirect back
    runAfterLoginAction(navigate, "admin");
  }

  // -------------------------
  // ✅ LOGIN submit (Single Form)
  // - If sriandhravalmiki@gmail.com => GET admin login
  // - else => normal user login
  // -------------------------
  async function handleLoginSubmit(e) {
    e.preventDefault();
    resetMessages();
    setLoading(true);

    try {
      const email = String(loginEmail).trim().toLowerCase();
      const pass = String(loginPassword || "");

      if (!email) throw new Error("Please enter email.");
      if (!isEmail(email)) throw new Error("Please enter a valid email.");
      if (!pass) throw new Error("Please enter password.");

      // ✅ ADMIN path (GET)
      if (email === ADMIN_EMAIL) {
        validateAdminPassword(pass);
        await handleAdminLoginGet(email, pass);
      } else {
        // ✅ USER path
        validateUserPassword(pass);
        await handleUserLoginDirect(email, pass);
      }
    } catch (err) {
      setError(err?.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  }

  // -------------------------
  // ✅ SIGNUP submit (OTP ONLY here)
  // -------------------------
  async function handleSignupSubmit(e) {
    e.preventDefault();
    resetMessages();
    setLoading(true);

    try {
      const fn = String(firstName).trim();
      const ln = String(lastName).trim();
      const em = String(signupEmail).trim().toLowerCase();

      if (!fn) throw new Error("First name is required.");
      if (!ln) throw new Error("Last name is required.");
      if (!em) throw new Error("Email is required.");
      if (!isEmail(em)) throw new Error("Please enter a valid email.");
      if (!signupPassword) throw new Error("Password is required.");
      validateUserPassword(signupPassword);

      if (em === ADMIN_EMAIL) {
        throw new Error("This email is reserved for admin.");
      }

      // 1) create user
      await signupUser({
        firstName: fn,
        lastName: ln,
        email: em,
        password: signupPassword,
      });

      // 2) send OTP (only for signup verification)
      await requestOtp({
        channel: "email",
        identifier: em,
        password: signupPassword,
      });

      setInfo("✅ Account created. OTP sent to your email (check Inbox/Spam).");
      setSignupStep("otp");
      setCooldown(30);
    } catch (err) {
      setError(err?.message || "Signup failed.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSignupVerifyOtp(e) {
    e.preventDefault();
    resetMessages();
    setLoading(true);

    try {
      const em = String(signupEmail).trim().toLowerCase();
      const otp = String(signupOtp).trim();

      if (!isEmail(em)) throw new Error("Invalid email.");
      validateUserPassword(signupPassword);
      if (!otp) throw new Error("Please enter OTP.");

      const resp = await verifyOtp({
        channel: "email",
        identifier: em,
        password: signupPassword,
        otp,
      });

      const token = extractToken(resp);
      if (!token) throw new Error("Token missing from server response.");

      setAuthSuccess(token, "signup_otp", "user");

      try {
        const me = await getMe(token);
        if (me) localStorage.setItem("me", JSON.stringify(me.user || me));
      } catch {}

      // ✅ NEW: download after signup-login too (if pending)
      runAfterLoginAction(navigate, "user");
    } catch (err) {
      setError(err?.message || "OTP verification failed.");
    } finally {
      setLoading(false);
    }
  }

  async function handleResendSignupOtp() {
    resetMessages();
    setLoading(true);

    try {
      const em = String(signupEmail).trim().toLowerCase();
      if (!isEmail(em)) throw new Error("Enter a valid email.");
      validateUserPassword(signupPassword);

      await requestOtp({
        channel: "email",
        identifier: em,
        password: signupPassword,
      });

      setInfo("✅ OTP resent to your email.");
      setCooldown(30);
    } catch (err) {
      setError(err?.message || "Failed to resend OTP.");
    } finally {
      setLoading(false);
    }
  }

  // -------------------------
  // UI
  // -------------------------
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-500 via-yellow-200 to-orange-400 relative overflow-hidden">
      <img
        src={templeImg}
        alt="Temple Background"
        className="absolute inset-0 w-full h-full object-cover opacity-30"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-black/40 to-transparent"></div>

      <div className="relative z-10 bg-white/20 backdrop-blur-lg rounded-2xl shadow-2xl w-[92%] sm:w-[480px] p-8 border border-white/40">
        <h1 className="text-3xl font-bold text-white drop-shadow-lg mb-2 text-center">
          🙏 Sri Andhra Valmiki
        </h1>
        <p className="text-yellow-100 text-sm mb-6 text-center">
          ✅ Single Login form (User/Admin). ✅ Signup = OTP verify.
        </p>

        {error ? <p className="text-red-200 text-sm mb-2 text-center">{error}</p> : null}
        {info ? <p className="text-green-100 text-sm mb-2 text-center">{info}</p> : null}

        {view === "login" ? (
          <>
            <form onSubmit={handleLoginSubmit} className="text-left space-y-4">
              <div>
                <label className="block text-white text-sm font-semibold mb-1">
                  Email Address
                </label>
                <input
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="user@gmail.com"
                  className="w-full px-4 py-2 rounded-lg bg-white/80 focus:bg-white text-gray-800 placeholder-gray-500 border border-gray-300 focus:ring-2 focus:ring-orange-400 outline-none transition"
                />
                <p className="text-[11px] text-yellow-50/90 mt-1">
                  Admin login: <b>sriandhravalmiki@gmail.com</b> / <b>rama@2026</b>
                </p>
              </div>

              <div>
                <label className="block text-white text-sm font-semibold mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={loginShowPass ? "text" : "password"}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full pr-11 px-4 py-2 rounded-lg bg-white/80 focus:bg-white text-gray-800 placeholder-gray-500 border border-gray-300 focus:ring-2 focus:ring-orange-400 outline-none transition"
                  />
                  <button
                    type="button"
                    onClick={() => setLoginShowPass((s) => !s)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-700 hover:text-gray-900"
                    aria-label="Toggle password visibility"
                  >
                    {loginShowPass ? (
                      <VisibilityIcon fontSize="small" />
                    ) : (
                      <VisibilityOffIcon fontSize="small" />
                    )}
                  </button>
                </div>
              </div>

              {/* Optional helper button */}
              <button
                type="button"
                onClick={() => {
                  setLoginEmail(ADMIN_EMAIL);
                  setLoginPassword(ADMIN_PASSWORD);
                  resetMessages();
                }}
                className="w-full py-2 bg-white/25 hover:bg-white/35 text-white font-semibold rounded-full shadow transition"
              >
                Use Admin Credentials
              </button>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-2 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white font-bold rounded-full shadow-lg transition ${
                  loading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Please wait..." : "Login"}
              </button>

              <button
                type="button"
                onClick={() => {
                  resetMessages();
                  setView("signup");
                  setSignupStep("form");
                  setCooldown(0);
                }}
                className="w-full text-xs text-white/90 underline hover:text-white"
              >
                Don&apos;t have an account? Sign Up
              </button>
            </form>
          </>
        ) : (
          <>
            {signupStep === "form" ? (
              <form onSubmit={handleSignupSubmit} className="text-left space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-white text-sm font-semibold mb-1">
                      First Name
                    </label>
                    <input
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="First name"
                      className="w-full px-4 py-2 rounded-lg bg-white/80 focus:bg-white text-gray-800 placeholder-gray-500 border border-gray-300 focus:ring-2 focus:ring-orange-400 outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="block text-white text-sm font-semibold mb-1">
                      Last Name
                    </label>
                    <input
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Last name"
                      className="w-full px-4 py-2 rounded-lg bg-white/80 focus:bg-white text-gray-800 placeholder-gray-500 border border-gray-300 focus:ring-2 focus:ring-orange-400 outline-none transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white text-sm font-semibold mb-1">
                    Email Address
                  </label>
                  <input
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    placeholder="user@gmail.com"
                    className="w-full px-4 py-2 rounded-lg bg-white/80 focus:bg-white text-gray-800 placeholder-gray-500 border border-gray-300 focus:ring-2 focus:ring-orange-400 outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-white text-sm font-semibold mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={signupShowPass ? "text" : "password"}
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      placeholder="Create password (min 8 chars)"
                      className="w-full pr-11 px-4 py-2 rounded-lg bg-white/80 focus:bg-white text-gray-800 placeholder-gray-500 border border-gray-300 focus:ring-2 focus:ring-orange-400 outline-none transition"
                    />
                    <button
                      type="button"
                      onClick={() => setSignupShowPass((s) => !s)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-700 hover:text-gray-900"
                      aria-label="Toggle password visibility"
                    >
                      {signupShowPass ? (
                        <VisibilityOffIcon fontSize="small" />
                      ) : (
                        <VisibilityIcon fontSize="small" />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-2 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white font-bold rounded-full shadow-lg transition ${
                    loading ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {loading ? "Creating..." : "Submit"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    resetMessages();
                    setView("login");
                    setCooldown(0);
                  }}
                  className="w-full text-xs text-white/90 underline hover:text-white"
                >
                  Already have an account? Login
                </button>
              </form>
            ) : (
              <form onSubmit={handleSignupVerifyOtp} className="text-left space-y-3">
                <div>
                  <label className="block text-white text-sm font-semibold mb-1">
                    OTP
                  </label>
                  <input
                    value={signupOtp}
                    onChange={(e) => setSignupOtp(e.target.value)}
                    placeholder="Enter OTP"
                    className="w-full px-4 py-2 rounded-lg bg-white/80 focus:bg-white text-gray-800 placeholder-gray-500 border border-gray-300 focus:ring-2 focus:ring-orange-400 outline-none transition tracking-widest"
                  />
                  <p className="text-[11px] text-yellow-50/90 mt-1">
                    OTP sent to:{" "}
                    <span className="font-semibold">
                      {String(signupEmail).trim().toLowerCase()}
                    </span>
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-2 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white font-bold rounded-full shadow-lg transition ${
                    loading ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {loading ? "Verifying..." : "Verify OTP & Continue"}
                </button>

                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => {
                      resetMessages();
                      setSignupStep("form");
                      setSignupOtp("");
                      setCooldown(0);
                    }}
                    className="text-xs text-white/90 underline hover:text-white"
                  >
                    Edit details
                  </button>

                  <button
                    type="button"
                    onClick={handleResendSignupOtp}
                    disabled={cooldown > 0 || loading}
                    className={`text-xs underline ${
                      cooldown > 0 || loading
                        ? "text-white/50 cursor-not-allowed"
                        : "text-white/90 hover:text-white"
                    }`}
                  >
                    {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend OTP"}
                  </button>
                </div>
              </form>
            )}
          </>
        )}

        <div className="mt-6 text-yellow-50 text-sm italic text-center">
          🌼 "Chant the name of the Lord and awaken divine bliss within." 🌼
        </div>
      </div>

      <div className="absolute w-96 h-96 bg-orange-300 opacity-20 blur-3xl rounded-full -top-10 -left-10 animate-pulse"></div>
      <div className="absolute w-96 h-96 bg-yellow-200 opacity-20 blur-3xl rounded-full bottom-10 right-10 animate-pulse"></div>
    </div>
  );
}
