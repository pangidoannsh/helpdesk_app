import { Icon } from '@iconify/react'
import React, { useState } from 'react'


interface ListFaqProps {
    subject: string,
    description: string
}
export default function ListFaq(props: ListFaqProps) {
    const { subject, description } = props;

    const [isDrop, setIsDrop] = useState(false);

    function handleDropdown() {
        setIsDrop(prev => !prev)
    }

    return (
        <div className='py-2'>
            <div className={`flex items-start justify-between duration-300 pb-4`}>
                <div>
                    <div className='text-slate-700 text-lg'>{subject}</div>
                    <div className='text-slate-500 overflow-hidden' style={{ height: isDrop ? 'max-content' : '0px' }}>{
                        description.split('\n').map((desc: any, index: number) => (
                            <div key={index}>{desc}</div>
                        ))
                    }</div>
                </div>
                <button onClick={handleDropdown}>
                    <Icon icon='material-symbols:arrow-drop-down' className={`text-2xl text-primary-600 duration-300
                    ${isDrop ? 'rotate-180' : ''}`} />
                </button>
            </div>
            <div className='divider-bottom' />
        </div>
    )
}
