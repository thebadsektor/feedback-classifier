import { useState } from 'react';
import GeminiAPI from './GeminiAPI';
import { GoogleAIResponse } from '../../types/GoogleAIResponse';

export default function ExecutiveSummarizer() {
    const [summaryResult, setSummaryResult] = useState<GoogleAIResponse | null>(null);

    const handleResult = (result: GoogleAIResponse) => {
        console.log('Executive Summary Result:', result);
        setSummaryResult(result); // Store the result for display or further processing
    };

    return (
    <div className="w-full p-6 bg-white rounded-lg shadow-md">
        <div className="flex flex-col items-center justify-center min-h-40 gap-4">
            <h3 className="text-lg font-semibold mb-2">Executive Summary</h3>
            <p className="text-gray-600">
                This component generates an executive summary of the data.
            </p>
            <GeminiAPI inputData="Your input data for summary" onResult={handleResult} />
            {summaryResult && (
                <div className="mt-4">
                    <h4 className="font-semibold">Summary Result:</h4>
                    <p>{JSON.stringify(summaryResult)}</p>
                </div>
            )}
        </div>
    </div>
    );
}