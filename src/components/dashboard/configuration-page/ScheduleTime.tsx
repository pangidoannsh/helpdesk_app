import { Icon } from '@iconify/react'
import {
    add,
    eachDayOfInterval,
    endOfMonth,
    endOfWeek,
    format,
    getDay,
    getMonth,
    getYear,
    isEqual,
    isSameDay,
    isSameMonth,
    isSameYear,
    isToday,
    parse,
    parseISO,
    startOfDay,
    startOfMonth,
    startOfToday,
    startOfWeek,

} from 'date-fns';
import { useContext, useEffect, useRef, useState } from 'react';
import SelectNoBorder from '../../ui/SelectNoBorder';
import Modal from '../../ui/Modal';
import AuthApi from '@/services/authApi';
import { AlertContext } from '@/context/AlertProvider';
import { log } from 'console';

const displayData = (data: any) => {
    return {
        id: data.id,
        name: data.agentUser.name, time: data.dutyTime,
        fungsi: data.agentUser.fungsi?.name.toUpperCase() ?? 'undifined'
    };
}

const colStartClasses = [
    '',
    'col-start-2',
    'col-start-3',
    'col-start-4',
    'col-start-5',
    'col-start-6',
    'col-start-7',
]

function classNames(...classes: any) {
    return classes.filter(Boolean).join(' ')
}

interface ScheduleTimeProps {
    agentOptions: Array<any>
    dataSchedule: Array<any>
}
const defaultAgentSelected = { value: null, display: "Pilih Agen" };

