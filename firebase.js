// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAI5fQRVcLcb79FeCIkQBPotTYKqZUlBhw",
  authDomain: "prompty-7a544.firebaseapp.com",
  projectId: "prompty-7a544",
  storageBucket: "prompty-7a544.appspot.com",
  messagingSenderId: "144398492520",
  appId: "1:144398492520:web:1a35bc569e905597c5ecdd",
  measurementId: "G-46HHSP0MMC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);