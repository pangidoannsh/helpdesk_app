import EditPassword from '@/components/common/EditPassword';
import CommonLayout from '@/components/layouts/Common';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { api } from '@/config/api';
import { AlertContext } from '@/context/AlertProvider';
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
    const { setAlert, closeAlert } = useContext(AlertContext)
    const nameRef = useRef<HTMLInputElement>(null)
    const phoneNumRef = useRef<HTMLInputElement>(null)
    const [fungsiOptions, setFungsiOptions] = useState(props.fungsiOptions.map((data: any) => ({ value: data.id, display: data.name?.toUpperCase() })));
    const [selectedFungsi, setSelectedFungsi] = useState(defaultFungsi);

    const [selectedLevel, setSelectedLevel] = useState<{ value: any, display: string }>({ value: null, display: "Pilih Level" })
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
            setAlert({
                isActived: true,
                code: 1,
                title: 'Success',
                message: 'Profile Berhasil Diubah'
            })
        }).catch(err => {
            console.log(err);
            setAlert({
                isActived: true,
                code: 0,
                title: 'Error ' + err.response?.status,
                message: err.response?.data.message.join(', ') ?? 'Gagal Update Data'
            })
        })
    }

    useEffect(() => {
        if (user.fungsi) {
            setSelectedFungsi({ value: user.fungsi.id, display: user.fungsi.name?.toUpperCase() })
        }
        if (user.level) {
            setSelectedLevel({ value: user.level, display: user.level?.toUpperCase() })
        }
    }, [user])
    return (
        <CommonLayout title='Profile | Helpdesk IT'>
            <section className='absolute left-1/2 -translate-x-1/2 top-32 w-1/2'>
                <Card className='flex flex-col gap-6 p-9 rounded-md'>
                    <h1 className='text-4xl text-primary-700 font-medium font-open-sans uppercase'>Profile</h1>
                    <Input defaultValue={props.currentPhone} inputRef={phoneNumRef} className='rounded-md ' label='Nomor Telepon' />
                    <Input defaultValue={user.name} inputRef={nameRef} className='rounded-md ' label='Nama' />
                    <Select useSelect={[selectedFungsi, setSelectedFungsi]} options={fungsiOptions} label='Fungsi' className='rounded-md' />
                    <Select useSelect={[selectedLevel, setSelectedLevel]} options={levelOptions} label='Level' className='rounded-md' />
                    <Button className='text-white rounded-md py-2 font-medium' onClick={handleSubmit}>
                        SUBMIT
                    </Button>
                </Card>
                <Card className='flex flex-col gap-6 p-9 mt-6 rounded-md'>
                    <h1 className='text-4xl text-primary-700 font-medium font-open-sans uppercase'>Ubah Password</h1>
                    <EditPassword />
                </Card>
            </section>
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
    return {
        props: {
            fungsiOptions, currentPhone
        }
    }
}

