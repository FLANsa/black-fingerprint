// Firebase Authentication - إدارة المصادقة
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';

class FirebaseAuth {
  constructor() {
    this.auth = window.firebaseAuth;
    this.db = window.firebaseDB;
    this.currentUser = null;
    this.init();
  }

  init() {
    // الاستماع لتغييرات حالة المصادقة
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.currentUser = user;
        console.log('User signed in:', user.email);
        this.updateUserSession(user);
      } else {
        this.currentUser = null;
        console.log('User signed out');
        this.clearUserSession();
      }
    });
  }

  // تسجيل الدخول
  async signIn(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      const user = userCredential.user;
      
      // الحصول على بيانات المستخدم من Firestore
      const userData = await this.getUserData(user.uid);
      
      return {
        success: true,
        user: {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          ...userData
        }
      };
    } catch (error) {
      console.error('Error signing in:', error);
      return {
        success: false,
        error: this.getErrorMessage(error.code)
      };
    }
  }

  // إنشاء حساب جديد
  async signUp(email, password, userData) {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      const user = userCredential.user;

      // تحديث ملف المستخدم
      await updateProfile(user, {
        displayName: userData.name
      });

      // حفظ بيانات المستخدم في Firestore
      await this.saveUserData(user.uid, {
        name: userData.name,
        role: userData.role || 'user',
        email: email,
        createdAt: new Date()
      });

      return {
        success: true,
        user: {
          uid: user.uid,
          email: user.email,
          displayName: userData.name,
          role: userData.role || 'user'
        }
      };
    } catch (error) {
      console.error('Error signing up:', error);
      return {
        success: false,
        error: this.getErrorMessage(error.code)
      };
    }
  }

  // تسجيل الخروج
  async signOut() {
    try {
      await signOut(this.auth);
      return { success: true };
    } catch (error) {
      console.error('Error signing out:', error);
      return {
        success: false,
        error: 'حدث خطأ أثناء تسجيل الخروج'
      };
    }
  }

  // الحصول على بيانات المستخدم من Firestore
  async getUserData(uid) {
    try {
      const userDoc = await window.firebaseStorage.getUser(uid);
      return userDoc;
    } catch (error) {
      console.error('Error getting user data:', error);
      return null;
    }
  }

  // حفظ بيانات المستخدم في Firestore
  async saveUserData(uid, userData) {
    try {
      await window.firebaseStorage.updateUser(uid, userData);
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  }

  // تحديث جلسة المستخدم في localStorage
  updateUserSession(user) {
    const sessionData = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      loginTime: new Date().toISOString()
    };
    localStorage.setItem('current_user', JSON.stringify(sessionData));
  }

  // مسح جلسة المستخدم
  clearUserSession() {
    localStorage.removeItem('current_user');
  }

  // الحصول على المستخدم الحالي
  getCurrentUser() {
    return this.currentUser;
  }

  // التحقق من تسجيل الدخول
  isSignedIn() {
    return this.currentUser !== null;
  }

  // الحصول على رسالة خطأ باللغة العربية
  getErrorMessage(errorCode) {
    const errorMessages = {
      'auth/user-not-found': 'المستخدم غير موجود',
      'auth/wrong-password': 'كلمة المرور غير صحيحة',
      'auth/email-already-in-use': 'البريد الإلكتروني مستخدم بالفعل',
      'auth/weak-password': 'كلمة المرور ضعيفة جداً',
      'auth/invalid-email': 'البريد الإلكتروني غير صحيح',
      'auth/too-many-requests': 'محاولات كثيرة جداً، حاول مرة أخرى لاحقاً',
      'auth/network-request-failed': 'خطأ في الشبكة، تحقق من اتصالك بالإنترنت',
      'auth/user-disabled': 'تم تعطيل هذا الحساب',
      'auth/operation-not-allowed': 'هذه العملية غير مسموحة'
    };

    return errorMessages[errorCode] || 'حدث خطأ غير متوقع';
  }

  // إنشاء مستخدمين افتراضيين (للتطوير)
  async createDefaultUsers() {
    const defaultUsers = [
      {
        email: 'admin@alsaqri.com',
        password: 'admin123',
        name: 'مدير النظام',
        role: 'admin'
      },
      {
        email: 'user@alsaqri.com',
        password: 'user123',
        name: 'موظف المبيعات',
        role: 'user'
      }
    ];

    for (const userData of defaultUsers) {
      try {
        await this.signUp(userData.email, userData.password, {
          name: userData.name,
          role: userData.role
        });
        console.log(`Default user created: ${userData.email}`);
      } catch (error) {
        if (error.code === 'auth/email-already-in-use') {
          console.log(`User already exists: ${userData.email}`);
        } else {
          console.error(`Error creating user ${userData.email}:`, error);
        }
      }
    }
  }
}

// إنشاء instance واحد للاستخدام في جميع أنحاء التطبيق
window.firebaseAuthManager = new FirebaseAuth();

console.log('Firebase Authentication initialized successfully!');
