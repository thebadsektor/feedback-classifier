import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, LinearScale, Title, Tooltip, Legend, CategoryScale, TooltipItem } from 'chart.js';

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
                data: [10, 20, 30, 100, 150, 130, 50],
                backgroundColor: 'rgba(158, 158, 158, 0.2)',
                borderColor: '#9E9E9E',
                borderWidth: 2,
                fill: true,
            },
            {
                label: 'Negative',
                data: [400, 333, 250, 350, 200, 500, 400],
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
                    label: function(tooltipItem: TooltipItem<'line'>) {
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