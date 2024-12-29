import { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { TagsInput } from 'react-tag-input-component';
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper } from '@mui/material';

// Define a new type for tagging results
type TaggingResult = {
    tags: string[];
};

// Define a type for the expected structure of each row
interface DataRow {
    [key: string]: string | number | undefined; // Adjust types as necessary
}

interface LLMTaggingProps {
    data: DataRow[]; // Use the new DataRow type
    selectedColumn: string | null; // New prop for the selected column
}

export default function LLMTagging({ data, selectedColumn }: LLMTaggingProps) {
    const [taggingResult, setTaggingResult] = useState<TaggingResult | null>({
        tags: [
            "Accomplishments",
            "Areas for Development",
            "Team Dynamics",
            "Innovation and Creativity",
            "Leadership and Initiative",
            "Zero Tolerance"
        ]
    });

    const [promptPreview, setPromptPreview] = useState<string>('');
    const [updatedData, setUpdatedData] = useState<DataRow[]>(data); // State to hold updated data
    const [isTaggingDone, setIsTaggingDone] = useState<boolean>(false); // State to track tagging completion

    // Initialize the Gemini model
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY; // Ensure you have the API key
    if (!apiKey) {
        throw new Error('API key for Google Gemini is not defined.'); // Handle the case where the API key is not set
    }
    const geminiAI = new GoogleGenerativeAI(apiKey);
    const model = geminiAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // Generate prompt aligned with Function Schema
    const generatePrompt = (tags: string[]) => {
        if (tags.length === 0) {
            return "No tags provided. Please enter tags to generate the prompt.";
        }

        const tagsList = tags.map(tag => `"${tag}"`).join(', ');
        return `Categorize the given employee feedback into the following categories: ${tagsList}. 
            Return the result as a JSON object where each category is a key and its value is a boolean indicating whether the feedback is relevant to that category.`;
    };

    // Handle when tags are updated
    const handleTagsChange = (tags: string[]) => {
        setTaggingResult({ tags });
        const newPrompt = generatePrompt(tags); // Generate prompt from the latest tags
        setPromptPreview(newPrompt); // Update the prompt preview immediately
    };

    // Handle the button click to run LLM tagging
    const handleRunTagging = async () => {
        if (!selectedColumn) {
            console.error("Selected column is null. Cannot run tagging.");
            return; // Exit if selectedColumn is null
        }

        console.log("Selected Column:", selectedColumn); // Debugging log for selected column
        console.log("Available Columns in Data:", Object.keys(updatedData[0] || {})); // Log available columns

        const feedbackColumn = updatedData.map(row => row[selectedColumn]).filter((feedback): feedback is string => feedback !== undefined && feedback !== null).map(String); // Use selectedColumn for feedback
        
        console.log("Feedback Column:", feedbackColumn); // Debugging log for feedback column

        const responses = await Promise.all(feedbackColumn.map(async (feedback) => {
            const prompt = generatePrompt(taggingResult?.tags || []);
            console.log("Generated Prompt:", prompt); // Debugging log for generated prompt

            // Call the in-house Gemini model with the prompt and feedback
            const geminiResponse = await model.generateContent(`Categorize the feedback: "${feedback}" based on the following categories: ${prompt}`);
            console.log("Gemini Response:", geminiResponse); // Debugging log for Gemini response

            return geminiResponse.response.text(); // Assuming the response is in the expected format
        }));

        console.log("Responses from Gemini:", responses); // Debugging log for responses

        // Append the responses to the updatedData
        const newData = updatedData.map((row, index) => ({
            ...row,
            'llm tagging': responses[index] || "N/A" // Add the response to the new column, fallback to "N/A"
        }));

        setUpdatedData(newData); // Update the state with the new data
        setIsTaggingDone(true); // Mark tagging as done
    };

    return (
        <div className="w-full p-6 bg-white rounded-lg shadow-md">
            <div className="flex flex-col items-center justify-center min-h-40 gap-4">
                <h3 className="text-lg font-semibold mb-2">Enhance via Tagging</h3>
                <p className="text-gray-600">
                    This component enhances the data by adding relevant tags.
                </p>
                <div className="mb-4 w-full">
                    <h3 className="text-lg font-semibold mb-2">Tag Input</h3>
                    <p className="text-gray-600 mb-2">
                        Add tags to enhance the data.
                    </p>
                    <div style={{ width: '100%' }}>
                        <TagsInput
                            value={taggingResult?.tags || []}
                            onChange={handleTagsChange} // Use the new handler
                            name="tags"
                            placeHolder="Enter tags"
                            onKeyUp={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                }
                            }}
                        />
                    </div>
                    <em>Press enter or comma to add new tag</em>
                </div>

                <div className="w-full mt-4">
                    <h3 className="text-lg font-semibold mb-2">Generated Prompt Preview</h3>
                    <div className="bg-gray-100 border rounded p-4 text-sm text-gray-700">
                        {promptPreview || "Start adding tags to preview the generated prompt."}
                    </div>
                </div>

                <div className="flex justify-center mt-4">
                    <button
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed mb-4"
                        onClick={handleRunTagging} // Attach the click handler
                    >
                        {"Run LLM Tagging"}
                    </button>
                </div>

                {/* Display the first 5 rows of updated data only if tagging is done */}
                {isTaggingDone && (
                    <>
                        <h3 className="text-lg font-semibold mb-2 text-left w-full">Data Preview (First 5 Rows)</h3>
                        <TableContainer component={Paper} style={{ maxHeight: 200, overflow: 'auto' }}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        {updatedData.length > 0 && Object.keys(updatedData[0]).map((key) => (
                                            <TableCell key={key}>{key}</TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {updatedData.slice(0, 5).map((row, index) => (
                                        <TableRow key={index}>
                                            {Object.keys(row).map((key) => (
                                                <TableCell key={key}>
                                                    {row[key] !== undefined ? row[key].toString() : "N/A"}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </>
                )}
            </div>
        </div>
    );
}
