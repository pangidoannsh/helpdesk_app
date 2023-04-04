import Card from '@/components/Card'
import Table from '@/components/dashboard/Table'
import DashboardLayout from '@/components/layouts/Dashboard'
import { Button } from '@/components/ui/Button'
import Select from '@/components/ui/Select'
import AuthApi from '@/services/authApi'
import { Icon } from '@iconify/react'
import { useEffect, useRef, useState } from 'react'

const columnTable = [
    { field: "parentOf", header: "Kategori", className: "p-4 text-slate-600 border-b uppercase" },
    { field: "categoryName", header: "Sub Kategori", className: "p-4 text-slate-600 border-b uppercase" },
    { field: "action", header: "#", width: "130px", align: 'center' },
]
const parentCategoryOptions = [
    { value: 'gangguan', display: 'Gangguan' },
    { value: 'permintaan', display: 'Permintaan' },
]
export default function CategoryPage() {
    const [dataCategory, setDataCategory] = useState<any>([]);
    const [loadingTable, setLoadingTable] = useState(true);
    const [loadingCreate, setLoadingCreate] = useState(false);
    const [parentCategory, setparentCategory] = useState({ value: null, display: "Cabang Dari Kategori" });
    const addInputRef = useRef<HTMLInputElement>(null);

    function displayData(data: any) {
        return {
            ...data, action: (
                <div className='flex justify-center gap-2'>
                    <button onClick={() => handleEdit(data.id)} className="text-white bg-secondary p-2 rounded">
                        <Icon icon="material-symbols:edit" className='text-xl' />
                    </button>
                    <button onClick={() => handleDelete(data.id)} className="text-white bg-red-500 p-2 rounded">
                        <Icon icon="fa6-solid:trash" className='text-xl' />
                    </button>
                </div>
            )
        }
    }
    function handleCreate(e: any) {
        e.preventDefault();
        const dataPost = {
            name: addInputRef.current?.value,
            parent: parentCategory.value
        }
        setLoadingCreate(true);
        AuthApi.post("/category", dataPost).then(res => {
            setDataCategory((prev: any) => [...prev, displayData(res.data)])
            addInputRef.current ? addInputRef.current.value = "" : ''
            setparentCategory({ value: null, display: "Cabang Dari Kategori" })
        }).catch(err => {
            console.log(err.response);
        }).finally(() => setLoadingCreate(false))
    }
    function handleEdit(id: any) {

    }

    function handleDelete(id: any) {

    }

    useEffect(() => {
        AuthApi.get('/category').then(res => {
            setDataCategory(res.data.map((data: any) => displayData(data)));
        }).catch(err => {
            console.log(err.response);
        }).finally(() => setLoadingTable(false))
    }, []);

    return (
        <DashboardLayout title='Responses Template | Helpdesk IT'>
            <Card className='rounded p-9 flex flex-col gap-6'>
                <h3 className='text-xl font-medium text-primary-700 uppercase'>Daftar Kategori</h3>
                <Table dataBody={dataCategory} column={columnTable} emptyDataMessage="Belum Ada Data Fungsi Tersimpan"
                    loading={loadingTable} />
                <form onSubmit={handleCreate} className="flex gap-4">
                    <Select options={parentCategoryOptions} useSelect={[parentCategory, setparentCategory]}
                        className="rounded" width='50%' />
                    <input type="text" placeholder='Tambah Sub Kategori Baru' className='w-1/2 focus:outline-none border
                     border-slate-300 px-3 py-2 rounded text-sm text-slate-600' ref={addInputRef} />
                    <Button loading={loadingCreate} className='px-4 py-1 rounded text-white items-center'>TAMBAH</Button>
                </form>
            </Card>
        </DashboardLayout>
    )
}
