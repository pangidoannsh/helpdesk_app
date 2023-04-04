import { Button } from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import Select from "@/components/ui/Select";
import { UserContext } from "@/context/UserProvider";
import CommonLayout from "@/components/layouts/Common";
import AuthApi from "@/services/authApi";
import { Icon } from "@iconify/react";
import { useRouter } from "next/router";
import { useContext, useEffect, useRef, useState } from "react";
import CreateTicket from "../CreateTicket";
import ContentLayanan from "./ContentLayanan";
import Search from "@/components/dashboard/ticket/Search";
import Card from "@/components/Card";

const dummyOptionsStatus = [
    { value: 1, display: "diminta" },
    { value: 2, display: "diproses" },
    { value: 3, display: "selesai" },
    { value: 4, display: "kadarluarsa" },
]
const dummyOptionsPriority = [
    { value: 1, display: "High" },
    { value: 2, display: "Medium" },
    { value: 3, display: "Low" },
]
const dummyOptionsCategories = [
    { value: 1, display: "Gangguan" },
    { value: 2, display: "Permintaan" },
]

interface LayananProps {
    listLayanan?: any;
    detailLayanan?: any;
}
export default function Layanan(props: LayananProps) {
    const { user, setUser } = useContext(UserContext);
    const [loadingDetail, setloadingDetail] = useState(false);
    const [listLayanan, setListLayanan] = useState(props.listLayanan)
    const router = useRouter();
    const { slug } = router.query;
    const filterSection = useRef<any>();
    const [isOpenCreate, setIsOpenCreate] = useState(false);
    const [detailLayanan, setDetailLayanan] = useState<any>();
    const handleOpenModalCreate = () => {
        setIsOpenCreate(true);
    }

    function handleSearch(query: string) {
        AuthApi.get(`/ticket/user?${query}`).then(res => {
            setListLayanan(res.data)
        }).catch(err => {
            console.log(err.response);
        })
    }
    useEffect(() => {
        if (slug) {
            filterSection.current.scrollIntoView({ behavior: 'auto' });
        }
    }, [])

    useEffect(() => {
        const dataLayanan = listLayanan.find((data: any) => data.slug.toString() === slug);

        if (slug) {
            AuthApi.get(`/ticket-message/${dataLayanan.id}`).then((res: any) => {
                setDetailLayanan({
                    ...dataLayanan, message: res.data
                });
            }).catch(err => {
                console.log(err.response);
            })
        }

    }, [slug]);

    return (
        <CommonLayout title='Layanan | HELPDESK BPS Riau' content='layanan helpdesk bps riau'>
            <div className="flex flex-col gap-6 bg-[#F8F8F8] px-2 md:px-12 xl:px-36 py-6">
                {/* Card Pengajuan Layanan */}
                <Card className="flex flex-col p-6 md:p-9 gap-4 rounded-lg">
                    <h2 className='uppercase text-2xl md:text-4xl font-bold text-primary-700'>perlu layanan bantuan ?</h2>
                    <div className='flex justify-center'>
                        <Icon icon="mdi:customer-service" className='text-9xl text-primary-600' />
                    </div>
                    <p className='font-open-sans text-xl text-slate-600'>
                        Ajukan keperluan atau pelayanan yang kamu inginkan di sini.
                    </p>
                    <Button onClick={handleOpenModalCreate}
                        className="common-button py-3">
                        AJUKAN LAYANAN
                    </Button>
                </Card>
                {/* Card Filter Layanan */}
                <Search refrence={filterSection} border="rounded-lg" functionSearch={handleSearch} withoutFungsi />

                <ContentLayanan datas={listLayanan} detail={detailLayanan} refSection={filterSection} setDetail={setDetailLayanan}
                    loadingDetail={loadingDetail} />
            </div>

            <Modal isOpen={isOpenCreate} setIsOpen={setIsOpenCreate} title="AJUKAN LAYANAN BARU" rounded="rounded-lg">
                <CreateTicket setIsOpen={setIsOpenCreate} setListData={setListLayanan} />
            </Modal>
        </CommonLayout>
    )
}