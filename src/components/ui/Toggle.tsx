import { useState } from 'react'
import { Switch } from '@headlessui/react'

interface ToggleProps {
    label?: string;
    enabled: boolean;
    setEnabled: (enabled: boolean) => void;
}
export default function Toggle(props: ToggleProps) {
    const { enabled, setEnabled } = props;
    return (
        <div className="flex items-center justify-between">
            <span className='text-slate-600'>{props.label}</span>
            <Switch
                checked={enabled}
                onChange={setEnabled}
                className={`${enabled ? 'bg-primary-600' : 'bg-slate-200 shadow-inner'}
          relative inline-flex h-[30] w-[55px] shrink-0 cursor-pointer rounded-full border-2 border-transparent 
          transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white 
          focus-visible:ring-opacity-75`}
            >
                <span className="sr-only">Use setting</span>
                <span
                    aria-hidden="true"
                    className={`${enabled ? 'translate-x-6 bg-white' : 'translate-x-0 bg-primary-600'}
            pointer-events-none inline-block h-[28px] w-[28px] transform rounded-full  shadow-lg ring-0 
            transition duration-200 ease-in-out`}
                />
            </Switch>
        </div>
    )
}
