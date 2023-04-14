import { Icon } from '@iconify/react'
import {
    add,
    eachDayOfInterval,
    endOfMonth,
    endOfWeek,
    format,
    getDay,
    isEqual,
    isSameMonth,
    isToday,
    parse,
    parseISO,
    startOfToday,
    startOfWeek,
} from 'date-fns';
import { useEffect, useState } from 'react';
import SelectNoBorder from '../ui/SelectNoBorder';
import Modal from '../ui/Modal';
import AuthApi from '@/services/authApi';

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
    dataSchedule: Array<any>,
    handleAdd: (agentId: any, dutyTime: any) => void,
    handleDelete: (scheduleId: any) => void,
    agentOptions: Array<any>
}
const defaultAgentSelected = { value: null, display: "Pilih Agen" };

export default function ScheduleTime(props: ScheduleTimeProps) {
    const { dataSchedule, handleAdd, handleDelete } = props;

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

    const days = eachDayOfInterval({
        start: startOfWeek(firstDayCurrentMonth),
        end: endOfWeek(endOfMonth(firstDayCurrentMonth)),
    })

    function previousMonth() {
        let firstDayPrevMonth = add(firstDayCurrentMonth, { months: -1 });
        setCurrentMonth(format(firstDayPrevMonth, 'MMM-yyyy'))
    }

    function nextMonth() {
        let firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 })
        setCurrentMonth(format(firstDayNextMonth, 'MMM-yyyy'))
    }

    function handleSave() {
        handleAdd(agentSelected.value, selectedDay)
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
        handleDelete(agentDeleteSelected.value)
        setagentDeleteSelected(defaultAgentSelected);
        setopenModalDelete(false);
    }

    return (
        <>
            <div className="max-w">
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
                                        onClick={() => setSelectedDay(day)}
                                        className={`mx-auto flex h-8 w-8 items-center justify-center rounded
                                        ${'Sat Sun'.includes(format(day, 'EEE')) ? 'text-red-500' : ''}
                                        ${isToday(day) ? 'text-primary-700 font-semibold' : ''}
                                        ${isEqual(day, selectedDay) ? 'bg-primary-600 text-white' :
                                                dataSchedule.findIndex(data => isEqual(day, parseISO(data.time))) !== -1 ?
                                                    'bg-emerald-500 text-white' : ''}
                                        ${!isSameMonth(day, firstDayCurrentMonth) ? 'text-slate-400' : ''}
                                        `}
                                    >
                                        <time dateTime={format(day, 'yyyy-MM-dd')}>
                                            {format(day, 'd')}
                                        </time>
                                    </button>

                                    <div className="w-1 h-1 mx-auto mt-1">
                                        {/* {meetings.some((meeting) =>
                                            isSameDay(parseISO(meeting.startDatetime), day)
                                        ) && (
                                                <div className="w-1 h-1 rounded-full bg-sky-500"></div>
                                            )} */}
                                    </div>
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
                            {dataSchedule.filter(data => isEqual(parseISO(data.time), selectedDay)).map(agent => (
                                <div className='flex gap-1 items-center'>
                                    <button onClick={() => setUpDelete(agent)}>
                                        <Icon icon="material-symbols:close-rounded" className='text-red-500 text-lg' />
                                    </button>
                                    <span>{agent.name}</span>
                                </div>
                            ))}
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
