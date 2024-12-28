// src
'use client';

import { ChangeEvent, useState } from 'react';
import Papa from 'papaparse';
import { DataFrame } from 'danfojs';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

interface CsvUploadProps {
  setDataFrame: (dataFrame: DataFrame | null) => void;
}

interface CsvData {
  data: string[][];
  headers: string[];
}

export default function CsvUpload({ setDataFrame }: CsvUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [csvData, setCsvData] = useState<CsvData | null>(null);
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedData, setProcessedData] = useState<Record<string, string | number>[]>([]);

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
        const rows = results.data.slice(1) as string[][];

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
      const processedRow: Record<string, string | number> = {};
      selectedColumns.forEach((header) => {
        const index = csvData.headers.indexOf(header);
        processedRow[header] = row[index];
      });
      return processedRow;
    });

    setProcessedData(processedData);

    try {
      const df = new DataFrame(processedData, { columns: selectedColumns });
      setDataFrame(df);
    } catch (error) {
      console.error('Error creating DataFrame:', error);
      alert('Error creating DataFrame. Check console for details.');
    }
  };

  return (
    <div className="w-full p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-2 text-center">Upload CSV</h3>
      <p className="text-gray-600 text-center mb-4">
          This uploads a CSV file and allows you to select columns to process.
      </p>
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
            <h3 className="text-lg font-semibold mb-2 text-center">Select columns to process:</h3>
            <div className="flex justify-center flex-wrap gap-2 mb-4">
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
            <TableContainer component={Paper} style={{ maxHeight: 400, maxWidth: 800, overflow: 'auto' }}>
              <div style={{ overflowX: 'auto' }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      {Object.keys(processedData[0]).map((key) => (
                        <TableCell key={key} style={{ border: '1px solid #ccc' }}>{key}</TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {processedData.slice(0, 10).map((row, index) => (
                      <TableRow key={index}>
                        {Object.values(row).map((value, idx) => (
                          <TableCell key={idx} style={{ border: '1px solid #ccc' }}>{value}</TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TableContainer>
          </div>
        )}
      </div>
    </div>
  );
}
