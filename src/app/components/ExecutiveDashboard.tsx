import DonutChart from "./data-viz/DonutChart";
import TimeSeriesChart from "./data-viz/TimeSeriesChart";
import PerPersonDatatable from "./data-viz/PerPersonDatatable";
import LLMMarkdown from "./data-viz/LLMMarkdown";
import StackedBarGraph from "./data-viz/StackedBarGraph";

export default function ExecutiveDashboard() {
    return (
        <>
            <div className="mt-4">
                <div className="flex gap-4">
                    <div className="bg-gray-100 rounded-md" style={{minWidth:400, minHeight:400}}>
                        <div className="flex items-center justify-center h-full w-full">
                            <DonutChart />
                        </div>
                    </div>
                    <div className="flex-1 bg-gray-100 p-4 rounded-md" style={{ minHeight: 400 }}>
                        <div className="flex items-center justify-center h-full w-full">
                            <TimeSeriesChart style={{ width: '100%', height: '100%' }} />
                        </div>
                    </div>
                </div>
                <div className="bg-gray-100 p-4 rounded-md mt-4" style={{minHeight:400}}>
                    <div className="flex items-center justify-center h-full" style={{ minHeight: '400px' }}>
                        <LLMMarkdown />
                    </div>
                </div>
                <div className="bg-gray-100 p-4 rounded-md mt-4" style={{minHeight:400}}>
                    <div className="flex items-center justify-center h-full" style={{ minHeight: '400px' }}>
                        <StackedBarGraph />
                    </div>
                </div>
                <div className="bg-gray-100 p-4 rounded-md mt-4" style={{minHeight:400}}>
                    <div className="flex items-center justify-center h-full" style={{ minHeight: '400px' }}>
                        <LLMMarkdown />
                    </div>
                </div>
                <div className="bg-gray-100 p-4 rounded-md mt-4" style={{minHeight:400}}>
                    <div className="flex items-center justify-center h-full" style={{ minHeight: '400px' }}>
                        <LLMMarkdown />
                    </div>
                </div>
                <div className="bg-gray-100 p-4 rounded-md mt-4" style={{minHeight:400}}>
                    <div className="flex items-center justify-center h-full" style={{ minHeight: '400px' }}>
                        <LLMMarkdown />
                    </div>
                </div>
            </div>
        </>
    );
}