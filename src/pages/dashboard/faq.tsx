import TextArea from '@/components/common/TextArea'
import Table from '@/components/dashboard/Table'
import DashboardLayout from '@/components/layouts/Dashboard'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import { api } from '@/config/api'
import { AlertContext } from '@/context/AlertProvider'
import AuthApi from '@/services/authApi'
import { Icon } from '@iconify/react'
import { GetStaticPropsContext } from 'next'
import React, { useContext, useRef, useState } from 'react'

const columnTable = [
    { field: "subject", header: "Subjek" },
    { field: "description", header: "Deskripsi" },
    { field: "action", header: "#", width: "130px", align: 'center' },
]

interface FaqProps {
    dataFaq: Array<any>
}
export default function faq(props: FaqProps) {
    const { setAlert, closeAlert } = useContext(AlertContext)
    console.log(props.dataFaq);

    const [dataFaq, setDataFaq] = useState(props.dataFaq.map(data => displayData(data)));
    const [isEdit, setisEdit] = useState(false);
    const [loadingCreate, setloadingCreate] = useState(false);
    const subjectRef = useRef<HTMLInputElement>(null);
    const descRef = useRef<HTMLTextAreaElement>(null);
    const [dataEdit, setDataEdit] = useState<any>();
    const [dataDelete, setDataDelete] = useState<any>();

    function displayData(data: any) {
        const { description } = data;
        const descArr = description.split('\n');
        return {
            ...data, description: (
                <div className="flex flex-col">
                    {descArr.map((desc: any, index: number) => (
                        <span key={index}>{desc}</span>
                    ))}
                </div>
            ),
            action: (
                <div className='flex justify-center gap-2'>
                    <button onClick={() => setUpEdit(data)} className="text-white bg-secondary p-2 rounded">
                        <Icon icon="material-symbols:edit" className='text-xl' />
                    </button>
                    <button onClick={() => setUpDelete(data)} className="text-white bg-red-500 p-2 rounded">
                        <Icon icon="fa6-solid:trash" className='text-xl' />
                    </button>
                </div>
            )
        }
    }

    function handleCreate(e: any) {
        e.preventDefault();

        setloadingCreate(true)

        const dataPost = {
            subject: subjectRef.current?.value,
            description: descRef.current?.value
        }
        AuthApi.post('faq', dataPost).then(res => {
            setDataFaq([...dataFaq, displayData(res.data)])
            subjectRef.current ? subjectRef.current.value = '' : ''
            descRef.current ? descRef.current.value = '' : ''
        }).catch(err => {
            console.log(err);
            setAlert({
                isActived: true,
                code: 0,
                title: err.response ? 'Error ' + err.response.status : 'Failed',
                message: 'Gagal Menambahkan FAQ'
            })
            setTimeout(() => closeAlert(), 3000);
        }).finally(() => setloadingCreate(false))
    }

    function setUpEdit(data: any) {
        setDataEdit(data)
        subjectRef.current ? subjectRef.current.value = data.subject : ''
        descRef.current ? descRef.current.value = data.description : ''
        setisEdit(true)
    }

    function cancelEdit() {
        setisEdit(false)
    }

    function handleUpdate(e: any) {
        e.preventDefault();

        e.preventDefault();
        const dataPut = {
            subject: subjectRef.current?.value,
            description: descRef.current?.value,
        };
        setloadingCreate(true)
        AuthApi.put(`/faq/${dataEdit.id}`, dataPut).then(res => {
            setDataFaq(dataFaq.map((data: any) => data.id === res.data.id ? displayData(res.data) : data));
            cancelEdit();
        }).catch(err => {
            console.log(err.response);
            setAlert({
                isActived: true,
                code: 0,
                title: "Error " + err.response.status,
                message: "Gagal Memperbarui Respon"
            })
            setTimeout(() => closeAlert(), 3000);
        }).finally(() => setloadingCreate(false))
    }

    function setUpDelete(data: any) {

    }

    function cancelDelete() {

    }

    return (
        <DashboardLayout title='FAQ Dashboard | Helpdesk IT'>
            <Card className='rounded p-9 flex flex-col gap-6'>
                <h3 className='text-xl font-medium text-primary-700 uppercase'>FAQ</h3>
                <Table dataBody={dataFaq} column={columnTable} emptyDataMessage='tidak ada FAQ' />
                <form onSubmit={!isEdit ? handleCreate : handleUpdate} className="flex flex-col gap-4 w-3/4 mx-auto">
                    <input type="text" placeholder='Subjek FAQ Baru' className='focus:outline-none border
                     border-slate-300 px-3 py-2 rounded text-sm text-slate-600' ref={subjectRef} />
                    <TextArea inputRef={descRef} className='rounded' placeholder='Deskripsi FAQ' />
                    {!isEdit ?
                        <Button loading={loadingCreate} className='px-4 py-1 rounded text-white items-center'>TAMBAH</Button> :
                        (<>
                            <button className='px-4 py-1 rounded bg-secondary text-white'>
                                {loadingCreate ? <Icon icon="eos-icons:loading" className="text-3xl" /> : "PERBARUI"}
                            </button>
                            <span onClick={cancelEdit}
                                className='px-4 py-1 rounded border flex items-center border-red-500 text-red-500
                            cursor-pointer justify-center'>
                                BATALKAN
                            </span>
                        </>)
                    }
                </form>
            </Card>
        </DashboardLayout>
    )
}

export async function getStaticProps(context: GetStaticPropsContext) {
    let dataFaq: Array<any> = [];
    await api.get('/faq').then(res => {
        dataFaq = res.data

    }).catch(err => {

    })

    return {
        props: {
            dataFaq
        }
    }
}
