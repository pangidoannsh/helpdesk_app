import { UserContext } from '@/context/UserProvider';
import { Icon } from '@iconify/react'
import Cookies from 'js-cookie';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useContext, useState } from 'react'

interface ProfileProps {
    setAlert: (alert: any) => void;
}
export default function Profile({ setAlert }: ProfileProps) {
    const { user, setUser } = useContext(UserContext);
    const router = useRouter();
    const [drop, setDrop] = useState(false);
    function handleLogout() {
        Cookies.remove('jwt');
        setUser({});
        if (router.pathname !== "/") {
            let time = 3;
            setAlert({
                isActived: true,
                code: 1,
                title: "Success",
                message: "Logout Berhasil! redirect to home : " + time
            })
            const interval = setInterval(() => {
                setAlert({
                    isActived: true,
                    code: 1,
                    title: "Success",
                    message: "Logout Berhasil! redirect to home : " + time
                })
                time--;
                if (time === 0) {
                    clearInterval(interval)
                }
            }, 1000)

            setTimeout(() => {
                router.push("/");
            }, 4000);
        }
    }
    return (
        <div className='relative'>
            <button className='flex gap-2 items-center text-primary-600' onClick={() => setDrop(prev => !prev)}>
                <Icon icon="ic:baseline-account-circle" className='text-4xl' />
                <span className='uppercase sm:inline hidden'>Hello, {user.name?.split(" ")[0]}!</span>
            </button>
            {drop ?
                <div className="profile-drop shadow text-sm">
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
