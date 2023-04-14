import CreateTicket from '@/components/common/CreateTicket';
import CommonLayout from '@/components/layouts/Common'
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card'
import Modal from '@/components/ui/Modal';
import { Icon } from '@iconify/react';
import React, { useState } from 'react'

export default function CreateTicketPage() {
    const [isOpenCreate, setIsOpenCreate] = useState(false);

    const handleOpenModalCreate = () => {
        setIsOpenCreate(true);
    }
    return (
        <CommonLayout title='Ticket | Helpdesk IT'>
            <div className="flex flex-col gap-6 min-h-screen bg-[#F8F8F8] px-2 md:px-12 xl:px-36 py-6">
                {/* Card Pengajuan Layanan */}
                <Card className={`flex flex-col p-6 md:p-9 gap-4 rounded-lg `}>
                    <h2 className='uppercase text-2xl md:text-4xl font-bold text-primary-700'>perlu layanan bantuan ?</h2>
                    <div className='flex justify-center'>
                        <Icon icon="mdi:customer-service" className='text-9xl text-primary-600' />
                    </div>
                    <p className='font-open-sans text-xl text-slate-600'>
                        Ajukan keperluan atau pelayanan yang kamu inginkan di sini.
                    </p>
                    <Button onClick={handleOpenModalCreate}
                        className="common-button py-3">
                        AJUKAN LAYANAN
                    </Button>
                </Card>
            </div>
            <Modal isOpen={isOpenCreate} setIsOpen={setIsOpenCreate} title="AJUKAN LAYANAN BARU" rounded="rounded-lg">
                <CreateTicket setIsOpen={setIsOpenCreate} />
            </Modal>
        </CommonLayout>
    )
}
