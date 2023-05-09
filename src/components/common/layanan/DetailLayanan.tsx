import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import AuthApi from '@/services/authApi';
import { Icon } from '@iconify/react';
import { useRouter } from 'next/router';
import React, { useContext, useEffect, useRef, useState } from 'react'
import TextArea from '../TextArea'
import ListMessage from './ListMessage';
import io from 'socket.io-client';
import BASE_URL from '@/config/baseUrl';
import { UserContext } from '@/context/UserProvider';
import { format, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';


const socket = io(BASE_URL);

interface DetailLayananProps {
    detailLayanan?: any;
    listMessages?: Array<any>;
    setListMessages?: (listMessage: any) => void;
    loadingDetail: boolean;
    isOpenDetail: boolean;
}

export default function DetailLayanan({ detailLayanan, listMessages = [],
    loadingDetail, setListMessages = () => { }, isOpenDetail }: DetailLayananProps) {
    const { slug } = useRouter().query;

    const [isGeneral, setisGeneral] = useState(true);
    const [loadingSend, setloadingSend] = useState(false);
    const messageRef = useRef<HTMLTextAreaElement>(null);

    const handleSend = (event: any) => {
        const dataPost = {
            // userSend: user.id,
            ticketId: detailLayanan.id,
            content: messageRef.current?.value.replaceAll("\n", "<br/>")
        }
        // console.log(dataPost);
        setloadingSend(true)
        // socket.emit('sendMessage', dataPost);
        AuthApi.post('/ticket-message', dataPost).then(res => {
            // console.log(res.data);

            // setListMessages((prev: any) => [...prev, res.data])
            messageRef.current ? messageRef.current.value = "" : ''
        }).catch(err => {
            console.log(err.response);

        }).finally(() => setloadingSend(false));
    }

    useEffect(() => {
        if (messageRef.current) messageRef.current.value = '';
    }, [slug])

    useEffect(() => {
        socket.on("receiveMessage", data => {
            if (setListMessages) {
                console.log('data', data);
                if (detailLayanan) {
                    if (data.ticket.id === detailLayanan.id) {
                        setListMessages((prev: Array<any>) => [...prev, data])
                    }
                }
            }
        })
        return () => {
            socket.off('receiveMessage')
        }
    }, [detailLayanan])

    return (
        <div className={`w-full ${!isOpenDetail ? 'hidden lg:block' : ''}`} id='detail-section'>
            <Card className={`flex flex-col w-full p-4 md:p-6 rounded-lg gap-8
            ${detailLayanan ? "h-auto" : "h-screen"}`}>
                {detailLayanan ?
                    !loadingDetail ? (
                        <>
                            <div className="flex flex-col gap-6">
                                {/* Tab */}
                                <div className="divider-bottom">
                                    <button className={`rounded-t-lg border-t border-x uppercase text-sm  p-2 translate-y-[1px]
                                ${isGeneral ? "border-slate-400 text-slate-500 bg-white" :
                                            "border-transparent text-primary-700"}`}
                                        onClick={() => setisGeneral(true)}>
                                        general
                                    </button>
                                    <button className={`rounded-t-lg border-t border-x uppercase text-sm p-2 translate-y-[1px]
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
                                    <div className='flex md:flex-row flex-col gap-4 md:gap-12'>
                                        <div className="text-sm">
                                            <div className='text-slate-500'>Fungsi</div>
                                            <div className='text-slate-800 uppercase'>{detailLayanan.fungsi?.name ?? 'undifined'}</div>
                                        </div>
                                        <div className="text-sm">
                                            <div className='text-slate-500'>Prioritas</div>
                                            <div className='text-slate-800 uppercase'>{detailLayanan.priority}</div>
                                        </div>
                                        <div className="text-sm">
                                            <div className='text-slate-500'>Waktu Dibuat</div>
                                            <div className='text-slate-800'>
                                                {format(parseISO(detailLayanan.createdAt), 'HH:m dd MMMM yyyy', { locale: id })}
                                            </div>
                                        </div>
                                        <div className="text-sm">
                                            <div className='text-slate-500'>Masa Aktif</div>
                                            <div className='text-slate-800'>
                                                {format(parseISO(detailLayanan.expiredAt), 'HH:m dd MMMM yyyy', { locale: id })}</div>
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
                            <ListMessage dataMessage={listMessages} inputMessageRef={messageRef}
                                setIsGeneralTab={setisGeneral} />
                        </>
                    ) : <div className="flex justify-center py-20">
                        <Icon icon="eos-icons:loading" className='text-4xl text-primary-600' />
                    </div>
                    : <div className='mt-16 flex justify-center text-slate-600'>
                        Silahkan pilih daftar layanan untuk melihat detailnya
                    </div>}
            </Card>
        </div>

    )
}
