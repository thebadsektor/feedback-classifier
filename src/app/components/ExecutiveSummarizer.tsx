import { useState } from 'react';
import GeminiAPI from './GeminiAPI';
import { GoogleAIResponse } from '../../types/GoogleAIResponse';
import DonutChart from './DonutChart';
import HorizontalBarChart from './HorizontalBarChart';
import { DataFrame, CustomDataFrame } from '@/types/Dataframe';
import * as dfd from "danfojs";
import { DataFrame as DanfoDataFrame } from 'danfojs';

interface ExecutiveSummarizerProps {
    dataFrame: DataFrame;
}

export default function ExecutiveSummarizer({ dataFrame }: ExecutiveSummarizerProps) {
    const [summaryResult, setSummaryResult] = useState<GoogleAIResponse | null>(null);
    const [showChart, setShowChart] = useState(false);

    const handleResult = (result: GoogleAIResponse) => {
        console.log('Executive Summary Result:', result);
        setSummaryResult(result);
    };

    const handleGenerateSummary = (dataFrame: DataFrame) => {
        if (!dataFrame || !dataFrame.isValid() || dataFrame.getRowCount() === 0) {
            console.error("Invalid DataFrame or no data available to summarize.");
            return;
        }
    
        const allColumns = dataFrame.columns;
        const identifierColumn = allColumns[1]; // Dynamic identifier column
        const tagColumns = allColumns.slice(allColumns.indexOf("sentimentScore") + 1);
    
        // Validate the 'sentiment' column exists
        if (!allColumns.includes("sentiment")) {
            console.error("The 'sentiment' column is missing in the input DataFrame.");
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
        const updatedColumns = [...dataFrame.columns, "Positive", "Negative", "Neutral"];
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
        try {
            const finalSummary = dfd.merge({
                left: sentimentSummary,
                right: tagSummary,
                on: [identifierColumn],
                how: "inner",
            });
            console.log("Final Summary:", finalSummary.toString());
        } catch (err) {
            console.error("Error during merge operation:", err);
        }
    };

    return (
        <div className="w-full p-6 bg-white rounded-lg shadow-md">
            <div className="flex flex-col items-center justify-center min-h-40 gap-4">
                <h3 className="text-lg font-semibold mb-2">Executive Summary</h3>
                <p className="text-gray-600">
                    This component generates an executive summary of the data.
                </p>
                <GeminiAPI inputData="Your input data for summary" onResult={handleResult} />
                
                <div className="flex justify-center mt-4">
                    <button
                        onClick={() => handleGenerateSummary(dataFrame)}
                        className="flex items-center bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition-colors"
                    >
                        Generate Executive Summary
                    </button>
                </div>

                {summaryResult && (
                    <div className="mt-4">
                        <h4 className="font-semibold">Summary Result:</h4>
                        <p>{JSON.stringify(summaryResult)}</p>
                    </div>
                )}

                {showChart && (
                    <>
                        <DonutChart dataFrame={dataFrame} />
                        {dataFrame.columns.slice(dataFrame.columns.indexOf("sentimentScore") + 1).map((tag) => (
                            <HorizontalBarChart key={tag} label={tag} />
                        ))}
                    </>
                )}
            </div>
        </div>
    );
}