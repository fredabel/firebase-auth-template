
import { useState } from 'react'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { signOut } from "firebase/auth";
import { useNavigate, NavLink } from 'react-router-dom';
import { useAuth} from '../context/AuthContext';
import { auth } from '../lib/firebase/firebaseConfig';
import ErrorDialog from './ErrorDialog';

const Navbar: React.FC = () =>  {

    const navigate = useNavigate();
    const {user} = useAuth();

    const [errorOpen, setErrorOpen] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string>('Logout error!');

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/login')
        } catch (err) {
            const msg = err instanceof Error ? err.message : "Logout error!";
            setErrorMsg(msg);
            setErrorOpen(true);
        }
    };

    return (
        <div className="bg-white">
            <header className="absolute inset-x-0 top-0 z-50">
                <nav aria-label="Global" className="flex items-center justify-between p-6 lg:px-8">
                    <div className="flex lg:flex-1">
                        <NavLink to="/">
                        <span className="sr-only">FBAuth Template</span>
                        <img
                            alt=""
                            src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
                            className="h-8 w-auto"
                        />
                        </NavLink>
                        
                    </div>
                    <div className=" lg:flex lg:flex-1 lg:justify-end">
                        {
                            !user ? (
                                <NavLink to="/login" className="text-sm/6 font-semibold text-gray-900">
                                    Log in <span aria-hidden="true">&rarr;</span>
                                </NavLink>
                            ): (
                                <Menu as="div" className="relative inline-block">
                                    <MenuButton className="inline-flex w-full justify-center text-sm ">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-8">
                                            <path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" clipRule="evenodd" />
                                        </svg>
                                    </MenuButton>
                                    <MenuItems transition
                                        className="absolute right-0 z-10 w-50 origin-top-right rounded-md bg-white shadow-lg outline-1 outline-black/5 transition data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
                                        >
                                        <div className="py-1">
                                            <MenuItem>
                                                <p className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden">{user.email}</p>
                                            </MenuItem>
                                            <MenuItem>
                                                <NavLink to="/profile" className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden">Profile</NavLink>
                                            </MenuItem>
                                            <MenuItem
                                                as="button"
                                                onClick={handleLogout}
                                                className="cursor-pointer block w-full rounded px-3 py-2 text-left text-red-600 hover:text-red-500 data-[focus]:bg-red-50"
                                                >
                                                Logout
                                            </MenuItem>
                                        </div>
                                    </MenuItems>
                                </Menu>
                            )
                        }
                    </div>
                </nav>
            </header>
            <ErrorDialog
                open={errorOpen}
                onClose={() => { setErrorOpen(false); setErrorMsg(''); }}
                message={errorMsg}
            />
        </div>
    )
}

export default Navbar