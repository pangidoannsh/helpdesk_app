import { Icon } from "@iconify/react";
import { useRouter } from "next/router"

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
]
interface DashboardNavbarProps {
    setLoadingPage: (loadingPage: boolean) => void;
}
export default function DashboardNavbar(props: DashboardNavbarProps) {
    const { setLoadingPage } = props;
    const router = useRouter();

    const handleClick = (pathname: string) => {
        setLoadingPage(!router.pathname.includes(pathname))
        router.push(pathname)
    }
    return (
        <nav className='navbar-dashboard xl:gap-12 md:gap-9 gap-6'>
            {menus.map((menu, index) => (
                <button onClick={() => handleClick(menu.pathname)}
                    className={`flex flex-col py-4 px-6 gap-1 relative font-open-sans items-center border-r-2
                ${router.pathname.includes(menu.pathname) ? 'text-primary-600 border-primary-600' :
                            'text-slate-400 border-fafafa'}`} key={index}>
                    <Icon icon={menu.icon} className="text-2xl" />
                    <span className={`text-sm uppercase 
                    ${!router.pathname.includes(menu.pathname) ? 'text-fafafa' : ''}`}>{menu.title}</span>
                    {/* <div className="absolute top-0 right-0 h-full w-[2px] bg-primary-700"></div> */}
                </button>
            ))}
        </nav>
    )
}
