import Modal from '@/components/ui/Modal';
import SelectNoBorder from '@/components/ui/SelectNoBorder';
import { AlertContext } from '@/context/AlertProvider';
import AuthApi from '@/services/authApi';
import { Icon } from '@iconify/react';
import React, { useContext, useEffect, useState } from 'react'

interface ScheduleFungsiProps {
    dataFungsi: Array<any>
    agentOptions: Array<any>
    dataSchedule: Array<any>
}
const defaultAgentSelected = { value: null, display: "Pilih Agen" };

function displayData(data: any) {
    return { id: data.id, name: data.agentUser.name, fungsiId: data.fungsi.id }
}

export default function ScheduleFungsi(props: ScheduleFungsiProps) {
    const { dataFungsi } = props;
    const { setAlert, closeAlert } = useContext(AlertContext)
    const [dataSchedule, setDataSchedule] = useState(props.dataSchedule.map(data => displayData(data)))
    const [fungsiSelected, setFungsiSelected] = useState({ id: null, name: "" });

    const [agentSelected, setAgentSelected] = useState(defaultAgentSelected);
    const [isAddSchedule, setIsAddSchedule] = useState(false);
    const [scheduleDelSelected, setscheduleDelSelected] = useState(defaultAgentSelected);
    const [openModalDelete, setopenModalDelete] = useState(false)

    function handleSelectFungsi(fungsi: any) {
        setFungsiSelected({ id: fungsi.id, name: fungsi.name });
        setIsAddSchedule(false)
    }

    function handleSave() {
        const dataPost = {
            agentId: agentSelected.value,
            fungsiId: fungsiSelected.id
        };
        AuthApi.post('/fungsi-schedule', dataPost).then(res => {
            setDataSchedule((prev: any) => [...prev, displayData(res.data)]);
            setAlert({
                isActived: true,
                code: 1,
                title: "Success",
                message: "Berhasil menambahkan agen ke jadwal tugas"
            })
        }).catch(err => {
            console.log(err.response);
            setAlert({
                isActived: true,
                code: 0,
                title: "Failed",
                message: err.response.data.message
            })
        }).finally(() => setTimeout(() => closeAlert(), 2000))
        // handleAdd(agentSelected.value, selectedDay)
        setAgentSelected(defaultAgentSelected);
        setIsAddSchedule(false);
    }

    function setUpDelete(agent: any) {
        setscheduleDelSelected({ value: agent.id, display: agent.name })
        setopenModalDelete(true);
    }

    function cancelDelete() {
        setopenModalDelete(false)
    }
    function handleDeleteSchedule() {
        AuthApi.delete(`/fungsi-schedule/${scheduleDelSelected.value}`).then(res => {
            setDataSchedule(dataSchedule.filter((data: any) => data.id !== scheduleDelSelected.value).map((result: any) => result));
            setAlert({
                isActived: true,
                code: 1,
                title: "Success",
                message: "Berhasil menghapus dari agen jadwal tugas"
            })
        }).catch(err => {
            setAlert({
                isActived: true,
                code: 0,
                title: "Failed",
                message: "Gagal menghapus agen dari jadwal"
            })
        }).finally(() => setTimeout(() => {
            closeAlert()
        }, 2000))

        setscheduleDelSelected(defaultAgentSelected);
        setopenModalDelete(false);
    }
    return (
        <>
            <div className='flex gap-6'>
                <div className="w-1/2 grid grid-cols-4 gap-6">
                    {dataFungsi.map((data, index) =>
                        <button key={index} onClick={() => handleSelectFungsi(data)}
                            className={`rounded py-2 px-3 uppercase 
                    ${fungsiSelected.id === data.id ? 'bg-primary-600 text-white' : 'text-slate-500'}
                    ${dataSchedule.findIndex(schedule => schedule.fungsiId === data.id) !== -1 ? 'bg-emerald-500 text-white'
                                    : ''}`}
                        >
                            {data.name}
                        </button>)}
                </div>
                <div className="bg-gray-200 w-[1px]" />
                <div className="w-1/2">
                    <h2 className="font-semibold text-gray-900">
                        Jadwal Untuk Fungsi
                        <span className='uppercase'> {fungsiSelected.name}</span>
                    </h2>
                    <div className="mt-4 mb-2 space-y-1 text-sm leading-6 text-gray-500 ">
                        {dataSchedule.filter((data: any) => data.fungsiId === fungsiSelected.id)
                            .map((agent: any, index: number) => (
                                <div className='flex gap-1 items-center' key={index}>
                                    <button onClick={() => setUpDelete(agent)}>
                                        <Icon icon="material-symbols:close-rounded" className='text-red-500 text-lg' />
                                    </button>
                                    <span>{agent.name}</span>
                                </div>
                            ))
                        }
                        {isAddSchedule ? <li className='flex gap-9 w-max'>
                            <SelectNoBorder useSelect={[agentSelected, setAgentSelected]}
                                options={[defaultAgentSelected, ...props.agentOptions]} />
                            <div className="flex gap-3">
                                <button className='text-primary-500 hover:text-primary-700 text-base'
                                    onClick={handleSave}>
                                    Simpan
                                </button>
                                <button className='text-red-500 hover:text-red-700 text-base'
                                    onClick={() => { setIsAddSchedule(false); setAgentSelected(defaultAgentSelected) }}>
                                    Batal
                                </button>
                            </div>
                        </li> : ''}
                    </div>
                    {
                        !isAddSchedule ?
                            <button className='w-full rounded flex items-center text-primary-500 hover:text-primary-700'
                                onClick={() => setIsAddSchedule(true)}>
                                <Icon icon="material-symbols:add-rounded" className='text-xl' />
                                <span>Tambah</span>
                            </button>
                            : ''
                    }
                </div>
            </div>
            <Modal isOpen={openModalDelete} setIsOpen={setopenModalDelete} size={300} className='p-4'>
                <div className="flex flex-col gap-2">
                    <div className='text-slate-800'>Hapus Agen <span className='font-semibold'>{scheduleDelSelected.display}</span> dari Jadwal ?</div>
                    <div className="flex gap-2 justify-end">
                        <button className='text-red-500 hover:text-red-700'
                            onClick={() => handleDeleteSchedule()}>Hapus</button>
                        <button className='text-slate-400 hover:text-slate-600'
                            onClick={() => cancelDelete()}>Batal</button>
                    </div>
                </div>
            </Modal>
        </>
    )
}
