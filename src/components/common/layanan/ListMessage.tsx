import { UserContext } from '@/context/UserProvider';
import Converter from '@/utils/converter';
import { Icon } from '@iconify/react';
import React, { useContext } from 'react';

interface Message {
    userCreated: {
        id: string;
        name: string;
    };
    content: string;
    createdAt: string;
}
interface ListMessageProps {
    dataMessage: Array<Message>
}
export default function ListMessage({ dataMessage }: ListMessageProps) {
    const { user, setUser } = useContext(UserContext);
    const handleQuote = (message: Message) => {
        // set tab jadi BALAS
        // set text area
    }
    return (
        <div className='flex flex-col-reverse gap-4'>
            {dataMessage.length !== 0 ?
                dataMessage.reverse().map((message, index) => (
                    <div className={`flex rounded gap-6 py-4 px-6 border chat-entry
                    ${message.userCreated.id === user.id ? 'border-primary-500' : 'border-gray-400'}`} key={index}>
                        <div className={`text-center ${message.userCreated.id === user.id ? "text-primary-600" : "text-slate-500"}`}>
                            <Icon icon={`${message.userCreated.id === user.id ? "ic:baseline-account-circle" : "mdi:customer-service"}`}
                                className="text-6xl" />
                            <div className='mt-3'>{message.userCreated.id === user.id ? user.name : "Agen"}</div>
                        </div>
                        <div>
                            <div className="text-slate-500">{message.createdAt}</div>
                            <div className="text-slate-800 my-6">{Converter.stringToElement(message.content)}</div>
                            <button className='rounded border border-primary-600 py-2 px-4 flex items-center 
                            text-primary-600 hover:bg-primary-600 hover:text-white ' onClick={() => handleQuote(message)}>
                                <Icon icon="material-symbols:format-quote" className='text-2xl rotate-180' />
                                Mengutip
                            </button>
                        </div>
                    </div>)) :
                <div className="flex justify-center text-slate-400">Tidak Ada Detail Pesan</div>
            }
        </div>
    )
}
