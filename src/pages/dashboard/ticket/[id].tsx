import DashboardLoading from '@/components/dashboard/DashboardLoading';
import AgentResponse from '@/components/dashboard/ticket/AgentResponse';
import DetailHeader from '@/components/dashboard/ticket/DetailHeader';
import UserResponse from '@/components/dashboard/ticket/UserResponse';
import DashboardLayout from '@/components/layouts/Dashboard';
import BASE_URL from '@/config/baseUrl';
import AuthApi from '@/services/authApi';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react'
import { io } from 'socket.io-client';

const socket = io(BASE_URL);

export default function TicketDetail() {
    const router = useRouter();
    const { id } = router.query;
    const messageRef = useRef<HTMLTextAreaElement>(null)
    const [loadingPage, setloadingPage] = useState(true);
    const [detail, setdetail] = useState<any>();
    const [dataMessages, setDataMessages] = useState<any>([]);
    const [isGeneral, setisGeneral] = useState(true);
    const [responseOptions, setResponseOptions] = useState<any>([]);

    useEffect(() => {
        if (id) {
            AuthApi.get(`/ticket/detail/${id}`).then(res => {
                setdetail(res.data)
            }).catch(err => {
                console.log(err.response);
            }).finally(() => setloadingPage(false))

            AuthApi.get(`/ticket-message/${id}`).then(res => {
                setDataMessages(res.data)
            }).catch(err => {
                console.log(err.response);
            })
        }
    }, [id])

    useEffect(() => {
        AuthApi.get('/responses').then(res => {
            setResponseOptions(res.data.map((data: any) => ({ value: data.text, display: data.text })))
        }).catch(err => {
            console.log(err.response);
        })
    }, [])
    useEffect(() => {
        socket.on("receiveMessage", data => {
            if (setDataMessages) {
                console.log(data);
                // console.log(id);

                if (data.ticket.id === id) {
                    setDataMessages((prev: Array<any>) => [...prev, data])
                }
            }
        })
        return () => {
            socket.off('receiveMessage')
        }
    }, [])

    return (
        <DashboardLayout title='Tiket | Helpdesk Dashboard'>
            {loadingPage ? <DashboardLoading /> : <>
                <DetailHeader detail={detail} isGeneral={isGeneral} setIsGeneral={setisGeneral} messageRef={messageRef}
                    setDataMessage={setDataMessages} responsesOptions={responseOptions} />
                <div className="flex flex-col-reverse gap-4">
                    {dataMessages.map((message: any, index: number) =>
                        <div key={index}>
                            {message.userCreated?.level === "pegawai" ?
                                <UserResponse userName={message.userCreated.name} content={message.content} createdAt={message.createdAt} /> :
                                <AgentResponse userName={message.userCreated.name} content={message.content} createdAt={message.createdAt} />
                            }
                        </div>
                    )}
                </div>
            </>
            }
        </DashboardLayout>
    )
}



