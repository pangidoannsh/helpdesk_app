import Card from '@/components/ui/Card'
import CommonLayout from '@/components/layouts/Common'
import { Icon } from '@iconify/react'
import React, { useEffect, useRef, useState } from 'react'
import { api } from '@/config/api'
import ListFaq from '@/components/common/ListFaq'
import { useRouter } from 'next/router'
import { GetServerSidePropsContext } from 'next'

interface FAQprops {
    dataFAQ: any
}

export default function Faq(props: FAQprops) {
    const router = useRouter();

    const [dataFAQ, setdataFAQ] = useState(props.dataFAQ);
    const searchRef = useRef<HTMLInputElement>(null)

    function handleSearch(e: any) {
        e.preventDefault();
        if (searchRef.current) {
            router.push('/faq?subject=' + searchRef.current.value)
            api.get('/faq?subject=' + searchRef.current.value).then(res => {
                setdataFAQ(res.data)

            }).catch(err => {
                console.log(err);

            })
        }
    }
    useEffect(() => {

    }, [])

    return (
        <CommonLayout title='FAQ | Helpdesk BPS Riau' content='faq helpdesk it Badan Pusat Statistik Provinsi Riau'>
            <div className="flex flex-col gap-6 px-2 md:px-12 xl:px-36 py-6">
                <Card className='rounded-lg flex flex-col md:gap-9 gap-6 md:p-9 p-6 '>
                    <h2 className='uppercase text-2xl md:text-4xl font-bold text-primary-700'>FAQ</h2>
                    <form onSubmit={handleSearch} className="flex">
                        <input placeholder='Cari...' className='py-3 px-4 text-slate-500 rounded-l-lg focus:outline-none w-full
                        border border-slate-400 focus:ring focus:ring-primary-600/20 focus:border-primary-600'
                            ref={searchRef} defaultValue={router.query.subject ?? ''} />
                        <button className='bg-primary-600 rounded-r-lg flex items-center px-3'>
                            <Icon icon="ic:round-search" className='text-white text-4xl' />
                        </button>
                    </form>
                </Card>
                <Card className='rounded-lg md:p-9 p-6'>
                    {dataFAQ.length !== 0 ? dataFAQ.map((faq: any) => (
                        <ListFaq subject={faq.subject} description={faq.description} key={faq.id} />
                    )) : <div className='text-center text-slate-500'>FAQ Tidak Ditemukan</div>}
                </Card>
            </div>
        </CommonLayout>
    )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
    let dataFAQ: any[] = [];
    const { subject } = context.query

    const url = '/faq' + (subject !== undefined ? `?subject=${subject}` : '')

    await api.get(url).then(res => {
        dataFAQ = res.data;
    }).catch(err => [

    ])

    return {
        props: {
            dataFAQ
        }
    }
}