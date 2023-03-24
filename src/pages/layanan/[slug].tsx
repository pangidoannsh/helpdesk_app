import Layanan from '@/components/common/layanan/Layanan';
import { api } from '@/config/api';
import { parseCookies } from 'nookies';

interface LayananProps {
    listLayanan: any;
}
export default function LayananDetail(props: LayananProps) {

    return (
        <Layanan />
    )
}
// export async function getStaticProps(context: any) {

// }
export async function getServerSideProps(context: any) {
    const token = parseCookies(context).jwt;
    if (!token) {
        return {
            redirect: {
                destination: "/403",
                permanent: false,
            }
        };
    }
    let listLayanan: any = [];
    await api.get("/ticket/user", {
        headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
        listLayanan = res.data;
    }).catch(err => {

    })

    return {
        props: {
            listLayanan: listLayanan ? listLayanan : []
        }
    }
}
