import { initializeApp } from 'firebase/app'
import { getDatabase } from 'firebase/database'

const firebaseConfig = {
    apiKey: "AIzaSyDqg_W1fNLD-MDtv9siRVbZULFY0IgCOqk",
    authDomain: "xi-rpl-02.firebaseapp.com",
    databaseURL: "https://xi-rpl-02-default-rtdb.firebaseio.com",
    projectId: "xi-rpl-02",
    storageBucket: "xi-rpl-02.firebasestorage.app",
    messagingSenderId: "724654909336",
    appId: "1:724654909336:web:f0f9fc065f1e8647e66ded",
    measurementId: "G-0GJFWXXZEN"
}

const app = initializeApp(firebaseConfig)
export const db = getDatabase(app)
export default app
