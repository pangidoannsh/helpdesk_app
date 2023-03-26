import { Button } from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import Select from "@/components/ui/Select";
import { UserContext } from "@/context/UserProvider";
import CommonLayout from "@/components/layouts/Common";
import AuthApi from "@/services/authService";
import { Icon } from "@iconify/react";
import { useRouter } from "next/router";
import { useContext, useEffect, useRef, useState } from "react";
import CreateTicket from "../CreateTicket";
import ContentLayanan from "./ContentLayanan";

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
    const [statusFilter, setStatusFilter] = useState({ value: null, display: "Status" });
    const [priorityFilter, setPriorityFilter] = useState({ value: null, display: "Prioritas" });
    const [categoryFilter, setCategoryFilter] = useState({ value: null, display: "Kategori" });
    const subjectInputRef = useRef<HTMLInputElement>(null);
    const handleOpenModalCreate = () => {
        setIsOpenCreate(true);
    }
    useEffect(() => {
        if (slug) {
            filterSection.current.scrollIntoView({ behavior: 'auto' });
        }
    }, [])

    useEffect(() => {
        const dataLayanan = listLayanan.find((data: any) => data.slug.toString() === slug);

        if (slug) {
            // setloadingDetail(true);
            AuthApi.get(`/ticket-message/${dataLayanan.id}`).then((res: any) => {
                setDetailLayanan({
                    ...dataLayanan, message: res.data
                });
            }).catch(err => {
                console.log(err.response);
            })
            // .finally(() => setloadingDetail(false))
        }

    }, [slug]);

    return (
        <CommonLayout title='Layanan | HELPDESK BPS Riau' content='layanan helpdesk bps riau'>
            <div className="flex flex-col gap-6 bg-[#F8F8F8] px-2 md:px-12 xl:px-36 py-6">
                {/* Card Pengajuan Layanan */}
                <div className="flex flex-col p-6 md:p-9 gap-4 shadow bg-white rounded">
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
                </div>

                {/* Card Filter Layanan */}
                <div className="flex flex-col p-6 md:p-9 gap-4 shadow bg-white rounded" ref={filterSection} id="status-layanan">
                    <h2 className='uppercase text-2xl md:text-4xl font-bold text-primary-700'>status layanan</h2>
                    <div className="hidden md:grid  grid-cols-5 gap-4">
                        <Input placeholder='Subjek' inputRef={subjectInputRef} icon="ic:baseline-search" className='rounded text-sm' />
                        <Select useSelect={[statusFilter, setStatusFilter]} options={dummyOptionsStatus} icon="fluent:status-16-filled"
                            className='rounded' />
                        <Select useSelect={[priorityFilter, setPriorityFilter]} options={dummyOptionsPriority}
                            icon="material-symbols:priority" className='rounded' />
                        <Select useSelect={[categoryFilter, setCategoryFilter]} options={dummyOptionsCategories}
                            icon="bxs:category" className='rounded' />
                        <Button className='common-button py-2'>Cari</Button>
                    </div>
                </div>

                <ContentLayanan datas={listLayanan} detail={detailLayanan} refSection={filterSection} setDetail={setDetailLayanan}
                    loadingDetail={loadingDetail} />

            </div>

            <Modal isOpen={isOpenCreate} setIsOpen={setIsOpenCreate} title="AJUKAN LAYANAN BARU">
                <CreateTicket setIsOpen={setIsOpenCreate} setListData={setListLayanan} />
            </Modal>
        </CommonLayout>
    )
}