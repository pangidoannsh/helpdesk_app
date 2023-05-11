import Card from '@/components/ui/Card'
import DashboardLayout from '@/components/layouts/Dashboard'
import Select from '@/components/ui/Select'
import { api } from '@/config/api'
import { AlertContext } from '@/context/AlertProvider'
import { parseCookies } from 'nookies'
import { useContext, useRef, useState } from 'react'
import Input from '@/components/ui/Input'
import Toggle from '@/components/ui/Toggle'
import Button from '@/components/ui/Button'
import AuthApi from '@/services/authApi'

interface Config {
    BaseScheduleAgent: string,
    systemMode: string,
    isSendWhatsapp: true,
    isSendEmail: true,
    ticketDeadline: number;
}
interface ConfigurationProps {
    config: Config
}
const baseScheduleOptions = [
    { value: 'time', display: "Waktu" },
    { value: 'fungsi', display: "Fungsi" }
]
const modeSystemOptions = [
    { value: 1, display: "Ready" },
    { value: 2, display: "Maintenace" }
]

export default function ConfigurationPage(props: ConfigurationProps) {
    const { setAlert, closeAlert } = useContext(AlertContext)

    const [loadingSave, setLoadingSave] = useState(false);

    const [baseSchedule, setBaseSchedule] = useState({
        value: props.config?.BaseScheduleAgent,
        display: props.config?.BaseScheduleAgent === "time" ? "Waktu" : "Fungsi"
    });
    const [systemMode, setSystemMode] = useState({
        value: props.config.systemMode,
        display: props.config.systemMode?.charAt(0).toUpperCase() + props.config.systemMode?.slice(1)
    });

    const [isSendWhatsapp, setIsSendWhatsapp] = useState<boolean>(props.config?.isSendWhatsapp ?? false);
    const [isSendEmail, setIsSendEmail] = useState<boolean>(props.config?.isSendEmail ?? false);

    const deadlineInputRef = useRef<HTMLInputElement>(null);

    function handleSave() {
        closeAlert();
        setLoadingSave(true);
        const dataUpdate = {
            baseSchedule: baseSchedule.value,
            systemMode: systemMode.value,
            isSendWhatsapp,
            isSendEmail,
            ticketDeadline: deadlineInputRef.current?.value
        }
        AuthApi.put('/config', dataUpdate).then(res => {
            setAlert({
                isActived: true,
                code: 1,
                title: 'Success',
                message: "Berhasil mengubah Konfigurasi Sistem"
            })
        }).catch(err => {
            setAlert({
                isActived: true,
                code: 0,
                title: 'Error ' + err.response?.status ?? '',
                message: "Gagal mengubah Konfigurasi Sistem"
            })
            console.log(err.response);

        }).finally(() => {
            setLoadingSave(false);
            setTimeout(() => {
                closeAlert();
            }, 2000)
        })
    }

    return (
        <DashboardLayout title='Configuration | Helpdesk IT'>
            <Card className='rounded p-9 flex justify-center'>
                <div className="flex gap-6 flex-col lg:w-1/3 md:w-1/2">
                    <h3 className='text-xl font-medium text-primary-700 uppercase text-center'>Konfigurasi</h3>
                    <Select useSelect={[systemMode, setSystemMode]} options={modeSystemOptions} label='Mode Sistem'
                        className='pr-6 rounded' />
                    <Select useSelect={[baseSchedule, setBaseSchedule]} options={baseScheduleOptions}
                        className='pr-6 rounded' label='Mode Jadwal Agen' />
                    <Input inputRef={deadlineInputRef} label='Tenggat Waktu Tiket(hari)' type='number' className='rounded'
                        defaultValue={props.config.ticketDeadline?.toString()} />
                    <Toggle enabled={isSendWhatsapp} setEnabled={setIsSendWhatsapp} label='Kirim Notifikasi Whatsapp' />
                    <Toggle enabled={isSendEmail} setEnabled={setIsSendEmail} label='Kirim Notifikasi Email' />
                    <Button className='text-white rounded py-2' onClick={handleSave} loading={loadingSave}>SAVE</Button>
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

    let config: any = {};

    await api.get(`/config`, {
        headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
        config = res.data;
    }).catch(err => {
        console.log(err.response);
    })

    return {
        props: {
            config
        }
    }
}