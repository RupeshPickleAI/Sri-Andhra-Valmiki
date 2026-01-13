// src/utils/authSession.js
export const authSession = {
  getToken() {
    return localStorage.getItem("token");
  },

  getRole() {
    return localStorage.getItem("role"); // "user" | "admin"
  },

  getMe() {
    try {
      const raw = localStorage.getItem("me");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  // ✅ logout should NOT remove otp_verified_once (so next user login is password-only)
  logout({ keepOtpVerifiedOnce = true } = {}) {
    const otpFlag = localStorage.getItem("otp_verified_once");

    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("auth_provider");
    localStorage.removeItem("me");

    if (!keepOtpVerifiedOnce) {
      localStorage.removeItem("otp_verified_once");
    } else {
      if (otpFlag) localStorage.setItem("otp_verified_once", otpFlag);
    }
  },
};
