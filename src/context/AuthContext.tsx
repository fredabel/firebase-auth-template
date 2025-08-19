import { useState, createContext, useContext, type ReactNode, useReducer, useEffect } from "react";
import { onAuthStateChanged, type User, reload  } from "firebase/auth";
import { auth, db } from '../lib/firebase/firebaseConfig'
import { doc, onSnapshot } from "firebase/firestore";

type AppUserProfile = {
  firstName: string;
  lastName?: string;
  about?: string;
  email: string;
};

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

    // Live profile doc subscription (updates UI immediately after edits)
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

    // For when you update displayName/photoURL via updateProfile(...)
    const reloadUser = async () => {
        if (auth.currentUser) {
        await reload(auth.currentUser);
        // setUser ensures context consumers re-render with the refreshed user object
        setUser(auth.currentUser);
        }
    };

    // useEffect(() =>{
    //     const unsubscribe = onAuthStateChanged(auth, (user) => {
    //         if(user){
    //             setUser(user);
    //         }else{
    //             setUser(null)
    //         }
    //     })
    //     return ()  => unsubscribe();
    // },[])

    return (
        <AuthContext.Provider value={{user, profile, profileLoading, reloadUser}}>
            {children}
        </AuthContext.Provider>
    )
}
export const useAuth = () => useContext(AuthContext);
export default AuthContext