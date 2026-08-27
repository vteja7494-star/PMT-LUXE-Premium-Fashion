// PMT LUXE — Firebase Phone OTP Login
// auth.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

// 🔐 Firebase Console nundi nee config ikkada paste cheyyali
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.firebasestorage.app",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

let confirmationResult = null;

// reCAPTCHA
window.recaptchaVerifier = new RecaptchaVerifier(
  auth,
  "recaptcha-container",
  {
    size: "invisible"
  }
);

// SEND OTP
window.sendOTP = async function () {
  const phoneInput = document.getElementById("phone");
  const phone = phoneInput.value.trim();

  if (!/^\+[1-9]\d{7,14}$/.test(phone)) {
    alert("Enter phone number with country code.\nExample: +919876543210");
    return;
  }

  try {
    const appVerifier = window.recaptchaVerifier;

    confirmationResult = await signInWithPhoneNumber(
      auth,
      phone,
      appVerifier
    );

    document.getElementById("otp-section").style.display = "block";
    alert("OTP sent successfully.");
  } catch (error) {
    console.error(error);
    alert("OTP failed. Please try again.");
  }
};

// VERIFY OTP
window.verifyOTP = async function () {
  const otp = document.getElementById("otp").value.trim();

  if (!/^\d{6}$/.test(otp)) {
    alert("Enter the 6-digit OTP.");
    return;
  }

  if (!confirmationResult) {
    alert("Please send OTP first.");
    return;
  }

  try {
    const result = await confirmationResult.confirm(otp);
    const user = result.user;

    console.log("Logged in:", user.uid);

    localStorage.setItem("pmtLoggedIn", "true");
    localStorage.setItem("pmtUserPhone", user.phoneNumber || "");

    alert("Login successful ✓");

    // Continue to checkout
    if (typeof window.goToCheckout === "function") {
      window.goToCheckout();
    }
  } catch (error) {
    console.error(error);
    alert("Invalid OTP. Please try again.");
  }
};

// LOGOUT
window.logoutPMT = async function () {
  try {
    await auth.signOut();

    localStorage.removeItem("pmtLoggedIn");
    localStorage.removeItem("pmtUserPhone");

    alert("Logged out successfully.");
    location.reload();
  } catch (error) {
    console.error(error);
  }
};
