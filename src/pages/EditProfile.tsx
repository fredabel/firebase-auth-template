import React, {useEffect, useState} from 'react'
import { useNavigate } from "react-router-dom"
import { useAuth} from '../context/AuthContext';
import { db } from '../lib/firebase/firebaseConfig'
import { doc, getDoc, setDoc } from "firebase/firestore";

import {type UserEditForm} from '../models/User.model'

import LoadingDialog from '../components/LoadingDialog';
import ErrorDialog from '../components/ErrorDialog';
import SuccessDialog from '../components/SuccessDialog';



const EditProfile: React.FC = () => {

    const navigate = useNavigate()
    const {user} = useAuth();

    const [successOpen, setSuccessOpen] = useState(false);
    const [successMsg, setSuccessMsg] = useState<string>('Success message!');
    const [loading, setLoading] = useState(false)
    const [errorOpen, setErrorOpen] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string>('Error fetching user!');

    const [formData, setFormData] = useState<UserEditForm>({
        firstName: "",
        lastName: "",
        about:  "",
    });

    useEffect(() => {
    
        if (!user?.uid) return;
        let cancelled = false;
    
        ( async () => {
            try{
                const docSnap = await getDoc(doc(db, "users", user.uid));
                if (!cancelled) {
                    if (docSnap.exists()) {
                        const data =  docSnap.data()
                        setFormData({
                            firstName: data.firstName,
                            lastName: data.lastName,
                            about: data.about,
                        })
                    } else {
                        setErrorMsg('User does not exist!');
                        setErrorOpen(true);
                    }
                }
            } catch (e) {
                if (!cancelled) {
                    if (e instanceof Error)
                        setErrorOpen(true);
                        setErrorMsg("Something went wrong."); 
                }
            }
        })()
    
        return () => { cancelled = true; };
    
    },[user])

    const handleSaveProfile: React.FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault()
        if (!user?.uid) {
            setErrorMsg("You must be signed in.");
            setErrorOpen(true);
            return;
        }
        try {
            setLoading(true);
            // Merge to avoid wiping other server-side fields
            await setDoc(doc(db, "users", user.uid), formData, { merge: true });
            setSuccessMsg("Profile has been updated successfully!");
            setSuccessOpen(true);
        } catch (e: unknown) {
            const msg = e instanceof Error ? e.message : String(e);
            setErrorMsg(msg || "Failed to update profile.");
            setErrorOpen(true);
        } finally {
            setLoading(false);
        }
    }

    const handleChange: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>  = (e) => {
        const { name, value } = e.target ;
        setFormData({ ...formData, [name]: value });
    }

    return (
        <div className="relative isolate px-6 pt-5 lg:px-8">
            <div className="mx-auto max-w-2xl py-30 sm:py-40 lg:py-30">
                <form onSubmit={handleSaveProfile}>
                <div className="space-y-12">
                    <div className="border-b border-gray-900/10 pb-12">
                        <h2 className="text-base/7 font-semibold text-gray-900">Personal Information</h2>
                        <p className="mt-1 text-sm/6 text-gray-600">Try to edit your personal information here.</p>
                    </div>

                    <div className="border-b border-gray-900/10 pb-12">
                        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                            <div className="sm:col-span-3">
                            <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
                                Email address
                            </label>
                            <div className="mt-2">
                               <p className="block text-sm/6 font-medium text-gray-900">{user?.email}</p>
                            </div>
                            </div>
                        </div>
                
                        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                        <div className="sm:col-span-3">
                            <label htmlFor="firstName" className="block text-sm/6 font-medium text-gray-900">
                                First name
                            </label>
                            <div className="mt-2">
                                <input
                                id="firstName"
                                name="firstName"
                                type="text"
                                autoComplete="given-name"
                                value={formData.firstName}
                                onChange={handleChange}
                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                />
                            </div>
                        </div>

                        <div className="sm:col-span-3">
                            <label htmlFor="lastName" className="block text-sm/6 font-medium text-gray-900">
                                Last name
                            </label>
                            <div className="mt-2">
                                <input
                                id="lastName"
                                name="lastName"
                                type="text"
                                autoComplete="family-name"
                                value={formData.lastName}
                                onChange={handleChange}
                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                />
                            </div>
                        </div>
                        <div className="col-span-full">
                            <label htmlFor="about" className="block text-sm/6 font-medium text-gray-900">
                                About
                            </label>
                            <div className="mt-2">
                                <textarea
                                id="about"
                                name="about"
                                rows={3}
                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                value={formData.about}
                                onChange={handleChange}
                                />
                            </div>
                            <p className="mt-3 text-sm/6 text-gray-600">Write a few sentences about yourself.</p>
                        </div>
                        </div>
                    </div>
                </div>
                <div className="mt-6 flex items-center justify-end gap-x-6">
                    <button type="button" className="cursor-pointer text-sm/6 font-semibold text-gray-900" onClick={()=> {navigate('/profile')}}>
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="cursor-pointer rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        Save
                    </button>
                </div>
                </form>
            </div>
            
            <LoadingDialog open={loading} onClose={() => { /*Do nothing*/}}/>

            <ErrorDialog
                open={errorOpen}
                onClose={() => {}}
                title="User profile error"
                message={errorMsg}
                redirect='/'
            />

            <SuccessDialog
                open={successOpen}
                onClose={() => { setSuccessOpen(false); setSuccessMsg('Profile has been updated successfully!'); }}
                message={successMsg}
                redirect="/profile"
            />
            
        </div>
  )
}

export default EditProfile