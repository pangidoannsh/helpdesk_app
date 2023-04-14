import Card from '@/components/ui/Card';
import { useRouter } from 'next/router';
import React from 'react'

interface ListLayananProps {
    datas: Array<any>;
    refSection: any;
    className?: string;
}
export default function ListLayanan({ datas, refSection, className }: ListLayananProps) {
    const router = useRouter();
    function handleClick(detail: any) {
        if (window.innerWidth >= 1024) {
            router.push(`/ticket?slug=${detail.slug}`, `/ticket/${detail.slug}`, { shallow: true });
        } else {
            router.push(`/ticket/${detail.slug}`);
        }
        refSection.current.scrollIntoView({ behavior: 'smooth' });
    }
    return (
        <div className={`w-full lg:w-[35%] flex flex-col gap-4 ${className}`}>
            {datas.length !== 0 ?
                datas.map((data, index) => (
                    <button
                        className={`flex p-4 rounded-lg md:p-6 justify-between shadow bg-white hover:bg-[#CAF9FD]/20
                 border hover:border-primary-500 text-start 
                 ${data.id.toString() === router.query.id ? "border-primary-500 bg-[#CAF9FD]/20" : "border-transparent"}`}
                        key={index} onClick={() => handleClick(data)}>
                        <div className='flex flex-col gap-1 w-40 xl:w-56'>
                            <div className="font-bold text-primary-700 overflow-hidden truncate">{data.subject}</div>
                            <div className="text-sm text-slate-600">{data.category.categoryName}</div>
                            <div className="text-sm text-slate-600 uppercase">{data.priority}</div>
                            <div className="text-xs text-slate-600">{data.date}</div>
                        </div>
                        <div className=''>
                            <div className={`px-2 py-[2px] uppercase text-center text-sm rounded
                                    ${data.status === "open" ? "text-green-500 bg-green-100" :
                                    data.status === "process" ? "text-secondary bg-secondary/20" :
                                        data.status === "done" ? "text-primary-500 bg-sky-200" :
                                            'text-slate-500 bg-slate-200'
                                }`}>
                                {data.status}
                            </div>
                        </div>
                    </button>
                )) : <Card className='flex justify-center py-3 rounded-lg text-slate-500'>Belum Ada Mengajukan Layanan</Card>}
        </div>
    )
}
