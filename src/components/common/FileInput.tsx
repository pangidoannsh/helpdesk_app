import { Icon } from '@iconify/react'
import React, { RefObject } from 'react'

interface FileInputProps {
    handleOnChange: any;
    tagId: string;
    label: string;
    inputState: any;
}
export default function FileInput({ tagId, label, handleOnChange, inputState }: FileInputProps) {

    return (
        <>
            <label htmlFor={tagId} className={`flex justify-center border-[4px] border-dashed 
            rounded border-slate-300 p-4 items-center cursor-pointer relative`}>
                {inputState ? inputState.type.includes('image') ?
                    <>
                        <img src={URL.createObjectURL(inputState)} style={{ maxWidth: '100%', maxHeight: '300px' }} />
                        <div className={`absolute w-full h-full peer ${inputState ? ' hover:bg-primary-700/30' : ''}`}></div>
                        <span className='font-medium text-2xl absolute text-white peer-hover:block hidden'>Ganti {label}</span>
                    </> :
                    <div>PDF</div> :
                    <>
                        <Icon icon="material-symbols:add-rounded" className='text-2xl text-slate-400' />
                        <span className='font-medium text-slate-400 '>{label}</span>
                    </>}
            </label>
            <input type="file" id={tagId} className="hidden" onChange={handleOnChange} />
        </>
    )
}
