// Firebase Configuration
// استبدل هذه القيم بقيم مشروعك من Firebase Console

const firebaseConfig = {
  apiKey: "your-api-key-here",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};

// تهيئة Firebase
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

// تهيئة التطبيق
const app = initializeApp(firebaseConfig);

// تهيئة الخدمات
const auth = getAuth(app);
const db = getFirestore(app);

// تصدير الخدمات للاستخدام في الملفات الأخرى
window.firebaseAuth = auth;
window.firebaseDB = db;

console.log('Firebase initialized successfully!');
