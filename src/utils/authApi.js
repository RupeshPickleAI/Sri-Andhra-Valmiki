// src/utils/authApi.js
import axios from "axios";

const API_BASE_URL =
  import.meta?.env?.VITE_API_BASE_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: API_BASE_URL, // no /api here; we include /api in endpoints below
  headers: { "Content-Type": "application/json" },
});

const getErr = (e) =>
  e?.response?.data?.detail ||
  e?.response?.data?.error ||
  e?.response?.data?.message ||
  e?.message ||
  "Something went wrong";

// -----------------------------
// USER SIGNUP
// POST /api/auth/signup
// -----------------------------
export async function signupUser({ firstName, lastName, email, password, phone }) {
  try {
    const payload = {
      firstName: String(firstName || "").trim(),
      lastName: String(lastName || "").trim(),
      email: String(email || "").trim().toLowerCase(),
      password: String(password || ""),
    };
    if (phone) payload.phone = String(phone).trim();

    const { data } = await api.post("/api/auth/signup", payload);
    return data;
  } catch (e) {
    throw new Error(getErr(e));
  }
}

// -----------------------------
// ✅ USER LOGIN (NO OTP)
// POST /api/auth/login/password
// body: { email, password }
// returns: { token, user? }
// -----------------------------
export async function loginWithPassword({ email, password }) {
  try {
    const { data } = await api.post("/api/auth/login/password", {
      email: String(email || "").trim().toLowerCase(),
      password: String(password || ""),
    });
    return data;
  } catch (e) {
    throw new Error(getErr(e));
  }
}

// -----------------------------
// ✅ OTP (use ONLY in SIGNUP flow)
// If your backend uses these same endpoints, keep them.
// POST /api/auth/login/request-otp
// POST /api/auth/login/verify-otp
// -----------------------------
export async function requestOtp({ channel = "email", identifier, password }) {
  try {
    const id =
      channel === "email"
        ? String(identifier || "").trim().toLowerCase()
        : String(identifier || "").trim();

    const { data } = await api.post("/api/auth/login/request-otp", {
      channel,
      identifier: id,
      password: String(password || ""),
    });
    return data;
  } catch (e) {
    throw new Error(getErr(e));
  }
}

export async function verifyOtp({ channel = "email", identifier, password, otp }) {
  try {
    const id =
      channel === "email"
        ? String(identifier || "").trim().toLowerCase()
        : String(identifier || "").trim();

    const { data } = await api.post("/api/auth/login/verify-otp", {
      channel,
      identifier: id,
      password: String(password || ""),
      otp: String(otp || "").trim(),
    });
    return data;
  } catch (e) {
    throw new Error(getErr(e));
  }
}

// -----------------------------
// GET USER DATA
// GET /api/auth/me (Bearer token)
// -----------------------------
export async function getMe(token) {
  try {
    const { data } = await api.get("/api/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  } catch (e) {
    throw new Error(getErr(e));
  }
}

// -----------------------------
// ADMIN LOGIN (NO OTP)
// POST /api/auth/admin/login
// -----------------------------
export async function adminLogin({ email, password }) {
  try {
    const { data } = await api.post("/api/auth/admin/login", {
      email: String(email || "").trim().toLowerCase(),
      password: String(password || ""),
    });
    return data;
  } catch (e) {
    throw new Error(getErr(e));
  }
}

// optional legacy GET (only if your backend REALLY uses GET)
export async function adminLoginGet({ email, password }) {
  try {
    const { data } = await api.get("/api/auth/admin/login", {
      params: {
        email: String(email || "").trim().toLowerCase(),
        password: String(password || ""),
      },
    });
    return data;
  } catch (e) {
    throw new Error(getErr(e));
  }
}
