// // src/utils/authApi.js
// import api from "./apiClient";
// import axios from "axios";
// const getErr = (e) =>
//   e?.response?.data?.detail ||
//   e?.response?.data?.error ||
//   e?.response?.data?.message ||
//   e?.message ||  "Something went wrong";

// // -----------------------------
// // USER SIGNUP
// // POST /api/auth/signup
// // -----------------------------
// export async function signupUser({ firstName, lastName, email, password, phone }) {
//   console.log("Signup API called");
//   try {
//     const payload = {
//       firstName: String(firstName || "").trim(),
//       lastName: String(lastName || "").trim(),
//       email: String(email || "").trim().toLowerCase(),
//       password: String(password || ""),
//     };
//     if (phone) payload.phone = String(phone).trim();

//     const { data } = await axios.post("https://sriandhravalmiki-merge.onrender.com/api/auth/signup", payload);
//     console.log("Signup API response:", data);
//     return data;
//   } catch (e) {
//     throw new Error(getErr(e));
//   }
// }

// // -----------------------------
// // ✅ USER LOGIN (NO OTP)
// // POST /api/auth/login/password
// // -----------------------------
// export async function loginWithPassword({ email, password }) {
//   try {
//     const { data } = await axios.post("https://sriandhravalmiki-merge.onrender.com/api/auth/login/password", {
//       email: String(email || "").trim().toLowerCase(),
//       password: String(password || ""),
//     });
//     return data;
//   } catch (e) {
//     throw new Error(getErr(e));
//   }
// }

// // -----------------------------
// // ✅ OTP (signup only)
// // POST /api/auth/login/request-otp
// // POST /api/auth/login/verify-otp
// // -----------------------------
// export async function requestOtp({ channel = "email", identifier, password }) {
//   try {
//     const id =
//       channel === "email"
//         ? String(identifier || "").trim().toLowerCase()
//         : String(identifier || "").trim();

//     const { data } = await axios.post("https://sriandhravalmiki-merge.onrender.com/api/auth/login/request-otp", {
//       channel,
//       identifier: id,
//       password: String(password || ""),
//     });
//     return data;
//   } catch (e) {
//     throw new Error(getErr(e));
//   }
// }

// export async function verifyOtp({ channel = "email", identifier, password, otp }) {
//   try {
//     const id =
//       channel === "email"
//         ? String(identifier || "").trim().toLowerCase()
//         : String(identifier || "").trim();

//     const { data } = await axios.post("https://sriandhravalmiki-merge.onrender.com/api/auth/login/verify-otp", {
//       channel,
//       identifier: id,
//       password: String(password || ""),
//       otp: String(otp || "").trim(),
//     });
//     return data;
//   } catch (e) {
//     throw new Error(getErr(e));
//   }
// }

// // -----------------------------
// // GET USER DATA
// // GET /api/auth/me (Bearer auto attached by apiClient, but still okay)
// // -----------------------------
// export async function getMe(token) {
//   try {
//     const { data } = await axios.get("https://sriandhravalmiki-merge.onrender.com/api/auth/me", {
//       headers: token ? { Authorization: `Bearer ${token}` } : {},
//     });
//     return data;
//   } catch (e) {
//     throw new Error(getErr(e));
//   }
// }

// // -----------------------------
// // ✅ ADMIN LOGIN (GET ONLY)
// // GET /api/auth/admin/login?email=
// // &password=Admin
// // -----------------------------
// export async function adminLoginGet({ email, password }) {
//   try {
//     const { data } = await api.get("/api/auth/admin/login", {
//       params: {
//         email: String(email || "").trim().toLowerCase(),
//         password: String(password || ""),
//       },
//     });
//     return data;
//   } catch (e) {
//     throw new Error(getErr(e));
//   }
// }

// src/utils/authApi.js
import api from "./apiClient.js";

const getErr = (e) =>
  e?.response?.data?.detail ||
  e?.response?.data?.error ||
  e?.response?.data?.message ||
  e?.message ||
  "Something went wrong";

