import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export function exportToCsv(filename: string, rows: any[], headers?: Record<string, string>) {
  if (!rows?.length) return;
  const cols = headers ? Object.keys(headers) : Object.keys(rows[0]);
  const head = headers ? [Object.values(headers).join(',')] : [cols.join(',')];
  const data = rows.map(r => cols.map(c => wrapCsv(r[c])).join(','));
  const blob = new Blob([head.concat(data).join('\r\n')], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, filename);
}

function wrapCsv(val: any) {
  if (val == null) return '';
  const s = String(val).replace(/"/g, '""');
  return /[",\r\n]/.test(s) ? `"${s}"` : s;
}

export function exportToXlsx(filename: string, rows: any[], sheetName = 'Reporte') {
  if (!rows?.length) return;
  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  const buf = XLSX.write(wb, { type: 'array', bookType: 'xlsx' });
  saveAs(new Blob([buf], { type: 'application/octet-stream' }), filename);
}
