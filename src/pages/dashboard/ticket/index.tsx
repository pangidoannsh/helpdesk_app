import Card from '@/components/ui/Card';
import Table from '@/components/dashboard/Table';
import TablePagination from '@/components/dashboard/TablePagination';
import Search from '@/components/dashboard/ticket/Search'
import DashboardLayout from '@/components/layouts/Dashboard';
import { api } from '@/config/api';
import AuthApi from '@/services/authApi';
import Link from 'next/link';
import { parseCookies } from 'nookies';
import React, { useEffect, useState } from 'react'
import { format, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';
import Converter from '@/utils/converter';

interface TicketPageProps {
    dataTicket: Array<any>;
    totalData: number
}

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
        ...data, priority: data.priority.toUpperCase() ?? data.priority, category: data.category.categoryName,
        fungsi: data.fungsi.name.toUpperCase(),
        idTicket: <Link href={`/dashboard/ticket/${data.id}`}>
            <div className="font-medium text-ternary">#{data.id}</div>
            <div className="mt-1 text-sm text-slate-500">{Converter.dateToMMformat(data.createdAt)}</div>
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
export default function Ticket(props: TicketPageProps) {
    const [totalData, setTotalData] = useState(props.totalData)
    const [ticketData, setTicketData] = useState(props.dataTicket.map((data: any) => displayData(data)));
    const [totalPage, settotalPage] = useState(Math.ceil(props.totalData / 10));
    const [currentPage, setcurrentPage] = useState(1);
    const [loadingTable, setloadingTable] = useState(false);
    const [pageFetched, setPageFetched] = useState([1]);
    const [filterQuery, setFilterQuery] = useState("");

    function handleSearch(query: string) {
        setFilterQuery(query);
        setcurrentPage(1);
        setPageFetched([1])
        setloadingTable(true);
        AuthApi.get(`/ticket?limit=10&${query}`).then(res => {
            setTicketData(res.data.map((data: any) => displayData(data)))
            AuthApi.get(`/ticket/length?${query}`).then(res => {
                setTotalData(res.data)
                settotalPage(res.data > 0 ? Math.ceil(res.data / 10) : 1)
            })
        }).catch(err => {
            console.log(err.response);
        }).finally(() => setloadingTable(false))
    }

    function handleAddFetch(offset: number) {
        if (pageFetched.findIndex(page => page === (currentPage + 1)) === -1) {
            AuthApi.get(`/ticket?limit=10&offset=${offset}&${filterQuery}`).then(res => {
                setTicketData([...ticketData, ...res.data.map((data: any) => displayData(data))]);
                setPageFetched([...pageFetched, currentPage + 1]);
            }).catch(err => {
                console.log(err.response);
            })
        }
    }
    return (
        <DashboardLayout title='Tiket | Helpdesk Dashboard'>
            <Search border='rounded' functionSearch={handleSearch} />
            <Card className='flex flex-col p-9 gap-6 rounded'>
                <Table column={columnTable} dataBody={ticketData.slice((currentPage - 1) * 10, currentPage * 10)}
                    emptyDataMessage="Tiket Kosong" loading={loadingTable} />
                <div className="flex justify-between items-center">
                    <span className='text-slate-500 text-sm'>menampilkan {ticketData.length} dari {totalData}</span>
                    <TablePagination totalPage={totalPage} currentPage={currentPage} setCurrentPage={setcurrentPage}
                        functionFetching={handleAddFetch} />
                </div>
            </Card>
        </DashboardLayout>
    )
}

export async function getServerSideProps(context: any) {
    const token = parseCookies(context).jwt;
    if (!token) {
        return {
            redirect: {
                destination: "/403",
                permanent: false,
            },
        };
    }

    let dataTicket: any = [];
    let totalData: number = 0;

    await api.get("/ticket?limit=10", {
        headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
        dataTicket = res.data
    }).catch(err => {
    })

    await api.get("/ticket/length", {
        headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
        totalData = res.data
    }).catch(err => {

    })

    return {
        props: {
            dataTicket,
            totalData
        }
    }
}