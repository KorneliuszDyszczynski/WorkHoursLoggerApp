// LoginPage.js
import { useState } from 'react';
import './LoginPage.css';
import { useNavigate } from 'react-router-dom';
import { auth, firestore } from './Firebase';
import { getDocs, collection } from "firebase/firestore";
import { signInWithEmailAndPassword } from "firebase/auth";
import 'react-toastify/dist/ReactToastify.css';
import { toast, ToastContainer } from 'react-toastify';
import globals from './globals'

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();


    const handleLogin = async () => {
        try {
            // Sign in with Firebase authentication
            await signInWithEmailAndPassword(auth, username, password);

        } catch (error) {
            console.error('Error logging in:', error.message);
            // Handle authentication error (e.g., display error message)
            if (error.code === "auth/wrong-password" || error.code === "auth/user-not-found") {
                // Handle invalid credentials (e.g., display a specific error message to the user)
                console.error('Invalid credentials. Please check your username and password.');
                toast.error('Invalid credentials. Please check your username and password.');
            } else {
                // Handle other authentication errors
                console.error('Unexpected authentication error:', error.code);
                toast.error('Unexpected authentication error. Please try again later.');
            }
        }
        globals.userEmail = username;

        try {
            //check Role
            const workerCollectionRef = collection(firestore, 'Workers');
            const querySnapshot = await getDocs(workerCollectionRef);
            const userData = querySnapshot.docs.find(
                (doc) => doc.data().Email === globals.userEmail
            );

            // If signInWithEmailAndPassword is successful, navigate based on user role
            if (userData.data().Role == 'Admin') {
                navigate('/admin');
            } else {
                navigate('/worker');
            }

        } catch (error) {
            toast.error('There is no worker with that email or role is invalid');
        }


    };

    return (
        <div className="login-container">
            <ToastContainer />
            <h2>Login</h2>
            <form>
                <label>
                    Username:
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </label>
                <label>
                    Password:
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </label>
                <button type="button" onClick={handleLogin}>
                    Login
                </button>
            </form>
        </div>
    );
};

export default LoginPage;
