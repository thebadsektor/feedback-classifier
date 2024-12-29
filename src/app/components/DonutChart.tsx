import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';

Chart.register(ArcElement, Tooltip, Legend);

const DonutChart: React.FC = () => {
    const data = {
        labels: ['Positive', 'Neutral', 'Negative'],
        datasets: [
            {
                data: [60, 30, 10], // Example data
                backgroundColor: ['#4caf50', '#9e9e9e', '#f44336'], // Green, Gray, Red
                hoverBackgroundColor: ['#45a049', '#8c8c8c', '#e53935'], // Darker shades for hover
            },
        ],
    };

    const options = {
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            tooltip: {
                callbacks: {
                    label: (context: any) => {
                        let label = context.label || '';
                        if (context.parsed > 0) {
                            label += `: ${context.parsed}%`;
                        }
                        return label;
                    },
                },
            },
        },
    };

    return (
        <div className="w-full h-64">
            <Doughnut data={data} options={options} />
        </div>
    );
};

export default DonutChart; 