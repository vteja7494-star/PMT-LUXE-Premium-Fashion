// PMT LUXE — Firebase Phone OTP Login

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyC-flmLASFbZTdgplIGWn4JK-p18aIe7D4",
  authDomain: "pmt-luxe-premium-fashion.firebaseapp.com",
  projectId: "pmt-luxe-premium-fashion",
  storageBucket: "pmt-luxe-premium-fashion.firebasestorage.app",
  messagingSenderId: "724070705651",
  appId: "1:724070705651:web:2af329ad93e69231374a86",
  measurementId: "G-S726ZV5N6V"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

let confirmationResult = null;

window.recaptchaVerifier = new RecaptchaVerifier(
  auth,
  "recaptcha-container",
  {
    size: "invisible"
  }
);

window.sendOTP = async function () {
  const phoneInput = document.getElementById("phone");
  const phone = phoneInput.value.trim();

  if (!/^\+[1-9]\d{7,14}$/.test(phone)) {
    alert("Enter phone number with country code.\nExample: +919876543210");
    return;
  }

  try {
    confirmationResult = await signInWithPhoneNumber(
      auth,
      phone,
      window.recaptchaVerifier
    );

    document.getElementById("otp-section").style.display = "block";
    alert("OTP sent successfully.");
  } catch (error) {
    console.error(error);
    alert("OTP failed. Please try again.");
  }
};

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

    localStorage.setItem("pmtLoggedIn", "true");
    localStorage.setItem("pmtUserPhone", user.phoneNumber || "");

    alert("Login successful ✓");

    if (typeof window.goToCheckout === "function") {
      window.goToCheckout();
    }
  } catch (error) {
    console.error(error);
    alert("Invalid OTP. Please try again.");
  }
};

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
