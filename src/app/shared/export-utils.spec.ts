// src/app/shared/export-utils.spec.ts
import { exportToCsv, exportToXlsx } from './export-utils';
import * as FileSaver from 'file-saver';

describe('export-utils', () => {
  it('exportToCsv debería llamar a saveAs con Blob y nombre .csv', async () => {
    const saveAsSpy = spyOn(FileSaver, 'saveAs').and.stub();
    const rows = [{ Nombre: 'Luis', Apellido: 'Pérez' }];

    exportToCsv('test.csv', rows);

    expect(saveAsSpy).toHaveBeenCalled();

    const call = saveAsSpy.calls.mostRecent();
    const blob = call.args[0] as Blob;
    const filename = call.args[1] as string;

    expect(filename.endsWith('.csv')).toBeTrue();
    expect(blob).toBeTruthy();

    const text = await blob.text();
    expect(text).toContain('Nombre'); // encabezado
    expect(text).toContain('Luis');   // dato
  });

  it('exportToXlsx debería llamar a saveAs con Blob y nombre .xlsx', () => {
    const saveAsSpy = spyOn(FileSaver, 'saveAs').and.stub();
    const rows = [{ Nombre: 'Ana' }];

    exportToXlsx('test.xlsx', rows);

    expect(saveAsSpy).toHaveBeenCalled();

    const call = saveAsSpy.calls.mostRecent();
    const blob = call.args[0] as Blob;
    const filename = call.args[1] as string;

    expect(filename.endsWith('.xlsx')).toBeTrue();
    expect(blob).toBeTruthy();
  });
});
