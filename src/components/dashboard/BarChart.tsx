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
    data: Array<any>
}
export default function BarChart(props: BarChartProps) {
    const { labels, data } = props;
    console.log(data);

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
                        data,
                        backgroundColor: 'rgb(0, 114, 190)',
                    }
                ],
            }
        } />;
}