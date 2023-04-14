import Head from 'next/head';
import React, { useState } from 'react';
import DashboardNavbar from '../dashboard/DashboardNavbar';
import Header from '../dashboard/Header';
import LoadingPage from '../ui/LoadingPage';
import { LayoutProps } from './layout.interface';

export default function DashboardLayout(props: LayoutProps) {
    const [loadingPage, setLoadingPage] = useState(false);

    return (
        <>
            <Head>
                <title>{props.title}</title>
                <meta name="description" content={props.content} />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/bps.svg" />
            </Head>
            <main className='bg-dashboard'>
                <DashboardNavbar setLoadingPage={setLoadingPage} />
                <div className='ml-[110px] py-6 px-12 flex flex-col gap-6'>
                    <Header />
                    {loadingPage ? <LoadingPage type="dashboard" /> : props.children}
                </div>
            </main>
        </>
    )
}
