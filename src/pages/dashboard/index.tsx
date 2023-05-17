import BarChart from "@/components/dashboard/BarChart";
import DoughnutChart from "@/components/dashboard/DoughnutChart";
import LineChart from "@/components/dashboard/LineChart";
import DashboardLayout from "@/components/layouts/Dashboard";
import Card from "@/components/ui/Card";
import SelectNoBorder from "@/components/ui/SelectNoBorder";
import { api } from "@/config/api";
import AuthApi from "@/services/authApi";
import { Icon } from "@iconify/react";
import { eachYearOfInterval } from "date-fns";
import { parseCookies } from "nookies";
import { useEffect, useState } from "react";

const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Juni', 'Juli', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

const status = [
    { status: 'open', icon: 'material-symbols:mail', label: 'ticket open' },
    { status: 'process', icon: 'uil:process', label: 'sedang proses' },
    { status: 'feedback', icon: 'fluent:person-feedback-16-filled', label: 'menunggu feedback' },
    { status: 'done', icon: 'material-symbols:done-rounded', label: 'ticket selesai' },
    { status: 'expired', icon: 'material-symbols:timer-off', label: 'ticket expired' },
]

const feedbackLabels = [
    {
        label: 'Sangat Puas',
        color: 'bg-primary-600',
        count: 60
    },
    {
        label: 'Puas',
        color: 'bg-secondary',
        count: 30
    },
    {
        label: 'Tidak Puas',
        color: 'bg-slate-400',
        count: 10
    },
]

const eachYearInterval = eachYearOfInterval({
    start: new Date(2020, 1, 1),
    end: new Date()
})

const yearOptions = eachYearInterval.map(date => ({ value: date.getFullYear(), display: date.getFullYear() }))
yearOptions.reverse();

interface DashboardProps {
    ticketCountEachStatus: any[],
    dataMonthlyTicket: any[],
    agents: any[],
    ticketComplete: any[]
}
export default function Dashboard(props: DashboardProps) {
    const [selectedYearMonthlyTicket, setSelectedYearMonthlyTicket] = useState(() => {
        const date = new Date();
        return yearOptions.find(year => year.value === date.getFullYear());
    })
    const [ticketCountEachStatus, setTicketCountEachStatus] = useState<any>(props.ticketCountEachStatus)
    const [dataMonthlyTicket, setDataMonthlyTicket] = useState<any>(props.dataMonthlyTicket);
    const [ticketComplete, setTicketComplete] = useState<any>(props.ticketComplete);

    function handleChangeSleectedMonthlyTicket(value: any) {
        getMonthlyTicketCount(value)

    }

    function getMonthlyTicketCount(year?: number) {
        AuthApi.get(`/ticket/monthly${year ? `?year=${year}` : ''}`).then(res => {
            setDataMonthlyTicket(res.data)
        }).catch(err => {
            console.log(err);
        })
    }
    useEffect(() => {
        // getMonthlyTicketCount();
        // AuthApi.get('/ticket/count/status').then(res => {
        //     setTicketCountEachStatus(res.data)
        // }).catch(err => {
        //     console.log(err);
        // })
    }, [])


    return (
        <DashboardLayout title="Dashboard | Helpdesk IT" content="dashboard helpdesk it">
            <div className="grid grid-cols-3 lg:grid-cols-5 gap-6">
                {status.map((data, index) => (
                    <Card className="xl:p-9 p-6 rounded flex justify-between" key={index}>
                        <div className="uppercase">
                            <div className="text-sm font-open-sans text-slate-500">{data.label}</div>
                            <div className="text-2xl font-open-sans text-slate-600">
                                {ticketCountEachStatus?.find((ticket: any) => ticket.status === data.status)?.count ?? 0}
                            </div>
                        </div>
                        <Icon icon={data.icon} className={`text-5xl ${data.status === 'open' ? 'text-green-600' :
                            data.status === 'process' ? 'text-secondary' : data.status === 'done' ? 'text-primary-600' :
                                'text-slate-400'}`} />
                    </Card>
                ))}
            </div>
            <div className="grid grid-cols-3 gap-6">
                <div className="lg:col-span-2 col-span-3 flex flex-col gap-6 lg:order-1 order-2">
                    <Card className="flex flex-col p-9 rounded gap-6">
                        <div className="flex gap-6 items-center">
                            <h3 className='text-xl font-medium text-primary-700 uppercase'>tiket bulanan</h3>
                            <div>
                                <SelectNoBorder useSelect={[selectedYearMonthlyTicket, setSelectedYearMonthlyTicket]}
                                    className='pr-6' options={yearOptions} onChange={handleChangeSleectedMonthlyTicket} />
                            </div>
                        </div>
                        <LineChart data={dataMonthlyTicket} labels={monthLabels} />
                    </Card>
                    <Card className="flex flex-col p-9 rounded gap-6">
                        <h3 className='text-xl font-medium text-primary-700 uppercase'>rata-rata penyelesaian tiket</h3>
                        <BarChart data={props.agents.map(agent => {
                            // console.log(ticketComplete);

                            return ticketComplete.find((ticket: any) => ticket.agentId === agent.id)?.timeRate ?? 0
                        })} labels={props.agents.map(agent => agent.name)} />
                    </Card>
                </div>
                <div className="flex flex-col col-span-3 lg:col-span-1 gap-6 order-1 lg:order-2">
                    <Card className="flex flex-col p-9 rounded gap-6">
                        <h3 className='text-xl font-medium text-primary-700 uppercase'>feedback</h3>
                        <div className="flex flex-col gap-6 items-center">
                            <DoughnutChart labels={feedbackLabels} />
                        </div>
                    </Card>
                    <Card className="flex flex-col p-9 rounded gap-2 relative overflow-hidden">
                        <h3 className='text-xl font-medium text-primary-700 uppercase'>Agen</h3>
                        <div className="flex flex-col gap-2">
                            <div className="text-sm text-slate-400">Jumlah Agen :</div>
                            <div className="text-6xl text-primary-700">{props.agents.length}</div>
                        </div>
                        <Icon icon='mdi:face-agent' className="absolute text-primary-600/10 top-4 right-0 
                        translate-x-10 text-[172px]" />
                    </Card>
                </div>
            </div>
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

    let ticketCountEachStatus: any[] = [];
    await api.get("/ticket/count/status", {
        headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
        ticketCountEachStatus = res.data
    }).catch(err => {

    })

    let dataMonthlyTicket: any[] = [];
    await api.get("/ticket/monthly", {
        headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
        dataMonthlyTicket = res.data
    }).catch(err => {

    })

    let agents: string[] = [];
    await api.get("/user/agent", {
        headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
        agents = res.data
    }).catch(err => {
    })

    let ticketComplete: any[] = [];
    await api.get("ticket/completion-rate", {
        headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
        ticketComplete = res.data
    }).catch(err => {

    })
    return {
        props: {
            ticketCountEachStatus,
            dataMonthlyTicket,
            agents,
            ticketComplete
        }
    }
}
