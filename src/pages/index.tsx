import Modal from "@/components/ui/Modal";
import CreateTicket from "@/components/common/CreateTicket";
import CommonLayout from "@/components/layouts/Common"
import { Icon } from '@iconify/react';
import { useState } from "react";
import Footer from "@/components/common/Footer";


export default function Home() {
  const [isOpenCreateTiket, setIsOpenCreateTiket] = useState(false);

  return (
    <CommonLayout title="Helpdesk IT | BPS Riau" >
      <div className="relative px-6 sm:px-12 py-12 lg:py-24 xl:py-32 overflow-hidden">
        <div className="flex flex-col gap-6 lg:w-[470px] lg:text-start text-center">
          <div className="flex flex-col gap-3">
            <h1 className="text-primary-800 text-6xl sm:text-8xl font-medium">HELPDESK</h1>
            <h3 className="text-primary-500 text-4xl">BPS Riau</h3>
          </div>
          <p className="text-slate-600 text-xl md:text-2xl font-open-sans">
            System pusat bantuan BPS Riau untuk memudahkan pelaporan dan pengolahan dokumentasi bantuan
          </p>
          <div className="flex justify-center sm:hidden">
            <Icon icon="mdi:customer-service" className="text-9xl text-primary-600" />
          </div>
          <button className="px-9 py-3 uppercase rounded text-white bg-primary-500 hover:bg-primary-600 active:bg-primary-700
          focus:ring-4 focus:ring-sky-200  text-xl md:text-2xl" onClick={() => setIsOpenCreateTiket(true)}>
            pesan bantuan
          </button>
          <div>
          </div>
        </div>
        <div className="absolute right-12 top-16 -z-10">
          <img src="/assets/images/cs_image.png" alt="helpdesk illustration" className="hidden lg:block lg:w-[65vw] opacity-60 xl:opacity-100" />
        </div>
      </div>
      <Footer />
      <Modal isOpen={isOpenCreateTiket} setIsOpen={setIsOpenCreateTiket} title="Pesan Layanan Bantuan">
        <CreateTicket setIsOpen={setIsOpenCreateTiket} />
      </Modal>
    </CommonLayout>
  )
}
