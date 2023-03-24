import React from 'react'

export default function Footer() {
    return (

        <footer className=" bg-white rounded shadow md:hidden absolute bottom-0 left-0 w-full">
            <div className="w-full py-4 px-6 flex items-center justify-between">
                <span className="text-sm text-gray-500">
                    © 2023 BPS Riau.
                </span>
                <ul className="flex flex-wrap items-center text-xs text-gray-500">
                    <li>
                        <a href="#" className="mr-4 hover:underline md:mr-6 uppercase">About</a>
                    </li>
                    <li>
                        <a href="#" className="mr-4 hover:underline md:mr-6 uppercase">FAQ</a>
                    </li>
                </ul>
            </div>
        </footer>

    )
}
