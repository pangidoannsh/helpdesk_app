import Card from '@/components/ui/Card'
import Table from '@/components/dashboard/Table'
import DashboardLayout from '@/components/layouts/Dashboard'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import Select from '@/components/ui/Select'
import { api } from '@/config/api'
import { AlertContext } from '@/context/AlertProvider'
import AuthApi from '@/services/authApi'
import { Icon } from '@iconify/react'
import { useRouter } from 'next/router'
import { parseCookies } from 'nookies'
import { useContext, useEffect, useRef, useState } from 'react'

interface CategoryPageProps {
    dataCategory: Array<any>
}
const columnTable = [
    { field: "parentOf", header: "Kategori", className: "p-4 text-slate-600 border-b uppercase" },
    { field: "categoryName", header: "Sub Kategori", className: "p-4 text-slate-600 border-b uppercase" },
    { field: "action", header: "#", width: "130px", align: 'center' },
]
const parentCategoryOptions = [
    { value: 'gangguan', display: 'Gangguan' },
    { value: 'permintaan', display: 'Permintaan' },
]
const nullParentCategory = { value: null, display: "Cabang Dari Kategori" };

export default function CategoryPage(props: CategoryPageProps) {
    const router = useRouter();

    const { setAlert, closeAlert } = useContext(AlertContext)
    const [isEdit, setisEdit] = useState(false);
    const [dataCategory, setDataCategory] = useState(props.dataCategory.map((data: any) => displayData(data)));
    const [dataEdit, setDataEdit] = useState<any>();
    const [dataDelete, setDataDelete] = useState<any>();
    const [openModalDelete, setopenModalDelete] = useState(false);

    // const [loadingTable, setLoadingTable] = useState(true);
    const [loadingCreate, setLoadingCreate] = useState(false);

    // const [editParentCategory, seteditParentCategory] = useState(nullParentCategory);
    const [parentCategory, setparentCategory] = useState(nullParentCategory);
    const inputNameRef = useRef<HTMLInputElement>(null);

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
            name: inputNameRef.current?.value,
            parent: parentCategory.value
        };

        setLoadingCreate(true);
        AuthApi.post("/category", dataPost).then(res => {
            setDataCategory((prev: any) => [...prev, displayData(res.data)])
            inputNameRef.current ? inputNameRef.current.value = "" : ''
            setparentCategory(nullParentCategory)
        }).catch(err => {
            console.log(err.response);
        }).finally(() => setLoadingCreate(false))
    }
    function setUpEdit(data: any) {
        setDataEdit(data);
        const displayParent = data.parentOf.toUpperCase();

        setparentCategory({ value: data.parentOf, display: displayParent });
        inputNameRef.current ? inputNameRef.current.value = data.categoryName : "";
        setisEdit(true);
    }
    function cancelEdit() {
        setisEdit(false)
        setparentCategory(nullParentCategory);
        inputNameRef.current ? inputNameRef.current.value = "" : "";
        setDataEdit(null);
    }
    function handleUpdate(e: any) {
        e.preventDefault();
        setLoadingCreate(true)
        const dataPut = {
            name: inputNameRef.current?.value,
            parent: parentCategory.value
        };

        AuthApi.put(`/category/${dataEdit.id}`, dataPut).then(res => {
            setDataCategory(dataCategory.map((data: any) => data.id === res.data.id ? displayData(res.data) : data));
            cancelEdit();
        }).catch(err => {
            console.log(err);
            let message = "Gagal Memperbarui Kategori";
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
    function setUpDelete(data: any) {
        setDataDelete(data);
        setopenModalDelete(true);
    }

    function handleDelete() {
        closeAlert();
        AuthApi.delete(`/category/${dataDelete.id}`).then(res => {
            setDataCategory(dataCategory.filter((data: any) => data.id !== dataDelete.id).map((category: any) => category));
            setAlert({
                isActived: true,
                code: 1,
                title: "Success",
                message: "Berhasil Menghapus Kategori " + dataDelete.categoryName
            })
            setopenModalDelete(false)
        }).catch(err => {
            console.log(err.response);

            let message = "Gagal Menghapus Kategori" + dataDelete.categoryName;
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
    function cancelDelete() {
        setopenModalDelete(false);
        setDataDelete(null)
    }

    return (
        <DashboardLayout title='Kategori Layanan | Helpdesk IT'>
            <Card className='rounded p-9 flex flex-col gap-6'>
                <h3 className='text-xl font-medium text-primary-700 uppercase'>Daftar Kategori</h3>
                <Table dataBody={dataCategory} column={columnTable} emptyDataMessage="Belum Ada Data Fungsi Tersimpan" />
                {!isEdit ?
                    <form onSubmit={handleCreate} className="flex gap-4">
                        <Select options={parentCategoryOptions} useSelect={[parentCategory, setparentCategory]}
                            className="rounded" width='50%' />
                        <input type="text" placeholder='Tambah Sub Kategori Baru' className='w-1/2 focus:outline-none border
                     border-slate-300 px-3 py-2 rounded text-sm text-slate-600' ref={inputNameRef} />
                        <Button loading={loadingCreate} className='px-4 py-1 rounded text-white items-center'>TAMBAH</Button>
                    </form> :
                    <form onSubmit={handleUpdate} className="flex gap-4">
                        <Select options={parentCategoryOptions} useSelect={[parentCategory, setparentCategory]}
                            className="rounded" width='50%' />
                        <input type="text" placeholder='Tambah Sub Kategori Baru' className='w-1/2 focus:outline-none border
                     border-slate-300 px-3 py-2 rounded text-sm text-slate-600' ref={inputNameRef} />
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
            <Modal isOpen={openModalDelete} setIsOpen={setopenModalDelete} size={300} className='p-4'>
                <div className="flex flex-col gap-2">
                    <div className='text-slate-800'>Hapus Kategori <span className='font-semibold'> {dataDelete?.categoryName}</span>?</div>
                    <div className="flex gap-2 justify-end">
                        <button className='text-red-500 hover:text-red-700'
                            onClick={() => handleDelete()}>Hapus</button>
                        <button className='text-slate-400 hover:text-slate-600'
                            onClick={() => cancelDelete()}>Batal</button>
                    </div>
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

    let dataCategory: any = [];
    await api.get("/category", {
        headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
        dataCategory = res.data
    }).catch(err => {

    })

    return {
        props: {
            dataCategory: dataCategory ? dataCategory : []
        }
    }
}