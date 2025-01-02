import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { TooltipItem } from 'chart.js';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function DonutChart() {
    const data = {
        labels: ['Positive', 'Neutral', 'Negative'],
        datasets: [
            {
                data: [300, 50, 100], // Example data values
                backgroundColor: ['#4CAF50', '#9E9E9E', '#F44336'], // Modern, clean color palette
                hoverBackgroundColor: ['#45A049', '#8C8C8C', '#E53935'],
            },
        ],
    };

    const options = {
        responsive: true,
        cutout: '70%',
        plugins: {
            legend: {
                display: true,
                position: 'top' as const,
            },
            tooltip: {
                callbacks: {
                    label: function(tooltipItem: TooltipItem<'doughnut'>) {
                        return `${tooltipItem.label}: ${tooltipItem.raw}`;
                    },
                },
            },
        },
    };

    return (
        <div style={{ position: 'relative', width: '340px', height: '340px' }}>
            <Doughnut data={data} options={options} />
            <div style={{ 
                position: 'absolute', 
                top: '55%', 
                left: '50%', 
                transform: 'translate(-50%, -50%)', 
                textAlign: 'center' 
            }}>
                <h3>Data Count</h3>
                <p className="text-2xl font-bold" style={{color: '#4CAF50'}}>9,999</p>
            </div>
        </div>
    );
}