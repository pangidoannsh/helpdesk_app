import { Icon } from '@iconify/react'
import React from 'react'
import Card from '../ui/Card'

export default function DashboardLoading() {
    return (
        <>
            <Card className='flex h-64 rounded items-center justify-center'>
                <Icon icon="eos-icons:loading" className='text-9xl text-primary-600' />
            </Card>
        </>
    )
}
