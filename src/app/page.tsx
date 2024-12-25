'use client';

import CsvUpload from './components/CsvUpload';
import { useState } from 'react';
import { DataFrame } from 'danfojs';

export default function Home() {
  const [dataFrame, setDataFrame] = useState<DataFrame | null>(null);

  return (
    <main className="container mx-auto p-4 min-h-screen" style={{ minHeight: '5000vh' }}>
      <div className="h-full flex flex-col items-center justify-center gap-8 max-w-4xl mx-auto bg-gray-50 rounded-xl shadow-lg p-8">
        <CsvUpload setDataFrame={setDataFrame} />
        {/* Other components will go here */}
      </div>
    </main>
  );
}
