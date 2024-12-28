import { useState } from 'react';
import GeminiAPI from './GeminiAPI';
import { GoogleAIResponse } from '../../types/GoogleAIResponse';

export default function LLMTagging() {
    const [taggingResult, setTaggingResult] = useState<GoogleAIResponse | null>(null);

    const handleResult = (result: GoogleAIResponse) => {
        console.log('Tagging Result:', result);
        setTaggingResult(result); // Store the result for display or further processing
    };

    return (
    <div className="w-full p-6 bg-white rounded-lg shadow-md">
        <div className="flex flex-col items-center justify-center min-h-40 gap-4">
            <h3 className="text-lg font-semibold mb-2">Enhance via Tagging</h3>
            <p className="text-gray-600">
                This component enhances the data by adding relevant tags.
            </p>
            <GeminiAPI inputData="Your input data for tagging" onResult={handleResult} />
            {taggingResult && (
                <div className="mt-4">
                    <h4 className="font-semibold">Tagging Result:</h4>
                    <p>{JSON.stringify(taggingResult)}</p>
                </div>
            )}
        </div>
    </div>
    );
}