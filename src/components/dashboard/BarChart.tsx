import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

interface BarChartProps {
    labels: Array<string>,
    data: Array<any>,
    labelHover: string
}
export default function BarChart(props: BarChartProps) {
    const { labels, data, labelHover } = props;

    return <Bar
        options={{
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    min: 0,
                    suggestedMax: Math.round((data?.length ?? 0 !== 0 ? Math.max(...data) + 10 : 10) / 10) * 10
                }
            }
        }}
        data={
            {
                labels,
                datasets: [
                    {
                        label: labelHover,
                        data: data.map(d => Math.ceil(d)),
                        backgroundColor: 'rgb(0, 114, 190)',
                    }
                ],
            }
        } />;
}