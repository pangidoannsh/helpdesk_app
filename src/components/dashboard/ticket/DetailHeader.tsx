import Card from "@/components/Card";
import TextArea from "@/components/common/TextArea";
import { Button } from "@/components/ui/Button";
import SelectNoBorder from "@/components/ui/SelectNoBorder";
import AuthApi from "@/services/authApi";
import { RefObject, useState } from "react";

const nullResponse = { value: null, display: "Balas Pesan Dengan Cepat" };

interface DetailHeaderProps {
    isGeneral: boolean;
    setIsGeneral: (isGeneral: boolean) => void;
    detail: any;
    messageRef: RefObject<HTMLTextAreaElement>;
    setDataMessage: (dataMessage: any) => void;
    responsesOptions?: Array<any>;
}
export default function DetailHeader(props: DetailHeaderProps) {
    const { isGeneral, setIsGeneral, detail, messageRef, setDataMessage, responsesOptions } = props;
    const [fastReply, setFastReply] = useState(nullResponse);
    const [loadingSend, setloadingSend] = useState(false);

    function getSelect(value: any) {
        if (messageRef) {
            if (messageRef.current) {
                messageRef.current.value = value;
            }
        }
    }

    const handleSend = (event: any) => {
        const dataPost = {
            ticketId: detail.id,
            content: messageRef.current?.value.replaceAll("\n", "<br/>")
        }
        // console.log(dataPost);
        setloadingSend(true)
        AuthApi.post('/ticket-message', dataPost).then(res => {
            setDataMessage((prev: any) => [...prev, res.data]);
            messageRef.current ? messageRef.current.value = "" : ''
        }).catch(err => {
            console.log(err.response);

        }).finally(() => setloadingSend(false));
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
                            <div className='text-slate-800 uppercase'>{detail?.fungsi ?? ''}</div>
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
                    <div className="divider-bottom" />
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
