import { UserContext } from '@/context/UserProvider';
import Converter from '@/utils/converter';
import MessageManager from '@/utils/messageManager';
import { Icon } from '@iconify/react';
import React, { RefObject, useContext } from 'react';

interface ListMessageProps {
    dataMessage: Array<any>,
    inputMessageRef: RefObject<HTMLTextAreaElement>;
    setIsGeneralTab: (isGeneral: boolean) => void;
    // setInputMessage: (message: string) => void;
}
export default function ListMessage({ dataMessage, inputMessageRef, setIsGeneralTab }: ListMessageProps) {
    const { user, setUser } = useContext(UserContext);
    // const handleQuote = (message: Message) => {
    //     // set text area
    //     setInputMessage(`MENGUTIP :\n"${MessageManager.clearQuote(message.content).replaceAll("<br/>", "\n")}"\n`)
    //     setTimeout(() => {
    //         inputMessageRef.current?.focus();
    //     }, 1000);
    //     document.getElementById("detail-section")?.scrollIntoView({ behavior: 'smooth' });
    //     // set tab jadi BALAS
    //     setIsGeneralTab(false);
    // }
    return (
        <div className='flex flex-col-reverse gap-4'>
            {dataMessage.length !== 0 ?
                dataMessage.map((message, index) => (
                    <div className={`flex rounded-lg gap-6 py-4 px-6 border chat-entry
                    ${message.userCreated.id === user.id ? 'border-primary-500' : 'border-gray-400'}`} key={index}>
                        <div className={`text-center ${message.userCreated.id === user.id ? "text-primary-600" : "text-slate-500"}`}>
                            <Icon icon={`${message.userCreated.id === user.id ? "ic:baseline-account-circle" : "mdi:customer-service"}`}
                                className="text-6xl" />
                            <div className='mt-3'>{message.userCreated.id === user.id ? user.name : "Agen"}</div>
                        </div>
                        <div>
                            <div className="text-slate-500">{message.createdAt}</div>
                            <div className="text-slate-800 my-6">{Converter.setToRowText(message.content)}</div>
                            {/* <button className='rounded border border-primary-600 py-2 px-4 flex items-center 
                            text-primary-600 hover:bg-primary-600 hover:text-white ' onClick={() => handleQuote(message)}>
                                <Icon icon="material-symbols:format-quote" className='text-2xl rotate-180' />
                                Mengutip
                            </button> */}
                        </div>
                    </div>)) :
                <div className="flex justify-center text-slate-400">Tidak Ada Detail Pesan</div>
            }
        </div>
    )
}
