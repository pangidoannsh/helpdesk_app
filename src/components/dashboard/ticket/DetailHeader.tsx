import Card from "@/components/ui/Card";
import TextArea from "@/components/common/TextArea";
import Button from "@/components/ui/Button";
import SelectNoBorder from "@/components/ui/SelectNoBorder";
import BASE_URL from "@/config/baseUrl";
import { UserContext } from "@/context/UserProvider";
import AuthApi from "@/services/authApi";
import { RefObject, useContext, useEffect, useState } from "react";
import { AlertContext } from "@/context/AlertProvider";
import Converter from "@/utils/converter";
import Stepper from "./StatusStepper";
import checkExtension from "@/utils/checkExtension";
import Link from "next/link";
import { Icon } from "@iconify/react";

const statusSteps = [
    { status: 'open', icon: 'material-symbols:mail', title: 'OPEN' },
    { status: 'process', icon: 'uil:process', title: 'PROSES,' },
    { status: 'feedback', icon: 'fluent:person-feedback-48-filled', title: 'FEEDBACK' },
]
const nullResponse = { value: null, display: "Balas Pesan Dengan Cepat" };

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
    const [agentOptions, setAgentOptions] = useState([]);
    const [agentSelected, setAgentSelected] = useState({ value: null, display: 'Belum Ada Agen Bertugas' });
    const [openFile, setOpenFile] = useState(false);

    function handleChangeResponse(value: any) {
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
                if (detail.status === 'open' && user.level === 'agent') {
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
        const status: string = detail.status === 'open' ? 'process' : detail.status === 'process' ? 'feedback' : detail.status;

        AuthApi.put(`/ticket/${detail.id ?? -1}/status`, { status }).then(res => {
            setAlert({
                isActived: true,
                code: 1,
                title: "Updated",
                message: `Status Ticket Berubah ke ${status.toUpperCase()}!`
            })
            AuthApi.get(`/ticket/detail/${detail.id}`).then(res => {
                setDetail(res.data)
            }).catch(err => {
                console.log(err.response);
            })
            // setDetail((prev: any) => ({ ...prev, status }))
        }).catch(err => {
            console.log(err.response);
            setAlert({
                isActived: true,
                code: 0,
                title: "Failed",
                message: `Status Ticket Gagal berubah ke ${status.toUpperCase()}!`
            })
        }).finally(() => {
            setloadingProcess(false);
            setTimeout(() => {
                closeAlert()
            }, 2000);
        });
    }
    function handleAddAgent() {
        AuthApi.post(`/ticket-assignment/${detail.id}`, {
            agentId: agentSelected.value
        }).then(res => {
            // console.log(res.data);
            setDetail({ ...detail, assignment: [res.data] });
            setAlert({
                isActived: true,
                code: 1,
                title: "Updated",
                message: `Agen Berhasil ditambahkan ke Tugas`
            })
        }).catch(err => {
            console.log(err.response ?? err);

            setAlert({
                isActived: true,
                code: 0,
                title: "Failed",
                message: `Gagal Menambahkan Agen ke Tugas!`
            })
        }).finally(() => setTimeout(closeAlert, 2000))
    }
    useEffect(() => {
        if (user && user.level === 'supervisor') {
            AuthApi.get('/user/agent').then(res => {
                setAgentOptions(res.data.map((agent: any) => ({ value: agent.id, display: agent.name?.toUpperCase() ?? 'No Name' })))
            }).catch(err => console.log(err))
        }
    }, [])

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
                {!'feedback done expired'.includes(detail.status) ? (
                    <button className={`rounded-t border-t border-x uppercase text-sm p-2 translate-y-[1px]
                                ${!isGeneral ? "border-slate-400 text-slate-500 bg-white" :
                            "border-transparent text-primary-700"}`}
                        onClick={() => setIsGeneral(false)}>
                        balas
                    </button>
                ) : ''}
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
                                        detail?.status === 'expired' ? 'text-red-500 bg-red-200' :
                                            'text-slate-500 bg-slate-200'
                            }`}>
                            {detail?.status ?? 'undifined'}
                        </div>
                    </div>
                </div>
                <div className="text-slate-600">{detail?.category?.categoryName ?? ''}</div>
                <div className="flex gap-2 text-sm text-slate-500 items-center">
                    <div className="font-medium min-w-max">AGEN BERTUGAS :</div>
                    {user.level === 'supervisor' && detail?.assignment.length === 0 ? (
                        <div className="flex gap-6">
                            <SelectNoBorder useSelect={[agentSelected, setAgentSelected]} options={agentOptions}
                                widthNotFull={true} />
                            {agentSelected.value ? <button className="text-primary-600 font-medium hover:text-primary-700"
                                onClick={handleAddAgent}>
                                Simpan
                            </button> : ''}
                        </div>
                    ) : (
                        <div>
                            {detail.assignment ?
                                detail?.assignment.length !== 0 ? detail?.assignment.map((agent: any) => agent.user.name).join(', ') :
                                    '(Belum Ada Agen Ditugaskan)' : ''
                            }
                        </div>
                    )}
                </div>
            </div>

            {isGeneral ? (
                <>
                    <div className='flex flex-wrap gap-12'>
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
                            <div className='text-slate-800'>{detail ? Converter.dateToMMMMformat(detail.createdAt, true) : '-'}</div>
                        </div>
                        <div className="text-sm">
                            <div className='text-slate-500'>Masa Aktif</div>
                            <div className='text-slate-800'>
                                {detail ? Converter.dateToMMMMformat(detail.expiredAt, true) : 'Tidak Ada Tenggat Waktu'}
                            </div>
                        </div>
                    </div>

                    {detail.status === 'open' || detail.status === 'process' ? <div>
                        <Button className="rounded text-white items-center py-2 px-8 uppercase"
                            onClick={handleProcess} loading={loadingProcess} disabled={user.level !== 'agent'}>
                            {detail.status === 'process' ? 'Selesaikan Tiket' : 'Proses Ticket'}
                        </Button>
                    </div> : ''}
                    <div className="flex flex-col gap-4">
                        <h4 className="font-medium text-lg text-slate-600 uppercase">Riwayat Tiket</h4>
                        <Stepper labels={statusSteps.map((step: any) => {
                            const { status } = step;
                            const getHistory = detail?.history?.find((history: any) => history.status === status) ?? null;
                            return {
                                ...step, agentName: getHistory?.userCreated.name ?? null
                            }
                        })} />
                        {detail.fileAttachment ?
                            <div className="mt-2">
                                <div className="flex gap-2 items-center mb-2">
                                    <h4 className="font-medium text-lg text-slate-600 uppercase">File Lampiran</h4>
                                    <button onClick={() => setOpenFile(prev => !prev)}>
                                        <Icon icon="material-symbols:arrow-drop-down" className={`text-2xl text-slate-600
                                        ${openFile ? 'rotate-180' : 'rotate-0'} duration-200`} />
                                    </button>
                                </div>
                                {checkExtension(detail.fileAttachment, ['.jpg', '.png', '.jpeg', '.webp']) ?
                                    <div className={`${openFile ? 'h-auto' : 'h-0'} overflow-hidden duration-300`}>
                                        <div className="relative w-max rounded overflow-hidden">
                                            <img src={`${BASE_URL}/file/${detail.fileAttachment}`} className="max-w-[50vw]  
                                        lg:max-h-52" />
                                            <Link href={`${BASE_URL}/file/${detail.fileAttachment}`} target="_blank"
                                                className="absolute top-0 left-0 w-full h-full hover:opacity-100 bg-primary-700/30
                                            opacity-0 duration-200 cursor-pointer text-white flex justify-center items-center
                                            font-medium text-2xl">
                                                Lihat
                                            </Link>
                                        </div>
                                    </div> : detail.fileAttachment.includes(".pdf") ? (
                                        <div className={`flex flex-col gap-2 rounded- overflow-hidden
                                        ${openFile ? 'h-72' : 'h-0'} overflow-hidden duration-300`}>
                                            <Link href={`${BASE_URL}/file/${detail.fileAttachment}`} target="_blank"
                                                className="hover:text-primary-700 text-slate-500 font-semibold">
                                                Klik Untuk Melihat Ukuran Penuh
                                            </Link>
                                            <iframe src={`${BASE_URL}/file/${detail.fileAttachment}`} className="w-1/2 h-60" />
                                        </div>
                                    ) : ''}
                            </div> : ''
                        }
                    </div>
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
                            onChange={handleChangeResponse} />
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
