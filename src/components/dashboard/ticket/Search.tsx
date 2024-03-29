import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select';
import { api } from '@/config/api';
import React, { RefObject, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router';

const statusOptions = [
    { value: null, display: "Semua Status" },
    { value: 'open', display: "OPEN" },
    { value: 'process', display: "PROCESS" },
    { value: 'feedback', display: "FEEDBACK" },
    { value: 'done', display: "DONE" },
    { value: 'expired', display: "EXPIRED" },
]
const priorityOptions = [
    { value: null, display: "Semua Prioritas" },
    { value: 'low', display: "LOW" },
    { value: 'medium', display: "MEDIUM" },
    { value: 'high', display: "HIGH" },
]

interface SearchProps {
    refrence?: RefObject<HTMLDivElement>;
    border?: string;
    functionSearch: (query: string) => void;
    className?: string;
    withoutFungsi?: boolean;
}
export default function Search(props: SearchProps) {
    const router = useRouter();

    const { border, functionSearch } = props;

    const subjectRef = useRef<HTMLInputElement>(null);
    const [categoryOptions, setcategoryOptions] = useState<any>([]);
    const [fungsiOptions, setfungsiOptions] = useState<any>([]);

    const [categoryInput, setCategoryInput] = useState({ value: null, display: "Semua Kategori" })

    const [statusInput, setStatusInput] = useState(() => {
        const statusValue = router.query.status;
        const status = statusOptions.find(data => data.value === statusValue)
        if (statusValue && status) {
            return {
                value: status.value,
                display: status.display
            }
        }
        return {
            value: null,
            display: "Semua Status"
        }
    })

    const [priorityInput, setPriorityInput] = useState(() => {
        const priorityValue = router.query.priority;
        const priority = priorityOptions.find(data => data.value === priorityValue)
        if (priorityValue && priority) {
            return {
                value: priority.value,
                display: priority.display
            }
        }
        return { value: null, display: "Semua Prioritas" }
    })
    const [fungsiInput, setFungsiInput] = useState({ value: null, display: "Semua Fungsi" })

    const [searchLoading, setSearchLoading] = useState(false);

    const handleSearch = (e: any) => {
        e.preventDefault();
        let query: string = "";
        if (subjectRef.current?.value) query += `subject=${subjectRef.current.value}&`;
        if (categoryInput.value) query += `category=${categoryInput.value}&`;
        if (statusInput.value) query += `status=${statusInput.value}&`;
        if (priorityInput.value) query += `priority=${priorityInput.value}&`;
        if (fungsiInput.value) query += `fungsi=${fungsiInput.value}&`;
        router.push(`ticket?${query.slice(0, -1)}`)
        functionSearch(query);
    }
    useEffect(() => {

        api.get('/category').then(res => {
            const categoryId = router.query.category
            if (categoryId) {
                const category = res.data.find((data: any) => data.id === categoryId)
                if (category) {
                    setCategoryInput({ value: category.id, display: category.categoryName })
                }
            }
            setcategoryOptions([{ value: null, display: "Semua Kategori" },
            ...res.data.map((data: any) => ({ value: data.id, display: data.categoryName }))]);
        }).catch(err => {
            console.log(err.response);
        })
        if (!props.withoutFungsi) {
            api.get('/fungsi').then(res => {
                const fungsiId = router.query.fungsi
                if (fungsiId) {
                    const fungsi = res.data.find((data: any) => data.id == fungsiId)
                    if (fungsi) {
                        setFungsiInput({ value: fungsi.id, display: fungsi.name.toUpperCase() })
                    }
                }
                setfungsiOptions([{ value: null, display: "Semua Fungsi" },
                ...res.data.map((data: any) => ({ value: data.id, display: data.name.toUpperCase() }))]);
            })
        }

    }, []);

    return (
        <Card className={`${border} ${props.className}`} refrence={props.refrence}>
            <form action="" className='flex flex-col gap-6 p-6 lg:p-9'>
                <h5 className='text-xl text-primary-600'>PENCARIAN</h5>
                {!props.withoutFungsi ? <>
                    <div className="grid md:grid-cols-2 gap-2 md:gap-6">
                        <Input inputRef={subjectRef} icon="ic:baseline-search" placeholder='Semua Subjek'
                            className={`${border} text-sm`} tagId='subject-input' defaultValue={router.query.subject ?? ""} />
                        <Select useSelect={[categoryInput, setCategoryInput]} icon="bxs:category" className={`${border}`}
                            options={categoryOptions} />
                    </div>
                    <div className="grid md:grid-cols-3 gap-2 md:gap-6">
                        <Select useSelect={[statusInput, setStatusInput]} icon="fluent:status-16-filled" className={`${border}`}
                            options={statusOptions} />
                        <Select useSelect={[priorityInput, setPriorityInput]} icon="material-symbols:priority" className={`${border}`}
                            options={priorityOptions} />
                        <Select useSelect={[fungsiInput, setFungsiInput]} icon="mingcute:department-fill" className={`${border}`}
                            options={fungsiOptions} />
                    </div>
                    <Button onClick={handleSearch} loading={searchLoading}
                        className={`${border} text-white py-2 px-6`}>CARI</Button>
                </> : <>
                    <div className="flex flex-col sm:grid sm:grid-cols-2 lg:grid-cols-5 gap-x-2 gap-y-4">
                        <Input inputRef={subjectRef} icon="ic:baseline-search" placeholder='Semua Subjek' className={`${border} text-sm`}
                            tagId='subject-input' />
                        <Select useSelect={[categoryInput, setCategoryInput]} icon="bxs:category" className={`${border}`}
                            options={categoryOptions} />
                        <Select useSelect={[statusInput, setStatusInput]} icon="fluent:status-16-filled" className={`${border}`}
                            options={statusOptions} />
                        <Select useSelect={[priorityInput, setPriorityInput]} icon="material-symbols:priority" className={`${border}`}
                            options={priorityOptions} />
                        <Button onClick={handleSearch} loading={searchLoading}
                            className={`${border} text-white items-center px-6 col-span-2 lg:col-span-1 py-2`}>CARI</Button>
                    </div>
                </>}
            </form>
        </Card>
    )
}
