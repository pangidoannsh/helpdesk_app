import DashboardLayout from "@/components/layouts/Dashboard";
import Card from "@/components/ui/Card";

export default function Dashboard() {
    return (
        <DashboardLayout title="Dashboard | Helpdesk IT" content="dashboard helpdesk it">
            <Card className="p-9 rounded">
                Dashboard
            </Card>
        </DashboardLayout>
    )
}

