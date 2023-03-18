import Head from 'next/head';
import { ReactNode } from 'react'

interface CommonLayoutProps {
    children: ReactNode;
    title: string;
    content?: string;
}
export default function Common(props: CommonLayoutProps) {
    return (
        <>
            <Head>
                <title>{props.title}</title>
                <meta name="description" content={props.content} />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/bps.svg" />
            </Head>
            <main>
                {props.children}
            </main>
        </>
    )
}
