import Card from '@/components/ui/Card';
import Converter from '@/utils/converter';
import { Icon } from '@iconify/react';

interface ResponseProps {
    userName?: string;
    createdAt?: string;
    content?: string;
}
export default function AgentResponse(props: ResponseProps) {
    const { content, userName, createdAt } = props;
    return (
        <Card className='flex gap-14 py-6 px-12 border border-primary-600 rounded chat-entry' backgroundColor='bg-f5'>
            <div className="flex flex-col items-center text-primary-700 w-40 truncate">
                <Icon icon="mdi:customer-service"
                    className="text-9xl" />
                <div className='mt-1'>{userName}</div>
            </div>
            <div>
                <div className="text-slate-500">{createdAt}</div>
                <div className="text-slate-800 my-6">{Converter.setToRowText(content ?? '')}</div>
                {/* <button className='rounded border border-primary-600 py-2 px-4 flex items-center 
                            text-primary-600 hover:bg-primary-600 hover:text-white ' onClick={() => handleQuote(message)}>
                                <Icon icon="material-symbols:format-quote" className='text-2xl rotate-180' />
                                Mengutip
                            </button> */}
            </div>
        </Card>
    )
}
