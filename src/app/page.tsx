'use client';

import { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import CsvUpload from './components/CsvUpload';
import SentimentAnalyzer from './components/SentimentAnalyzer';
import ExecutiveSummarizer from './components/ExecutiveSummarizer';
import LLMTagging from './components/LLMTagging';
import Spinner from './components/Spinner';
import { DataFrame } from 'danfojs';

export default function Home() {
  const [dataFrame, setDataFrame] = useState<DataFrame | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Navbar />
      {loading ? (
        <Spinner />
      ) : (
        <main className="container mx-auto p-4 min-h-screen mt-16">
          <div className="h-full flex flex-col items-center justify-center gap-8 max-w-4xl mx-auto bg-gray-50 rounded-xl shadow-lg p-8">
            <CsvUpload setDataFrame={setDataFrame} />
            {/* TODO: Make use of dataFrame */}
            {dataFrame && <></>}
            <SentimentAnalyzer dataFrame={dataFrame} />
            <LLMTagging />
            <ExecutiveSummarizer />
          </div>
        </main>
      )}
    </>
  );
}
