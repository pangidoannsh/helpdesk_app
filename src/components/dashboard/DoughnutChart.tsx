import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

interface DoughnutChartProps {
    labels: Array<any>,
    labelHover: string
}

export default function DoughnutChart(props: DoughnutChartProps) {
    const { labels, labelHover } = props
    const [widthScreen, setWidthScreen] = useState(700);

    useEffect(() => {
        setWidthScreen(window.innerWidth)
    }, [])
    return (
        <>
            <div style={{ width: widthScreen > 600 ? '300px' : '200px', height: widthScreen > 600 ? '300px' : '200px' }}>
                <Doughnut
                    options={{
                        plugins: {
                            legend: {
                                display: false
                            }
                        }
                    }}
                    data={{
                        labels: labels.map(data => data.label),
                        datasets: [
                            {
                                label: labelHover,
                                data: labels.map(label => label.percentage),
                                backgroundColor: labels.map(label => label.rgb),
                                animation: { duration: 500, easing: 'easeOutSine' },
                            },
                        ]
                    }} />
            </div>
            <div className='flex justify-between w-full'>
                {labels.map((label, index) => (
                    <div className='flex gap-3 ' key={index}>
                        <div className={`rounded-full w-2 h-2 relative top-1 ${label.color}`}></div>
                        <div className='flex flex-col gap-1'>
                            <div className="font-medium text-xs text-slate-400">{label.label}</div>
                            <div className='text-slate-800 font-medium'>{label.percentage}%</div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    )
}