import { Icon } from '@iconify/react'
import { useRouter } from 'next/router'
import React from 'react'

export default function ScreenAlert(props: { mode: string }) {
    const router = useRouter();

    return (
        <div className={`${props.mode === "ready" || router.pathname.includes('dashboard') ? 'hidden' : ''} 
        lg:w-1/3 md:w-1/2 w-5/6 left-1/2 -translate-x-1/2 rounded-lg text-2xl z-40
        p-6 h-80 text-yellow-700 bg-yellow-100 fixed top-24 flex flex-col items-center`}>
            <Icon icon="mdi:warning-circle" className='text-9xl' />
            Sistem masih dalam maintenance, anda tidak dapat melakukan pembuatan tiket ataupun sebagainya,
            harap lakukan lagi dilain waktu Terimakasiih
        </div>
    )
}
