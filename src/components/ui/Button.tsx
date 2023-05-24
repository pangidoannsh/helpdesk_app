import { Icon } from "@iconify/react";

interface ButtonPrimaryProps {
    className?: string;
    children?: any;
    loading?: boolean;
    onClick?: (event: any) => void;
    disabled?: boolean
}
export default function Button({ className, children, loading, onClick, disabled }: ButtonPrimaryProps) {
    return (
        <button onClick={onClick} disabled={disabled || loading}
            className={`flex justify-center bg-primary-600 hover:bg-primary-700 ${className} disabled:bg-opacity-80
            disabled:cursor-not-allowed`}>
            {loading ? <Icon icon="eos-icons:loading" className="text-3xl" /> : children}
        </button>
    )
}