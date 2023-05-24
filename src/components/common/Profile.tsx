import { UserContext } from '@/context/UserProvider';
import { Icon } from '@iconify/react'
import Cookies from 'js-cookie';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useContext, useState } from 'react'
import { AlertContext } from '@/context/AlertProvider';
export default function Profile() {
    const { setAlert, closeAlert } = useContext(AlertContext)
    const { user, setUser } = useContext(UserContext);
    const router = useRouter();
    const [drop, setDrop] = useState(false);
    function handleLogout() {
        Cookies.remove('jwt');
        setUser({});
        setAlert({
            isActived: true,
            code: 1,
            title: "Success",
            message: "Logout Berhasil!"
        })
        setTimeout(() => {
            closeAlert();
        }, 2000);
        if (router.pathname !== "/") router.push("/");
    }
    return (
        <div className='relative'>
            <button className='flex gap-2 items-center text-primary-600' onClick={() => setDrop(prev => !prev)}>
                <Icon icon="ic:baseline-account-circle" className='text-4xl' />
                <span className='uppercase lg:inline hidden'>Hello, {user.name?.split(" ")[0]}!</span>
            </button>
            {drop ?
                <div className="profile-drop md:left-0 -left-full -ml-6 md:ml:0 shadow text-sm">
                    <Link href="/profile" className='text-slate-500 mb-4 flex items-center gap-1 hover:text-primary-600'>
                        <Icon icon="fa6-solid:user-gear" className='text-lg' />
                        <span>PROFILE</span>
                    </Link>
                    <button onClick={handleLogout}
                        className='text-slate-500 flex items-center gap-1 hover:text-red-600'>
                        <Icon icon="material-symbols:logout" className='text-xl' />
                        <span>LOGOUT</span>
                    </button>
                </div> : ''
            }
        </div>

    )
}
