import Card from '@/components/Card';
import Table from '@/components/dashboard/Table';
import TablePagination from '@/components/dashboard/TablePagination';
import Search from '@/components/dashboard/ticket/Search'
import DashboardLayout from '@/components/layouts/Dashboard';
import AuthApi from '@/services/authApi';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'

const columnTable = [
    { header: 'id tiket', field: 'idTicket' },
    { header: 'subjek', field: 'subject' },
    { header: 'kategori', field: 'category' },
    { header: 'fungsi', field: 'fungsi' },
    { header: 'prioritas', field: 'priority', width: "120px", align: 'center' },
    { header: 'status', field: 'status', width: "100px", align: 'center' },
];
const displayData = (data: any) => {
    return {
        ...data, priority: data.priority.toUpperCase(), category: data.category.categoryName, fungsi: data.fungsi.toUpperCase(),
        idTicket: <Link href={`/dashboard/ticket/${data.id}`}>
            <div className="font-medium text-ternary">#{data.id}</div>
            <div className="mt-1 text-sm text-slate-500">{data.createdAt}</div>
        </Link>,
        subject: <Link href={`/dashboard/ticket/${data.id}`}>
            <div className="font-medium text-ternary capitalize">{data.subject}</div>
            <div className="mt-1 text-sm text-slate-500">{data.userOrderer.name}</div>
        </Link>,
        status: <div className="flex justify-center items-center">
            <div className={`status text-sm ${data.status === "open" ? "text-green-500 bg-green-100" :
                data.status === "process" ? "text-secondary bg-secondary/20" :
                    data.status === "done" ? "text-primary-500 bg-sky-200" : 'text-slate-500 bg-slate-200'}`}
            >
                {data.status}
            </div>
        </div>
    }
}
export default function Ticket() {
    const [ticketData, setTicketData] = useState<any>([]);
    const [totalPage, settotalPage] = useState(1);
    const [currentPage, setcurrentPage] = useState(1);
    const [loadingTable, setloadingTable] = useState(true);

    function handleSearch(query: string) {
        AuthApi.get(`/ticket?${query}`).then(res => {
            console.log(res.data);
            setTicketData(res.data.map((data: any) => displayData(data)))
        }).catch(err => {
            console.log(err.response);
        })
    }
    useEffect(() => {
        AuthApi.get('/ticket').then(res => {
            setTicketData(res.data.map((data: any) => displayData(data)))
        }).catch(err => {
            console.log(err.response);
        }).finally(() => setloadingTable(false))
    }, [])

    return (
        <DashboardLayout title='Tiket | Helpdesk Dashboard'>
            <Search border='rounded' functionSearch={handleSearch} />
            <Card className='flex flex-col p-9 gap-6 rounded'>
                <Table column={columnTable} dataBody={ticketData} loading={loadingTable} emptyDataMessage="Tiket Kosong" />
                <div className="flex justify-between items-center">
                    <span className='text-slate-500 text-sm'>menampilkan {ticketData.length} dari {ticketData.length}</span>
                    <TablePagination totalPage={totalPage} currentPage={currentPage} />
                </div>
            </Card>
        </DashboardLayout>
    )
}
