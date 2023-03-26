import Head from 'next/head';
import DashboardNavbar from '../dashboard/DashboardNavbar';
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
            <main className='bg-dashboard'>
                <DashboardNavbar />
                <div className='ml-[110px]'>{props.children}</div>
            </main>
        </>
    )
}
