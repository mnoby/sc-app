import firebase from "firebase/app"
import "firebase/firestore"

let config = {
  apiKey: "AIzaSyBeHiiYgxfnJAi8d2uO9xsjONPo3L6y8yQ",
  authDomain: "sachii-app.firebaseapp.com",
  databaseURL: "https://sachii-app-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "sachii-app",
  storageBucket: "sachii-app.appspot.com",
  messagingSenderId: "80698338474",
  appId: "1:80698338474:web:6c7b552647b5ddaa8134d3",
}

firebase.initializeApp(config)

export default firebase.firestore()
