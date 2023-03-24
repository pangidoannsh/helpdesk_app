import CommonNavbar from '@/components/common/CommonNavbar';
import Login from '@/components/common/Login';
import AlertProvider from '@/context/AlertProvider';
import UserProvider, { UserContext } from '@/context/UserProvider';
import Head from 'next/head';
import { useContext, useState } from 'react';
import { LayoutProps } from './layout.interface';

export default function CommonLayout(props: LayoutProps) {
    const [isOpenLogin, setIsOpenLogin] = useState(false);
    return (
        <>
            <Head>
                <title>{props.title}</title>
                <meta name="description" content={props.content} />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/bps.svg" />
            </Head>
            <main>
                <AlertProvider>
                    <CommonNavbar setOpenLoginModal={setIsOpenLogin} />
                    {props.children}
                    <Login isOpen={isOpenLogin} setIsOpen={setIsOpenLogin} />
                </AlertProvider>
            </main>
        </>
    )
}
