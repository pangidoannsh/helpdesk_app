import { useContext, useRef, useState } from 'react'
import { RadioGroup } from '@headlessui/react'
import { Icon } from '@iconify/react'
import Button from '../ui/Button'
import AuthApi from '@/services/authApi'
import { AlertContext } from '@/context/AlertProvider'
import TextArea from './TextArea'

const defaultFeedback = { value: 0, title: 'Tidak Puas', icon: 'solar:sad-square-bold', style: 'text-red-500' };

const feedbackOptions = [
    { value: 1, title: 'Tidak Puas', icon: 'solar:sad-square-bold', style: 'text-red-500' },
    { value: 2, title: 'Puas', icon: 'solar:smile-square-bold', style: 'text-primary-600' },
    { value: 3, title: 'Sangat Puas', icon: 'solar:emoji-funny-square-bold', style: 'text-green-500' },
]

interface FeedbackRadioProps {
    ticketDetail: any,
    setTicketDetail: (ticketDetail: any) => void
}
export default function FeedbackRadio(props: FeedbackRadioProps) {
    const { ticketDetail, setTicketDetail } = props;

    const { setAlert, closeAlert } = useContext(AlertContext)
    const commentRef = useRef<HTMLTextAreaElement>(null)
    const [selected, setSelected] = useState(defaultFeedback)
    const [loadingSubmit, setLoadingSubmit] = useState(false)

    function handleSubmit(e: any) {
        closeAlert()
        const dataPost = {
            value: selected.value,
            comment: commentRef?.current?.value ?? null,
            ticketId: ticketDetail.id
        }
        // console.log(dataPost);
        if (selected.value === 1 && commentRef?.current?.value === '') {
            setAlert({
                isActived: true,
                code: 2,
                title: 'Warning',
                message: 'Tolong berikan Kritik,saran, dan alasan atas ke-Tidak Puasan anda!'
            })

            setTimeout(() => {
                closeAlert()
            }, 2000);
            return;
        }
        setLoadingSubmit(true)

        AuthApi.post('/feedback', dataPost).then(res => {
            setAlert({
                isActived: true,
                code: 1,
                title: 'Success',
                message: 'Feedback Berhasil Dikirim! Terimakasih atas Feedbacknya'
            })
            setTicketDetail({ ...ticketDetail, status: 'done' })
        }).catch(err => {
            setAlert({
                isActived: true,
                code: 0,
                title: 'Error',
                message: 'Feedback Gagal Dikirim!'
            })
            console.log(err.response);
        }).finally(() => {
            setLoadingSubmit(false)
            setTimeout(() => {
                closeAlert()
            }, 2000);
        })
    }
    return (
        <div className='flex flex-col gap-6 px-48'>
            <div className='font-medium text-slate-700 text-lg'>Berikan Feedback untuk menyelesaikan Laporan Anda</div>
            {selected.value === 0 ? (
                <div className='flex items-center rounded-md px-4 py-2 text-red-400 bg-red-400/10'>
                    <Icon icon="mdi:warning-circle-outline" className='text-2xl' />
                    <span>Berikan tingkat kepuasan sebelum mengirim feedback</span>
                </div>
            ) : ''}
            <RadioGroup value={selected} onChange={setSelected}>
                <div className="flex gap-9 justify-center">
                    {feedbackOptions.map((plan) => (
                        <RadioGroup.Option
                            key={plan.value}
                            value={plan}
                            className={({ active, checked }) =>
                                `${checked ? plan.style : 'text-slate-400'}
                                 items-center flex flex-col gap-2 cursor-pointer focus:outline-none`
                            }
                        >
                            <Icon icon={plan.icon} className="text-8xl" />
                            <span>{plan.title}</span>
                        </RadioGroup.Option>
                    ))}
                </div>
            </RadioGroup>
            <TextArea inputRef={commentRef} row={2} placeholder='Berikan Kritik dan Saran anda' />
            <Button onClick={handleSubmit} loading={loadingSubmit} disabled={selected.value === 0}
                className='text-white py-2 font-medium rounded-md'>KIRIM FEEDBACK</Button>
        </div>
    )
}

function CheckIcon(props: { className: string }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" {...props}>
            <circle cx={12} cy={12} r={12} fill="#fff" opacity="0.2" />
            <path
                d="M7 13l3 3 7-7"
                stroke="#fff"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    )
}
