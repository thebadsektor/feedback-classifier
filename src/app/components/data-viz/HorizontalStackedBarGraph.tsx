import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend, TooltipItem } from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

interface HorizontalStackedBarGraphProps {
    style?: React.CSSProperties;
}

const HorizontalStackedBarGraph: React.FC<HorizontalStackedBarGraphProps> = ({ style }) => {
    const data = {
        labels: ['January', 'February', 'March', 'April', 'May'],
        datasets: [
            {
                label: 'Positive',
                data: [300, 400, 350, 450, 500],
                backgroundColor: '#4CAF50',
            },
            {
                label: 'Neutral',
                data: [50, 60, 70, 80, 90],
                backgroundColor: '#9E9E9E',
            },
            {
                label: 'Negative',
                data: [100, 90, 80, 70, 60],
                backgroundColor: '#F44336',
            },
        ],
    };

    const options = {
        responsive: true,
        indexAxis: 'y' as const,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            tooltip: {
                callbacks: {
                    label: function(tooltipItem: TooltipItem<'bar'>) {
                        const label = tooltipItem.dataset.label || '';
                        const value = tooltipItem.raw;
                        return `${label}: ${value}`;
                    },
                },
            },
            datalabels: {
                anchor: 'center' as const,
                align: 'center' as const,
                formatter: (value: number) => value,
                color: 'white' as const,
            },
        },
        scales: {
            x: {
                stacked: true,
                display: false,
            },
            y: {
                stacked: true,
                position: 'top' as const,
            },
        },
    };

    return (
        <div style={{ position: 'relative', width: '100%', height: '100%', ...style }}>
            <Bar data={data} options={options} />
        </div>
    );
};

export default HorizontalStackedBarGraph; 