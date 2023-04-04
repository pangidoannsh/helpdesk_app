import { Icon } from '@iconify/react'

interface TablePaginationProps {
    totalPage: number;
    currentPage: number;
}
export default function TablePagination(props: TablePaginationProps) {
    return (
        <div className="flex gap-1">
            <button className='btn-pagination text-xl focus:ring focus:ring-sky-200'>
                <Icon icon="material-symbols:chevron-left-rounded" />
            </button>
            {[...Array(props.totalPage)].map((data: any, index) => (
                <button className='btn-pagination text-sm focus:ring focus:ring-sky-200' key={index}>
                    {index + 1}
                </button>
            ))}
            <button className='btn-pagination text-xl focus:ring focus:ring-sky-200'>
                <Icon icon="material-symbols:chevron-right-rounded" />
            </button>
        </div>
    )
}
