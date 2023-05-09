import { Icon } from '@iconify/react'

interface TablePaginationProps {
    totalPage: number;
    currentPage: number;
    setCurrentPage: (current: number) => void;
    functionFetching: (offset: number) => void;
}
export default function TablePagination(props: TablePaginationProps) {
    const { totalPage, currentPage, setCurrentPage, functionFetching } = props;
    function handleNext() {
        setCurrentPage(currentPage + 1);
        functionFetching(currentPage * 10);
    }
    function handlePrev() {
        setCurrentPage(currentPage - 1);
    }

    return (
        <div className="flex gap-1">
            <button className='btn-pagination bg-primary-700 text-white hover:bg-primary-800 text-xl focus:ring 
            focus:ring-sky-200 disabled:bg-opacity-60' disabled={currentPage === 1}
                onClick={() => handlePrev()}>
                <Icon icon="material-symbols:chevron-left-rounded" />
            </button>
            {[...Array(totalPage)].map((data: any, index) => (
                <button className={`btn-pagination text-sm focus:ring focus:ring-sky-200 duration-100 
                ${index + 1 === currentPage ? 'hover:bg-primary-800 bg-primary-700 text-white'
                        : 'hover:bg-primary-700 text-primary-700 hover:text-white'}`}
                    key={index}>
                    {index + 1}
                </button>
            ))}
            <button className='btn-pagination bg-primary-700 text-white hover:bg-primary-800 text-xl focus:ring
             focus:ring-sky-200 disabled:bg-opacity-60' disabled={currentPage === totalPage}
                onClick={() => handleNext()}>
                <Icon icon="material-symbols:chevron-right-rounded" />
            </button>
        </div>
    )
}
