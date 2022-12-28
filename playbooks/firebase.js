// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import data from "./es";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBgeCqZC1RBXqEopzYt_sEmJgwoZWtT-7I",
  authDomain: "spevnik-ac575.firebaseapp.com",
  projectId: "spevnik-ac575",
  storageBucket: "spevnik-ac575.appspot.com",
  messagingSenderId: "825177532911",
  appId: "1:825177532911:web:9e81429befb73dd54dee1a",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore();

// Get a new write batch
const batch = db.batch();

const collection = "es";

data.forEach((element) => {
  // Set the value of 'NYC'
  const eRef = db.collection(collection).doc(element.id);
  batch.set(eRef, { 
      artist: element.artist,
      album: element.album,
      year: element.year,
      name: element.name,
      crd_file: element.crd_file,
      midi_file: element.midi_file,
      mp_file: element.mp_file
   });
});

// Commit the batch
await batch.commit();
