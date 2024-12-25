'use client';

import { ChangeEvent, useState } from 'react';
import Papa from 'papaparse';

interface CsvData {
  data: any[];
  headers: string[];
}

export default function CsvUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [csvData, setCsvData] = useState<CsvData | null>(null);
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile && selectedFile.type === 'text/csv') {
      setFile(selectedFile);
      parseCsv(selectedFile);
    } else {
      alert('Please select a valid CSV file');
    }
  };

  const parseCsv = (file: File) => {
    setIsProcessing(true);
    Papa.parse(file, {
      complete: (results) => {
        const headers = results.data[0] as string[];
        setCsvData({
          data: results.data.slice(1),
          headers: headers
        });
        setIsProcessing(false);
      },
      header: false,
      skipEmptyLines: true
    });
  };

  const toggleColumn = (header: string) => {
    setSelectedColumns(prev => 
      prev.includes(header)
        ? prev.filter(col => col !== header)
        : [...prev, header]
    );
  };

  const processSelectedColumns = () => {
    if (!csvData || selectedColumns.length === 0) return;
    
    // Process only selected columns
    const processedData = csvData.data.map(row => {
      const processedRow: Record<string, any> = {};
      selectedColumns.forEach((header, index) => {
        processedRow[header] = row[csvData.headers.indexOf(header)];
      });
      return processedRow;
    });

    console.log('Processed data:', processedData);
    // Here you can handle the processed data as needed
  };

  return (
    <div className="w-full max-w-xl p-6 bg-white rounded-lg shadow-md">
      <div className="flex flex-col items-center justify-center min-h-40 gap-4">
        <label className="relative cursor-pointer bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors">
          <span>{file ? file.name : 'Upload CSV'}</span>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>

        {isProcessing && (
          <div className="text-gray-600">Processing CSV...</div>
        )}

        {csvData && (
          <div className="w-full mt-4">
            <h3 className="text-lg font-semibold mb-2">Select columns to process:</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {csvData.headers.map((header) => (
                <label key={header} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedColumns.includes(header)}
                    onChange={() => toggleColumn(header)}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm">{header}</span>
                </label>
              ))}
            </div>
            
            <button
              onClick={processSelectedColumns}
              disabled={selectedColumns.length === 0}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Process Selected Columns
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 