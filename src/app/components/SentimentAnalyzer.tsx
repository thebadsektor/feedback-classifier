"use client";

import React, { useState } from "react";
import { DataFrame, DataRow } from "../../types/Dataframe";
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import { analyzeSentimentRuleBased } from '../utils/sentimentAnalysis'; // Import the new function

interface SentimentAnalyzerProps {
  dataFrame: DataFrame | null;
}

const SentimentAnalyzer: React.FC<SentimentAnalyzerProps> = ({ dataFrame }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [updatedDataFrame, setUpdatedDataFrame] = useState<DataFrame | null>(
    null
  );
  const [selectedColumn, setSelectedColumn] = useState<string | null>(null);
  const [selectedMode, setSelectedMode] = useState<string>('sentiment-rule-based');

  const analyzeSentiment = async () => {
    console.log('Starting sentiment analysis...');

    if (!dataFrame || !dataFrame.rows || !selectedColumn) {
      console.log('DataFrame or selectedColumn is not defined.');
      return;
    }

    setIsLoading(true);
    console.log('DataFrame rows:', dataFrame.rows);
    console.log('Selected column for sentiment analysis:', selectedColumn);

    try {
      const newRows = await Promise.all(
        dataFrame.rows.map(async (row: DataRow) => {
          console.log('Analyzing row:', row);

          let sentimentResult;

          // Check the selected mode
          if (selectedMode === 'sentiment-rule-based') {
            sentimentResult = analyzeSentimentRuleBased(String(row[selectedColumn]));
          } else {
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
            if (result && Array.isArray(result) && result.length > 0) {
              sentimentResult = {
                label: result[0].label,
                score: result[0].score,
              };
            }
          }

          // Debugging: Log the sentimentResult
          console.log('Sentiment Result:', sentimentResult);

          return {
            ...row,
            sentiment: sentimentResult?.label || 'Unknown', // Fallback to 'Unknown'
            sentimentScore: sentimentResult?.score || 0, // Fallback to 0
          };
        })
      );

      console.log('New rows with sentiment:', newRows);
      setUpdatedDataFrame({ columns: [...dataFrame.columns, 'sentiment', 'sentimentScore'], rows: newRows });
    } catch (error) {
      console.error("Error during sentiment analysis:", error);
    } finally {
      setIsLoading(false);
      console.log('Sentiment analysis completed.');
    }
  };

  return (
    <div className="w-full p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-2 text-center">
        Sentiment Analysis
      </h3>
      <p className="text-gray-600 text-center">
        This component analyzes the sentiment of each record in the dataframe.
      </p>

      {dataFrame && (
        <>
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2 text-center">
              Select Column for Sentiment Analysis:
            </h3>
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
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2 text-center">
              Select Mode for Sentiment Analysis:
            </h3>
            <div className="flex flex-col items-center">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="sentimentMode"
                  value="sentiment-rule-based"
                  className="mr-2"
                  defaultChecked
                  onChange={() => setSelectedMode('sentiment-rule-based')}
                />
                Sentiment (Rule Based)
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="sentimentMode"
                  value="HuggingFace API"
                  className="mr-2"
                  onChange={() => setSelectedMode('HuggingFace API')}
                />
                HuggingFace API
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="sentimentMode"
                  value="Gemini"
                  className="mr-2"
                  onChange={() => setSelectedMode('Gemini')}
                />
                Gemini
              </label>
            </div>
          </div>

          <div className="flex justify-center mt-4">
            <button
              onClick={analyzeSentiment}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed mb-4"
              disabled={isLoading || !selectedColumn}
            >
              {isLoading ? "Analyzing Sentiment..." : "Run Sentiment Analysis"}
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
                      {row[col] !== undefined ? row[col].toString() : "N/A"}
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
