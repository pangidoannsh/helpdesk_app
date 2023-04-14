import React, { Fragment, ReactNode } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { Icon } from '@iconify/react'

interface SelectProps {
    label?: string;
    options?: Array<any>;
    useSelect: any;
    className?: string;
    icon?: string;
    width?: string;
    catchSelect?: (catches: any) => void
}
const Select = ({ label, options = [], useSelect, icon, className, width, catchSelect }: SelectProps) => {

    const [selected, setSelected] = useSelect;

    function handleSelect(select: any) {
        if (catchSelect) {
            catchSelect(select);
        }
        setSelected(select);
    }
    return (
        <div className='flex flex-col gap-2' style={{ width: width ?? "100%" }}>
            {label ? <label className={`text-sm text-slate-600`}>{label}</label> : ''}
            <Listbox value={selected} onChange={handleSelect}>
                <div className="relative">
                    <Listbox.Button className={`relative w-full ${className} bg-white py-2 pr-4 pl-2 
                    ${selected.value === null ? 'text-slate-400' : 'text-primary-600'} 
                     text-left border border-slate-300 focus:outline-none text-sm`} >
                        {icon ? <span className='absolute top-1/2 -translate-y-1/2'>
                            <Icon icon={icon} className={`text-xl`} />

                        </span> : ''}
                        <span className={`block truncate ${icon ? "translate-x-7" : ""}`}>{selected.display}</span>
                        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                            <Icon icon="material-symbols:arrow-drop-down" className="text-lg text-slate-800" />
                        </span>
                    </Listbox.Button>
                    <Transition
                        as={Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <Listbox.Options className={`absolute mt-1 max-h-60 w-full overflow-auto rounded z-10 bg-white 
                         shadow-lg shadow-slate-400/20 ring-1 ring-slate-400/20 focus:outline-none sm:text-sm`}>
                            {options.length > 0 ? (
                                options.map((option, index) => (
                                    <Listbox.Option
                                        key={index}
                                        className={({ active }) =>
                                            `relative cursor-default select-none py-2 px-4
                                        ${active ? 'bg-primary-500 bg-opacity-20 text-primary-700' : 'text-slate-500'}`
                                        }
                                        value={option}
                                    >
                                        {({ selected }) => (
                                            <span className={`block text-base truncate ${selected ? 'font-medium text-primary-700'
                                                : 'font-normal'}`}>
                                                {option.display}
                                            </span>
                                        )}
                                    </Listbox.Option>
                                ))

                            ) :
                                <div className="relative cursor-default select-none py-2 px-4 text-center text-slate-400">
                                    tidak ada pilihan
                                </div>
                            }
                        </Listbox.Options>
                    </Transition>
                </div>
            </Listbox >
        </div >
    )
}
export default Select;