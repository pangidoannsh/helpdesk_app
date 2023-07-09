import { Icon } from "@iconify/react"
import Image from "next/image";
import { useEffect, useState } from "react"

const slides = [
    {
        image: "/assets/images/create.png",
        title: "BUAT TIKET",
        desc: "Buat tiket anda untuk melakukan pelaporan gangguan/permintaan teknologi"
    },
    {
        image: "/assets/images/processing.png",
        title: "TIKET DIPROSES",
        desc: "Menunggu laporan gangguan/permintaan diproses oleh agen"
    },
    {
        image: "/assets/images/feedback.png",
        title: "BERI FEEDBACK",
        desc: "Memberikan feedback dari tiket yang sudah selesai"
    },
]
export default function Carousel() {
    const [slidePos, setSlidePos] = useState(0);
    const [indexSlide, setIndexSlide] = useState(0);

    function handleSlider(action: string) {
        if (action === "next") {
            if (indexSlide === 2) {
                setSlidePos(0);
                setIndexSlide(0);
            } else {
                setSlidePos(prev => prev - 640);
                setIndexSlide(prev => prev + 1);
            }
        } else {
            if (indexSlide === 0) {
                setSlidePos(-2 * 640);
                setIndexSlide(2);
            } else {
                setSlidePos(prev => prev + 640);
                setIndexSlide(prev => prev - 1);
            }
        }
    }

    useEffect(() => {
        const interval = setInterval(() => {
            // console.log(indexSlide);

            if (indexSlide === 2) {
                setSlidePos(0);
                setIndexSlide(0);
            } else {
                setSlidePos(prev => prev - 640);
                setIndexSlide(prev => prev + 1);
            }
        }, 3000)

        return () => {
            clearInterval(interval)
        }
    }, [indexSlide])

    return (
        <div className="lg:w-[640px] overflow-hidden hidden lg:block relative -translate-y-4">
            <div className="flex w-max duration-500" style={{ translate: `${slidePos}px 0` }}>
                {slides.map((slide, index: number) => (
                    <div key={index} className="lg:w-[640px] flex flex-col text-center">
                        <div>
                            <Image src={slide.image} alt="buat tiket" className="lg:h-[392px] mx-auto" />
                        </div>
                        <div className="font-medium text-primary-600 text-4xl">{slide.title}</div>
                        <div className="text-slate-600 font-open-sans text-xl">{slide.desc}</div>
                    </div>
                ))}
            </div>
            <button className="absolute w-max left-4 duration-100 top-1/2 -translate-y-1/2 text-5xl text-slate-400 hover:text-slate-500">
                <Icon icon="octicon:chevron-left-16" onClick={() => handleSlider("prev")} />
            </button>
            <button className="absolute w-max right-4 duration-100 top-1/2 -translate-y-1/2 text-5xl text-slate-400 hover:text-slate-500">
                <Icon icon="octicon:chevron-right-16" onClick={() => handleSlider("next")} />
            </button>
        </div>
    )
}