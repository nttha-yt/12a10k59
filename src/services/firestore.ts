import { db } from './firebase';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { FullAppData } from '../types';
import { getStoredData, saveStoredData } from '../utils/storage';

const CLASS_DOC_ID = '12A10';
const CLASS_COLLECTION = 'classes';
const KVDB_URL = 'https://kvdb.io/67EZ54ukzvhv7GPgEg7WGM/app_data';

export async function fetchAppData(): Promise<FullAppData> {
  const docRef = doc(db, CLASS_COLLECTION, CLASS_DOC_ID);
  
  try {
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data() as FullAppData;
      saveStoredData(data); // Backup to local storage
      return data;
    }
  } catch (error) {
    console.error("Error fetching from Firestore:", error);
  }

  // Fallback 1: Try to migrate data from KVDB if Firestore is empty
  try {
    const response = await fetch(KVDB_URL);
    if (response.ok) {
      const data = await response.json();
      if (data && data.students) {
        try {
          await setDoc(docRef, data);
        } catch(e) {}
        saveStoredData(data);
        return data as FullAppData;
      }
    }
  } catch (error) {
    console.error("Error migrating from KVDB:", error);
  }
  
  // Fallback 2: Use local storage data and upload to Firestore
  const localData = getStoredData();
  try {
    await setDoc(docRef, localData);
  } catch(e) {}
  
  return localData;
}

export async function saveAppData(data: FullAppData): Promise<void> {
  // Always save to localStorage as a backup
  saveStoredData(data);
  
  // Save to Firebase Firestore
  try {
    const docRef = doc(db, CLASS_COLLECTION, CLASS_DOC_ID);
    await setDoc(docRef, data);
  } catch (error) {
    console.error("Error saving to Firestore:", error);
  }
}

export function subscribeToAppData(callback: (data: FullAppData) => void) {
  const docRef = doc(db, CLASS_COLLECTION, CLASS_DOC_ID);
  
  // Firebase Real-time subscription
  const unsubscribe = onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      const data = docSnap.data() as FullAppData;
      saveStoredData(data);
      callback(data);
    }
  });
  
  return unsubscribe;
}

