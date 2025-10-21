// Firebase Configuration for Phone Store Demo
// إعدادات Firebase للمستودع الجديد

const firebaseConfig = {
  apiKey: "AIzaSyCfRGq8FpMGqddntK1smfTMDcYc7M4gUBs",
  authDomain: "black-fingerprint-c5c1e.firebaseapp.com",
  projectId: "black-fingerprint-c5c1e",
  storageBucket: "black-fingerprint-c5c1e.firebasestorage.app",
  messagingSenderId: "963825886353",
  appId: "1:963825886353:web:eaaff5fcfdee5317570b30",
  measurementId: "G-YX7CHPQ152"
};

// تهيئة Firebase
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';

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
