import Card from '@/components/ui/Card';
import { useRouter } from 'next/router';
import { useRef } from 'react'

interface ListLayananProps {
    datas: Array<any>;
    handleNextPage: () => void
    refSection: any;
    className?: string;
}
export default function ListLayanan({ datas, handleNextPage, refSection, className }: ListLayananProps) {
    const router = useRouter();
    const container = useRef<HTMLDivElement>(null)
    function handleClick(detail: any) {
        if (window.innerWidth >= 1024) {
            router.push(`/ticket?slug=${detail.slug}`, `/ticket/${detail.slug}`, { shallow: true });
        } else {
            router.push(`/ticket/${detail.slug}`);
        }
        refSection.current.scrollIntoView({ behavior: 'smooth' });
    }
    function handleScroll() {
        if ((container.current?.scrollHeight ?? -1) - (container.current?.scrollTop ?? -1) <= (container.current?.clientHeight ?? 0)) {
            handleNextPage()
        }
    }

    return (
        <div className={`w-full lg:w-[35%] flex flex-col gap-4 ${className} max-h-[640px] overflow-hidden hover:overflow-y-auto
        light-scrollbar`} onScroll={() => handleScroll()}
            ref={container}>
            {datas.length !== 0 ?
                datas.map((data, index) => (
                    <button
                        className={`flex p-4 rounded-lg md:p-6 justify-between shadow hover:bg-[#CAF9FD]/20
                 border hover:border-primary-500 text-start 
                 ${data.slug.toString() === router.query.slug ? "border-primary-500 bg-[#CAF9FD]/20" : "border-transparent bg-white"}`}
                        key={index} onClick={() => handleClick(data)}>
                        <div className='flex flex-col gap-1 max-w-[70%] xl:w-56'>
                            <div className="font-bold text-primary-700 overflow-hidden truncate">{data.subject} pawdapwdk</div>
                            <div className="text-sm text-slate-600">{data.category.categoryName}</div>
                            <div className="text-sm text-slate-600 uppercase">{data.priority}</div>
                            <div className="text-xs text-slate-600">{data.date}</div>
                        </div>
                        <div className=''>
                            <div className={`px-2 py-[2px] uppercase text-center text-sm rounded
                                    ${data.status === "open" ? "text-green-500 bg-green-100" :
                                    data.status === "process" ? "text-secondary bg-secondary/20" :
                                        data.status === "done" ? "text-primary-500 bg-sky-200" :
                                            data.status === "expired" ? "text-red-500 bg-red-200" :
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
