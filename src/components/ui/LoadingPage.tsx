import { Icon } from '@iconify/react'
import React from 'react'
import styles from '../../styles/loading.module.css'

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
}
