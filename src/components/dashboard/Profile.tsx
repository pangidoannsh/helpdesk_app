import { UserContext } from '@/context/UserProvider'
import { Menu, Transition } from '@headlessui/react';
import { Icon } from '@iconify/react'
import Link from 'next/link';
import { Fragment, useContext, useState } from 'react'

const profileImage = "https://images.unsplash.com/photo-1552058544-f2b08422138a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=399&q=80"
export default function Profile() {
    const { user } = useContext(UserContext);
    const [drop, setDrop] = useState(false);

    return (
        <>
            <div className='flex gap-4 items-center'>
                <div style={{ backgroundImage: `url('${profileImage}')` }}
                    className="bg-no-repeat bg-center rounded w-12 h-14 bg-cover" />
                <Menu as="div" className="relative inline-block text-left">
                    <Menu.Button className="flex items-center">
                        <span className='text-slate-800'>{user.name}</span>
                        <Icon icon="material-symbols:arrow-drop-down" className='text-xl' />
                    </Menu.Button>
                    <div className='text-xs text-slate-500 capitalize'>{user.level}</div>
                    <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                    >
                        <Menu.Items className="absolute right-0 mt-2 min-w-full origin-top-right divide-y 
                        divide-gray-100 rounded bg-white shadow-dashboard ring-1 ring-black ring-opacity-5 
                        focus:outline-none">
                            <Menu.Item >
                                <Link href="/"
                                    className="text-slate-500 group flex w-full items-center rounded px-4 py-2
                                            hover:bg-primary-500/5 hover:text-primary-500 gap-1">
                                    <Icon icon="material-symbols:home-rounded" className='text-xl' />
                                    <span>Home</span>
                                </Link>
                            </Menu.Item>
                            <Menu.Item >
                                <button
                                    className="text-slate-500 group flex w-full items-center rounded px-4 py-2
                                            hover:bg-primary-500/5 hover:text-primary-500 gap-1">
                                    <Icon icon="fa6-solid:user-gear" className='text-lg' />
                                    <span>Profile</span>
                                </button>
                            </Menu.Item>
                        </Menu.Items>
                    </Transition>
                </Menu>
            </div>

        </>
    )
}
