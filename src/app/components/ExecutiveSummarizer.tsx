import { useState } from 'react';
import GeminiAPI from './GeminiAPI';
import { GoogleAIResponse } from '../../types/GoogleAIResponse';
import DonutChart from './DonutChart';
import HorizontalBarChart from './HorizontalBarChart';

interface ExecutiveSummarizerProps {
    dataFrame: any; // Adjust the type as necessary based on your DataFrame structure
}

export default function ExecutiveSummarizer({ dataFrame }: ExecutiveSummarizerProps) {
    const [summaryResult, setSummaryResult] = useState<GoogleAIResponse | null>(null);
    const [showChart, setShowChart] = useState(false);

    const handleResult = (result: GoogleAIResponse) => {
        console.log('Executive Summary Result:', result);
        setSummaryResult(result);
    };

    const handleGenerateSummary = () => {
        console.log('Generating executive summary for:', dataFrame);
        setShowChart(true);
    };

    return (
        <div className="w-full p-6 bg-white rounded-lg shadow-md">
            <div className="flex flex-col items-center justify-center min-h-40 gap-4">
                <h3 className="text-lg font-semibold mb-2">Executive Summary</h3>
                <p className="text-gray-600">
                    This component generates an executive summary of the data.
                </p>
                <GeminiAPI inputData="Your input data for summary" onResult={handleResult} />
                
                <div className="flex justify-center mt-4">
                    <button
                        onClick={handleGenerateSummary}
                        className="flex items-center bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition-colors"
                    >
                        Generate Executive Summary
                    </button>
                </div>

                {summaryResult && (
                    <div className="mt-4">
                        <h4 className="font-semibold">Summary Result:</h4>
                        <p>{JSON.stringify(summaryResult)}</p>
                    </div>
                )}

                {showChart && (
                    <>
                        <DonutChart dataFrame={dataFrame} />
                        <HorizontalBarChart />
                    </>
                )}
            </div>
        </div>
    );
}