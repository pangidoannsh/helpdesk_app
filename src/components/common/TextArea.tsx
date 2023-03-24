import React, { RefObject } from 'react'

interface TextAreaProps {
    label?: string;
    tagId?: string;
    inputRef: RefObject<HTMLTextAreaElement>;
    placeholder?: string;
}
export default function TextArea(props: TextAreaProps) {
    return (
        <div className='flex flex-col gap-2'>
            {props.label ?
                <label htmlFor={props.tagId} className="text-slate-600 text-sm">{props.label}</label> : ""
            }
            <textarea ref={props.inputRef} id={props.tagId}
                className="py-2 px-3 text-slate-500 border rounded focus:outline-none border-slate-300" rows={4}
                placeholder={props.placeholder ? props.placeholder : ''} />
        </div>
    )
}
