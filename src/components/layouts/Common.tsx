import CommonNavbar from '@/components/common/CommonNavbar';
import Login from '@/components/common/Login';
import Head from 'next/head';
import { useState } from 'react';
import LoadingPage from '../LoadingPage';
import { LayoutProps } from './layout.interface';

export default function CommonLayout(props: LayoutProps) {
    const [isOpenLogin, setIsOpenLogin] = useState(false);
    const [loadingPage, setLoadingPage] = useState(true);
    return (
        <>
            <Head>
                <title>{props.title}</title>
                <meta name="description" content={props.content} />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/bps.svg" />
            </Head>
            <main>
                <CommonNavbar setOpenLoginModal={setIsOpenLogin} setLoadingPage={setLoadingPage} />
                {
                    loadingPage ? <LoadingPage /> : props.children
                }
                <Login isOpen={isOpenLogin} setIsOpen={setIsOpenLogin} />
            </main>
        </>
    )
}
