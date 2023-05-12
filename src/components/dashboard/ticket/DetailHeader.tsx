import Card from "@/components/ui/Card";
import TextArea from "@/components/common/TextArea";
import Button from "@/components/ui/Button";
import SelectNoBorder from "@/components/ui/SelectNoBorder";
import BASE_URL from "@/config/baseUrl";
import { UserContext } from "@/context/UserProvider";
import AuthApi from "@/services/authApi";
import { RefObject, useContext, useState } from "react";
import { io } from "socket.io-client";
import { AlertContext } from "@/context/AlertProvider";

const nullResponse = { value: null, display: "Balas Pesan Dengan Cepat" };
const socket = io(BASE_URL);

interface DetailHeaderProps {
    isGeneral: boolean;
    setIsGeneral: (isGeneral: boolean) => void;
    detail: any;
    setDetail: (detail: any) => void
    messageRef: RefObject<HTMLTextAreaElement>;
    setDataMessage: (dataMessage: any) => void;
    responsesOptions?: Array<any>;
}
export default function DetailHeader(props: DetailHeaderProps) {
    const { user } = useContext(UserContext)
    const { setAlert, closeAlert } = useContext(AlertContext);
    const { isGeneral, setIsGeneral, detail, messageRef, setDataMessage, responsesOptions, setDetail } = props;
    const [fastReply, setFastReply] = useState(nullResponse);
    const [loadingSend, setloadingSend] = useState(false);
    const [loadingProcess, setloadingProcess] = useState(false);

    function getSelect(value: any) {
        if (messageRef) {
            if (messageRef.current) {
                messageRef.current.value = value;
            }
        }
    }

    const handleSend = (event: any) => {
        if (detail.status !== 'expired') {
            const dataPost = {
                ticketId: detail.id,
                content: messageRef.current?.value.replaceAll("\n", "<br/>")
            }
            // socket.emit('sendMessage', dataPost)
            // console.log(dataPost);
            setloadingSend(true)
            AuthApi.post('/ticket-message', dataPost).then(res => {
                // setDataMessage((prev: any) => [...prev, res.data]);
                messageRef.current ? messageRef.current.value = "" : '';
                setFastReply(nullResponse);
                if (detail?.status ?? 'open' === 'open') {
                    handleProcess();
                }
            }).catch(err => {
                console.log(err.response);

            }).finally(() => setloadingSend(false));
        } else {
            setAlert({
                isActived: true,
                code: 0,
                title: "Gagal Mengirim Pesan",
                message: "Status Ticket sudah EXPIRED!"
            })
            setTimeout(() => {
                closeAlert()
            }, 2000);
        }
    }

    const handleProcess = (event?: any) => {
        setloadingProcess(true);
        closeAlert();
        AuthApi.put(`/ticket/${detail.id ?? -1}/process`).then(res => {
            setAlert({
                isActived: true,
                code: 1,
                title: "Updated",
                message: "Status Ticket Berubah ke PROCESS!"
            })
            setDetail((prev: any) => ({ ...prev, status: 'process' }))
        }).catch(err => {
            console.log(err.response);
            setAlert({
                isActived: true,
                code: 0,
                title: "Failed",
                message: "Status Ticket Gagal berubah ke PROCESS!"
            })
        }).finally(() => {
            setloadingProcess(false);
            setTimeout(() => {
                closeAlert()
            }, 2000);
        });
    }

    return (
        <Card className='flex flex-col gap-8 p-9 rounded'>
            {/* Tab */}
            <div className="divider-bottom">
                <button className={`rounded-t border-t border-x uppercase text-sm  p-2 translate-y-[1px]
                                ${isGeneral ? "border-slate-400 text-slate-500 bg-white" :
                        "border-transparent text-primary-700"}`}
                    onClick={() => setIsGeneral(true)}>
                    general
                </button>
                <button className={`rounded-t border-t border-x uppercase text-sm p-2 translate-y-[1px]
                                ${!isGeneral ? "border-slate-400 text-slate-500 bg-white" :
                        "border-transparent text-primary-700"}`}
                    onClick={() => setIsGeneral(false)}>
                    balas
                </button>
            </div>
            {/* Title */}
            <div className="flex flex-col gap-2">
                <div className="flex gap-6">
                    <h4 className='text-2xl font-bold text-slate-600 uppercase'>
                        [#{detail?.id ?? ''}] {detail?.subject ?? ''}
                    </h4>
                    <div>
                        <div className={`py-1 px-2 uppercase rounded
                                            ${detail?.status === "open" ? "text-green-500 bg-green-100" :
                                detail?.status === "process" ? "text-secondary bg-secondary/20" :
                                    detail?.status === "done" ? "text-primary-500 bg-sky-200" :
                                        'text-slate-500 bg-slate-200'
                            }`}>
                            {detail?.status ?? ''}
                        </div>
                    </div>
                </div>
                <div className="text-slate-600">{detail?.category?.categoryName ?? ''}</div>
            </div>
            {isGeneral ? (
                <>
                    <div className='flex gap-12'>
                        <div className="text-sm">
                            <div className='text-slate-500'>Fungsi</div>
                            <div className='text-slate-800 uppercase'>{detail?.fungsi?.name ?? 'undifined'}</div>
                        </div>
                        <div className="text-sm">
                            <div className='text-slate-500'>Prioritas</div>
                            <div className='text-slate-800 uppercase'>{detail?.priority ?? ''}</div>
                        </div>
                        <div className="text-sm">
                            <div className='text-slate-500'>Waktu Dibuat</div>
                            <div className='text-slate-800'>{detail?.createdAt ?? ''}</div>
                        </div>
                        <div className="text-sm">
                            <div className='text-slate-500'>Masa Aktif</div>
                            <div className='text-slate-800'>
                                {detail?.expiredAt !== " " ? detail?.expiredAt ?? 'Tidak Tenggat Waktu' : 'Tidak Ada Tenggat Waktu'}
                            </div>
                        </div>
                    </div>
                    <div>
                        <Button className="rounded text-white items-center py-2 px-8 uppercase"
                            onClick={handleProcess} loading={loadingProcess} disabled={detail.status === 'expired'}>
                            Proses Ticket
                        </Button>
                    </div>
                    {/* <div className="divider-bottom" /> */}
                </>
            ) :
                (<>
                    <div className="divider-bottom" />
                    <div className="flex gap-12 items-center">
                        <div className='text-slate-400 min-w-[90px]'>To</div>
                        <div className='text-slate-800'>{detail?.userOrderer?.name ?? ''}</div>
                    </div>
                    <div className="flex gap-12 items-center">
                        <div className='text-slate-400 min-w-[90px]'>Balas Cepat</div>
                        <SelectNoBorder useSelect={[fastReply, setFastReply]} options={[nullResponse, ...responsesOptions ?? []]}
                            catchSelect={getSelect} />
                    </div>
                    <div className="flex flex-col gap-4">
                        <TextArea placeholder='Ketikkan Pesan...' inputRef={messageRef} label="Balasan" className='rounded'
                            labelClass='text-slate-400' row={2} />
                        <Button className='py-2 bg-primary-600 rounded font-medium text-white' onClick={handleSend}
                            loading={loadingSend} >
                            KIRIM
                        </Button>
                    </div>
                </>)
            }
        </Card>
    )
}
