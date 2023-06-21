import React, { RefObject, useContext, useRef, useState } from 'react'
import Button from '../ui/Button';
import { Icon } from '@iconify/react';
import AuthApi from '@/services/authApi';
import { AlertContext } from '@/context/AlertProvider';

export default function EditPassword() {
    const { closeAlert, setAlert } = useContext(AlertContext);

    const currentPass = useRef<HTMLInputElement>(null);
    const newPass = useRef<HTMLInputElement>(null);

    function handleSubmit(e: any) {
        e.preventDefault();

        if (currentPass.current?.value !== newPass.current?.value) {
            AuthApi.put('user/password', {
                currentPassword: currentPass.current?.value,
                newPassword: newPass.current?.value,
            }).then(res => {
                // console.log(res.data);
                currentPass.current?.value ? currentPass.current.value = "" : '';
                newPass.current?.value ? newPass.current.value = "" : '';
                setAlert({
                    isActived: true,
                    code: 1,
                    title: "Success",
                    message: "Password Berhasil Diubah!"
                })
            }).catch(err => {
                console.log(err.response?.data ?? err);
                let message = "Password Gagal Diubah!";
                if (err.response?.status === 406) {
                    message = "Password Salah!"
                }
                setAlert({
                    isActived: true,
                    code: 0,
                    title: "Failed",
                    message
                })
            }).finally(() => setTimeout(() => { closeAlert() }, 3000))
        }
        else {
            setAlert({
                isActived: true,
                code: 2,
                title: "Warning",
                message: "Password Lama dan Baru yang diinputkan tidak berbeda!"
            })
            setTimeout(() => { closeAlert() }, 3000);
        }
    }
    return (
        <form onSubmit={handleSubmit} className='flex flex-col gap-6'>
            <PasswordInput inputRef={newPass} className='rounded-md' label="Password Baru" />
            <PasswordInput inputRef={currentPass} className='rounded-md' label="Password Sekarang" />
            <Button className='text-white rounded-md py-2 font-medium'>
                UBAH PASSWORD
            </Button>
        </form>
    )
}

interface PasswordInputProps {
    className?: string;
    label?: string;
    tagId?: string;
    inputRef: RefObject<HTMLInputElement>;
    placeholder?: string;
    icon?: string;
    defaultValue?: any;
}
function PasswordInput(props: PasswordInputProps) {
    const [seePassword, setseePassword] = useState(false);
    const [isFocus, setIsFocus] = useState(false);

    return (
        <div className='flex flex-col gap-2'>
            <label htmlFor={props.tagId} className="text-slate-600 text-sm">{props.label}</label>
            <div className="relative">
                <input ref={props.inputRef} id={props.tagId} defaultValue={props.defaultValue}
                    onFocus={() => setIsFocus(true)}
                    type={seePassword ? "text" : "password"} className={`p-2 w-full ${props.icon ? "pl-8" : ''}
                 text-slate-500 border focus:outline-none border-slate-300 ${props.className}`}
                    placeholder={props.placeholder ? props.placeholder : ''} />
                <span className={`can-see-password top-1 ${isFocus ? 'inline' : 'hidden'}`}
                    onClick={e => { e.preventDefault(); setseePassword(!seePassword) }}>
                    <Icon icon={`${seePassword ? 'mdi:eye-off' : 'ic:round-remove-red-eye'}`}
                        className='text-lg text-slate-600' />
                </span>
            </div>
        </div>
    )
}
