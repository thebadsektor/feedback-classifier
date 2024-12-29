'use client';

import React, { useState } from 'react';
import { DataFrame } from '../../types/Dataframe';
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';

interface SentimentAnalyzerProps {
  dataFrame: DataFrame | null;
}

const SentimentAnalyzer: React.FC<SentimentAnalyzerProps> = ({ dataFrame }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [updatedDataFrame, setUpdatedDataFrame] = useState<DataFrame | null>(null);
  const [selectedColumn, setSelectedColumn] = useState<string | null>(null);

  const analyzeSentiment = async () => {
    if (!dataFrame || !dataFrame.rows || !selectedColumn) {
      console.log('DataFrame or selectedColumn is not defined.');
      return;
    }
  
    const filteredRows = dataFrame.rows.map((row) => {
      // Ensure the selected column has only `string | number` values
      const value = row[selectedColumn];
      if (typeof value === 'boolean') {
        console.warn(`Skipping boolean value in column ${selectedColumn}:`, value);
        return { ...row, sentiment: 'Skipped', sentimentScore: 'N/A' };
      }
      return row;
    });
  
    setIsLoading(true);
  
    try {
      const newRows = await Promise.all(
        filteredRows.map(async (row) => {
          if (!row || typeof row[selectedColumn!] !== 'string') {
            return { ...row, sentiment: 'Unknown', sentimentScore: 0 };
          }
  
          const response = await fetch(
            'https://api-inference.huggingface.co/models/distilbert-base-uncased-finetuned-sst-2-english',
            {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ inputs: row[selectedColumn!] }),
            }
          );
  
          const result = await response.json();
  
          if (result && Array.isArray(result[0])) {
            const bestResult = result[0].reduce((prev, current) =>
              prev.score > current.score ? prev : current
            );
  
            return {
              ...row,
              sentiment: bestResult.label,
              sentimentScore: bestResult.score,
            };
          }
  
          return { ...row, sentiment: 'Unknown', sentimentScore: 0 };
        })
      );
  
      setUpdatedDataFrame({
        columns: [...dataFrame.columns, 'sentiment', 'sentimentScore'],
        rows: newRows,
      });
    } catch (error) {
      console.error('Error during sentiment analysis:', error);
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