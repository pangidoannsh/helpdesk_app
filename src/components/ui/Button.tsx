import { Icon } from "@iconify/react";

interface ButtonPrimaryProps {
    className?: string;
    children?: any;
    loading?: boolean;
    onClick?: (event: any) => void;
}
export function Button({ className, children, loading, onClick }: ButtonPrimaryProps) {
    return (
        <button onClick={onClick}
            className={`flex justify-center bg-primary-600 hover:bg-primary-700 ${className}`}>
            {loading ? <Icon icon="eos-icons:loading" className="text-3xl" /> : children}
        </button>
    )
}