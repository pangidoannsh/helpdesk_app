import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

interface DoughnutChartProps {
    labels: Array<any>
}

export default function DoughnutChart(props: DoughnutChartProps) {
    const { labels } = props
    return (
        <>
            <div style={{ width: '300px', height: '300px' }}>
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
                                label: '# of Votes',
                                data: labels.map(label => label.count),
                                backgroundColor: [
                                    'rgb(0, 114, 190)',
                                    'rgb(238, 157, 43)',
                                    'rgb(148, 163, 184)',
                                ],
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
                            <div className='text-slate-800 font-medium'>{label.count}</div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    )
}