import Card from '@/components/ui/Card'
import DashboardLayout from '@/components/layouts/Dashboard'
import Select from '@/components/ui/Select'
import { api } from '@/config/api'
import { AlertContext } from '@/context/AlertProvider'
import AuthApi from '@/services/authApi'
import { parseCookies } from 'nookies'
import { useContext, useEffect, useRef, useState } from 'react'
import ScheduleTime from '@/components/dashboard/configuration-page/ScheduleTime'
import SelectNoBorder from '@/components/ui/SelectNoBorder'
import ScheduleFungsi from '@/components/dashboard/configuration-page/ScheduleFungsi'
import Button from '@/components/ui/Button'

interface ConfigurationProps {
    agentOptions: Array<any>
    base: string
    timeSchedule: Array<any>
    fungsiSchedule: Array<any>
    dataFungsi: Array<any>
}
const baseScheduleOptions = [
    { value: 'time', display: "Waktu" },
    { value: 'fungsi', display: "Fungsi" }
]

export default function AgentSchedulePage(props: ConfigurationProps) {
    const { setAlert, closeAlert } = useContext(AlertContext)

    const [baseSchedule, setBaseSchedule] = useState({
        value: props.base,
        display: props.base === "time" ? "Waktu" : "Fungsi"
    });

    return (
        <DashboardLayout title='Configuration | Helpdesk IT'>
            <Card className='rounded p-9 flex flex-col gap-6'>
                <div className="flex gap-6 items-center">
                    <h3 className='text-xl font-medium text-primary-700 uppercase'>Jadwal Tugas Agen</h3>
                    <div>
                        <SelectNoBorder useSelect={[baseSchedule, setBaseSchedule]} options={baseScheduleOptions} className='pr-6' />
                    </div>
                </div>
                {baseSchedule.value === 'time' ?
                    <ScheduleTime dataSchedule={props.timeSchedule}
                        agentOptions={props.agentOptions.map(opt => ({ value: opt.id, display: opt.name }))} /> :
                    <ScheduleFungsi dataFungsi={props.dataFungsi} dataSchedule={props.fungsiSchedule}
                        agentOptions={props.agentOptions.map(opt => ({ value: opt.id, display: opt.name }))} />}
            </Card>
            {/* <Card className='rounded p-9 flex flex-col gap-6'>
                <div className="flex gap-6 items-center">
                    <h3 className='text-xl font-medium text-primary-700 uppercase'>Jadwal Tugas Agen Berdasarkan Fungsi</h3>
                </div>
                <ScheduleFungsi dataFungsi={props.dataFungsi} dataSchedule={props.fungsiSchedule}
                    agentOptions={props.agentOptions.map(opt => ({ value: opt.id, display: opt.name }))} />
            </Card> */}
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

    let agentOptions: any = [];
    await api.get("/user/agent", {
        headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
        agentOptions = res.data
    }).catch(err => {

    })

    let base = "";
    let timeSchedule: Array<any> = [];
    let fungsiSchedule: Array<any> = [];

    await api.get(`/schedule`, {
        headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
        base = res.data.base;
        timeSchedule = res.data.timeSchedule;
        fungsiSchedule = res.data.fungsiSchedule;
    }).catch(err => {
        console.log(err.response);
    })

    let dataFungsi: Array<any> = [];
    await api.get(`/fungsi`, {
        headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
        dataFungsi = res.data
    }).catch(err => {
        console.log(err.response);
    })

    return {
        props: {
            agentOptions,
            base,
            timeSchedule,
            fungsiSchedule,
            dataFungsi
        }
    }
}