export default function ScheduleTime(props: ScheduleTimeProps) {
    const { setAlert, closeAlert } = useContext(AlertContext)

    const [dataSchedule, setDataSchedule] = useState<any>(props.dataSchedule.map((data: any) => displayData(data)));

    // const [loading, setLoading] = useState(true);
    const today = startOfToday()
    const [selectedDay, setSelectedDay] = useState(today)
    const [currentMonth, setCurrentMonth] = useState(format(today, 'MMM-yyyy'));

    const [loadingDelete, setloadingDelete] = useState(false);
    const [agentDeleteSelected, setagentDeleteSelected] = useState(defaultAgentSelected);
    const [openModalDelete, setopenModalDelete] = useState(false);

    const [isAddSchedule, setIsAddSchedule] = useState(false);
    const [agentSelected, setAgentSelected] = useState(defaultAgentSelected);
    const [agentOptions, setAgentOptions] = useState([defaultAgentSelected, ...props.agentOptions]);
    const firstDayCurrentMonth = parse(currentMonth, 'MMM-yyyy', new Date());

    const [monthYearFetched, setMonthYearFetched] = useState<Date[]>([]);
    const days = eachDayOfInterval({
        start: startOfWeek(firstDayCurrentMonth),
        end: endOfWeek(endOfMonth(firstDayCurrentMonth)),
    })

    function previousMonth() {
        let firstDayPrevMonth = add(firstDayCurrentMonth, { months: -1 });

        if (firstDayPrevMonth < today && !(isEqual(firstDayPrevMonth, startOfMonth(today)))) {
            if (monthYearFetched.findIndex(day => isEqual(day, firstDayPrevMonth)) === -1) {
                setMonthYearFetched([...monthYearFetched, startOfDay(firstDayPrevMonth)])
                AuthApi.get(`/time-schedule?month=${getMonth(firstDayPrevMonth) + 1}&year=${getYear(firstDayPrevMonth)}`).then(res => {
                    if (res.data.length !== 0) {
                        setDataSchedule([...dataSchedule, ...res.data.map((data: any) => displayData(data))]);
                    }
                }).catch(err => {
                    console.log(err.response);
                })
            }
        }

        setCurrentMonth(format(firstDayPrevMonth, 'MMM-yyyy'))
    }

    function nextMonth() {
        let firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 })
        setCurrentMonth(format(firstDayNextMonth, 'MMM-yyyy'));
    }

    function handleSave() {
        const dataPost = {
            agentId: agentSelected.value,
            dutyTime: new Date(selectedDay.getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 19).replace('T', ' ')
        };
        AuthApi.post('/time-schedule', dataPost).then(res => {
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
        setagentDeleteSelected({ value: agent.id, display: agent.name })
        setopenModalDelete(true);
    }
    function cancelDelete() {
        setopenModalDelete(false)
    }
    function handleDeleteSchedule() {
        AuthApi.delete(`/time-schedule/${agentDeleteSelected.value}`).then(res => {
            setDataSchedule(dataSchedule.filter((data: any) => data.id !== agentDeleteSelected.value).map((result: any) => result));
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
        // handleDelete(agentDeleteSelected.value)
        setagentDeleteSelected(defaultAgentSelected);
        setopenModalDelete(false);
    }
    // console.log(dataSchedule.map((data: any) => parseISO(data.time)));
    // console.log(days.map((day: any) => dataSchedule.findIndex((schedule: any) => isSameDay(day, parseISO(schedule.time))) !== -1 ? 'x' : ''));

    return (
        <>
            <div>
                <div className="md:grid md:grid-cols-2 md:divide-x md:divide-gray-200">
                    <div className="md:pr-14">
                        <div className="flex items-center">
                            <h2 className="flex-auto font-semibold text-gray-900">
                                {format(firstDayCurrentMonth, 'MMMM yyyy')}
                            </h2>
                            <button
                                type="button"
                                onClick={previousMonth}
                                className="-my-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
                            >
                                <span className="sr-only">Previous month</span>
                                <Icon icon="material-symbols:chevron-left-rounded" className='text-2xl' />
                            </button>
                            <button
                                onClick={nextMonth}
                                type="button"
                                className="-my-1.5 -mr-1.5 ml-2 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
                            >
                                <span className="sr-only">Next month</span>
                                <Icon icon="material-symbols:chevron-right-rounded" className='text-2xl' />

                            </button>
                        </div>
                        <div className="grid grid-cols-7 mt-10 text-xs leading-6 text-center text-gray-500">
                            <div>Min</div>
                            <div>Sen</div>
                            <div>Sel</div>
                            <div>Rab</div>
                            <div>Kam</div>
                            <div>Jum</div>
                            <div>Sab</div>
                        </div>
                        <div className="grid grid-cols-7 mt-2 text-sm">
                            {days.map((day, dayIdx) => (
                                <div
                                    key={day.toString()}
                                    className={classNames(
                                        dayIdx === 0 && colStartClasses[getDay(day)],
                                        'py-1.5'
                                    )}
                                >
                                    <button
                                        type="button"
                                        onClick={() => { setSelectedDay(day); setIsAddSchedule(false) }}
                                        className={`mx-auto flex h-8 w-8 items-center justify-center rounded
                                        ${'Sat Sun'.includes(format(day, 'EEE')) ? 'text-red-500' : ''}
                                        ${isToday(day) ? 'text-primary-700 font-semibold' : ''}
                                        ${isEqual(day, selectedDay) ? 'bg-primary-600 text-white' :
                                                dataSchedule.findIndex((data: any) => isSameDay(day, parseISO(data.time))) !== -1 ?
                                                    'bg-emerald-500 text-white' : ''}
                                        ${!isSameMonth(day, firstDayCurrentMonth) ? 'text-slate-400' : ''}
                                        `}
                                    >
                                        <time dateTime={format(day, 'yyyy-MM-dd')}>
                                            {format(day, 'd')}
                                        </time>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                    <section className="mt-12 md:mt-0 md:pl-14 w-max">
                        <h2 className="font-semibold text-gray-900">
                            Jadwal untuk{' '}
                            <time dateTime={format(selectedDay, 'yyyy-MM-dd')}>
                                {format(selectedDay, 'dd MMM, yyy')}
                            </time>
                        </h2>
                        <div className="mt-4 mb-2 space-y-1 text-sm leading-6 text-gray-500 ">
                            {dataSchedule.filter((data: any) => isSameDay(parseISO(data.time), selectedDay))
                                .map((agent: any, index: number) => (
                                    <div className='flex gap-1 items-center' key={index}>
                                        <button onClick={() => setUpDelete(agent)}>
                                            <Icon icon="material-symbols:close-rounded" className='text-red-500 text-lg' />
                                        </button>
                                        <span>{agent.name}</span>
                                    </div>
                                ))
                            }
                            {isAddSchedule ? <li className='flex gap-9'>
                                <SelectNoBorder useSelect={[agentSelected, setAgentSelected]} options={agentOptions} />
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
                    </section>
                </div>
            </div>
            <Modal isOpen={openModalDelete} setIsOpen={setopenModalDelete} size={300} className='p-4'>
                <div className="flex flex-col gap-2">
                    <div className='text-slate-800'>Hapus Agen <span className='font-semibold'>{agentDeleteSelected.display}</span> dari Jadwal ?</div>
                    <div className="flex gap-2 justify-end">
                        <button className='text-red-500 hover:text-red-700'
                            onClick={() => handleDeleteSchedule()}>Hapus</button>
                        <button className='text-slate-400 hover:text-slate-600'
                            onClick={() => cancelDelete()}>Batal</button>
                    </div>
                </div>
            </Modal>
        </ >
    )
}
