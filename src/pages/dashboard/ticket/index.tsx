import Card from '@/components/ui/Card';
import Table from '@/components/dashboard/Table';
import TablePagination from '@/components/dashboard/TablePagination';
import Search from '@/components/dashboard/ticket/Search'
import DashboardLayout from '@/components/layouts/Dashboard';
import { api } from '@/config/api';
import AuthApi from '@/services/authApi';
import Link from 'next/link';
import { parseCookies } from 'nookies';
import React, { useContext, useEffect, useState } from 'react'
import Converter from '@/utils/converter';
import { Icon } from '@iconify/react';
import Modal from '@/components/ui/Modal';
import { AlertContext } from '@/context/AlertProvider';
import { useRouter } from 'next/router';
import { GetServerSidePropsContext } from 'next';

interface TicketPageProps {
    dataTicket: Array<any>
    totalData: number
    query: string
}

const columnTable = [
    { header: 'id tiket', field: 'idTicket' },
    { header: 'subjek', field: 'subject' },
    { header: 'kategori', field: 'category' },
    { header: 'fungsi', field: 'fungsi' },
    { header: 'prioritas', field: 'priority', width: "120px", align: 'center' },
    { header: 'status', field: 'status', width: "100px", align: 'center' },
];

export default function Ticket(props: TicketPageProps) {
    const router = useRouter();

    const displayData = (data: any) => {
        return {
            ...data, priority: data.priority.toUpperCase() ?? data.priority, category: data.category.categoryName,
            fungsi: data.fungsi?.name?.toUpperCase() ?? 'undifined',
            idTicket: <Link href={`/dashboard/ticket/${data.id}`}>
                <div className="font-medium text-ternary">#{data.id}</div>
                <div className="mt-1 text-sm text-slate-500">{Converter.dateToMMformat(data.createdAt)}</div>
            </Link>,
            subject: <Link href={`/dashboard/ticket/${data.id}`}>
                <div className="font-medium text-ternary capitalize">{data.subject}</div>
                <div className="mt-1 text-sm text-slate-500">{data.userOrderer.name}</div>
            </Link>,
            status: <div className="flex justify-center items-center relative status-ticket">
                <div className={`status text-sm ${data.status === "open" ? "text-green-500 bg-green-100" :
                    data.status === "process" ? "text-secondary bg-secondary/20" :
                        data.status === "done" ? "text-primary-500 bg-sky-200" :
                            data.status === "expired" ? "text-red-500 bg-red-200" :
                                'text-slate-500 bg-slate-200'}`}>
                    {data.status}
                </div>
                <button onClick={() => setupDelete(data)}
                    className={`absolute -right-5 top-1/2 -translate-y-1/2 z-20
                    ${data.status === 'expired' ? 'exp-ticket' : 'hidden'}`}>
                    <Icon icon='fa6-solid:trash' className='text-red-500 text-lg' />
                </button>
            </div>
        }
    }

    const { setAlert, closeAlert } = useContext(AlertContext);

    const [totalData, setTotalData] = useState(props.totalData)
    const [ticketData, setTicketData] = useState(props.dataTicket.map((data: any) => displayData(data)));
    const [totalPage, settotalPage] = useState(Math.ceil(props.totalData / 10));
    const [currentPage, setcurrentPage] = useState(1);
    const [loadingTable, setloadingTable] = useState(false);
    const [pageFetched, setPageFetched] = useState([1]);
    const [filterQuery, setFilterQuery] = useState(props.query);
    const [ticketDelete, setTicketDelete] = useState<any>(null);
    const [openModalDelete, setopenModalDelete] = useState(false)

    function handleSearch(query: string) {
        setloadingTable(true);
        setFilterQuery(query);
        setcurrentPage(1);
        setPageFetched([1])
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

    function handleFetchPage(page: number) {
        const currentFetched = pageFetched.map(data => data);

        for (let i = page; i > 0; i--) {
            currentFetched.push(i);
        }

        if (pageFetched.findIndex(thisPage => thisPage === page) === -1) {
            AuthApi.get(`/ticket?limit=${(page * 10) - (currentPage * 10)}&offset=${currentPage * 10}&${filterQuery}`)
                .then(res => {
                    const updateData = [...ticketData, ...res.data.map((data: any) => displayData(data))];

                    setTicketData(updateData.filter((obj, index, arr) => {
                        return arr.map(mapObj => mapObj.id).indexOf(obj.id) === index;
                    }));

                    setPageFetched(currentFetched.filter((value, index) => {
                        return currentFetched.indexOf(value) === index;
                    }))

                })
                .catch(err => {
                    console.log(err.response);
                })
        }
    }

    function setupDelete(ticket: any) {
        setTicketDelete(ticket);
        setopenModalDelete(true)

    }

    function handleDelete() {
        AuthApi.delete(`ticket/${ticketDelete.id}`).then(res => {
            setAlert({
                isActived: true,
                code: 1,
                title: 'Success',
                message: "Berhasil Menghapus Tiket!"
            })
            setTotalData(prev => prev - 1);
            console.log(res);

            setTicketData(ticketData.filter(ticket => ticket.id !== ticketDelete.id).map(data => data));
            setopenModalDelete(false)
        }).catch(err => {
            setAlert({
                isActived: true,
                code: 0,
                title: 'Failed',
                message: "Gagal Menghapus Tiket!"
            })
            console.log(err.response);
        }).finally(() => {
            setTimeout(() => {
                closeAlert()
            }, 2000)
        })
    }

    function cancelDelete() {
        setopenModalDelete(false)
    }

    useEffect(() => {
        const newTotalPage = Math.ceil(totalData / 10);
        settotalPage(newTotalPage)
        setcurrentPage(prev => newTotalPage < prev ? newTotalPage : prev)
    }, [totalData])

    return (
        <DashboardLayout title='Tiket | Helpdesk Dashboard'>
            <Search border='rounded' functionSearch={handleSearch} />
            <Card className='flex flex-col p-9 gap-6 rounded'>
                <Table column={columnTable} dataBody={ticketData.slice((currentPage - 1) * 10, currentPage * 10)}
                    emptyDataMessage="Tiket Kosong" loading={loadingTable} />
                <div className="flex justify-between items-center">
                    <span className='text-slate-500 text-sm'>menampilkan {ticketData.length} dari {totalData}</span>
                    <TablePagination totalPage={totalPage} currentPage={currentPage} setCurrentPage={setcurrentPage}
                        functionFetching={handleAddFetch} handleFetchPage={handleFetchPage} />
                </div>
            </Card>
            <Modal isOpen={openModalDelete} setIsOpen={setopenModalDelete} size={300} className='p-4'>
                <div className="flex flex-col gap-2">
                    <div className='text-slate-800'>Hapus Ticket Expired, Subjek : <span className='font-semibold'>{ticketDelete?.subject}</span> ?</div>
                    <div className="flex gap-2 justify-end">
                        <button className='text-red-500 hover:text-red-700'
                            onClick={() => handleDelete()}>Hapus</button>
                        <button className='text-slate-400 hover:text-slate-600'
                            onClick={() => cancelDelete()}>Batal</button>
                    </div>
                </div>
            </Modal>
        </DashboardLayout>
    )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const { status, subject, category, priority, fungsi } = context.query;

    let query: string = "";
    if (subject) query += `subject=${subject}&`;
    if (category) query += `category=${category}&`;
    if (status) query += `status=${status}&`;
    if (priority) query += `priority=${priority}&`;
    if (fungsi) query += `fungsi=${fungsi}&`;

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
    // secara default hanya akan mengambil data dengan status open
    await api.get("/ticket?limit=10&" + query, {
        headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
        dataTicket = res.data
    }).catch(err => {
    })

    // secara default hanya akan mengambil data dengan status open
    await api.get("/ticket/length?" + query, {
        headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
        totalData = res.data
    }).catch(err => {

    })

    return {
        props: {
            dataTicket,
            totalData,
            query
        }
    }
}