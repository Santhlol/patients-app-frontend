import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PatientsService } from './patients.service';
import { environment } from '../../environments/environment';

describe('PatientsService', () => {
  let svc: PatientsService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports:[HttpClientTestingModule] });
    svc = TestBed.inject(PatientsService);
    http = TestBed.inject(HttpTestingController);
  });

  it('debería construir correctamente los query params en getPaged', () => {
    svc.getPaged({ page: 2, pageSize: 20, name: 'Lu', documentNumber: '1002' }).subscribe();
    const req = http.expectOne(r => r.url === `${environment.apiBaseUrl}/api/patients`);
    expect(req.request.params.get('page')).toBe('2');
    expect(req.request.params.get('pageSize')).toBe('20');
    expect(req.request.params.get('name')).toBe('Lu');
    expect(req.request.params.get('documentNumber')).toBe('1002');
    req.flush({ page:2, pageSize:20, totalCount:0, items:[] });
    http.verify();
  });
});
