import { Dialog, Transition } from '@headlessui/react'
import { Icon } from '@iconify/react'
import React, { Fragment, ReactNode } from 'react'

interface ModalProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    title?: any;
    size?: string | ReactNode;
    children: ReactNode;
    rounded?: string;
}
const Modal = ({ isOpen, setIsOpen, title, size, children, rounded }: ModalProps) => {
    function closeModal() {
        setIsOpen(false)
    }

    return (
        <>
            <Transition appear show={isOpen} as={Fragment}>
                <Dialog as="div" className={`relative z-30`} onClose={closeModal} >
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black bg-opacity-25" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto" id='modal'>
                        <div className="flex justify-center px-2 md:px-12 py-4 text-center items-center min-h-full">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className={`${rounded ?? "rounded"} 
                                 bg-white p-6 md:p-8 text-left align-middle shadow-xl transition-all`}
                                    style={{ width: size ? `${size}px` : '100%' }}>
                                    {/* Title dari Modal */}
                                    {title ? (
                                        <div className="flex justify-between pb-6 divider-bottom mb-4">
                                            <div className='text-2xl text-slate-500'>{title}</div>
                                            <button onClick={closeModal}>
                                                <Icon icon="carbon:close" className='text-[28px] text-slate-500' />
                                            </button>
                                        </div>
                                    ) : ''}
                                    {/* Content dari Modal */}
                                    {children}
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    )
}

export default Modal;