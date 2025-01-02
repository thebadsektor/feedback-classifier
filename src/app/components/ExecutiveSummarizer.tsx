import React, { useState } from "react";
import { DataFrame } from "@/types/Dataframe";
import * as dfd from "danfojs";
import DonutChart from "./data-viz/DonutChart";
import TimeSeriesChart from "./data-viz/TimeSeriesChart";

interface ExecutiveSummarizerProps {
  dataFrame: DataFrame;
}

export default function ExecutiveSummarizer({
  dataFrame,
}: ExecutiveSummarizerProps) {
  const [summaryResult, setSummaryResult] = useState<dfd.DataFrame | null>(
    null
  );

  const handleGenerateSummary = (dataFrame: DataFrame) => {
    if (!dataFrame || !dataFrame.isValid() || dataFrame.getRowCount() === 0) {
      console.error("Invalid DataFrame or no data available to summarize.");
      return;
    }

    const allColumns = dataFrame.columns;
    const identifierColumn = allColumns[1]; // Dynamic identifier column
    const tagColumns = allColumns.slice(
      allColumns.indexOf("sentimentScore") + 1
    );

    // Validate the 'sentiment' column exists
    if (!allColumns.includes("sentiment")) {
      console.error(
        "The 'sentiment' column is missing in the input DataFrame."
      );
      return;
    }

    // Add sentiment columns directly to the rows
    const newRows = dataFrame.rows.map((row) => {
      const sentimentValue = row["sentiment"] as string;
      return {
        ...row,
        Positive: sentimentValue === "Positive" ? 1 : 0,
        Negative: sentimentValue === "Negative" ? 1 : 0,
        Neutral: sentimentValue === "Neutral" ? 1 : 0,
      };
    });

    // Create a new DataFrame with the updated rows
    const updatedColumns = [
      ...dataFrame.columns,
      "Positive",
      "Negative",
      "Neutral",
    ];
    const df = new dfd.DataFrame(newRows, { columns: updatedColumns });
    console.log("DataFrame After Adding Sentiment Columns:", df.columns);

    // Group by identifier column and aggregate
    let sentimentSummary: dfd.DataFrame;
    try {
      sentimentSummary = df.groupby([identifierColumn]).agg({
        sentimentScore: ["mean"],
        Positive: ["sum"],
        Negative: ["sum"],
        Neutral: ["sum"],
      });
      console.log("Sentiment Summary:", sentimentSummary.toString());
    } catch (err) {
      console.error("Error during sentiment aggregation:", err);
      return;
    }

    // Aggregate tag columns
    let tagSummary: dfd.DataFrame;
    try {
      const tagDf = df.loc({ columns: [identifierColumn, ...tagColumns] });
      tagSummary = tagDf.groupby([identifierColumn]).sum();
      console.log("Tag Summary:", tagSummary.toString());
    } catch (err) {
      console.error("Error during tag aggregation:", err);
      return;
    }

    // Merge sentiment and tag summaries
    let finalSummary: dfd.DataFrame;
    try {
      finalSummary = dfd.merge({
        left: sentimentSummary,
        right: tagSummary,
        on: [identifierColumn],
        how: "inner",
      });
      console.log("Final Summary:", finalSummary.toString());
    } catch (err) {
      console.error("Error during merge operation:", err);
      return;
    }

    // Log the summaryResult before rendering
    console.log("Summary Result:", finalSummary);

    // Set summaryResult directly to finalSummary
    setSummaryResult(finalSummary);
  };

  // Log the summaryResult before rendering
  console.log("Summary Result:", summaryResult);

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
      {summaryResult && (
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
                <div className="flex items-center justify-center h-full w-full">
                  <DonutChart />
                </div>
              </div>
              <div
                className="flex-1 bg-gray-100 p-4 rounded-md"
                style={{ maxHeight: 400 }}
              >
                <p className="flex text-center text-lg font-bold">
                  Sentiment Trend
                </p>
                <div className="flex items-center justify-center h-full w-full">
                  <TimeSeriesChart style={{ width: "100%", height: "90%" }} />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
