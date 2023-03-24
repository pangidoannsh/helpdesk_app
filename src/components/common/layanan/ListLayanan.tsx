import { useRouter } from 'next/router';
import React from 'react'

interface ListLayananProps {
    datas: Array<any>;
    refSection: any;
}
export default function ListLayanan({ datas, refSection }: ListLayananProps) {
    const router = useRouter();
    function handleClick(detail: any) {
        router.push(`/layanan?slug=${detail.slug}`, `/layanan/${detail.slug}`, { shallow: true });
        refSection.current.scrollIntoView({ behavior: 'smooth' });
    }
    return (
        <div className="w-full lg:w-[35%] flex flex-col gap-4">
            {datas.map((data, index) => (
                <button
                    className={`flex p-4 rounded md:p-6 justify-between shadow bg-white hover:bg-[#CAF9FD]/20
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
            ))}
        </div>
    )
}
