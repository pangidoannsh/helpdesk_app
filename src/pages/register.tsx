import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import { api } from "@/config/api";
import { GetStaticPropsContext } from "next";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

const levelOptions = [
    { value: 'pegawai', display: 'pegawai'.toUpperCase() },
    { value: 'agent', display: 'agent'.toUpperCase() },
    { value: 'supervisor', display: 'supervisor'.toUpperCase() },
]

const defaultFungsiOption = { value: null, display: 'Pilih Fungsi' }

interface RegisterProps {
    fungsiOptions: Array<any>
}
export default function RegisterPage(props: RegisterProps) {
    const router = useRouter();

    const nameRef = useRef<HTMLInputElement>(null)
    const [inputLevel, setInputLevel] = useState(levelOptions[0])
    const [fungsiOptions, setFungsiOptions] = useState([defaultFungsiOption])
    const [selectedFungsi, setSelectedFungsi] = useState(defaultFungsiOption)
    const phoneNumRef = useRef<HTMLInputElement>(null)
    const passwordRef = useRef<HTMLInputElement>(null)
    const [loadingSubmit, setLoadingSubmit] = useState(false)

    function handleSubmit(e: any) {
        e.preventDefault()
        setLoadingSubmit(true)
        const dataCreate = {
            phone: phoneNumRef.current?.value,
            password: passwordRef.current?.value,
            name: nameRef.current?.value,
            level: inputLevel.value,
            fungsiId: selectedFungsi.value
        };
        console.log(dataCreate);

        api.post('/user/register', dataCreate).then(res => {
            alert('register berhasil!')
            // router.push('/')
        }).catch(err => {
            console.log(err.response);
        }).finally(() => setLoadingSubmit(false))
    }

    useEffect(() => {
        api.get('/fungsi').then(res => {
            setFungsiOptions([defaultFungsiOption, ...res.data.map((fungsi: any) => ({ value: fungsi.id, display: fungsi.name?.toUpperCase() }))])
        }).catch(err => {
            console.log(err);

        })
    }, [])

    return (
        <Card className="shadow-lg p-9 rounded-lg absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 w-1/4">
            <form className="flex flex-col gap-6" onSubmit={(handleSubmit)}>
                <h1 className="text-4xl text-primary-700 font-open-sans font-medium">Register</h1>
                <Input inputRef={nameRef} className="rounded-lg " label="Nama" />
                <Select useSelect={[inputLevel, setInputLevel]} className="rounded-lg" label="Level" options={levelOptions} />
                <Select useSelect={[selectedFungsi, setSelectedFungsi]} className="rounded-lg" label="Fungsi" options={fungsiOptions} />
                <Input inputRef={phoneNumRef} className="rounded-lg " label="Nomor Telepon" />
                <Input inputRef={passwordRef} className="rounded-lg " label="Password" type="password" />
                <Button className="rounded py-2 text-white font-medium" loading={loadingSubmit}>SUBMIT</Button>
            </form>
        </Card>
    )
}

// export async function getStaticProps(context: GetStaticPropsContext) {
//     let fungsiOptions: Array<any> = []
//     api.get('/fungsi').then(res => {
//         console.log("Rsponse => ", res.data);

//         fungsiOptions = res.data
//     }).catch(err => {
//         console.log(err);

//     })
//     return {
//         props: {
//             fungsiOptions
//         }
//     }
// }