'use client';

import { ChangeEvent, useState } from 'react';
import Papa from 'papaparse';
import { DataFrame } from 'danfojs';

interface CsvData {
  data: any[];
  headers: string[];
}

interface CsvUploadProps {
  setDataFrame: (df: DataFrame | null) => void;
}

export default function CsvUpload({ setDataFrame }: CsvUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [csvData, setCsvData] = useState<CsvData | null>(null);
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedData, setProcessedData] = useState<Record<string, any>[]>([]);

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
        console.log('Parsed CSV Data:', results.data);
        const headers = results.data[0] as string[];
        const rows = results.data.slice(1);

        if (!headers || rows.length === 0) {
          alert('The CSV file appears to be empty or invalid.');
          setCsvData(null);
          setIsProcessing(false);
          return;
        }

        setCsvData({ data: rows, headers });
        setSelectedColumns(headers);
        setIsProcessing(false);
      },
      error: (error) => {
        console.error('Error parsing CSV:', error);
        alert('An error occurred while parsing the CSV. Check the console for details.');
        setIsProcessing(false);
      },
      header: false,
      skipEmptyLines: true,
    });
  };

  const toggleColumn = (header: string) => {
    setSelectedColumns((prev) =>
      prev.includes(header)
        ? prev.filter((col) => col !== header)
        : [...prev, header]
    );
  };

  const processSelectedColumns = () => {
    if (!csvData || selectedColumns.length === 0) return;

    const processedData = csvData.data.map((row) => {
      const processedRow: Record<string, any> = {};
      selectedColumns.forEach((header) => {
        const index = csvData.headers.indexOf(header);
        processedRow[header] = row[index];
      });
      return processedRow;
    });

    console.log("Processed Data for DataFrame:", processedData);

    setProcessedData(processedData);

    try {
      const df = new DataFrame(processedData, { columns: selectedColumns });
      console.log("Created DataFrame:", df);
      setDataFrame(df);
    } catch (error) {
      console.error("Error creating DataFrame:", error);
      alert("Error creating DataFrame. Check console for details.");
    }
  };

  return (
    <div className="w-full p-6 bg-white rounded-lg shadow-md">
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

        {isProcessing && <div className="text-gray-600">Processing CSV...</div>}

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

            <div className="flex justify-center">
              <button
                onClick={processSelectedColumns}
                disabled={selectedColumns.length === 0}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Create DataFrame
              </button>
            </div>
          </div>
        )}

        {processedData.length > 0 && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Dataframe Preview (Top 10 Rows):</h3>
            <table className="min-w-full border-collapse border border-gray-300">
              <thead>
                <tr>
                  {Object.keys(processedData[0]).map((key) => (
                    <th key={key} className="border border-gray-300 px-4 py-2">{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {processedData.slice(0, 10).map((row, index) => (
                  <tr key={index}>
                    {Object.values(row).map((value, idx) => (
                      <td key={idx} className="border border-gray-300 px-4 py-2">{value}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
