import { Icon } from '@iconify/react'
import React from 'react'

interface StepperProps {
    labels?: Array<any>,
}
export default function StatusStepper({ labels }: StepperProps) {
    // console.log(labels);

    return <div>
        <ol className="flex items-center w-full lg:w-1/2">
            {labels ? labels.map((label, index) => (
                <li className={`flex items-center relative ${index !== 0 ?
                    `w-full before:content-[''] before:w-full before:h-1 before:border-b ${label.agentName ? 'before:border-primary-600/20' : ''}
                    before:border-4 before:inline-block` : ""}`} key={label.status}>
                    <span className={`flex items-center justify-center w-10 h-10 rounded-full lg:h-12 lg:w-12 shrink-0 relative step-icon
                    ${label.agentName || label.status === 'open' ? 'bg-primary-600/20 text-primary-600' : 'bg-gray-200 text-gray-400'}`}>
                        <Icon icon={label.icon} className='lg:text-xl' />
                        <div className='absolute -top-10 left-2 bg-slate-600 rounded shadow p-2 step-detail
                        uppercase text-sm text-white'>
                            {label.status}
                        </div>
                    </span>
                    <div className={`text-primary-600 text-sm absolute -right-0 -bottom-1/2`} key={label.status}>
                        {label.agentName}
                    </div>
                </li>
            )) : ''}
        </ol>
        <div className="flex mt-2">

        </div>
    </div >

}
