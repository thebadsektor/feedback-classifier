import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, LinearScale, Title, Tooltip, Legend, CategoryScale } from 'chart.js';

ChartJS.register(LineElement, PointElement, LinearScale, Title, Tooltip, Legend, CategoryScale);

interface TimeSeriesChartProps {
    style?: React.CSSProperties;
}

export default function TimeSeriesChart({ style }: TimeSeriesChartProps) {
    const data = {
        labels: ['Q1', 'Q2', 'Q3', 'Q4', 'Q5', 'Q6', 'Q7'],
        datasets: [
            {
                label: 'Positive',
                data: [300, 400, 350, 450, 500, 600, 700],
                backgroundColor: 'rgba(76, 175, 80, 0.2)',
                borderColor: '#4CAF50',
                borderWidth: 2,
                fill: true,
            },
            {
                label: 'Neutral',
                data: [10, 50, 350, 400, 300, 200, 100],
                backgroundColor: 'rgba(158, 158, 158, 0.2)',
                borderColor: '#9E9E9E',
                borderWidth: 2,
                fill: true,
            },
            {
                label: 'Negative',
                data: [50, 100, 550, 300, 444, 300, 230],
                backgroundColor: 'rgba(244, 67, 54, 0.2)',
                borderColor: '#F44336',
                borderWidth: 2,
                fill: true,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: true,
                position: 'top' as const,
            },
            tooltip: {
                callbacks: {
                    label: function(tooltipItem: any) {
                        return `${tooltipItem.dataset.label}: ${tooltipItem.raw}`;
                    },
                },
            },
        },
    };

    return (
        <div style={style}>
            <p>Time Series Chart</p>
            <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                <Line data={data} options={options} />
            </div>
        </div>
    );
}