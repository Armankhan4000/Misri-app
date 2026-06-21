import { 
  collection, 
  doc, 
  setDoc, 
  updateDoc, 
  getDocs, 
  onSnapshot, 
  addDoc, 
  deleteDoc,
  query,
  limit,
  getDoc
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';
import { 
  Customer, 
  Technician, 
  Booking, 
  Banner, 
  PromoCode, 
  Product, 
  ShopOrder, 
  SystemLog,
  AppSettings
} from './types';
import { 
  initialCustomers, 
  initialTechnicians, 
  initialBookings, 
  initialBanners, 
  initialPromoCodes, 
  initialProducts, 
  initialOrders, 
  systemLogs 
} from './data';

// Helper to seed database if empty
export async function seedFirestoreIfEmpty() {
  try {
    const custSnap = await getDocs(query(collection(db, 'customers'), limit(1)));
    if (custSnap.empty) {
      console.log('Firestore is empty. Hydrating collections with genuine default datasets...');
      
      // 1. Seed customers
      for (const item of initialCustomers) {
        await setDoc(doc(db, 'customers', item.id), item);
      }
      // 2. Seed technicians
      for (const item of initialTechnicians) {
        await setDoc(doc(db, 'technicians', item.id), item);
      }
      // 3. Seed bookings
      for (const item of initialBookings) {
        await setDoc(doc(db, 'bookings', item.id), item);
      }
      // 4. Seed banners
      for (const item of initialBanners) {
        await setDoc(doc(db, 'banners', item.id), item);
      }
      // 5. Seed promoCodes
      for (const item of initialPromoCodes) {
        await setDoc(doc(db, 'promoCodes', item.id), item);
      }
      // 6. Seed products
      for (const item of initialProducts) {
        await setDoc(doc(db, 'products', item.id), item);
      }
      // 7. Seed orders
      for (const item of initialOrders) {
        await setDoc(doc(db, 'orders', item.id), item);
      }
      // 8. Seed systemLogs
      for (const item of systemLogs) {
        // Use setDoc with generated timestamp string for reproducible logging
        const logId = item.timestamp.replace(/[: -]/g, '_');
        await setDoc(doc(db, 'systemLogs', logId), item);
      }

      // 9. Seed default appSettings/global
      const defaultSettings: AppSettings = {
        appName: 'মিস্ত্রি হাব / Mistri Hub',
        primaryColor: '#0ea5e9', // Sky Blue
        secondaryColor: '#0f172a', // Slate Dark
        themeMode: 'dark',
        emergencyNotice: 'জরুরী ঘোষণা: ঢাকা সিটি করপোরেশন এলাকায় বর্তমানে ইলেকট্রিশিয়ান ও প্লাম্বিং সেবার চাহিদা বেশি!',
        allowBookingRegistration: true,
        commissionPercentage: 15,
        lastUpdated: new Date().toISOString()
      };
      await setDoc(doc(db, 'appSettings', 'global'), defaultSettings);

      console.log('Seeding process fully finished!');
    }
  } catch (err) {
    console.warn('Seeding skipped or credentials require authenticated admin schema authorization:', err);
  }
}

// 1-to-1 Real-time Synced Listeners
export function listenToCollection<T>(
  colName: string, 
  callback: (data: T[]) => void, 
  onError?: (err: Error) => void
) {
  const colRef = collection(db, colName);
  return onSnapshot(
    colRef,
    (snapshot) => {
      const items: T[] = [];
      snapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() } as T);
      });
      callback(items);
    },
    (error) => {
      console.error(`Listen to ${colName} failed: `, error);
      if (onError) onError(error);
      handleFirestoreError(error, OperationType.LIST, colName);
    }
  );
}

