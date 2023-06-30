import Modal from "@/components/ui/Modal";
import CreateTicket from "@/components/common/CreateTicket";
import CommonLayout from "@/components/layouts/Common"
import { Icon } from '@iconify/react';
import { useState } from "react";
import Footer from "@/components/common/Footer";
import Link from "next/link";
import Image from "next/image"
import Carousel from "@/components/ui/Carousel";

export default function Home() {
  const [isOpenCreateTiket, setIsOpenCreateTiket] = useState(false);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     console.log('fetch!');

  //   }, 3000);
  //   return () => {
  //     clearInterval(interval);
  //   }
  // }, [])

  return (
    <CommonLayout title="Helpdesk IT BPS Riau" >
      <div className="relative px-6 sm:px-12 mt-8 flex justify-between items-center">
        <div className="flex flex-col gap-8 lg:w-[710px] lg:text-start text-center">
          <div className="flex flex-col gap-3">
            <h1 className="text-primary-800 text-6xl sm:text-8xl font-medium">HELPDESK</h1>
            <h3 className="text-primary-600 text-4xl lg:text-6xl">BPS Riau</h3>
          </div>
          <p className="text-slate-600 text-xl md:text-2xl font-open-sans">
            Sistem pusat bantuan BPS Riau untuk memudahkan pelaporan gangguan/permintaan teknologi di BPS Riau dan
            pengolahan dokumentasi bantuan IT Support
          </p>
          <div className="flex justify-center lg:hidden">
            <Icon icon="mdi:customer-service" className="text-9xl text-primary-600" />
          </div>
          <button className="px-9 py-3 lg:py-4 uppercase rounded-lg text-white bg-primary-500 hover:bg-primary-600 active:bg-primary-700
          focus:ring-4 focus:ring-sky-200 text-xl md:text-2xl lg:w-max font-medium" onClick={() => setIsOpenCreateTiket(true)}>
            buat tiket sekarang
          </button>
          <Link href='/ticket' className="lg:hidden block border rounded-md border-primary-500 text-primary-500 py-2 text-xl
          font-medium uppercase">
            Lihat Ticket
          </Link>
          <div>
          </div>
        </div>
        <Carousel />
        {/* <div className="absolute right-12 top-16 -z-10">
          <img src="/assets/images/cs_image.png" alt="helpdesk illustration" className="hidden lg:block lg:w-[65vw] opacity-60 xl:opacity-100" />
        </div> */}
      </div>
      <Footer />
      <Modal isOpen={isOpenCreateTiket} setIsOpen={setIsOpenCreateTiket} title="Pesan Layanan Bantuan" rounded="rounded-lg">
        <CreateTicket setIsOpen={setIsOpenCreateTiket} />
      </Modal>
    </CommonLayout>
  )
}
