// Firebase Storage - إدارة البيانات مع Firestore
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  getDoc, 
  query, 
  where, 
  orderBy,
  onSnapshot 
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

class FirebaseStorage {
  constructor() {
    this.db = window.firebaseDB;
    this.auth = window.firebaseAuth;
  }

  // ===== إدارة المستخدمين =====
  async createUser(userData) {
    try {
      const userRef = await addDoc(collection(this.db, 'users'), {
        ...userData,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      return userRef.id;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  async getUser(userId) {
    try {
      const userDoc = await getDoc(doc(this.db, 'users', userId));
      if (userDoc.exists()) {
        return { id: userDoc.id, ...userDoc.data() };
      }
      return null;
    } catch (error) {
      console.error('Error getting user:', error);
      throw error;
    }
  }

  async updateUser(userId, userData) {
    try {
      await updateDoc(doc(this.db, 'users', userId), {
        ...userData,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  // ===== إدارة الهواتف =====
  async addPhone(phoneData) {
    try {
      const phoneRef = await addDoc(collection(this.db, 'phones'), {
        ...phoneData,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      return phoneRef.id;
    } catch (error) {
      console.error('Error adding phone:', error);
      throw error;
    }
  }

  async getPhones() {
    try {
      const phonesSnapshot = await getDocs(collection(this.db, 'phones'));
      const phones = [];
      phonesSnapshot.forEach((doc) => {
        phones.push({ id: doc.id, ...doc.data() });
      });
      return phones;
    } catch (error) {
      console.error('Error getting phones:', error);
      throw error;
    }
  }

  async getPhone(phoneId) {
    try {
      const phoneDoc = await getDoc(doc(this.db, 'phones', phoneId));
      if (phoneDoc.exists()) {
        return { id: phoneDoc.id, ...phoneDoc.data() };
      }
      return null;
    } catch (error) {
      console.error('Error getting phone:', error);
      throw error;
    }
  }

  async updatePhone(phoneId, phoneData) {
    try {
      await updateDoc(doc(this.db, 'phones', phoneId), {
        ...phoneData,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Error updating phone:', error);
      throw error;
    }
  }

  async deletePhone(phoneId) {
    try {
      await deleteDoc(doc(this.db, 'phones', phoneId));
    } catch (error) {
      console.error('Error deleting phone:', error);
      throw error;
    }
  }

  // ===== إدارة الأكسسوارات =====
  async addAccessory(accessoryData) {
    try {
      const accessoryRef = await addDoc(collection(this.db, 'accessories'), {
        ...accessoryData,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      return accessoryRef.id;
    } catch (error) {
      console.error('Error adding accessory:', error);
      throw error;
    }
  }

  async getAccessories() {
    try {
      const accessoriesSnapshot = await getDocs(collection(this.db, 'accessories'));
      const accessories = [];
      accessoriesSnapshot.forEach((doc) => {
        accessories.push({ id: doc.id, ...doc.data() });
      });
      return accessories;
    } catch (error) {
      console.error('Error getting accessories:', error);
      throw error;
    }
  }

  async getAccessory(accessoryId) {
    try {
      const accessoryDoc = await getDoc(doc(this.db, 'accessories', accessoryId));
      if (accessoryDoc.exists()) {
        return { id: accessoryDoc.id, ...accessoryDoc.data() };
      }
      return null;
    } catch (error) {
      console.error('Error getting accessory:', error);
      throw error;
    }
  }

  async updateAccessory(accessoryId, accessoryData) {
    try {
      await updateDoc(doc(this.db, 'accessories', accessoryId), {
        ...accessoryData,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Error updating accessory:', error);
      throw error;
    }
  }

  async deleteAccessory(accessoryId) {
    try {
      await deleteDoc(doc(this.db, 'accessories', accessoryId));
    } catch (error) {
      console.error('Error deleting accessory:', error);
      throw error;
    }
  }

  // ===== إدارة المبيعات =====
  async addSale(saleData) {
    try {
      const saleRef = await addDoc(collection(this.db, 'sales'), {
        ...saleData,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      return saleRef.id;
    } catch (error) {
      console.error('Error adding sale:', error);
      throw error;
    }
  }

  async getSales() {
    try {
      const salesSnapshot = await getDocs(
        query(collection(this.db, 'sales'), orderBy('createdAt', 'desc'))
      );
      const sales = [];
      salesSnapshot.forEach((doc) => {
        sales.push({ id: doc.id, ...doc.data() });
      });
      return sales;
    } catch (error) {
      console.error('Error getting sales:', error);
      throw error;
    }
  }

  async getSale(saleId) {
    try {
      const saleDoc = await getDoc(doc(this.db, 'sales', saleId));
      if (saleDoc.exists()) {
        return { id: saleDoc.id, ...saleDoc.data() };
      }
      return null;
    } catch (error) {
      console.error('Error getting sale:', error);
      throw error;
    }
  }

  // ===== إدارة فئات الأكسسوارات =====
  async addAccessoryCategory(categoryData) {
    try {
      const categoryRef = await addDoc(collection(this.db, 'accessory_categories'), {
        ...categoryData,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      return categoryRef.id;
    } catch (error) {
      console.error('Error adding accessory category:', error);
      throw error;
    }
  }

  async getAccessoryCategories() {
    try {
      const categoriesSnapshot = await getDocs(collection(this.db, 'accessory_categories'));
      const categories = [];
      categoriesSnapshot.forEach((doc) => {
        categories.push({ id: doc.id, ...doc.data() });
      });
      return categories;
    } catch (error) {
      console.error('Error getting accessory categories:', error);
      throw error;
    }
  }

  // ===== إدارة أنواع الهواتف =====
  async addPhoneType(phoneTypeData) {
    try {
      const phoneTypeRef = await addDoc(collection(this.db, 'phone_types'), {
        ...phoneTypeData,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      return phoneTypeRef.id;
    } catch (error) {
      console.error('Error adding phone type:', error);
      throw error;
    }
  }

  async getPhoneTypes() {
    try {
      const phoneTypesSnapshot = await getDocs(collection(this.db, 'phone_types'));
      const phoneTypes = [];
      phoneTypesSnapshot.forEach((doc) => {
        phoneTypes.push({ id: doc.id, ...doc.data() });
      });
      return phoneTypes;
    } catch (error) {
      console.error('Error getting phone types:', error);
      throw error;
    }
  }

  // ===== البحث =====
  async searchPhones(searchTerm) {
    try {
      const phonesSnapshot = await getDocs(collection(this.db, 'phones'));
      const phones = [];
      phonesSnapshot.forEach((doc) => {
        const phoneData = { id: doc.id, ...doc.data() };
        // البحث في الحقول المختلفة
        const searchFields = [
          phoneData.phone_number,
          phoneData.serial_number,
          phoneData.brand,
          phoneData.model,
          phoneData.phone_color,
          phoneData.phone_memory,
          phoneData.description,
          phoneData.customer_name,
          phoneData.customer_id
        ];
        
        if (searchFields.some(field => 
          field && field.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )) {
          phones.push(phoneData);
        }
      });
      return phones;
    } catch (error) {
      console.error('Error searching phones:', error);
      throw error;
    }
  }

  async searchAccessories(searchTerm) {
    try {
      const accessoriesSnapshot = await getDocs(collection(this.db, 'accessories'));
      const accessories = [];
      accessoriesSnapshot.forEach((doc) => {
        const accessoryData = { id: doc.id, ...doc.data() };
        // البحث في الحقول المختلفة
        const searchFields = [
          accessoryData.name,
          accessoryData.category,
          accessoryData.description,
          accessoryData.supplier,
          accessoryData.notes
        ];
        
        if (searchFields.some(field => 
          field && field.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )) {
          accessories.push(accessoryData);
        }
      });
      return accessories;
    } catch (error) {
      console.error('Error searching accessories:', error);
      throw error;
    }
  }

  // ===== الاستماع للتغييرات في الوقت الفعلي =====
  onPhonesChange(callback) {
    return onSnapshot(collection(this.db, 'phones'), (snapshot) => {
      const phones = [];
      snapshot.forEach((doc) => {
        phones.push({ id: doc.id, ...doc.data() });
      });
      callback(phones);
    });
  }

  onAccessoriesChange(callback) {
    return onSnapshot(collection(this.db, 'accessories'), (snapshot) => {
      const accessories = [];
      snapshot.forEach((doc) => {
        accessories.push({ id: doc.id, ...doc.data() });
      });
      callback(accessories);
    });
  }

  onSalesChange(callback) {
    return onSnapshot(
      query(collection(this.db, 'sales'), orderBy('createdAt', 'desc')), 
      (snapshot) => {
        const sales = [];
        snapshot.forEach((doc) => {
          sales.push({ id: doc.id, ...doc.data() });
        });
        callback(sales);
      }
    );
  }
}

// إنشاء instance واحد للاستخدام في جميع أنحاء التطبيق
window.firebaseStorage = new FirebaseStorage();

console.log('Firebase Storage initialized successfully!');
