import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

interface LineChartProps {
    labels: Array<string>,
    data: Array<any>,
    labelHover: string
}
export default function LineChart(props: LineChartProps) {
    const { labels, data, labelHover } = props;
    return <Line
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
        data={{
            labels,
            datasets: [
                {
                    label: labelHover,
                    data,
                    borderColor: 'rgba(0, 114, 190, 0.6)',
                    backgroundColor: 'rgb(0, 114, 190)',
                    animation: { duration: 500, easing: 'easeOutSine' },
                }
            ]
        }} />;
}