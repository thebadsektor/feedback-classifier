import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';

Chart.register(ArcElement, Tooltip, Legend);

interface DonutChartProps {
    dataFrame: any; // Adjust the type as necessary based on your DataFrame structure
}

const DonutChart: React.FC<DonutChartProps> = ({ dataFrame }) => {
    // Calculate sentiment counts
    const sentimentCounts = {
        positive: 0,
        neutral: 0,
        negative: 0,
    };

    if (dataFrame && dataFrame.rows) {
        dataFrame.rows.forEach((row: any) => {
            const sentiment = row.sentiment; // Adjust this based on your actual sentiment field name
            if (sentiment === 'Positive') {
                sentimentCounts.positive += 1;
            } else if (sentiment === 'Neutral') {
                sentimentCounts.neutral += 1;
            } else if (sentiment === 'Negative') {
                sentimentCounts.negative += 1;
            }
        });
    }

    const data = {
        labels: ['Positive', 'Neutral', 'Negative'],
        datasets: [
            {
                data: [sentimentCounts.positive, sentimentCounts.neutral, sentimentCounts.negative],
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
                            label += `: ${context.parsed}`;
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