export default function ExecutiveDashboard() {
    return (
        <>
            <div className="mt-4">
                <div className="flex gap-4">
                    <div className="bg-gray-300 p-4 rounded-md" style={{minWidth:400, minHeight:400}}>
                        <div className="flex items-center justify-center h-full">
                            <p className="text-center text-gray-500">Donut Chart</p>
                        </div>
                    </div>
                    <div className="flex-1 bg-gray-300 p-4 rounded-md">
                        <div className="flex items-center justify-center h-full">
                            <p className="text-center text-gray-500">Time Series Chart</p>
                        </div>
                    </div>
                </div>
                <div className="bg-gray-300 p-4 rounded-md mt-4" style={{minHeight:400}}>
                    <div className="flex items-center justify-center h-full" style={{ minHeight: '400px' }}>
                        <p className="text-center text-gray-500">AI Insights</p>
                    </div>
                </div>
                <div className="bg-gray-300 p-4 rounded-md mt-4" style={{minHeight:400}}>
                    <div className="flex items-center justify-center h-full" style={{ minHeight: '400px' }}>
                        <p className="text-center text-gray-500">Clustering Stacked Graphs</p>
                    </div>
                </div>
                <div className="bg-gray-300 p-4 rounded-md mt-4" style={{minHeight:400}}>
                    <div className="flex items-center justify-center h-full" style={{ minHeight: '400px' }}>
                        <p className="text-center text-gray-500">AI Insights</p>
                    </div>
                </div>
                <div className="bg-gray-300 p-4 rounded-md mt-4" style={{minHeight:400}}>
                    <div className="flex items-center justify-center h-full" style={{ minHeight: '400px' }}>
                        <p className="text-center text-gray-500">Per Person Summary</p>
                    </div>
                </div>
                <div className="bg-gray-300 p-4 rounded-md mt-4" style={{minHeight:400}}>
                    <div className="flex items-center justify-center h-full" style={{ minHeight: '400px' }}>
                        <p className="text-center text-gray-500">AI Insights</p>
                    </div>
                </div>
            </div>
        </>
    );
}