import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCy5QtF1cL62qJEg7ZzvqzYl9F6DGxWucw",
  authDomain: "votesmart-india-78563.firebaseapp.com",
  projectId: "votesmart-india-78563",
  storageBucket: "votesmart-india-78563.firebasestorage.app",
  messagingSenderId: "439362404762",
  appId: "1:439362404762:web:13449e465013c7f2dbba23",
  measurementId: "G-ER4E8CFHWN"
};

export function getFirebaseApp() {
  return getApps().length ? getApp() : initializeApp(firebaseConfig);
}

export function getFirebaseAuth() {
  return getAuth(getFirebaseApp());
}
