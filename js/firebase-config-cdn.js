// Firebase Configuration for Phone Store Demo - CDN Version
// إعدادات Firebase للمستودع الجديد - نسخة CDN

const firebaseConfig = {
  apiKey: "AIzaSyAbjrt-vFCq8upgxmGDyli-UUi6TMZyQA0",
  authDomain: "phone-store-demo.firebaseapp.com",
  projectId: "phone-store-demo",
  storageBucket: "phone-store-demo.firebasestorage.app",
  messagingSenderId: "37108593123",
  appId: "1:37108593123:web:e4bfac087ccd95550fb0d6",
  measurementId: "G-NQWS57YQFW"
};

// تهيئة Firebase باستخدام CDN
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { getAnalytics } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js';

// تهيئة التطبيق
const app = initializeApp(firebaseConfig);

// تهيئة الخدمات
const db = getFirestore(app);
const auth = getAuth(app);
const analytics = getAnalytics(app);

// تصدير الخدمات للاستخدام في الملفات الأخرى
window.firebaseDB = db;
window.firebaseAuth = auth;
window.firebaseAnalytics = analytics;

console.log('🔥 Firebase initialized successfully!');
console.log('📊 Firestore Database:', db);
console.log('🔐 Authentication:', auth);
console.log('📈 Analytics:', analytics);
