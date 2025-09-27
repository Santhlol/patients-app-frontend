import { TestBed } from '@angular/core/testing';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpErrorInterceptor } from './http-error.interceptor';
import { MessageService } from 'primeng/api';

describe('HttpErrorInterceptor', () => {
  let http: HttpTestingController;
  let client: HttpClient;
  let msg: MessageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, HttpClientModule],
      providers: [
        MessageService,
        { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true },
      ],
    });
    http = TestBed.inject(HttpTestingController);
    client = TestBed.inject(HttpClient);
    msg = TestBed.inject(MessageService);
    spyOn(msg, 'add').and.callThrough();
  });

  it('debería mostrar toast y reemitir el error 409 (duplicado)', (done) => {
    client.get('/x').subscribe({
      next: () => fail('debería fallar'),
      error: (err) => {
        expect(err.status).toBe(409);
        expect(msg.add).toHaveBeenCalled();
        done();
      }
    });

    const e = { message: 'Paciente duplicado', details: ['DocumentType + DocumentNumber ya existe.'] };
    http.expectOne('/x').flush(e, { status: 409, statusText: 'Conflict' });
    http.verify();
  });
});
