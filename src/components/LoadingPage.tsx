import { Icon } from '@iconify/react'
import React from 'react'
import styles from '../styles/loading.module.css'

interface LoadingPageProps {
    type?: string
}
export default function LoadingPage(props: LoadingPageProps) {
    return (
        <div className="fixed inset-0 flex items-center justify-center">
            <div className={styles['lds-ring']}>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
        </div>
    )
    return (
        props.type === "dashboard" ?
            <div className='fixed inset-0  flex items-center justify-center'>
                <Icon icon="eos-icons:loading" className='text-9xl text-primary-600 z-50' />
            </div> :
            <div className='fixed inset-0  flex items-center justify-center'>
                <Icon icon="mingcute:loading-fill" className='text-9xl text-primary-600 z-50 animate-spin' />
            </div>
    )
}
