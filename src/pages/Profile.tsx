import React, { useState, useEffect } from "react";
import { useAuth} from '../context/AuthContext';
import { db } from '../lib/firebase/firebaseConfig'
import { doc, getDoc } from "firebase/firestore";

import type { UserProfile } from '../models/User.model'
import ErrorDialog from '../components/ErrorDialog';
import { PencilIcon } from '@heroicons/react/24/outline';
import { useNavigate } from "react-router-dom";

const Profile: React.FC = () => {

    const navigate = useNavigate()
    const {user} = useAuth();
    const [profile, setProfile] = useState<UserProfile | null>(null)
    const [errorOpen, setErrorOpen] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string>('User profile error!');

    useEffect(() => {

        if (!user?.uid) return;
        let cancelled = false;

        ( async () => {
            try{
                const docSnap = await getDoc(doc(db, "users", user.uid));
                if (!cancelled) {
                    if (docSnap.exists()) {
                        setProfile(docSnap.data() as UserProfile);
                    } else {
                        setProfile(null); 
                        setErrorMsg('User does not exist!');
                        setErrorOpen(true);
                    }
                }
            } catch (e) {
                if (!cancelled) {
                    if (e instanceof Error) return e.message;  
                }
            }
        })()

        return () => { cancelled = true; };

    },[user])

    return (
        <div className="relative isolate px-6 pt-5 lg:px-8">
            <div className="mx-auto max-w-2xl py-56 sm:py-48 lg:py-56">
                {
                    user ? (
                       <div>
                            <div className="flex justify-between">
                                <div className="px-4 sm:px-0">
                                    <h3 className="text-base/7 font-semibold text-gray-900">Profile Information</h3>
                                    <p className="mt-1 max-w-2xl text-sm/6 text-gray-500">This is your profile information page.</p>
                                </div>
                                <div className="flex gap-1 px-4 sm:px-0 items-center cursor-pointer">
                                    <PencilIcon className="size-4 font-bold text-indigo-600 hover:text-indigo-500" /> 
                                    <a className=" text-sm/6 font-bold text-indigo-600 hover:text-indigo-500 " onClick={()=> navigate('/profile/edit')}> Edit</a>
                                </div>
                            </div>
                            <div className="mt-6 border-t border-gray-100">
                                <dl className="divide-y divide-gray-100">
                                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                        <dt className="text-sm/6 font-medium text-gray-900">First name</dt>
                                        <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">{profile?.firstName }</dd>
                                    </div>
                                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                        <dt className="text-sm/6 font-medium text-gray-900">Last name</dt>
                                        <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">{profile?.lastName}</dd>
                                    </div>
                                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                        <dt className="text-sm/6 font-medium text-gray-900">Email address</dt>
                                        <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">{profile?.email}</dd>
                                    </div>
                                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                        <dt className="text-sm/6 font-medium text-gray-900">About</dt>
                                        <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
                                        {profile?.about}
                                        </dd>
                                    </div>
                                </dl>
                            </div>
                        </div>
                    ) : ''
                }
            </div>
            <ErrorDialog
                open={errorOpen}
                onClose={() => {}}
                title="User profile error"
                message={errorMsg}
                redirect='/'
            />
        </div>
    )
}
export default Profile;