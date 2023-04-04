
export default function Dashboard() {
    return (
        <div>
            Dashboard Login
        </div>
    )
}

export async function getServerSideProps(context: any) {
    context.res.writeHead(302, { location: '/dashboard/ticket' });
    context.res.end();
}
