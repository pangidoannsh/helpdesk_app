import { Icon } from '@iconify/react';
import React, { RefObject } from 'react'

interface InputProps {
    className?: string;
    label?: string;
    tagId?: string;
    type?: string;
    inputRef: RefObject<HTMLInputElement>;
    placeholder?: string;
    icon?: string;
    defaultValue?: any;
}
export default function Input(props: InputProps) {
    return (
        <div className='relative flex flex-col gap-2'>
            {props.icon ?
                <label htmlFor={props.tagId} className="absolute left-2 top-1/2 -translate-y-1/2">
                    <Icon icon={props.icon} className="text-xl text-slate-400" />
                </label> : ''
            }
            {props.label ?
                <label htmlFor={props.tagId} className="text-slate-600 text-sm">{props.label}</label> : ''
            }
            <input ref={props.inputRef} id={props.tagId} defaultValue={props.defaultValue}
                type={props.type ? props.type : "text"} className={`p-2 ${props.icon ? "pl-8" : ''}
                 text-slate-500 border focus:outline-none border-slate-300 ${props.className}`}
                placeholder={props.placeholder ? props.placeholder : ''} />
        </div>
    )
}