// Real-time operations wrappers
export async function updateCustomerStatusInCloud(id: string, status: Customer['status']) {
  const path = `customers/${id}`;
  try {
    const docRef = doc(db, 'customers', id);
    await updateDoc(docRef, { status });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function updateCustomerNidInCloud(id: string, nidNum: string, status: Customer['nidStatus']) {
  const path = `customers/${id}`;
  try {
    const docRef = doc(db, 'customers', id);
    await updateDoc(docRef, { nidNumber: nidNum, nidStatus: status });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function updateTechnicianStatusInCloud(id: string, status: Technician['status']) {
  const path = `technicians/${id}`;
  try {
    const docRef = doc(db, 'technicians', id);
    await updateDoc(docRef, { status });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function updateTechnicianNidInCloud(id: string, nidNum: string, verified: boolean) {
  const path = `technicians/${id}`;
  try {
    const docRef = doc(db, 'technicians', id);
    await updateDoc(docRef, { nidNumber: nidNum, nidVerified: verified });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function updateTechnicianPoliceVerifiedInCloud(id: string, policeVerified: boolean) {
  const path = `technicians/${id}`;
  try {
    const docRef = doc(db, 'technicians', id);
    await updateDoc(docRef, { policeVerified });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function updateTechnicianFeaturedInCloud(id: string, isFeatured: boolean) {
  const path = `technicians/${id}`;
  try {
    const docRef = doc(db, 'technicians', id);
    await updateDoc(docRef, { isFeatured });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function updateTechnicianInCloud(id: string, updates: Partial<Technician>) {
  const path = `technicians/${id}`;
  try {
    const docRef = doc(db, 'technicians', id);
    await updateDoc(docRef, updates);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function resolveDisputeInCloud(bookingId: string, resolution: 'refund' | 'payout' | 'custom', prevDispute: any) {
  const path = `bookings/${bookingId}`;
  try {
    const docRef = doc(db, 'bookings', bookingId);
    await updateDoc(docRef, {
      dispute: {
        ...prevDispute,
        status: 'Resolved',
        resolutionDate: new Date().toISOString().substring(0, 10)
      }
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function createPromoCodeInCloud(promo: PromoCode) {
  const path = `promoCodes/${promo.id}`;
  try {
    await setDoc(doc(db, 'promoCodes', promo.id), promo);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deletePromoCodeFromCloud(id: string) {
  const path = `promoCodes/${id}`;
  try {
    await deleteDoc(doc(db, 'promoCodes', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function createBannerCampaignInCloud(banner: Banner) {
  const path = `banners/${banner.id}`;
  try {
    await setDoc(doc(db, 'banners', banner.id), banner);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteBannerCampaignInCloud(id: string) {
  const path = `banners/${id}`;
  try {
    await deleteDoc(doc(db, 'banners', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function updateProductInventoryInCloud(id: string, quantity: number, status: string) {
  const path = `products/${id}`;
  try {
    const docRef = doc(db, 'products', id);
    await updateDoc(docRef, { quantity, status });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function addProductToCloud(product: Product) {
  const path = `products/${product.id}`;
  try {
    await setDoc(doc(db, 'products', product.id), product);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function updateOrderStatusInCloud(id: string, status: ShopOrder['status']) {
  const path = `orders/${id}`;
  try {
    const docRef = doc(db, 'orders', id);
    await updateDoc(docRef, { status });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function createSystemLog(log: SystemLog) {
  const path = 'systemLogs';
  try {
    const logId = log.timestamp.replace(/[: -]/g, '_') + '_' + Math.floor(Math.random() * 105);
    await setDoc(doc(db, 'systemLogs', logId), log);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

// 9. Companion App Configuration Syncer (Live Settings)
export async function updateAppSettingsInCloud(settings: AppSettings) {
  const path = 'appSettings/global';
  try {
    await setDoc(doc(db, 'appSettings', 'global'), settings);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export function listenToAppSettings(callback: (settings: AppSettings | null) => void) {
  const docRef = doc(db, 'appSettings', 'global');
  return onSnapshot(
    docRef,
    (docSnap) => {
      if (docSnap.exists()) {
        callback(docSnap.data() as AppSettings);
      } else {
        callback(null);
      }
    },
    (error) => {
      console.error('Listen to appSettings/global failed:', error);
      handleFirestoreError(error, OperationType.GET, 'appSettings/global');
    }
  );
}

