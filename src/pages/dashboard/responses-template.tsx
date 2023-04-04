import Card from '@/components/Card'
import Table from '@/components/dashboard/Table'
import DashboardLayout from '@/components/layouts/Dashboard'
import { Button } from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import { AlertContext } from '@/context/AlertProvider'
import AuthApi from '@/services/authApi'
import { Icon } from '@iconify/react'
import { useContext, useEffect, useRef, useState } from 'react'

const columnTable = [
    { field: "text", header: "Isi Respon", className: "p-4 text-slate-600 border-b" },
    { field: "action", header: "#", width: "130px", align: 'center' },
]
export default function ResponsesTemplate() {
    const { setAlert, closeAlert } = useContext(AlertContext);

    const [dataResponse, setDataResponse] = useState<any>([]);
    const [dataEdit, setDataEdit] = useState<any>();
    const [isEdit, setisEdit] = useState(false);

    const [dataDelete, setDataDelete] = useState<any>();
    const [openModalDelete, setopenModalDelete] = useState(false)
    const [loadingTable, setLoadingTable] = useState(true);
    const [loadingCreate, setLoadingCreate] = useState(false);
    const resInputRef = useRef<HTMLInputElement>(null);

    function displayData(data: any) {
        return {
            ...data, action: (
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
        const dataPost = {
            text: resInputRef.current?.value
        }
        setLoadingCreate(true);
        AuthApi.post("/responses", dataPost).then(res => {
            setDataResponse((prev: any) => [...prev, displayData(res.data)])
            resInputRef.current ? resInputRef.current.value = "" : ''
        }).catch(err => {
            console.log(err.response);
        }).finally(() => setLoadingCreate(false))
    }

    function setUpEdit(data: any) {
        setDataEdit(data);
        resInputRef.current ? resInputRef.current.value = data.text : ''
        setisEdit(true);
    }

    function handleUpdate(e: any) {
        e.preventDefault();
        const dataPut = {
            text: resInputRef.current?.value
        };
        setLoadingCreate(true)
        AuthApi.put(`/responses/${dataEdit.id}`, dataPut).then(res => {
            setDataResponse(dataResponse.map((data: any) => data.id === res.data.id ? displayData(res.data) : data));
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
        }).finally(() => setLoadingCreate(false))
    }
    function cancelEdit() {
        setisEdit(false)
        resInputRef.current ? resInputRef.current.value = "" : "";
        setDataEdit(null);
    }

    function setUpDelete(data: any) {
        setopenModalDelete(true);
        setDataDelete(data)
    }
    function handleDelete() {
        closeAlert();
        AuthApi.delete(`/responses/${dataDelete.id}`).then(res => {
            setDataResponse(dataResponse.filter((data: any) => data.id !== dataDelete.id).map((filter: any) => filter))
            setAlert({
                isActived: true,
                code: 1,
                title: "Success",
                message: "Berhasil Menghapus Respon"
            })
            setopenModalDelete(false);

        }).catch(err => {
            setAlert({
                isActived: true,
                code: 0,
                title: "Error " + err.response.status,
                message: "Gagal Menghapus Respon"
            })
        }).finally(() => setTimeout(() => closeAlert(), 3000))
    }
    function cancelDelete() {
        setDataDelete(null);
        setopenModalDelete(false)
    }
    useEffect(() => {
        AuthApi.get('/responses').then(res => {
            setDataResponse(res.data.map((data: any) => displayData(data)));
        }).catch(err => {
            console.log(err.response);
        }).finally(() => setLoadingTable(false))
    }, []);

    return (
        <DashboardLayout title='Responses Template | Helpdesk IT'>
            <Card className='rounded p-9 flex flex-col gap-6'>
                <h3 className='text-xl font-medium text-primary-700 uppercase'>Daftar Respon Cepat</h3>
                <Table dataBody={dataResponse} column={columnTable} emptyDataMessage="Belum Ada Data Fungsi Tersimpan"
                    loading={loadingTable} />
                {!isEdit ?
                    <form onSubmit={handleCreate} className="flex gap-4">
                        <input type="text" placeholder='Tambah Respon Baru' className='w-1/2 focus:outline-none border
                     border-slate-300 px-3 py-2 rounded text-sm text-slate-600' ref={resInputRef} />
                        <Button loading={loadingCreate} className='px-4 py-1 rounded text-white items-center'>TAMBAH</Button>
                    </form> :
                    <form onSubmit={handleUpdate} className="flex gap-4">
                        <input type="text" placeholder='Tambah Respon Baru' className='w-1/2 focus:outline-none border
                     border-slate-300 px-3 py-2 rounded text-sm text-slate-600' ref={resInputRef} />
                        <button className='px-4 py-1 rounded bg-secondary text-white'>
                            {loadingCreate ? <Icon icon="eos-icons:loading" className="text-3xl" /> : "PERBARUI"}
                        </button>
                        <span onClick={cancelEdit}
                            className='px-4 py-1 rounded border flex items-center border-red-500 text-red-500
                            cursor-pointer'>
                            BATALKAN
                        </span>
                    </form>
                }
            </Card>
            {/* Modal Konfirmasi Delete */}
            <Modal isOpen={openModalDelete} setIsOpen={setopenModalDelete} title="Delete Fungsi" size={500}>
                <div className='text-lg text-slate-700'>Apakah Anda Yakin Ingin Menghapus Response
                    <span className='uppercase text-primary-700'> "{dataDelete?.text}"</span> ?
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