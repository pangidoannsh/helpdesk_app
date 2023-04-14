import Card from '@/components/ui/Card'
import CommonLayout from '@/components/layouts/Common'
import { Icon } from '@iconify/react'
import React, { useState } from 'react'
import { api } from '@/config/api'

interface FAQprops {
    dataFAQ: any
}

export default function faq(props: FAQprops) {
    const [dataFAQ, setdataFAQ] = useState(props.dataFAQ)
    return (
        <CommonLayout title='FAQ | Helpdesk BPS Riau' content='faq helpdesk it Badan Pusat Statistik Provinsi Riau'>
            <div className="flex flex-col gap-6 px-2 md:px-12 xl:px-36 py-6">
                <Card className='rounded-lg flex flex-col md:gap-9 gap-6 md:p-9 p-6 '>
                    <h2 className='uppercase text-2xl md:text-4xl font-bold text-primary-700'>FAQ</h2>
                    <div className="flex">
                        <input placeholder='Cari...' className='py-3 px-4 text-slate-500 rounded-l-lg focus:outline-none w-full
                        border border-slate-400 focus:ring focus:ring-primary-600/20 focus:border-primary-600' />
                        <button className='bg-primary-600 rounded-r-lg flex items-center px-3'>
                            <Icon icon="ic:round-search" className='text-white text-4xl' />
                        </button>
                    </div>
                </Card>
            </div>
        </CommonLayout>
    )
}

export async function getServerSideProps(context: any) {
    let dataFAQ: any[] = [];

    api.get('/faq').then(res => {
        dataFAQ = res.data;
    }).catch(err => [

    ])

    return {
        props: {
            dataFAQ
        }
    }
}