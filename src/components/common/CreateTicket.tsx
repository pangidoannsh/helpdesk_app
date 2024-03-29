import FileInput from "@/components/common/FileInput";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import TextArea from "@/components/common/TextArea";
import { useContext, useEffect, useRef, useState } from "react";
import Button from "../ui/Button";
import AuthApi from "@/services/authApi";
import { AlertContext } from "@/context/AlertProvider";
import { UserContext } from "@/context/UserProvider";

const dummyPriority = [
    { value: "high", display: "High" },
    { value: "medium", display: "Medium" },
    { value: "low", display: "Low" },
]
interface CreateTicketProps {
    setIsOpen: (isOpen: boolean) => void;
    setListData?: (listData: any) => void;
}

const displayEmployee = (data: any) => {
    return {
        value: data.id, display: <div className="flex gap-9">
            <span>{data.name}</span>
            <span className="uppercase">{data.fungsi?.name ?? 'undifined'}</span>
        </div>,
        fungsiId: data.fungsi?.id ?? null
    }
}
export default function CreateTicket(props: CreateTicketProps) {
    const { user, setUser } = useContext(UserContext);
    const { setIsOpen, setListData } = props;
    const { setAlert, closeAlert } = useContext(AlertContext)
    const [loadingCreate, setloadingCreate] = useState(false);

    const [employeeOtpions, setEmployeeOtpions] = useState<Array<any>>([]);
    const [categoryOptions, setCategoryOptions] = useState([]);

    const [inputEmployee, setinputEmployee] = useState({ value: null, display: "Pegawai" });
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
        closeAlert();
        const pegawaiFungsiId = employeeOtpions.find(employee => employee.value == inputEmployee.value)?.fungsiId ?? null
        if (!pegawaiFungsiId && user.level !== 'pegawai') {
            setAlert({
                isActived: true,
                code: 0,
                title: `Error 406`,
                message: "Pegawai belum memiliki Fungsi!"
            })

            setTimeout(() => {
                closeAlert()
            }, 2000)
            return;
        }
        setloadingCreate(true);
        const dataPost = {
            fungsiId: user.level === 'pegawai' ? user.fungsi?.id ?? -1
                : pegawaiFungsiId,
            category: inputCategory.value,
            priority: inputPriority.value,
            subject: inputSubjectRef.current?.value,
            message: inputDescRef.current?.value,
            file: inputAttachment,
            userOrdererId: user.level !== 'pegawai' ? inputEmployee.value : null
        }

        // console.log(dataPost);
        AuthApi.postFile('/ticket', dataPost).then(res => {
            if (setListData) {
                setListData((prev: any) => [...prev, res.data]);
            }
            setIsOpen(false);
            setAlert({
                isActived: true,
                code: 1,
                title: "Success",
                message: "Layanan Berhasil diajukan, silahkan ke halaman Layanan untuk melihat respon agen"
            })
        }).catch(err => {
            console.log(err);
            if (err.response) {
                if (err.response.status === 400) {
                    setAlert({
                        isActived: true,
                        code: 0,
                        title: `Error ${err.response.status}`,
                        message: "Pastikan Semua Kolom input terisi!"
                    })
                } else {
                    setAlert({
                        isActived: true,
                        code: 0,
                        title: `Error ${err.response.status}`,
                        message: err.response.data.message ?? "Layanan Gagal diajukan!"
                    })
                }
            }
        }).finally(() => {
            setloadingCreate(false);
            setTimeout(() => {
                closeAlert();
            }, 3000);
        })
    }

    useEffect(() => {
        AuthApi.get('/category').then(res => {
            setCategoryOptions(res.data.map((data: any) => ({ value: data.id, display: data.categoryName })))
        }).catch(err => {
            console.log(err);
        })

        if (user.level !== "pegawai") {
            AuthApi.get('user/employee').then(res => {
                setEmployeeOtpions(res.data.map((data: any) => displayEmployee(data)));
            }).catch(err => {
                console.log(err.response);
            })
        }
    }, [])

    return (
        <div className="flex flex-col gap-6">
            {user.level !== 'pegawai' ? (
                <Select className="rounded-lg" label="PEGAWAI YANG DIPESANKAN" options={employeeOtpions}
                    useSelect={[inputEmployee, setinputEmployee]} />
            ) : ''}
            <div className="grid grid-cols-2 gap-4 md:gap-6">
                <Select className="rounded-lg" label="KATEGORI" options={categoryOptions} useSelect={[inputCategory, setinputCategory]} />
                <Select className="rounded-lg" label="PRIORITAS" options={dummyPriority} useSelect={[inputPriority, setinputPriority]} />
            </div>
            <Input className="rounded-lg" label="SUBJEK" tagId="subjek-id" inputRef={inputSubjectRef} />
            <TextArea inputRef={inputDescRef} label="KETERANGAN" tagId="keterangan-id" />
            <FileInput tagId="lampiran-id" label="LAMPIRAN (optional)" handleOnChange={handleAttachment}
                inputState={inputAttachment} />
            <Button loading={loadingCreate} onClick={handleCreate}
                className="common-button py-2">KIRIM</Button>
        </div>
    )
}
