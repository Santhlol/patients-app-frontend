import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListComponent } from './list.component';
import { PatientsService } from '../../patients.service';
import { of } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('ListComponent', () => {
  let comp: ListComponent;
  let fx: ComponentFixture<ListComponent>;

  const apiMock = {
    getPaged: jasmine.createSpy().and.returnValue(of({ page:1, pageSize:10, totalCount:2, items:[] }))
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListComponent],
      imports: [FormsModule],              
      providers: [{ provide: PatientsService, useValue: apiMock }],
      schemas: [NO_ERRORS_SCHEMA],         
    }).compileComponents();

    fx = TestBed.createComponent(ListComponent);
    comp = fx.componentInstance;
  });

  it('debería invocar getPaged y asignar total/items', () => {
    comp.load({ first: 0, rows: 10 } as any); 
    expect(apiMock.getPaged).toHaveBeenCalled();
    expect(comp.total).toBe(2);
  });
  it('debería pasar filtros name/documentNumber al servicio', () => {
    const api = TestBed.inject(PatientsService) as any;
    api.getPaged.calls.reset();

    comp.name = 'Lu';
    comp.documentNumber = '1002';
    comp.load({ first: 0, rows: 10 } as any);

    expect(api.getPaged).toHaveBeenCalledWith(jasmine.objectContaining({
      page: 1, pageSize: 10, name: 'Lu', documentNumber: '1002'
    }));
  });
});
