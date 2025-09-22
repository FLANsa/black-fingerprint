// Firebase Configuration for Phone Store Demo
// إعدادات Firebase للمستودع الجديد

const firebaseConfig = {
  apiKey: "AIzaSyAbjrt-vFCq8upgxmGDyli-UUi6TMZyQA0",
  authDomain: "phone-store-demo.firebaseapp.com",
  projectId: "phone-store-demo",
  storageBucket: "phone-store-demo.firebasestorage.app",
  messagingSenderId: "37108593123",
  appId: "1:37108593123:web:e4bfac087ccd95550fb0d6",
  measurementId: "G-NQWS57YQFW"
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
