import { Button } from '@/components/ui/Button';
import AuthApi from '@/services/authService';
import React, { useRef, useState } from 'react'
import TextArea from '../TextArea'
import ListMessage from './ListMessage';

interface DetailLayananProps {
    detailLayanan?: any;
    setDetailLayanan?: any
}

export default function DetailLayanan({ detailLayanan, setDetailLayanan }: DetailLayananProps) {
    const [isGeneral, setisGeneral] = useState(true);
    const [loadingSend, setloadingSend] = useState(false);
    const messageRef = useRef<HTMLTextAreaElement>(null);

    const handleSend = (event: any) => {
        const dataPost = {
            ticketId: detailLayanan.id,
            content: messageRef.current?.value.replaceAll("\n", "<br/>")
        }
        // console.log(dataPost);
        setloadingSend(true)
        AuthApi.post('/ticket-message', dataPost).then(res => {
            console.log(res.data);

            setDetailLayanan({
                ...detailLayanan,
                message: [...detailLayanan.message, res.data]
            })
            messageRef.current ? messageRef.current.value = "" : ''
        }).catch(err => {
            console.log(err.response);

        }).finally(() => setloadingSend(false));

    }


    return (
        <div className='w-full lg:block hidden'>
            <div className={`flex flex-col w-full p-4 md:p-6 justify-between shadow bg-white rounded gap-8
            ${detailLayanan ? "h-auto" : "h-screen"}`}>
                {detailLayanan ?
                    <>
                        <div className="flex flex-col gap-6">
                            {/* Tab */}
                            <div className="divider-bottom">
                                <button className={`rounded-t border-t border-x uppercase text-sm  p-2 translate-y-[1px]
                                ${isGeneral ? "border-slate-400 text-slate-500 bg-white" :
                                        "border-transparent text-primary-700"}`}
                                    onClick={() => setisGeneral(true)}>
                                    general
                                </button>
                                <button className={`rounded-t border-t border-x uppercase text-sm p-2 translate-y-[1px]
                                ${!isGeneral ? "border-slate-400 text-slate-500 bg-white" :
                                        "border-transparent text-primary-700"}`}
                                    onClick={() => setisGeneral(false)}>
                                    balas
                                </button>
                            </div>
                            {/* Title */}
                            <div className="flex flex-col gap-2">
                                <div className="flex gap-6">
                                    <h4 className='text-2xl font-bold text-slate-600 uppercase'>
                                        [#{detailLayanan.id}] {detailLayanan.subject}
                                    </h4>
                                    <div>
                                        <div className={`py-1 px-2 uppercase rounded
                                            ${detailLayanan.status === "open" ? "text-green-500 bg-green-100" :
                                                detailLayanan.status === "process" ? "text-secondary bg-secondary/20" :
                                                    detailLayanan.status === "done" ? "text-primary-500 bg-sky-200" :
                                                        'text-slate-500 bg-slate-200'
                                            }`}>
                                            {detailLayanan.status}
                                        </div>
                                    </div>
                                </div>
                                <div className="text-slate-600">{detailLayanan.category.categoryName}</div>
                            </div>
                        </div>
                        {isGeneral ? (
                            <>
                                <div className='flex gap-12'>
                                    <div className="text-sm">
                                        <div className='text-slate-500'>Fungsi</div>
                                        <div className='text-slate-800'>Kepegawaian</div>
                                    </div>
                                    <div className="text-sm">
                                        <div className='text-slate-500'>Prioritas</div>
                                        <div className='text-slate-800 uppercase'>{detailLayanan.priority}</div>
                                    </div>
                                    <div className="text-sm">
                                        <div className='text-slate-500'>Waktu Dibuat</div>
                                        <div className='text-slate-800'>{detailLayanan.createdAt}</div>
                                        {/* <div className='text-slate-800'>12:00 14 Maret 2023</div> */}
                                    </div>
                                    <div className="text-sm">
                                        <div className='text-slate-500'>Masa Aktif</div>
                                        <div className='text-slate-800'>18 Maret 2023</div>
                                    </div>
                                </div>
                                <div className="divider-bottom" />
                            </>
                        ) :
                            (<>
                                <div className="divider-bottom" />
                                <div className="flex flex-col gap-4">
                                    <TextArea placeholder='Ketikkan Pesan...' inputRef={messageRef} />
                                    <Button className='py-2 bg-primary-600 rounded font-medium text-white'
                                        loading={loadingSend} onClick={handleSend}>
                                        KIRIM
                                    </Button>
                                </div>
                            </>)
                        }
                        <ListMessage dataMessage={detailLayanan.message} />
                    </>
                    : <div className='mt-16 flex justify-center text-slate-600'>
                        Silahkan pilih daftar layanan untuk melihat detailnya
                    </div>}
            </div>
        </div>

    )
}
