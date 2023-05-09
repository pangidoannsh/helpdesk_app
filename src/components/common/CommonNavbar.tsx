import { AlertContext } from '@/context/AlertProvider';
import { UserContext } from '@/context/UserProvider'
import { Icon } from '@iconify/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useContext, useState } from 'react'
import Profile from './Profile';

interface CommonNavbarProps {
    setOpenLoginModal: (isOpenLoginModal: boolean) => void;
    setLoadingPage: (loadingPage: boolean) => void;
}
export default function CommonNavbar({ setOpenLoginModal, setLoadingPage }: CommonNavbarProps) {
    const { alert, setAlert } = useContext(AlertContext);
    const router = useRouter();

    const { user, setUser } = useContext(UserContext);

    function handleClick(path: string) {
        setTimeout(() => {
            setLoadingPage(router.pathname !== path)
        }, 100);
        router.push(path);
    }
    return (
        <nav className='flex md:py-4 py-2 px-4 md:px-12 justify-between helpdesk-shadow-24 font-open-sans sticky top-0 left-0
        bg-white z-20'>
            {/* Mobile */}
            <button className='block md:hidden'>
                <Icon icon="material-symbols:menu-rounded" className='text-primary-600 text-4xl' />
            </button>
            <Link href="/" className="flex gap-4 items-center">
                <img src="/bps.svg" alt="bps logo" className='w-10 md:w-auto' />
                <span className='font-open-sans hidden md:block text-2xl text-primary-600'>HELPDESK BPS Riau</span>
            </Link>
            {/* Mobile */}
            {!user.id ?
                <div className="md:hidden">
                    <button onClick={() => setOpenLoginModal(true)}
                        className='py-2 px-4 bg-primary-600 rounded text-white uppercase'>
                        login
                    </button>
                </div> : ''
            }
            <div className="md:flex hidden gap-9 font-open-sans uppercase items-center text-primary-600">
                <button onClick={() => handleClick("/faq")}
                    className={`${router.pathname === '/faq' ? 'font-semibold' : ''} uppercase`}>
                    faq
                </button>
                {!user.id ?
                    <button onClick={() => setOpenLoginModal(true)}
                        className='py-2 px-4 common-button uppercase'>
                        login
                    </button>
                    : <>
                        <button onClick={() => handleClick('/create-ticket')}
                            className={`${router.pathname.includes('/layanan') ? 'font-semibold' : ''} uppercase`}>
                            Buat Tiket
                        </button>
                        <button onClick={() => handleClick('/ticket')}
                            className={`${router.pathname.includes('/ticket') ? 'font-semibold' : ''} uppercase`}>
                            Lihat Tiket
                        </button>
                        {(user.level === 'agent' || user.level === 'supervisor') ?
                            <button onClick={() => handleClick("/dashboard")} className="uppercase">
                                Dashboard
                            </button> : ''}
                    </>
                }
            </div>
            {user.id ? <Profile /> : ''}
        </nav>
    )
}
