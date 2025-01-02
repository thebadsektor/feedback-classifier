import React, { useState } from "react";
import { DataFrame } from "@/types/Dataframe";
import DonutChart from "./data-viz/DonutChart";
import TimeSeriesChart from "./data-viz/TimeSeriesChart";
import LLMMarkdown from "./data-viz/LLMMarkdown";
import markdownContent from "../mock-data/markdownContent";

interface ExecutiveSummarizerProps {
  dataFrame: DataFrame;
}

interface SentimentCounts {
  Total: number;
  Positive: number;
  Neutral: number;
  Negative: number;
}

interface SentimentTrend {
  period: string;
  Positive: number;
  Neutral: number;
  Negative: number;
}

export default function ExecutiveSummarizer({
  dataFrame,
}: ExecutiveSummarizerProps) {
  const [summaryResult, setSummaryResult] = useState<{
    sentimentCounts?: SentimentCounts;
    sentimentTrends?: SentimentTrend[];
  } | null>(null);

  const handleGenerateSummary = (dataFrame: DataFrame) => {
    console.log(dataFrame);

    // Validate the input DataFrame
    if (!dataFrame || !dataFrame.isValid() || dataFrame.getRowCount() === 0) {
      console.error("Invalid DataFrame or no data available to summarize.");
      return;
    }

    // Generate sentiment counts
    const sentimentCounts = generateSentimentCounts(dataFrame);

    // Generate sentiment trends
    const sentimentTrends = generateSentimentTrends();

    // Set the summary result
    setSummaryResult({
      sentimentCounts,
      sentimentTrends,
    });

    console.log("Generated Summary Result:", {
      sentimentCounts,
      sentimentTrends,
    });
  };

  const generateSentimentCounts = (dataFrame: DataFrame): SentimentCounts => {
    // Calculate sentiment counts
    return {
      Total: dataFrame.rows.length,
      Positive: dataFrame.rows.filter((row) => row["sentiment"] === "Positive")
        .length,
      Neutral: dataFrame.rows.filter((row) => row["sentiment"] === "Neutral")
        .length,
      Negative: dataFrame.rows.filter((row) => row["sentiment"] === "Negative")
        .length,
    };
  };

  const generateSentimentTrends = (): SentimentTrend[] => {
    // Placeholder data for trends
    return [
      { period: "Q1", Positive: 10, Neutral: 5, Negative: 3 },
      { period: "Q2", Positive: 15, Neutral: 7, Negative: 5 },
      { period: "Q3", Positive: 12, Neutral: 6, Negative: 4 },
      { period: "Q4", Positive: 18, Neutral: 9, Negative: 6 },
    ];
  };

  return (
    <>
      <h3 className="text-lg font-semibold mb-2 mt-16 text-center">
        Executive Summary
      </h3>
      <p className="text-gray-600 text-center">
        This component generates an executive summary of the data.
      </p>

      <div className="flex justify-center mt-4">
        <button
          onClick={() => handleGenerateSummary(dataFrame)}
          className="flex items-center bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition-colors"
        >
          Generate Executive Summary
        </button>
      </div>
      {summaryResult?.sentimentCounts && (
        <>
          <div className="flex flex-col gap-4 mt-10">
            <h1 className="text-2xl font-bold">Executive Summary</h1>
          </div>
          <div className="mt-4">
            <div className="flex gap-4">
              <div
                className="bg-gray-100 rounded-md"
                style={{ minWidth: 400, minHeight: 400 }}
              >
                <DonutChart
                  counts={[
                    summaryResult.sentimentCounts.Positive || 0,
                    summaryResult.sentimentCounts.Neutral || 0,
                    summaryResult.sentimentCounts.Negative || 0,
                  ]}
                  dataCount={summaryResult.sentimentCounts.Total || 0}
                />
              </div>
              <div
                className="flex-1 bg-gray-100 p-4 rounded-md"
                style={{ maxHeight: 400 }}
              >
                <p className="flex text-center text-lg font-bold">
                  Sentiment Trend
                </p>
                <div className="flex items-center justify-center h-full w-full">
                  <TimeSeriesChart
                    style={{ width: "100%", height: "90%" }}
                    data={summaryResult.sentimentTrends || []} // Pass trends data
                  />
                </div>
              </div>
            </div>
            <div
              className="bg-gray-100 p-4 rounded-md mt-4"
              style={{ minHeight: 400 }}
            >
              <div className="flex h-full" style={{ minHeight: "400px" }}>
                <LLMMarkdown content={markdownContent} />
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
