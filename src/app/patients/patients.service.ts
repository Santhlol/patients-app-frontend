import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

export interface Patient {
  patientId: number;
  documentType: string;
  documentNumber: string;
  firstName: string;
  lastName: string;
  birthDate: string; // yyyy-MM-dd
  phoneNumber?: string;
  email?: string;
  createdAt: string;
}
export interface CreatePatientDto extends Omit<Patient, 'patientId' | 'createdAt'> {}
export interface UpdatePatientDto extends Omit<Patient, 'patientId' | 'createdAt'> {}
export interface PagedResult<T> {
  page: number; pageSize: number; totalCount: number; items: T[];
}

@Injectable({ providedIn: 'root' })
export class PatientsService {
  private base = `${environment.apiBaseUrl}/api/patients`;

  constructor(private http: HttpClient) {}

  getPaged(opts: { page: number; pageSize: number; name?: string; documentNumber?: string; }):
    Observable<PagedResult<Patient>> {
    let params = new HttpParams()
      .set('page', opts.page)
      .set('pageSize', opts.pageSize);
    if (opts.name) params = params.set('name', opts.name);
    if (opts.documentNumber) params = params.set('documentNumber', opts.documentNumber);
    return this.http.get<PagedResult<Patient>>(this.base, { params });
  }

  getById(id: number) { return this.http.get<Patient>(`${this.base}/${id}`); }
  create(dto: CreatePatientDto) { return this.http.post<Patient>(this.base, dto); }
  update(id: number, dto: UpdatePatientDto) { return this.http.put(`${this.base}/${id}`, dto); }
  delete(id: number) { return this.http.delete(`${this.base}/${id}`); }

  getCreatedAfter(date: string) {
    return this.http.get<Patient[]>(`${this.base}/created-after`, { params: new HttpParams().set('date', date) });
  }
}