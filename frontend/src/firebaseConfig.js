// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// Your Firebase Configuration (Replace with your actual config)
const firebaseConfig = {
    apiKey: 'AIzaSyC_E2o026Y58jQO8FQXsxnHNyeKSe6SKKM',
  authDomain: 'herbalheaven-d8cb9.firebaseapp.com',
  projectId: 'herbalheaven-d8cb9',
  storageBucket: 'herbalheaven-d8cb9.appspot.com',
  messagingSenderId: '654458706208',
  appId: '1:654458706208:web:f122ff742b6c8151cd9f45',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };
