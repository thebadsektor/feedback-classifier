'use client';

import React, { useState } from 'react';
import { DataFrame } from '../../types/Dataframe';
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';

interface Sentiment {
  label: string;
  score: number;
}

interface SentimentAnalyzerProps {
  dataFrame: DataFrame | null;
}

interface DataRow {
  [key: string]: any; // This allows for dynamic keys with any type of value
}

const SentimentAnalyzer: React.FC<SentimentAnalyzerProps> = ({ dataFrame }) => {
  const [text, setText] = useState('');
  const [sentimentResult, setSentimentResult] = useState<{ label: string; score: number } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [updatedDataFrame, setUpdatedDataFrame] = useState<DataFrame | null>(null);
  const [selectedColumn, setSelectedColumn] = useState<string | null>(null);

  const analyzeSentiment = async () => {
    console.log('Starting sentiment analysis...');
  
    if (!dataFrame || !dataFrame.rows || !selectedColumn) {
      console.log('DataFrame or selectedColumn is not defined.');
      return;
    }
  
    // Define customizable ranges for sentiment classification
    const sentimentRanges = {
      positive: [0.21, 1], // Scores between 0.21 and 1 are positive
      neutral: [-0.2, 0.2], // Scores between -0.2 and 0.2 are neutral
      negative: [-1, -0.21], // Scores less than -0.21 are negative
    };
  
    setIsLoading(true);
  
    try {
      const newRows = await Promise.all(
        dataFrame.rows.map(async (row: DataRow) => {
          console.log('Analyzing row:', row);
  
          const response = await fetch(
            'https://api-inference.huggingface.co/models/distilbert-base-uncased-finetuned-sst-2-english',
            {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ inputs: row[selectedColumn] }),
            }
          );
  
          const result = await response.json();
          console.log('API response for row:', result);
  
          if (result && Array.isArray(result[0])) {
            const sentimentArray = result[0];
            const bestResult = sentimentArray.reduce((prev, current) =>
              prev.score > current.score ? prev : current
            );
  
            // Map the score to a sentiment label based on the ranges
            const sentimentLabel =
              bestResult.score >= sentimentRanges.positive[0] &&
              bestResult.score <= sentimentRanges.positive[1]
                ? 'POSITIVE'
                : bestResult.score >= sentimentRanges.neutral[0] &&
                  bestResult.score <= sentimentRanges.neutral[1]
                ? 'NEUTRAL'
                : 'NEGATIVE';
  
            console.log('Mapped Sentiment:', sentimentLabel);
  
            return {
              ...row,
              sentiment: sentimentLabel,
              sentimentScore: bestResult.score,
            };
          } else {
            console.error('Unexpected API response structure:', result);
            return {
              ...row,
              sentiment: 'Unknown',
              sentimentScore: 0,
            };
          }
        })
      );
  
      console.log('New rows with sentiment data:', newRows);
  
      setUpdatedDataFrame({
        columns: [...new Set([...dataFrame.columns, 'sentiment', 'sentimentScore'])],
        rows: newRows,
      });
    } catch (error) {
      console.error('Error during sentiment analysis:', error);
    } finally {
      setIsLoading(false);
      console.log('Sentiment analysis completed.');
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
                  <input
                    type="radio"
                    name="sentimentColumn"
                    value={column}
                    className="mr-2"
                    onChange={() => setSelectedColumn(column)}
                  />
                  {column}
                </label>
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-4">
            <button
              onClick={analyzeSentiment}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed mb-4"
              disabled={isLoading || !selectedColumn}
            >
              {isLoading ? 'Analyzing Sentiment...' : 'Run Sentiment Analysis'}
            </button>
          </div>
        </>
      )}

      {updatedDataFrame && (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {updatedDataFrame.columns.map((col) => (
                  <TableCell key={col}>{col}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {updatedDataFrame.rows.map((row, index) => (
                <TableRow key={index}>
                  {updatedDataFrame.columns.map((col) => (
                    <TableCell key={col}>
                      {row[col] !== undefined ? row[col].toString() : 'N/A'}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
};

export default SentimentAnalyzer;
