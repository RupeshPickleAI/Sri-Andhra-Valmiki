// src/utils/authApi.js
import axios from "axios";

const API_BASE_URL =
  import.meta?.env?.VITE_API_BASE_URL || "http://localhost:5000"; // backend base (no /api needed)

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

const getErr = (e) =>
  e?.response?.data?.detail ||
  e?.response?.data?.error ||
  e?.response?.data?.message ||
  e?.message ||
  "Something went wrong";

// -----------------------------
// SIGNUP
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

    // optional
    if (phone) payload.phone = String(phone).trim();

    const { data } = await api.post("/api/auth/signup", payload);
    return data;
  } catch (e) {
    throw new Error(getErr(e));
  }
}

// -----------------------------
// LOGIN → REQUEST OTP
// POST /api/auth/login/request-otp
// body: { channel, identifier, password }
// -----------------------------
export async function requestLoginOtp({ channel, identifier, password }) {
  try {
    const { data } = await api.post("/api/auth/login/request-otp", {
      channel,
      identifier: channel === "email" ? String(identifier).trim().toLowerCase() : String(identifier).trim(),
      password: String(password || ""),
    });
    return data;
  } catch (e) {
    throw new Error(getErr(e));
  }
}

// -----------------------------
// LOGIN → VERIFY OTP
// POST /api/auth/login/verify-otp
// body: { channel, identifier, password, otp }
// returns { token, user }
// -----------------------------
export async function verifyLoginOtp({ channel, identifier, password, otp }) {
  try {
    const { data } = await api.post("/api/auth/login/verify-otp", {
      channel,
      identifier: channel === "email" ? String(identifier).trim().toLowerCase() : String(identifier).trim(),
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
// GET /api/auth/me  (Bearer token)
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
// body: { email, password }
// -----------------------------
// ✅ STATIC ADMIN LOGIN (GET)
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


