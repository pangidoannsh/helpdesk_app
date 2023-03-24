import Head from 'next/head';
import { LayoutProps } from './layout.interface';

export default function Dashboard(props: LayoutProps) {
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
