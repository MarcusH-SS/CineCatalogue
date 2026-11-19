import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyA-BDSdqrNrL3nWTvCdMHQzoooRvuJuokU",
  authDomain: "cinecatalogue.firebaseapp.com",
  projectId: "cinecatalogue",
  storageBucket: "cinecatalogue.firebasestorage.app",
  messagingSenderId: "909764649591",
  appId: "1:909764649591:web:b5cda30e8161a95280dc72",
  measurementId: "G-C5DC9W63CS"
};

// Inicializa o Firebase (evita duplicar instâncias)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

const auth = getAuth(app);

const db = getFirestore(app);

export { app, auth, db };