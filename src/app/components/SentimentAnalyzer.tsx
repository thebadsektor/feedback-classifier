'use client';

import { useState } from 'react';
import { DataFrame } from '../../types/Dataframe';

interface Sentiment {
  label: string;
  score: number;
}

interface SentimentAnalyzerProps {
  dataFrame: DataFrame | null;
}

const SentimentAnalyzer: React.FC<SentimentAnalyzerProps> = ({ dataFrame }) => {
  const [text, setText] = useState('');
  const [sentimentResult, setSentimentResult] = useState<{ label: string; score: number } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const analyzeSentiment = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        'https://api-inference.huggingface.co/models/distilbert-base-uncased-finetuned-sst-2-english',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ inputs: text }),
        }
      );
  
      const result = await response.json();
      console.log('API Response:', result);
  
      if (result.error) {
        alert(
          `Model is currently loading. Estimated time: ${
            result.estimated_time || 'unknown'
          } seconds`
        );
        return;
      }
  
      // Flatten the result if it's nested
      const flattenedResult: Sentiment[] = Array.isArray(result[0]) ? result.flat() : result;
  
      // Extract the highest-scoring sentiment
      const bestResult = flattenedResult.reduce<Sentiment>((prev: Sentiment, current: Sentiment) => 
        prev.score > current.score ? prev : current,
        flattenedResult[0] // Initial value
      );
      console.log('Best Result:', bestResult);
  
      if (bestResult && typeof bestResult.score === 'number') {
        setSentimentResult(bestResult);
      } else {
        console.error('Invalid bestResult structure:', bestResult);
      }
    } catch (error) {
      console.error('Error analyzing sentiment:', error);
      alert('An error occurred while analyzing sentiment.');
    } finally {
      setIsLoading(false);
    }
  };  

  return (
    <div className="w-full p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-2 text-center">Sentiment Analysis</h3>
      <p className="text-gray-600 text-center">
          This component analyzes the sentiment of each record in the dataframe.
      </p>
      
      {dataFrame && (
        <>
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2 text-center">Select Column for Sentiment Analysis:</h3>
            {dataFrame.columns.map((column) => (
              <div key={column}>
                <label className="flex items-center">
                  <input type="radio" name="sentimentColumn" value={column} className="mr-2" />
                  {column}
                </label>
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-4">
            <button
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed mb-4"
            >
              Run Sentiment Analysis
            </button>
          </div>
        </>
      )}

      <div className="flex flex-col items-center justify-center min-h-40 gap-4">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text for sentiment analysis"
          rows={4}
          className="border p-2 w-full"
        />
        <button
            onClick={analyzeSentiment}
            className="mt-2 bg-blue-500 text-white p-2 rounded"
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : 'Analyze Sentiment'}
          </button>
          {sentimentResult && (
            <p className="mt-4">
              Sentiment: {sentimentResult.label} (Score: {(sentimentResult.score ?? 0).toFixed(2)})
            </p>
          )}
          <button
            onClick={() => setSentimentResult(null)}
            className="mt-2 bg-red-500 text-white p-2 rounded"
          >
            Reset
          </button>
      </div>
    </div>
  );
};

export default SentimentAnalyzer;
