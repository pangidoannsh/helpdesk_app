import { api } from '@/config/api';
import { AlertContext } from '@/context/AlertProvider';
import { UserContext } from '@/context/UserProvider';
import { Dialog, Transition } from '@headlessui/react';
import { Icon } from '@iconify/react';
import Cookies from 'js-cookie';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Fragment, useContext, useRef, useState } from 'react';
import Button from '../ui/Button';
import Image from 'next/image';

interface LoginProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}
export default function Login(props: LoginProps) {
    const { user, setUser } = useContext(UserContext);
    const { alert, setAlert, closeAlert } = useContext(AlertContext);
    const router = useRouter();
    const [loadingSubmit, setloadingSubmit] = useState(false);
    const [seePassword, setseePassword] = useState(false);
    const [isFocusPassword, setIsFocusPassword] = useState(false);

    const { isOpen, setIsOpen } = props;
    const phoneInputRef = useRef<any>(null);
    const passwordInputRef = useRef<any>(null);

    function handleSubmit(e: any) {
        e.preventDefault();
        const credential = {
            phone: phoneInputRef.current?.value,
            password: passwordInputRef.current?.value,
        }

        setloadingSubmit(true);
        closeAlert();
        api.post('/auth/login', credential).then(res => {
            Cookies.set('jwt', res.data.access_token, { expires: 7 });
            // console.log(res.data);

            setUser(res.data.user_data);
            setIsOpen(false);
            setAlert({
                isActived: true,
                code: 1,
                title: "Success",
                message: "Login Berhasil"
            });
            if (res.data.user_data.level !== 'pegawai') {
                setTimeout(() => {
                    router.push('/dashboard')
                }, 1000);
            }
            setTimeout(() => {
                closeAlert();
            }, 2000);
        }).catch(err => {
            console.log(err);
            setAlert({
                isActived: true,
                code: 0,
                title: "Failed",
                message: "Login Gagal Periksa Kembali Nomor Telepon dan Password Anda"
            });
        }).finally(() => setloadingSubmit(false));
    }
    function closeModal() {
        setIsOpen(false);
    }
    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-30" onClose={closeModal} >
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-25" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto" id='modal'>
                    <div className="flex justify-center px-4 sm:px-12 py-4 text-center items-center min-h-full">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="rounded-md flex flex-col gap-12
                                 bg-white p-6 text-left align-middle shadow-xl transition-all w-full sm:w-[450px]">
                                {/* Title dari Modal */}
                                <div className="flex justify-between items-start">
                                    <LoginLogo />
                                    <button onClick={closeModal}>
                                        <Icon icon="carbon:close" className='text-2xl text-slate-500' />
                                    </button>
                                </div>
                                {/* Content dari Modal */}
                                <h4 className='font-open-sans font-semibold text-2xl text-slate-600'>LOGIN</h4>
                                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                                    {/* Phone Input */}
                                    <div className="relative mb-8 font-open-sans">
                                        <input id='phone' type="text" className='focus:outline-none bg-transparent p-1 focus:rounded
                                        border-b border-b-slate-400 w-full text-slate-400 focus:text-slate-600 peer '
                                            placeholder=" " ref={phoneInputRef} />
                                        <div className='absolute bottom-0 duration-300 w-0 peer-focus:w-full h-[2px] bg-primary-500' />
                                        <label htmlFor="phone" className="floating-label font-medium">Nomor Telepon</label>
                                    </div>
                                    {/* Password Input */}
                                    <div className="relative">
                                        {/* Input */}
                                        <input id="password" type={`${seePassword ? 'text' : 'password'}`} className='focus:outline-none
                                            bg-transparent p-1 focus:rounded border-b border-b-slate-400 w-full text-slate-400 
                                         focus:text-slate-600 peer' placeholder=" "
                                            onFocus={() => setIsFocusPassword(true)} ref={passwordInputRef} />
                                        {/* label */}
                                        <label htmlFor="password" className="floating-label font-medium">
                                            Password
                                        </label>
                                        {/* Can See Password or Not Button */}
                                        <span className={`can-see-password ${isFocusPassword ? 'inline' : 'hidden'} peer`}
                                            onClick={e => { e.preventDefault(); setseePassword(!seePassword) }}>
                                            <Icon icon={`${seePassword ? 'mdi:eye-off' : 'ic:round-remove-red-eye'}`}
                                                className='text-lg text-slate-600' />
                                        </span>
                                        {/* Border Bottom */}
                                        <div className='absolute bottom-0 duration-300 w-0 peer-focus:w-full h-[2px] bg-primary-500 ' />
                                    </div>
                                    {/* Forget Password */}
                                    <Link href="/call-center" className='hover:text-primary-500 
                                    text-xs font-open-sans text-slate-500'>Lupa Password?</Link>
                                    <Button loading={loadingSubmit}
                                        className='bg-primary-600 py-2 rounded-lg font-open-sans font-bold hover:bg-primary-700 text-white'>LOGIN</Button>
                                </form>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    )
}
const LoginLogo = () => {
    return (
        <div className="flex gap-2">
            <Image src="/bps.svg" alt="bps logo" />
            <div className='text-slate-800 font-open-sans'>
                <div className="font-semibold text-2xl">
                    HELPDESK
                </div>
                <div>BPS Riau</div>
            </div>
        </div>
    )
}