// ✅ USER SIGNUP
export async function signupUser({ firstName, lastName, email, password, phone }) {
  console.log("📤 Signup API called");
  try {
    const payload = {
      firstName: String(firstName || "").trim(),
      lastName: String(lastName || "").trim(),
      email: String(email || "").trim().toLowerCase(),
      password: String(password || ""),
    };
    if (phone) payload.phone = String(phone).trim();

    console.log("📤 Signup payload:", payload);
    const { data } = await api.post("/api/auth/signup", payload);
    console.log("✅ Signup response:", data);
    return data;
  } catch (e) {
    console.error("❌ Signup error:", getErr(e));
    throw new Error(getErr(e));
  }
}

// ✅ USER LOGIN (NO OTP)
export async function loginWithPassword({ email, password }) {
  console.log("📤 Login API called");
  try {
    const payload = {
      email: String(email || "").trim().toLowerCase(),
      password: String(password || ""),
    };
    console.log("📤 Login payload:", payload);
    const { data } = await api.post("/api/auth/login/password", payload);
    console.log("✅ Login response:", data);
    
    // Save token if returned
    if (data.token) {
      localStorage.setItem("authToken", data.token);
      console.log("✅ Token saved to localStorage");
    }
    return data;
  } catch (e) {
    console.error("❌ Login error:", getErr(e));
    throw new Error(getErr(e));
  }
}

// ✅ REQUEST OTP
export async function requestOtp({ channel = "email", identifier, password }) {
  console.log("📤 Request OTP called");
  try {
    const id =
      channel === "email"
        ? String(identifier || "").trim().toLowerCase()
        : String(identifier || "").trim();

    const payload = {
      channel,
      identifier: id,
      password: String(password || ""),
    };
    console.log("📤 Request OTP payload:", payload);
    const { data } = await api.post("/api/auth/login/request-otp", payload);
    console.log("✅ OTP requested:", data);
    return data;
  } catch (e) {
    console.error("❌ Request OTP error:", getErr(e));
    throw new Error(getErr(e));
  }
}

// ✅ VERIFY OTP
export async function verifyOtp({ channel = "email", identifier, password, otp }) {
  console.log("📤 Verify OTP called");
  try {
    const id =
      channel === "email"
        ? String(identifier || "").trim().toLowerCase()
        : String(identifier || "").trim();

    const payload = {
      channel,
      identifier: id,
      password: String(password || ""),
      otp: String(otp || "").trim(),
    };
    console.log("📤 Verify OTP payload:", payload);
    const { data } = await api.post("/api/auth/login/verify-otp", payload);
    console.log("✅ OTP verified:", data);
    
    // Save token if returned
    if (data.token) {
      localStorage.setItem("authToken", data.token);
      console.log("✅ Token saved to localStorage");
    }
    return data;
  } catch (e) {
    console.error("❌ Verify OTP error:", getErr(e));
    throw new Error(getErr(e));
  }
}

// ✅ GET USER DATA
export async function getMe(token) {
  console.log("📤 Get user data called");
  try {
    const { data } = await api.get("/api/auth/me", {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    console.log("✅ User data:", data);
    return data;
  } catch (e) {
    console.error("❌ Get user error:", getErr(e));
    throw new Error(getErr(e));
  }
}

// ✅ ADMIN LOGIN
export async function adminLoginGet({ email, password }) {
  console.log("📤 Admin login called");
  try {
    const payload = {
      email: String(email || "").trim().toLowerCase(),
      password: String(password || ""),
    };
    console.log("📤 Admin login payload:", payload);
    const { data } = await api.get("/api/auth/admin/login", {
      params: payload,
    });
    console.log("✅ Admin login response:", data);
    
    // Save token if returned
    if (data.token) {
      localStorage.setItem("authToken", data.token);
      console.log("✅ Admin token saved to localStorage");
    }
    return data;
  } catch (e) {
    console.error("❌ Admin login error:", getErr(e));
    throw new Error(getErr(e));
  }
}

// ✅ LOGOUT
export function logout() {
  localStorage.removeItem("authToken");
  console.log("✅ Logged out - token cleared");
}

// ✅ GET STORED TOKEN
export function getStoredToken() {
  const token = localStorage.getItem("authToken");
  console.log("🔑 Retrieved token from storage:", token ? "Found" : "Not found");
  return token;
}
