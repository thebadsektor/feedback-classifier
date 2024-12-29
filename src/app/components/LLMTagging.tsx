import { useState } from 'react';
import GeminiAPI from './GeminiAPI';
import { TagsInput } from 'react-tag-input-component';

// Define a new type for tagging results
type TaggingResult = {
    tags: string[];
};

export default function LLMTagging() {
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

                {/* Placeholder for GeminiAPI integration */}
                <GeminiAPI inputData={promptPreview} onResult={() => console.log("Tagging Completed")} />
            </div>
        </div>
    );
}
