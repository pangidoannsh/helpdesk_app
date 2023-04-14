import Card from '@/components/ui/Card'
import DashboardLayout from '@/components/layouts/Dashboard'
import Select from '@/components/ui/Select'
import { api } from '@/config/api'
import { AlertContext } from '@/context/AlertProvider'
import AuthApi from '@/services/authApi'
import { parseCookies } from 'nookies'
import { useContext, useRef, useState } from 'react'
import ScheduleTime from '@/components/dashboard/ScheduleTime'

interface ConfigurationProps {
    agentOptions: Array<any>,
    dataSchedule: Array<any>
}
const columnTable = [
    { field: "name", header: "Nama Agen" },
    { field: "time", header: "Waktu" },
    { field: "fungsi", header: "Fungsi Asal" },
]
const baseScheduleOptions = [
    { value: 0, display: "Waktu" },
    { value: 1, display: "Fungsi" }
]

const displayData = (data: any) => {
    return {
        id: data.id,
        name: data.user.name, time: data.dutyTime,
        fungsi: data.user.fungsi ? data.user.fungsi.toUpperCase() : data.user.fungsi
    };
}

export default function ConfigurationPage(props: ConfigurationProps) {
    const { setAlert, closeAlert } = useContext(AlertContext)

    const [dataSchedule, setDataSchedule] = useState(props.dataSchedule.map((data: any) => displayData(data)));
    const [baseSchedule, setBaseSchedule] = useState({ value: 0, display: "Waktu" });

    const inputDateRef = useRef<HTMLInputElement>(null);

    function handleChangeBaseSchedule(baseScheduleSelected: any) {
        console.log(baseScheduleSelected);

    }

    function handleCreate(agentId: any, dutyTime: any) {
        const dataPost = {
            agentId,
            dutyTime
        };
        AuthApi.post('/time-schedule', dataPost).then(res => {
            setDataSchedule((prev: any) => [...prev, displayData(res.data)]);
            inputDateRef.current ? inputDateRef.current.value = "" : ''
            setAlert({
                isActived: true,
                code: 1,
                title: "Success",
                message: "Berhasil menambahkan agen ke jadwal tugas"
            })
        }).catch(err => {
            console.log(err.response);
            setAlert({
                isActived: true,
                code: 0,
                title: "Failed",
                message: err.response.data.message
            })
        }).finally(() => setTimeout(() => closeAlert(), 2000))
    }

    function handleDelete(scheduleId: any) {
        AuthApi.delete(`/time-schedule/${scheduleId}`).then(res => {
            setDataSchedule(dataSchedule.filter((data: any) => data.id !== scheduleId).map((result: any) => result));
            setAlert({
                isActived: true,
                code: 1,
                title: "Success",
                message: "Berhasil menghapus dari agen jadwal tugas"
            })
        }).catch(err => {
            setAlert({
                isActived: true,
                code: 0,
                title: "Failed",
                message: "Gagal menghapus agen dari jadwal"
            })
        }).finally(() => setTimeout(() => {
            closeAlert()
        }, 2000))
    }
    return (
        <DashboardLayout title='Configuration | Helpdesk IT'>
            <Card className='rounded p-9 flex flex-col gap-6'>
                <div className="flex gap-6 items-center">
                    <h3 className='text-xl font-medium text-primary-700 uppercase'>Jadwal Tugas Agen</h3>
                    <div>
                        <Select useSelect={[baseSchedule, setBaseSchedule]} options={baseScheduleOptions} className='rounded pr-9'
                            catchSelect={handleChangeBaseSchedule} />
                    </div>
                </div>
                {baseSchedule.value === 0 ?
                    <ScheduleTime dataSchedule={dataSchedule} handleAdd={handleCreate} handleDelete={handleDelete}
                        agentOptions={props.agentOptions.map(opt => ({ value: opt.id, display: opt.name }))} />
                    : ''}
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

    let agentOptions: any = [];
    await api.get("/user/agent", {
        headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
        agentOptions = res.data
    }).catch(err => {

    })

    let dataSchedule: any = [];
    const date = new Date();

    await api.get(`/time-schedule?month=${date.getMonth() + 1}&year=${date.getFullYear()}`, {
        headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
        dataSchedule = res.data
    }).catch(err => {

    })

    return {
        props: {
            agentOptions,
            dataSchedule
        }
    }
}