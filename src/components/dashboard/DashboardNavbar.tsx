import { UserContext } from "@/context/UserProvider";
import { Icon } from "@iconify/react";
import { useRouter } from "next/router"
import { useContext } from "react";

const menus = [
    {
        title: "tiket",
        pathname: "/dashboard/ticket",
        icon: "ion:ticket"
    },
    {
        title: "faq",
        pathname: "/dashboard/faq",
        icon: "mdi:faq"
    },
    {
        title: "balas",
        pathname: "/dashboard/responses-template",
        icon: "ic:baseline-message"
    },
    {
        title: "kategori",
        pathname: "/dashboard/category",
        icon: "bxs:category"
    },
    {
        title: "fungsi",
        pathname: "/dashboard/fungsi",
        icon: "mingcute:department-fill"
    },
    {
        title: "konfigurasi",
        pathname: "/dashboard/configuration",
        icon: "material-symbols:settings-rounded",
        level: 'supervisor'
    },
]
interface DashboardNavbarProps {
    setLoadingPage: (loadingPage: boolean) => void;
}
export default function DashboardNavbar(props: DashboardNavbarProps) {
    const { setLoadingPage } = props;
    const router = useRouter();
    const { user } = useContext(UserContext);

    const handleClick = (pathname: string) => {
        setLoadingPage(!router.pathname.includes(pathname))
        router.push(pathname)
    }

    return (
        <nav className='navbar-dashboard xl:gap-9 md:gap-6 gap-4'>
            {menus.map((menu, index) => menu.level === user.level || !menu.level ?
                (
                    <button onClick={() => handleClick(menu.pathname)}
                        className={`flex flex-col py-4 px-6 gap-1 relative font-open-sans items-center border-r-2
                        ${router.pathname.includes(menu.pathname) ? 'text-primary-600 border-primary-600' :
                                'text-slate-400 border-fafafa'}`} key={index}>
                        <Icon icon={menu.icon} className="text-2xl" />
                        <span className={`text-sm uppercase 
                            ${!router.pathname.includes(menu.pathname) ? 'text-fafafa' : ''}`}>
                            {menu.title}
                        </span>
                    </button>
                ) : '')}
        </nav>
    )
}
