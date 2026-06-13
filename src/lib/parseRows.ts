export interface Contact {
  category: string;
  name: string;
  typeOfService: string;
  businessName?: string;
  phoneNumber?: string;
  rawRow: any[];
}

export function parseRows(rows: any[][]): Contact[] {
  if (!rows || rows.length < 2) return [];

  // Assuming first row is headers
  const headers = rows[0].map(h => String(h).toLowerCase().trim());
  
  // Find indices for common columns
  const findIdx = (keywords: string[]) => headers.findIndex(h => keywords.some(k => h.includes(k)));
  
  const categoryIdx = findIdx(['category']);
  // Handle variations in header names
  const nameIdx = findIdx(['name', 'contact name']);
  const serviceIdx = findIdx(['type of service', 'service', 'type']);
  const businessIdx = findIdx(['business name', 'business', 'company']);
  const phoneIdx = findIdx(['phone', 'mobile', 'contact number', 'number']);
  
  const extract = (row: any[], index: number) => index >= 0 && index < row.length ? row[index] : '';

  return rows.slice(1).map(row => {
    return {
      category: extract(row, categoryIdx),
      name: extract(row, nameIdx),
      typeOfService: extract(row, serviceIdx),
      businessName: extract(row, businessIdx),
      phoneNumber: extract(row, phoneIdx),
      rawRow: row
    };
  }).filter(c => c.name || c.businessName); // Filter out empty rows
}
