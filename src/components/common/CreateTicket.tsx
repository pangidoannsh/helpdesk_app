import FileInput from "@/components/common/FileInput";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import TextArea from "@/components/common/TextArea";
import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/Button";
import AuthApi from "@/services/authService";

const dummyPriority = [
    { value: "high", display: "High" },
    { value: "medium", display: "Medium" },
    { value: "low", display: "Low" },
]
interface CreateTicketProps {
    setIsOpen: (isOpen: boolean) => void;
    setListData?: (listData: any) => void;
}
export default function CreateTicket(props: CreateTicketProps) {
    const { setIsOpen, setListData } = props;

    const [loadingCreate, setloadingCreate] = useState(false);
    const [categoryOptions, setCategoryOptions] = useState([]);
    const [inputCategory, setinputCategory] = useState({ value: null, display: "Jenis Kategori" });
    const [inputPriority, setinputPriority] = useState({ value: "low", display: "Low" });
    const inputSubjectRef = useRef<HTMLInputElement>(null);
    const inputDescRef = useRef<HTMLTextAreaElement>(null);
    const [inputAttachment, setinputAttachment] = useState<any>(null)

    function handleAttachment(e: any) {
        // console.log(e.target.files);
        setinputAttachment(e.target.files[0])
    }
    function handleCreate(e: any) {
        setloadingCreate(true);
        const dataPost = {
            category: inputCategory.value,
            priority: inputPriority.value,
            subject: inputSubjectRef.current?.value,
            message: inputDescRef.current?.value,
            file: inputAttachment
        }
        // console.log(dataPost);
        AuthApi.post('/ticket', dataPost).then(res => {
            if (setListData) {
                setListData((prev: any) => [...prev, res.data]);
            }
            setIsOpen(false);
            alert("berhasil")
        }).catch(err => {
            console.log(err);

            alert("gagal")
        }).finally(() => setloadingCreate(false))
    }

    let isMounted = false;
    useEffect(() => {
        if (!isMounted) {
            AuthApi.get('/category').then(res => {
                setCategoryOptions(res.data.map((data: any) => ({ value: data.id, display: data.categoryName })))
            }).catch(err => {
                console.log(err);
            })
        }
        return () => {
            isMounted = true;
        }
    }, [])

    return (
        <div className="flex flex-col gap-6">
            <div className="grid grid-cols-2 gap-4 md:gap-6">
                <Select label="KATEGORI" options={categoryOptions} useSelect={[inputCategory, setinputCategory]} />
                <Select label="PRIORITAS" options={dummyPriority} useSelect={[inputPriority, setinputPriority]} />
            </div>
            <Input label="SUBJEK" tagId="subjek-id" inputRef={inputSubjectRef} />
            <TextArea inputRef={inputDescRef} label="KETERANGAN" tagId="keterangan-id" />
            <FileInput tagId="lampiran-id" label="LAMPIRAN" handleOnChange={handleAttachment} />
            <Button loading={loadingCreate} onClick={handleCreate}
                className="common-button py-2">KIRIM</Button>
        </div>
    )
}
