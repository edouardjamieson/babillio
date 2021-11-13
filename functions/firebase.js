import firebase from 'firebase'

const firebaseConfig = {
  apiKey: "AIzaSyBwstHvqr5ApMurgnl91QrR4Qs9UgCLnhY",
  authDomain: "babillio.firebaseapp.com",
  projectId: "babillio",
  storageBucket: "babillio.appspot.com",
  messagingSenderId: "430425599212",
  appId: "1:430425599212:web:b6bf3f44dc5281995bc9c9",
  measurementId: "G-KKCHE94ZLS"
};

// Initialize Firebase
const app = !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app()

// Initialize Firebase modules
const db = app.firestore()
const auth = app.auth()
const fields = firebase.firestore.FieldValue
const google = new firebase.auth.GoogleAuthProvider()
// Export modules
export { db, auth, google,fields }