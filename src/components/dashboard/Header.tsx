import Profile from "./Profile";

export default function Header() {
    return (
        <div className="flex justify-between">
            {/* Logo */}
            <div className="flex gap-2">
                <img src="/bps.svg" />
                <div className="font-open-sans">
                    <div className="font-semibold text-2xl text-gray-800 uppercase">Helpdesk</div>
                    <div className="text-gray-700">BPS RIau</div>
                </div>
            </div>
            {/* Profile */}
            <Profile />
        </div>
    )
}