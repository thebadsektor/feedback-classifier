import PerPersonDatatable from "./data-viz/PerPersonDatatable";
import LLMMarkdown from "./data-viz/LLMMarkdown";
import HorizontalStackedBarGraph from "./data-viz/HorizontalStackedBarGraph";
import markdownContent from "../mock-data/markdownContent";

export default function ExecutiveDashboard() {
    return (
        <>
        <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-bold">Executive Summary</h1>
        </div>
            <div className="mt-4">
                <div className="flex gap-4">
                    <div className="bg-gray-100 rounded-md" style={{minWidth:400, minHeight:400,}}>
                        <div className="flex items-center justify-center h-full w-full">
                            {/* <DonutChart /> */}
                        </div>
                    </div>
                    <div className="flex-1 bg-gray-100 p-4 rounded-md" style={{ maxHeight: 400 }}>
                        <p className="flex text-center text-lg font-bold">Sentiment Trend</p>
                        <div className="flex items-center justify-center h-full w-full">
                            {/* <TimeSeriesChart style={{ width: '100%', height: '90%'}} /> */}
                        </div>
                    </div>
                </div>
                <div className="bg-gray-100 p-4 rounded-md mt-4" style={{minHeight:400}}>
                    <div className="flex h-full" style={{ minHeight: '400px' }}>
                        <LLMMarkdown content={markdownContent} />
                    </div>
                </div>
                <div className="bg-gray-100 p-4 rounded-md mt-4" style={{minHeight:400}}>
                    <div className="flex items-center justify-center h-full w-full" style={{ minHeight: '400px' }}>
                        <HorizontalStackedBarGraph style={{ width: '100%', height: '100%' }}/>
                    </div>
                </div>
                <div className="bg-gray-100 p-4 rounded-md mt-4" style={{minHeight:400}}>
                    <div className="flex h-full" style={{ minHeight: '400px' }}>
                        <LLMMarkdown content={markdownContent} />
                    </div>
                </div>
                <div className="bg-white p-4 rounded-md mt-4" style={{minHeight:400}}>
                    <div className="flex items-center justify-center h-full" style={{ minHeight: '400px' }}>
                        <PerPersonDatatable />
                    </div>
                </div>
                <div className="bg-gray-100 p-4 rounded-md mt-4" style={{minHeight:400}}>
                    <div className="flex h-full" style={{ minHeight: '400px' }}>
                        <LLMMarkdown content={markdownContent} />
                    </div>
                </div>
            </div>
        </>
    );
}