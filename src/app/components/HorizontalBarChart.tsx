import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, BarElement, Tooltip, CategoryScale, LinearScale } from 'chart.js';

// Register the components
Chart.register(BarElement, Tooltip, CategoryScale, LinearScale);

interface HorizontalBarChartProps {
    label: string; // Define the label prop
}

const HorizontalBarChart: React.FC<HorizontalBarChartProps> = ({ label }) => {
    const data = {
        labels: [label], // Use the label prop for the bar chart
        datasets: [
            {
                label: 'Positive',
                data: [60], // Example data for positive sentiment
                backgroundColor: '#4caf50', // Green
            },
            {
                label: 'Neutral',
                data: [30], // Example data for neutral sentiment
                backgroundColor: '#9e9e9e', // Gray
            },
            {
                label: 'Negative',
                data: [10], // Example data for negative sentiment
                backgroundColor: '#f44336', // Red
            },
        ],
    };

    const options = {
        indexAxis: 'y' as const,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                callbacks: {
                    label: (context: any) => {
                        return `${context.dataset.label}: ${context.raw}%`;
                    },
                },
            },
        },
    };

    return (
        <div className="w-full h-32">
            <Bar data={data} options={options} />
        </div>
    );
};

export default HorizontalBarChart; 