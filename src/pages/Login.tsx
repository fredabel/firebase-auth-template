import React, { useState, useEffect } from "react";
import { signInWithEmailAndPassword, sendPasswordResetEmail  } from "firebase/auth";
import { auth } from '../lib/firebase/firebaseConfig'
import { FirebaseError } from "firebase/app";
import { useNavigate } from 'react-router-dom';
import SuccessDialog from '../components/SuccessDialog';

const Login: React.FC = () => {
    const navigate = useNavigate()
    function mapFirebaseError(err: FirebaseError) {
        switch (err.code) {
            case "auth/invalid-credential": return "Invalid credential.";
            case "auth/invalid-email": return "Invalid email address.";
            case "auth/user-not-found": return "No account found for that email.";
            case "auth/email-already-in-use": return "That email is already registered.";
            case "auth/weak-password": return "Password should be at least 6 characters.";
            case "auth/operation-not-allowed": return "Email/password sign-in is disabled in Firebase.";
            case "auth/invalid-api-key": return "Your Firebase API key is invalid. Check env values.";
            case "auth/missing-email": return "Enter your email to reset your password.";
            case "auth/too-many-requests": return "Too many attempts. Try again later.";

            default: return err.message;
        }
    }

    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string | null>(null);
    const [info, setInfo] = useState<string | null>(null);
    const [resetting, setResetting] = useState(false);

    const [successOpen, setSuccessOpen] = useState(false);
    const [successMsg, setSuccessMsg] = useState<string>('You have successfully logged in!');


    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            setError(null)
            setSuccessOpen(true);
        } catch (err) {
            const fe = err as FirebaseError;
            console.error("Auth error:", fe.code, fe.message);
            setError(mapFirebaseError(fe));
        }
    };

    // Redirect after the success message
    useEffect(() => {
        if (!successOpen) return;
        const t = setTimeout(() => {
            setSuccessOpen(false);
            navigate('/profile');
        }, 3000);
        return () => clearTimeout(t);
    }, [successOpen, navigate]);

    const handleForgotPassword =  async () => {
        setError(null);
        setInfo(null);
        if (!email) {
            setError("Enter your email to reset your password.");
            return;
        }
        setResetting(true);
        try{
            await sendPasswordResetEmail(auth, email)
            setInfo("Password reset email sent. Check your inbox and follow the link to set a new password.");

        }catch(err){
            const fe = err as FirebaseError;
            console.error("Auth error:", fe.code, fe.message);
            setError(mapFirebaseError(fe));
        }finally{
            setResetting(false);
        }
    }

    return (
        <div className="relative isolate px-6 pt-5 lg:px-8">
            <div className="mx-auto max-w-2xl py-20 sm:py-20 lg:py-20">
                <div className="flex flex-col justify-center px-6 py-12 lg:px-8">
                    <div className="text-center sm:mx-auto sm:w-full sm:max-w-sm">
                        <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">Hello, Welcome Back!</h2>
                        <p className="mt-1 text-pretty text-gray-500 ">
                            Sign in or Sign up to this firebase auth template.
                        </p>
                    </div>
                    <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                        <form  onSubmit={handleLogin} className="space-y-6">
                            <div>
                                <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
                                    Email
                                </label>
                                <div className="mt-2">
                                    <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    autoComplete="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                    />
                                </div>
                            </div>
                            <div>
                                <div className="flex items-center justify-between">
                                    <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">
                                        Password
                                    </label>
                                    <div className="text-sm">
                                        <a onClick={handleForgotPassword} className="cursor-pointer font-semibold text-indigo-600 hover:text-indigo-500">
                                            { resetting ? "Sending…" : "Forgot password?"}
                                        </a>
                                    </div>
                                </div>
                                <div className="mt-2">
                                    <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    autoComplete="current-password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                    />
                                </div>
                            </div>
                            <div>
                                <button
                                    type="submit"
                                    className="cursor-pointer flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                >
                                    Sign in
                                </button>
                            </div>
                            <div className="flex items-center gap-1 ">
                                <span className="block text-sm/6  text-gray-500">
                                    Don't have an account?
                                </span>
                                <a className="cursor-pointer text-sm/6 font-bold text-indigo-600 hover:text-indigo-500 " onClick={()=> navigate('/register')}>Sign Up</a>
                            </div>

                            {/* {Information Messages} */}

                            { 
                                info && (
                                    <div role="status" className="rounded-md border border-green-200 bg-green-50 p-3">
                                        <div className="text-sm text-green-800">{info}</div>
                                    </div>
                                )
                            }

                            {/* {Error Messages} */}
                            {

                                error  && (
                                    <div
                                        role="alert"
                                        className="mx-auto max-w-4xl rounded-md  bg-red-100 p-3"
                                    >
                                        <div className="flex items-start gap-3">
                                        
                                            <svg
                                                className="mt-0.5 h-5 w-5 flex-none text-red-500"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                                aria-hidden="true"
                                            >
                                                <path
                                                d="M10.88 2.63a1 1 0 0 0-1.76 0l-7.5 13.5A1 1 0 0 0 2.5 18h15a1 1 0 0 0 .88-1.87l-7.5-13.5ZM10 7a1 1 0 0 1 1 1v3a1 1 0 1 1-2 0V8a1 1 0 0 1 1-1Zm0 8a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5Z"
                                                />
                                            </svg>

                                            <div className="min-w-0">
                                                <p className="text-sm leading-6 text-red-500">{error}</p>
                                            </div>
                                        </div>
                                    </div>
                                )
                            }
                        </form>
                    </div>
                </div>
            </div>
            <SuccessDialog
                open={successOpen}
                onClose={() => { setSuccessOpen(false); setSuccessMsg('You have successfully logged in!'); }}
                message={successMsg}
                redirect='/profile'
            />
        </div>
    );
}
export default Login;