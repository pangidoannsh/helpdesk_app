import Image from "next/image";
import Profile from "./Profile";

export default function Header() {
    return (
        <div className="flex justify-between">
            {/* Logo */}
            <div className="flex gap-2">
                <img alt='bps logo' src="/bps.svg" />
                <div className="font-open-sans hidden md:block">
                    <div className="font-semibold text-2xl text-gray-800 uppercase">Helpdesk</div>
                    <div className="text-gray-700">BPS RIau</div>
                </div>
            </div>
            {/* Profile */}
            <Profile />
        </div>
    )
}