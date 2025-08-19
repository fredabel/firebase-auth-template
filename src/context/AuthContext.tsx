import { useState, createContext, useContext, type ReactNode, useEffect } from "react";
import { onAuthStateChanged, type User, reload  } from "firebase/auth";
import { auth, db } from '../lib/firebase/firebaseConfig'
import { doc, onSnapshot } from "firebase/firestore";

import {type AppUserProfile} from '../models/User.model'

interface AuthContextType{
    user: null | User;
    profile: AppUserProfile | null;
    profileLoading: boolean;
    reloadUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    profile: null,
    profileLoading: false,
    reloadUser: async () => {},
});

export const AuthProvider = ({children}: {children: ReactNode}) => {
    const [user, setUser] = useState<User | null>(null)
    const [profile, setProfile] = useState<AppUserProfile | null>(null);
    const [profileLoading, setProfileLoading] = useState(false);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (u) => setUser(u));
        return () => unsub();
    }, []);

    useEffect(() => {
        if (!user?.uid) {
            setProfile(null);
            return;
        }
        setProfileLoading(true);
        const ref = doc(db, "users", user.uid);
        const unsub = onSnapshot(
            ref,
            (snap) => {
                setProfile(snap.exists() ? (snap.data() as AppUserProfile) : null);
                setProfileLoading(false);
            },
            () => setProfileLoading(false)
        );
        return () => unsub();
    }, [user?.uid]);

    const reloadUser = async () => {
        if (auth.currentUser) {
        await reload(auth.currentUser);
        setUser(auth.currentUser);
        }
    };

    return (
        <AuthContext.Provider value={{user, profile, profileLoading, reloadUser}}>
            {children}
        </AuthContext.Provider>
    )
}
export const useAuth = () => useContext(AuthContext);
export default AuthContext