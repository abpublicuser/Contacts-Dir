import { useState, useEffect } from 'react';
import { ContactsDirectory } from './components/ContactsDirectory';
import { fetchSpreadsheetData } from './lib/sheets';
import { Loader2 } from 'lucide-react';

// Hardcoded spreadsheet ID:
// Please replace this with your actual public Google Spreadsheet ID. 
// Note: The Google Sheet must be shared as "Anyone with the link can view".
const SPREADSHEET_ID = "https://docs.google.com/spreadsheets/d/1dN6bkj48B126yAQ4mDZbchr27qOmC52dmH4TFRwUrPU/edit?usp=sharing";

export default function App() {
  const [dataRows, setDataRows] = useState<any[][]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData(SPREADSHEET_ID);
  }, []);

  const loadData = async (id: string) => {
    setIsLoadingData(true);
    setError(null);
    try {
      if (id === "YOUR_SPREADSHEET_ID_HERE") {
        throw new Error("Please replace 'YOUR_SPREADSHEET_ID_HERE' with your actual public Google Sheets ID in src/App.tsx.");
      }
      const rows = await fetchSpreadsheetData(id);
      setDataRows(rows);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch spreadsheet data.');
    } finally {
      setIsLoadingData(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans">
      <div className="h-screen w-full relative">
        {error && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg text-sm flex items-center gap-3">
             <span>{error}</span>
          </div>
        )}
        <ContactsDirectory 
          dataRows={dataRows} 
          isLoading={isLoadingData} 
        />
      </div>
    </div>
  );
}
