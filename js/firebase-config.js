// Firebase Configuration for Phone Store Demo
// إعدادات Firebase للمستودع الجديد

const firebaseConfig = {
  apiKey: "AIzaSyAN9fS6DGdigwDuXAiggGwwIo01vumMzTM",
  authDomain: "black-finger-print.firebaseapp.com",
  projectId: "black-finger-print",
  storageBucket: "black-finger-print.firebasestorage.app",
  messagingSenderId: "209431717379",
  appId: "1:209431717379:web:af68a4e7bc5f334e0c1036",
  measurementId: "G-41FNYQN9KW"
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
