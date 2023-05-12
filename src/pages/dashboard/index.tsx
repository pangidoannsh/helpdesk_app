import DashboardLayout from "@/components/layouts/Dashboard";
import Card from "@/components/ui/Card";
import { Icon } from "@iconify/react";

const status = [
    { status: 'open', count: 10, icon: 'material-symbols:mail' },
    { status: 'process', count: 10, icon: 'uil:process' },
    { status: 'done', count: 100, icon: 'material-symbols:done-rounded' },
    { status: 'expired', count: 25, icon: 'material-symbols:timer-off' },
]
export default function Dashboard() {
    return (
        <DashboardLayout title="Dashboard | Helpdesk IT" content="dashboard helpdesk it">
            <div className="grid grid-cols-4 gap-6">
                {status.map(data => (
                    <Card className="p-9 rounded flex justify-between ">
                        <div className="uppercase">
                            <div className="text-sm font-open-sans text-slate-500">tiket {data.status}</div>
                            <div className="text-2xl font-open-sans text-slate-600">{data.count}</div>
                        </div>
                        <div>
                            <Icon icon={data.icon} className={`text-5xl ${data.status === 'open' ? 'text-green-600' :
                                data.status === 'process' ? 'text-secondary' : data.status === 'done' ? 'text-primary-600' :
                                    'text-slate-400'}`} />
                        </div>
                    </Card>
                ))}
            </div>
            <div className="grid grid-cols-3 gap-6">
                <div className="col-span-2 flex flex-col gap-6">
                    <Card className="p-9 rounded">
                        <h3 className='text-xl font-medium text-primary-700 uppercase'>grafik tiket bulanan</h3>
                    </Card>
                    <Card className="p-9 rounded">
                        <h3 className='text-xl font-medium text-primary-700 uppercase'>grafik rata-rata penyelesaian tiket</h3>
                    </Card>
                </div>
                <Card className="p-9 rounded">
                    <h3 className='text-xl font-medium text-primary-700 uppercase text-center'>grefik feedback</h3>
                </Card>
            </div>
        </DashboardLayout>
    )
}

