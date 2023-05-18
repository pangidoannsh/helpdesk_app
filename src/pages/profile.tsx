import CommonLayout from '@/components/layouts/Common';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { api } from '@/config/api';
import { UserContext } from '@/context/UserProvider'
import AuthApi from '@/services/authApi';
import { GetServerSidePropsContext, GetStaticPropsContext } from 'next';
import { parseCookies } from 'nookies';
import React, { useContext, useEffect, useRef, useState } from 'react'

const defaultFungsi = {
    value: null, display: 'Pilih Fungsi'
}
const levelOptions = [
    { value: 'pegawai', display: 'PEGAWAI' },
    { value: 'agent', display: 'AGENT' }
]
interface ProfileProps {
    fungsiOptions: Array<any>,
    currentPhone: string
}
export default function ProfilePage(props: ProfileProps) {
    const { user, setUser } = useContext(UserContext)
    const nameRef = useRef<HTMLInputElement>(null)
    const phoneNumRef = useRef<HTMLInputElement>(null)
    const [fungsiOptions, setFungsiOptions] = useState(props.fungsiOptions.map((data: any) => ({ value: data.id, display: data.name?.toUpperCase() })));
    const [selectedFungsi, setSelectedFungsi] = useState(() => {
        if (user.fungsi) {
            return { value: user.fungsi.id, display: user.fungsi.name?.toUpperCase() }
        }
        return defaultFungsi
    });

    const [selectedLevel, setSelectedLevel] = useState({ value: user.level, display: user.level?.toUpperCase() })
    function handleSubmit(e: any) {
        const dataPost = {
            phone: phoneNumRef.current?.value,
            name: nameRef.current?.value,
            fungsiId: selectedFungsi.value,
            level: selectedLevel.value
        }

        AuthApi.put(`user/${user.id}`, dataPost).then(res => {
            const { fungsi, level, name } = res.data

            setUser({ ...user, fungsi, level, name })
            alert('Berhasil Update Profile')
        }).catch(err => {
            console.log(err.respnse);
            alert('error')
        })
    }
    return (
        <CommonLayout title='Profile | Helpdesk IT'>
            <Card className='absolute flex flex-col gap-6 p-9 left-1/2 -translate-x-1/2 top-32 w-1/2'>
                <h1 className='text-4xl text-primary-700 font-medium font-open-sans uppercase'>Profile</h1>
                <Input defaultValue={props.currentPhone} inputRef={phoneNumRef} className='rounded-md ' label='Nomor Telepon' />
                <Input defaultValue={user.name} inputRef={nameRef} className='rounded-md ' label='Nama' />
                <Select useSelect={[selectedFungsi, setSelectedFungsi]} options={fungsiOptions} label='Fungsi' className='rounded-md' />
                <Select useSelect={[selectedLevel, setSelectedLevel]} options={levelOptions} label='Level' className='rounded-md' />
                <Button className='text-white rounded-md py-2 font-medium' onClick={handleSubmit}>
                    SUBMIT
                </Button>
            </Card>
        </CommonLayout>
    )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const token = parseCookies(context).jwt;
    if (!token) {
        return {
            redirect: {
                destination: "/403",
                permanent: false,
            },
        };
    }

    let currentPhone: string = '';
    await api.get("/user/phone", {
        headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
        currentPhone = res.data
    }).catch(err => {

    })

    let fungsiOptions: Array<any> = [];
    await api.get('/fungsi').then(res => {
        fungsiOptions = res.data;
    }).catch(err => {
        console.log(err.response);
    })
    console.log(fungsiOptions);
    return {
        props: {
            fungsiOptions, currentPhone
        }
    }
}

