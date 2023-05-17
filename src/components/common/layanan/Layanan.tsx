import CommonLayout from "@/components/layouts/Common";
import AuthApi from "@/services/authApi";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import ContentLayanan from "./ContentLayanan";
import Search from "@/components/dashboard/ticket/Search";
import { AxiosError } from "axios";


interface LayananProps {
    listLayanan?: any;
    detailLayanan?: any;
}
export default function Layanan(props: LayananProps) {
    const [loadingDetail, setloadingDetail] = useState(false);
    const [listLayanan, setListLayanan] = useState(props.listLayanan)
    const router = useRouter();
    const { slug } = router.query;
    const filterSection = useRef<any>();
    const [isOpenCreate, setIsOpenCreate] = useState(false);
    const [detailLayanan, setDetailLayanan] = useState<any>();
    const [listMessages, setListMessages] = useState<any>([]);
    const [isOpenDetail, setIsOpenDetail] = useState(false);

    const [filterQuery, setFilterQuery] = useState("");
    const [isAllFetched, setIsAllFetched] = useState(false);

    const handleOpenModalCreate = () => {
        setIsOpenCreate(true);
    }

    function handleSearch(query: string) {
        setFilterQuery(query);
        setIsAllFetched(false);
        AuthApi.get(`/ticket/user?limit=5&${query}`).then(res => {
            setListLayanan(res.data)
        }).catch(err => {
            console.log(err.response);
        })
    }
    function handleNextPage() {
        console.log(filterQuery);

        if (!isAllFetched) {
            AuthApi.get(`/ticket/user?limit=5&offset=${listLayanan.length}&${filterQuery}`).then(res => {
                if (res.data.length === 0) {
                    setIsAllFetched(true)
                }
                setListLayanan((prev: Array<any>) => [...prev, ...res.data].filter(
                    (value, index, self) =>
                        index === self.findIndex((v) => v.id === value.id)
                ))
            }).catch((err: AxiosError) => {
                console.log(err.response);

            })
        }
    }

    useEffect(() => {
        if (slug) {
            filterSection.current.scrollIntoView({ behavior: 'auto' });
        }
    }, [])

    useEffect(() => {
        const dataLayanan = listLayanan.find((data: any) => data.slug.toString() === slug);

        if (slug) {
            if (window.innerWidth < 1024) {
                setIsOpenDetail(true);
            }
            setDetailLayanan(dataLayanan)
            try {
                AuthApi.get(`/ticket-message/${dataLayanan.id}`).then((res: any) => {
                    setListMessages(res.data)
                }).catch(err => {
                    console.log(err.response);
                })
            } catch (e) {
                router.push('/ticket')
            }
        }

    }, [slug]);

    return (
        <CommonLayout title='Layanan | HELPDESK BPS Riau' content='layanan helpdesk bps riau'>
            <div className="flex flex-col gap-6 min-h-screen bg-[#F8F8F8] px-2 md:px-12 xl:px-36 py-6">
                {/* Card Filter Layanan */}
                <Search refrence={filterSection} border="rounded-lg" className={`${isOpenDetail ? 'hidden' : ''}`}
                    functionSearch={handleSearch} withoutFungsi />

                <ContentLayanan datas={listLayanan} handleNextPage={handleNextPage} detail={detailLayanan} refSection={filterSection} isOpenDetail={isOpenDetail}
                    loadingDetail={loadingDetail} listMessages={listMessages} setListMessages={setListMessages} />
            </div>
        </CommonLayout>
    )
}