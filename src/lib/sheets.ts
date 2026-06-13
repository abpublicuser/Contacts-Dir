export async function fetchSpreadsheetData(inputUrlOrId: string) {
  const spreadsheetId = extractSpreadsheetId(inputUrlOrId);
  if (!spreadsheetId) {
    throw new Error('Invalid Spreadsheet ID or URL');
  }

  // Use the gviz/tq endpoint to fetch public sheet as CSV
  const url = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=out:csv`;
  const res = await fetch(url);
  
  if (!res.ok) {
    throw new Error('Failed to fetch spreadsheet. Make sure it is published or shared as "Anyone with the link can view".');
  }

  const csvText = await res.text();
  return parseCSV(csvText);
}

// Minimal CSV parser
function parseCSV(text: string): any[][] {
  const rows: any[][] = [];
  let currentRow: string[] = [];
  let currentCell = '';
  let insideQuotes = false;
  
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (char === '"') {
      if (insideQuotes && nextChar === '"') {
        currentCell += '"';
        i++; // skip next quote
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if (char === ',' && !insideQuotes) {
      currentRow.push(currentCell);
      currentCell = '';
    } else if ((char === '\n' || char === '\r') && !insideQuotes) {
      if (char === '\r' && nextChar === '\n') {
        i++; // skip \n
      }
      currentRow.push(currentCell);
      rows.push(currentRow);
      currentRow = [];
      currentCell = '';
    } else {
      currentCell += char;
    }
  }
  
  // Push the last row if exists
  if (currentCell || currentRow.length > 0) {
    currentRow.push(currentCell);
    rows.push(currentRow);
  }
  
  return rows;
}

export function extractSpreadsheetId(input: string): string | null {
  if (!input) return null;
  const match = input.match(/\/d\/([a-zA-Z0-9-_]+)/);
  if (match && match[1]) {
    return match[1];
  }
  return input;
}

