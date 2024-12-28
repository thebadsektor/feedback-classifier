import { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { GoogleAIResponse } from '../../types/GoogleAIResponse'; // Adjust the path as necessary

interface GeminiAPIProps {
  inputData: string; // This will be the prompt for the AI
  onResult: (result: GoogleAIResponse) => void; // Use the new type here
}

const GeminiAPI = ({ inputData, onResult }: GeminiAPIProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [gptResponse, setGptResponse] = useState('');

  const generateContentWithGoogleAI = async () => {
    setIsLoading(true);
    try {
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error('API key is not defined');
      }
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const result: GoogleAIResponse = await model.generateContent(inputData); // Use inputData as the prompt
      setGptResponse(result.response.text());
      onResult(result); // Pass the result back to the parent component
    } catch (error) {
      console.error('Error generating content with Google AI:', error);
      setGptResponse('An error occurred while generating content.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <button onClick={generateContentWithGoogleAI} disabled={isLoading}>
        {isLoading ? 'Loading...' : 'Generate Content with Google AI'}
      </button>
      {gptResponse && (
        <div className="mt-4">
          <h4 className="font-semibold">Google AI Response:</h4>
          <p>{gptResponse}</p>
        </div>
      )}
    </div>
  );
};

export default GeminiAPI;
