import { api } from '@/config/api';
import { parseCookies } from 'nookies';
import Layanan from '@/components/common/layanan/Layanan';
import { Suspense } from 'react';

interface LayananPageProps {
    listLayanan?: any;
}
export default function LayananPage(props: LayananPageProps) {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Layanan listLayanan={props.listLayanan} />
        </Suspense>
    )
}

export async function getServerSideProps(context: any) {
    const token = parseCookies(context).jwt;
    if (!token) {
        return {
            redirect: {
                destination: "/403",
                permanent: false,
            },
        };
    }

    let listLayanan: any = [];
    await api.get("/ticket/user?status=open", {
        headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
        listLayanan = res.data
    }).catch(err => {

    })

    return {
        props: {
            listLayanan: listLayanan ? listLayanan : []
        }
    }
}