import { Icon } from "@iconify/react";
import Link from "next/link"
import { useRouter } from "next/router"

const menus = [
    {
        title: "tiket",
        pathname: "/ticket",
        icon: "ion:ticket"
    },
    {
        title: "faq",
        pathname: "/faq",
        icon: "mdi:faq"
    },
    {
        title: "balas",
        pathname: "/reply-template",
        icon: "ic:baseline-message"
    },
    {
        title: "kategori",
        pathname: "/category",
        icon: "bxs:category"
    },
    {
        title: "fungsi",
        pathname: "/department",
        icon: "mingcute:department-fill"
    },
]

export default function DashboardNavbar() {
    const router = useRouter();
    return (
        <nav className='navbar-dashboard xl:gap-12 md:gap-9 gap-6'>
            {menus.map((menu, index) => (
                <Link href={menu.pathname} className={`flex flex-col py-4 px-6 gap-1 relative font-open-sans items-center border-r-2
                ${router.pathname.includes(menu.pathname) ? 'text-primary-700 border-primary-700' :
                        'text-slate-400 border-fafafa'}`}>
                    <Icon icon={menu.icon} className="text-2xl" />
                    <span className={`text-sm uppercase 
                    ${!router.pathname.includes(menu.pathname) ? 'text-fafafa' : ''}`}>{menu.title}</span>
                    {/* <div className="absolute top-0 right-0 h-full w-[2px] bg-primary-700"></div> */}
                </Link>
            ))}
        </nav>
    )
}
