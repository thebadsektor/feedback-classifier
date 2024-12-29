import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, BarElement, Tooltip, CategoryScale, LinearScale } from 'chart.js'; // Import necessary components

// Register the components
Chart.register(BarElement, Tooltip, CategoryScale, LinearScale); // Register all necessary scales and elements

const HorizontalBarChart: React.FC = () => {
    const data = {
        labels: ['Sentiment Distribution'], // Label for the bar chart
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
        indexAxis: 'y' as const, // Set the index axis to horizontal with type assertion
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false, // Disable the legend
            },
            tooltip: {
                callbacks: {
                    label: (context: any) => {
                        return `${context.dataset.label}: ${context.raw}%`; // Show percentage in tooltip
                    },
                },
            },
        },
    };

    return (
        <div className="w-full h-32">
            <h3 className="text-lg font-semibold mb-2">Sentiment Distribution</h3>
            <Bar data={data} options={options} />
        </div>
    );
};

export default HorizontalBarChart; 