import CsvUpload from './components/CsvUpload';

export default function Home() {
  return (
    <main className="container mx-auto p-4 min-h-screen">
      <div className="h-full flex flex-col items-center justify-center gap-8 max-w-4xl mx-auto bg-gray-50 rounded-xl shadow-lg p-8">
        <CsvUpload />
        {/* Other components will go here */}
      </div>
    </main>
  );
}
