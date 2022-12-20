import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyAMnQGrOVM7rwCSV-Wok5Aolby38ynd56E",
  authDomain: "cashflow-fa1dd.firebaseapp.com",
  projectId: "cashflow-fa1dd",
  storageBucket: "cashflow-fa1dd.appspot.com",
  messagingSenderId: "228595934651",
  appId: "1:228595934651:web:0f6cc61ff8399ae7b3509e",
};

const firebaseApp = initializeApp(firebaseConfig);

export default firebaseApp
