import { Transition } from "@headlessui/react";
import { Icon } from "@iconify/react";
import { Fragment } from "react";

interface AlertProps {
    isActived: boolean;
    code: number;
    title: string;
    message: any;
    setAlert: (alert: any) => void;
}
function Alert(props: AlertProps) {
    const { isActived, code, title, message, setAlert } = props;
    let color = "";
    let icon = "";
    if (code === 0) {
        color = "red";
        icon = "jam:triangle-danger-f";
    } else if (code === 1) {
        color = "green";
        icon = "material-symbols:check"
    } else if (code === 2) {
        color = "yellow";
        icon = "mdi:warning-circle"
    }
    function closeModal() {
        setAlert((prev: any) => ({ ...prev, isActived: false }));
    }

    return (
        <>
            <Transition appear show={isActived} as={Fragment}>
                <div className="fixed top-0 left-0 z-50 w-full overflow-y-auto">
                    <div className="flex justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <div className={`w-full max-w-md transform overflow-hidden flex bg-${color}-100 rounded
                                p-4 mb-4 text-${color}-700 items-center justify-between`}>
                                <div className="flex gap-x-2 items-center">
                                    <Icon icon={icon} className="text-2xl" />
                                    <div className='text-start'>
                                        <span className="font-medium">{title}: </span> {message}
                                    </div>
                                </div>
                                <button onClick={closeModal}>
                                    <Icon icon="material-symbols:close" className="text-lg" />
                                </button>
                            </div>
                        </Transition.Child>
                    </div>
                </div>
            </Transition>
            <span className="text-red-700 bg-red-100"></span>
            <span className="text-green-700 bg-green-100"></span>
            <span className="text-yellow-700 bg-yellow-100"></span>
        </>
    )
}

export default Alert;