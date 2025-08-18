import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from '../lib/firebase/firebaseConfig'
import {doc, setDoc, serverTimestamp } from 'firebase/firestore';

import { FirebaseError } from "firebase/app";
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

import type { FormData } from '../models/Register.model'
import SuccessDialog from '../components/SuccessDialog';
import LoadingDialog from '../components/LoadingDialog';

const Register = () => {

    const navigate = useNavigate();

    const [successOpen, setSuccessOpen] = useState(false);
    const [successMsg, setSuccessMsg] = useState<string>('Success message!');

    function mapFirebaseError(err: FirebaseError) {
        switch (err.code) {
            case "auth/invalid-email": return "Invalid email address.";
            case "auth/email-already-in-use": return "That email is already registered.";
            case "auth/weak-password": return "Password should be at least 6 characters.";
            case "auth/operation-not-allowed": return "Email/password sign-in is disabled in Firebase.";
            case "auth/invalid-api-key": return "Your Firebase API key is invalid. Check env values.";
            case "auth/missing-email": return "Enter your email to reset your password.";
            case "auth/too-many-requests": return "Too many attempts. Try again later.";

            default: return err.message;
        }
    }


    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null);
    const [info, setInfo] = useState<string | null>(null);

    const [formData, setFormData] = useState<FormData>({
        email: '',
        password: '',  
    });

    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);


    // Redirect after the success message
    useEffect(() => {
        if (!successOpen) return;
        const t = setTimeout(() => {
            setSuccessOpen(false);
            navigate('/');
        }, 3000);
        return () => clearTimeout(t);
    }, [successOpen, navigate]);

    const handleChange: React.ChangeEventHandler<HTMLInputElement>  = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    }

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault()

        if (formData.password !== confirmPassword) {
            setError('Passwords do not match.');
            setInfo(null);
            return;
        }
        setLoading(true)
        setError(null)
        try {
            const cred = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
            const u = cred.user;
            // Seed Firestore user doc (optional). If it fails, don’t block signup success.
            try {
                await setDoc(doc(db, 'users', u.uid), {
                    email: u.email,
                    firstName: '',
                    lastName: '',
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp(),
                }, { merge: true });
            
            setSuccessOpen(true);
            } catch (seedErr) {
                console.warn('User created, but failed to seed Firestore profile:', seedErr);
                //Set a non-blocking info message
                setInfo('Account created, but profile couldn’t be saved. You can complete it later.');
            }
        } catch (err) {
            const fe = err as FirebaseError;
            console.error("Auth error:", fe.code, fe.message);
            setError(mapFirebaseError(fe));
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="relative isolate px-6 pt-5 lg:px-8">
            <div className="mx-auto max-w-2xl py-20 sm:py-20 lg:py-20">
                <div className="flex flex-col justify-center px-6 py-12 lg:px-8">
                    <div className="text-center sm:mx-auto sm:w-full sm:max-w-sm">
                        <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">Create an account</h2>
                        <p className="mt-1 text-pretty text-gray-500 ">
                            Welcome to firebase auth template.
                        </p>
                    </div>
                
                    <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                        <form  onSubmit={handleRegister} className="space-y-6">
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
                                    value={formData.email} 
                                    onChange={handleChange}
                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                    />
                                </div>
                            </div>
                            <div>
                                <div>
                                    <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">
                                        Password
                                    </label>
                                    
                                </div>
                                <div className="mt-2 relative">
                                    <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    autoComplete="current-password"
                                    value={formData.password} 
                                    onChange={handleChange}
                                    className="pr-10 block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword((v) => !v)}
                                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                                        className="cursor-pointer absolute inset-y-0 right-0 flex items-center pr-2 text-gray-500 hover:text-gray-700"
                                    >
                                        {showPassword ? <EyeSlashIcon className="size-5"  /> : <EyeIcon className="size-5" />}

                                    </button>
                                </div>
                            </div>
                            {/* Confirm Password with show/hide */}
                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm/6 font-medium text-gray-900">
                                Confirm password
                                </label>
                                <div className="mt-2 relative">
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type={showConfirm ? 'text' : 'password'}
                                    required
                                    autoComplete="new-password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="pr-10 block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirm((v) => !v)}
                                    aria-label={showConfirm ? 'Hide confirm password' : 'Show confirm password'}
                                    className="cursor-pointer  absolute inset-y-0 right-0 flex items-center pr-2 text-gray-500 hover:text-gray-700"
                                >
                                    {showConfirm ? <EyeSlashIcon className="size-5" /> : <EyeIcon className="size-5" />}
                                </button>
                                </div>
                                    {
                                        confirmPassword && formData.password !== confirmPassword && (
                                            <p className="mt-1 text-xs text-red-600">Passwords do not match.</p>
                                        )
                                    }
                            </div>
                            <div className="mt-10">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="cursor-pointer flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                >
                                    Sign Up
                                </button>
                            </div>
                            <div className="flex items-center gap-1 ">
                                <span className="block text-sm/6  text-gray-500">
                                    Already have an account?
                                </span>
                                <a className="cursor-pointer text-sm/6 font-semibold text-indigo-600 hover:text-indigo-500 " onClick={()=> navigate('/login')}>Login</a>
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

            <LoadingDialog open={loading} onClose={() => { /*Do nothing*/}}/>

            <SuccessDialog
                open={successOpen}
                onClose={() => { setSuccessOpen(false); setSuccessMsg('You have successfully created an account!'); }}
                message={successMsg}
                redirect="/"
            />
        </div>
       
    )
}
export default Register;