import React, { useState } from "react";
import { DataFrame } from "@/types/Dataframe";
import DonutChart from "./data-viz/DonutChart";
import TimeSeriesChart from "./data-viz/TimeSeriesChart";
import LLMMarkdown from "./data-viz/LLMMarkdown";
import { GoogleAIResponse } from '@/types/GoogleAIResponse';
import GeminiAPI from "./GeminiAPI";

interface ExecutiveSummarizerProps {
  dataFrame: DataFrame;
}

interface SentimentAISummary {
  markdownContent: string; // AI-generated content in markdown format
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
  
    const [aiSummary, setAiSummary] = useState<SentimentAISummary | null>(null);
    const [showGeminiAPI, setShowGeminiAPI] = useState(false); // Tracks if GeminiAPI should be shown
  
    const handleGenerateSummary = (dataFrame: DataFrame) => {
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
  
    const handleLLMResult = (result: GoogleAIResponse) => {
      const markdownContent = result.response.text(); // Adjust based on the actual structure
      setAiSummary({ markdownContent }); // Set the AI summary with the markdown content
      setShowGeminiAPI(false); // Hide GeminiAPI after getting the result
      console.log("Generated Sentiment Summary:", markdownContent);
    };
  
    const generateLLMPrompt = (): string => {
        if (!summaryResult?.sentimentCounts || !summaryResult?.sentimentTrends) {
          console.error("Sentiment counts or trends are missing.");
          return "";
        }
      
        return `
          Analyze the following aggregated sentiment analysis data from employee performance reviews to provide organizational insights and actionable recommendations for improving the review process and fostering employee growth:
      
          Overall Sentiment Counts (aggregated across all reviews):
          ${JSON.stringify(summaryResult.sentimentCounts, null, 2)}
      
          Quarterly Sentiment Trends (tracking changes in sentiment over time):
          ${JSON.stringify(summaryResult.sentimentTrends, null, 2)}
      
          Instructions:
          - Summarize the overall sentiment breakdown and its implications for the organization.
          - Analyze the quarterly sentiment trends to identify any significant changes or patterns, such as shifts in employee morale or performance perceptions.
          - Provide generalized recommendations for:
            1. Improving positive sentiment across reviews.
            2. Addressing and mitigating negative sentiment trends.
            3. Enhancing the performance review process to better align with employee expectations and organizational goals.
          - Avoid employee-specific recommendations; focus instead on actionable insights for improving overall organizational performance and morale.
        `;
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
                      data={summaryResult.sentimentTrends || []}
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-center bg-gray-100 p-4 rounded-md mt-4">
                {!aiSummary ? (
                  <>
                    <GeminiAPI
                        inputData={generateLLMPrompt()}
                        onResult={handleLLMResult}
                        buttonLabel="Generate Sentiment Summary"
                        loadingLabel="Generating Sentiment Summary"
                      />
                  </>
                ) : (
                  <div className="flex h-full" style={{ minHeight: "400px" }}>
                    <LLMMarkdown content={aiSummary.markdownContent} />
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </>
    );
  }
  
