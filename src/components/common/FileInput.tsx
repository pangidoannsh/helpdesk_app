import { Icon } from '@iconify/react'
import React, { RefObject } from 'react'

interface FileInputProps {
    handleOnChange: any;
    tagId: string;
    label: string;
}
export default function FileInput({ tagId, label, handleOnChange }: FileInputProps) {
    return (
        <>
            <label htmlFor={tagId} className="text-slate-400 flex justify-center border-[4px] border-dashed 
            rounded border-slate-300 py-4 items-center cursor-pointer">
                <Icon icon="material-symbols:add-rounded" className='text-2xl' />
                <span className='font-medium'>{label}</span>
            </label>
            <input type="file" id={tagId} className="hidden" onChange={handleOnChange} />
        </>
    )
}
