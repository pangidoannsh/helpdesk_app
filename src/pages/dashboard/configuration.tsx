import Card from '@/components/ui/Card'
import DashboardLayout from '@/components/layouts/Dashboard'
import Select from '@/components/ui/Select'
import { api } from '@/config/api'
import { AlertContext } from '@/context/AlertProvider'
import AuthApi from '@/services/authApi'
import { parseCookies } from 'nookies'
import { useContext, useEffect, useRef, useState } from 'react'
import Input from '@/components/ui/Input'

interface ConfigurationProps {
    baseSchedule: string
}
const baseScheduleOptions = [
    { value: 'time', display: "Waktu" },
    { value: 'fungsi', display: "Fungsi" }
]
const modeSystemOptions = [
    { value: 1, display: "Ready" },
    { value: 2, display: "Maintenace" }
]
const tempDeadline = '4';

export default function ConfigurationPage(props: ConfigurationProps) {
    const { setAlert, closeAlert } = useContext(AlertContext)

    const [baseSchedule, setBaseSchedule] = useState({
        value: props.baseSchedule,
        display: props.baseSchedule === "time" ? "Waktu" : "Fungsi"
    });
    const [systemMode, setSystemMode] = useState({
        value: 1, display: "Ready"
    });
    const deadlineInputRef = useRef<HTMLInputElement>(null);

    function handleChangeBaseSchedule(baseScheduleSelected: any) {
        // closeAlert();
        // AuthApi.put('/config/base-schedule', {
        //     baseSchedule: baseScheduleSelected
        // }).then(res => {
        //     console.log(res.data);
        //     setAlert({
        //         isActived: true,
        //         code: 1,
        //         title: 'Update',
        //         message: 'Jadwal Berdasarkan ' + (res.data === 'time' ? 'Waktu' : 'Fungsi')
        //     })
        // }).catch(err => {
        //     console.log(err.response);
        //     setAlert({
        //         isActived: true,
        //         code: 0,
        //         title: 'Error',
        //         message: 'Gagal mengubah Jadwal'
        //     })
        //     setBaseSchedule({
        //         value: baseScheduleSelected === 'time' ? 'fungsi' : 'time',
        //         display: baseScheduleSelected === 'time' ? 'Fungsi' : 'Waktu'
        //     });
        // }).finally(() => setTimeout(() => closeAlert(), 3000))
    }
    function interval() {
        setInterval(() => {
            console.log("Testing");
        }, 1000);
    }
    useEffect(() => {
        // interval();
        // return () => {
        //     interval();
        // }
    }, [])

    return (
        <DashboardLayout title='Configuration | Helpdesk IT'>
            <Card className='rounded p-9 flex flex-col gap-6'>
                <h3 className='text-xl font-medium text-primary-700 uppercase'>Konfigurasi</h3>
                <div className="lg:w-1/4 md:w-1/2 flex flex-col gap-6">
                    <Select useSelect={[systemMode, setSystemMode]} options={modeSystemOptions} label='Mode Jadwal Agent'
                        className='pr-6 rounded' catchSelect={handleChangeBaseSchedule} />
                    <Select useSelect={[baseSchedule, setBaseSchedule]} options={baseScheduleOptions}
                        className='pr-6 rounded'
                        catchSelect={handleChangeBaseSchedule} label='Mode Sistem' />
                    <Input inputRef={deadlineInputRef} label='Tenggat Waktu Tiket(hari)' type='number' className='rounded'
                        defaultValue={tempDeadline} />
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

    let baseSchedule = "time";

    await api.get(`/config/base-schedule`, {
        headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
        baseSchedule = res.data;
    }).catch(err => {
        console.log(err.response);
    })

    return {
        props: {
            baseSchedule
        }
    }
}