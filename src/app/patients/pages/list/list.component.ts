import { Component } from '@angular/core';
import { PatientsService, Patient, PagedResult } from '../../patients.service';
import { TableLazyLoadEvent } from 'primeng/table';
import { debounceTime, Subject } from 'rxjs';
import { exportToCsv, exportToXlsx } from '../../../shared/export-utils';

@Component({
  selector: 'app-patients-list',
  templateUrl: './list.component.html'
})
export class ListComponent {
  loading = false;
  rows: Patient[] = [];
  total = 0;
  pageSize = 10;
  name = '';
  documentNumber = '';
  exportDialog = false;
  exportDate = ''; // yyyy-MM-dd

  openExport() { this.exportDialog = true; }
  doExportCsv()  { this.fetchAndExport('csv'); }
  doExportXlsx() { this.fetchAndExport('xlsx'); }

  private search$ = new Subject<void>();

  constructor(private api: PatientsService) {
    this.search$.pipe(debounceTime(300)).subscribe(() => this.load({first:0, rows:this.pageSize}));
  }

  onSearchChange() { this.search$.next(); }

  load(event: TableLazyLoadEvent) {
    this.loading = true;

    const pageSize = (event.rows ?? this.pageSize) || this.pageSize;
    const first = event.first ?? 0;                                   
    const page = Math.floor(first / pageSize) + 1;

    this.api.getPaged({
      page,
      pageSize,
      name: this.name || undefined,
      documentNumber: this.documentNumber || undefined
    }).subscribe({
      next: (res) => {
        this.rows = res.items;
        this.total = res.totalCount;
        this.pageSize = res.pageSize;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  delete(p: Patient) {
    if (!confirm(`¿Eliminar a ${p.firstName} ${p.lastName}?`)) return;
    this.api.delete(p.patientId).subscribe(() => this.load({first:0, rows:this.pageSize}));
  }

  private fetchAndExport(kind: 'csv'|'xlsx') {
    if (!this.exportDate) return;
    this.api.getCreatedAfter(this.exportDate).subscribe(list => {
      const rows = list.map(r => ({
        Documento: `${r.documentType}-${r.documentNumber}`,
        Nombre: r.firstName,
        Apellido: r.lastName,
        Email: r.email ?? '',
        Telefono: r.phoneNumber ?? '',
        Creado: new Date(r.createdAt).toISOString().replace('T',' ').slice(0,16),
      }));
      if (kind === 'csv') {
        exportToCsv(`pacientes-desde-${this.exportDate}.csv`, rows);
      } else {
        exportToXlsx(`pacientes-desde-${this.exportDate}.xlsx`, rows);
      }
      this.exportDialog = false;
    });
  }
}