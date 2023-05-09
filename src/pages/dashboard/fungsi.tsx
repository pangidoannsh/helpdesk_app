import Card from '@/components/ui/Card'
import Table from '@/components/dashboard/Table'
import DashboardLayout from '@/components/layouts/Dashboard'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import { api } from '@/config/api'
import { AlertContext } from '@/context/AlertProvider'
import AuthApi from '@/services/authApi'
import { Icon } from '@iconify/react'
import { useRouter } from 'next/router'
import { parseCookies } from 'nookies'
import { useContext, useEffect, useRef, useState } from 'react'

interface FungsiPageProps {
    dataFungsi: Array<any>
}
const columnTable = [
    { field: "name", header: "Nama Fungsi", className: "p-4 text-slate-600 border-b uppercase" },
    { field: "action", header: "#", width: "130px", align: 'center' },
]

export default function FungsiPage(props: FungsiPageProps) {
    const router = useRouter();
    const { setAlert, closeAlert } = useContext(AlertContext)

    const [dataFungsi, setDataFungsi] = useState(props.dataFungsi.map((data: any) => displayData(data)));
    const [dataEdit, setDataEdit] = useState<any>();
    const [dataDelete, setDataDelete] = useState<any>();

    const [isEdit, setIsEdit] = useState(false);
    // const [loadingTable, setLoadingTable] = useState(true);
    const [loadingCreate, setLoadingCreate] = useState(false);
    const [openModalDelete, setopenModalDelete] = useState(false);

    const inputNameRef = useRef<HTMLInputElement>(null);

    function displayData(data: any) {
        return {
            ...data, action: (
                <div className='flex justify-center gap-2'>
                    <button onClick={() => handleSetupEdit(data)} className="text-white bg-secondary p-2 rounded">
                        <Icon icon="material-symbols:edit" className='text-xl' />
                    </button>
                    <button onClick={() => handleSetupDelete(data)} className="text-white bg-red-500 p-2 rounded">
                        <Icon icon="fa6-solid:trash" className='text-xl' />
                    </button>
                </div>
            )
        }
    }

    function handleCreate(e: any) {
        e.preventDefault();
        const dataPost = {
            fungsiname: inputNameRef.current?.value
        }
        if (dataPost.fungsiname !== "") {
            setLoadingCreate(true);
            AuthApi.post("/fungsi", dataPost).then(res => {
                setDataFungsi((prev: any) => [...prev, displayData(res.data)])
                inputNameRef.current ? inputNameRef.current.value = "" : ''
            }).catch(err => {
                console.log(err.response);
                let message = "Gagal Menambahkan Fungsi";
                if (err.response.status === 401) {
                    setTimeout(() => router.push('/'), 2000);
                    message = "User belum terautentikasi!, silahkan Login terlebih dahulu"
                };
                if (err.response.status === 403) message = "User tidak memiliki akses!";
                setAlert({
                    isActived: true,
                    code: 0,
                    title: "Error " + err.response.status,
                    message
                })
            }).finally(() => setLoadingCreate(false))
        }
    }

    function handleSetupEdit(data: any) {
        setDataEdit(data);
        inputNameRef.current ? inputNameRef.current.value = data.name : "";
        setIsEdit(true);
    }
    function handleUpdate(e: any) {
        e.preventDefault();
        const dataPut = {
            fungsiname: inputNameRef.current?.value
        };
        setLoadingCreate(true)
        AuthApi.put(`/fungsi/${dataEdit.id}`, dataPut).then(res => {
            setDataFungsi(dataFungsi.map((data: any) => data.id === res.data.id ? displayData(res.data) : data));
            cancelEdit();
        }).catch(err => {
            console.log(err.response);
            let message = "Gagal Memperbarui Fungsi";
            if (err.response.status === 401) {
                setTimeout(() => router.push('/'), 2000);
                message = "User belum terautentikasi!, silahkan Login terlebih dahulu"
            };
            if (err.response.status === 403) message = "User tidak memiliki akses!";
            setAlert({
                isActived: true,
                code: 0,
                title: "Error " + err.response.status,
                message
            })
            setTimeout(() => closeAlert(), 3000);
        }).finally(() => setLoadingCreate(false))
    }

    function cancelEdit() {
        setIsEdit(false)
        inputNameRef.current ? inputNameRef.current.value = "" : "";
        setDataEdit(null);
    }

    function handleSetupDelete(data: any) {
        setopenModalDelete(true)
        setDataDelete(data);
    }
    function cancelDelete() {
        setopenModalDelete(false);
        setDataDelete(null)
    }

    function handleDelete() {
        closeAlert();
        AuthApi.delete(`/fungsi/${dataDelete.id}`).then(res => {
            setDataFungsi(dataFungsi.filter((data: any) => data.id !== dataDelete.id).map((filter: any) => filter))
            setAlert({
                isActived: true,
                code: 1,
                title: "Success",
                message: "Berhasil Menghapus Fungsi " + dataDelete.name
            })
            setopenModalDelete(false);

        }).catch(err => {
            console.log(err.response);

            let message = "Gagal Menghapus Fungsi " + dataDelete.name;
            if (err.response.status === 401) {
                setTimeout(() => router.push('/'), 2000);
                message = "User belum terautentikasi!, silahkan Login terlebih dahulu"
            };
            if (err.response.status === 403) message = "User tidak memiliki akses!";
            setAlert({
                isActived: true,
                code: 0,
                title: "Error " + err.response.status,
                message
            })
        }).finally(() => setTimeout(() => closeAlert(), 3000))
    }

    return (
        <DashboardLayout title='Fungsi | Helpdesk IT'>
            <Card className='rounded p-9 flex flex-col gap-6'>
                <h3 className='text-xl font-medium text-primary-700 uppercase'>Daftar Fungsi</h3>
                <Table dataBody={dataFungsi} column={columnTable} emptyDataMessage="Belum Ada Data Fungsi Tersimpan" />
                {!isEdit ? <form onSubmit={handleCreate} className="flex gap-4">
                    <input type="text" placeholder='Tambah Respon Baru' className='w-1/2 focus:outline-none border
                     border-slate-300 px-3 py-2 rounded text-sm text-slate-600' ref={inputNameRef} />
                    <Button loading={loadingCreate} className='px-4 py-1 rounded text-white items-center'>TAMBAH</Button>
                </form> :
                    <form onSubmit={handleUpdate} className="flex gap-4">
                        <input type="text" placeholder='Tambah Respon Baru' className='w-1/2 focus:outline-none border
                     border-slate-300 px-3 py-2 rounded text-sm text-slate-600' ref={inputNameRef} />
                        <button className='px-4 py-1 rounded bg-secondary text-white'>
                            {loadingCreate ? <Icon icon="eos-icons:loading" className="text-3xl" /> : "PERBARUI"}
                        </button>
                        <span onClick={cancelEdit}
                            className='px-4 py-1 rounded border flex items-center border-red-500 text-red-500
                            cursor-pointer'>
                            BATALKAN
                        </span>
                    </form>}
            </Card>
            {/* Modal Konfirmasi Delete */}
            <Modal isOpen={openModalDelete} setIsOpen={setopenModalDelete} title="Delete Fungsi" size={500}>
                <div className='text-lg text-slate-700'>Apakah Anda Yakin Ingin Menghapus Fungsi
                    <span className='uppercase'> {dataDelete?.name}</span> ?
                </div>
                <div className="flex justify-end gap-2 mt-4">
                    <button className='border border-red-500 text-red-500 rounded py-2 px-4 hover:bg-red-500 
                    hover:text-white' onClick={() => handleDelete()}>
                        HAPUS
                    </button>
                    <button className='bg-slate-300 text-slate-500 rounded py-2 px-4 border hover:border-slate-500'
                        onClick={() => cancelDelete()}>
                        BATAL
                    </button>
                </div>
            </Modal>
        </DashboardLayout>
    )
}


export async function getServerSideProps(context: any) {
    const token = parseCookies(context).jwt;
    if (!token) {
        return {
            redirect: {
                destination: "/403",
                permanent: false,
            },
        };
    }

    let dataFungsi: any = [];
    await api.get("/fungsi", {
        headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
        dataFungsi = res.data
    }).catch(err => {

    })

    return {
        props: {
            dataFungsi: dataFungsi ? dataFungsi : []
        }
    }
}
