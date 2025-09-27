import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormComponent } from './form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { PatientsService } from '../../patients.service';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { Router } from '@angular/router';

describe('FormComponent', () => {
  let comp: FormComponent;
  let fx: ComponentFixture<FormComponent>;

  const apiMock = {
    getById: jasmine.createSpy().and.returnValue(of({
      patientId: 1, documentType: 'CC', documentNumber: '123',
      firstName: 'Nombre', lastName: 'Apellido', birthDate: '2000-01-01',
      createdAt: new Date().toISOString()
    })),
    create: jasmine.createSpy().and.returnValue(of({})),
    update: jasmine.createSpy().and.returnValue(of({})),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormComponent],
      imports: [ReactiveFormsModule, RouterTestingModule],
      providers: [
        { provide: PatientsService, useValue: apiMock },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: convertToParamMap({  }) } } },
      ]
    }).compileComponents();

    fx = TestBed.createComponent(FormComponent);
    comp = fx.componentInstance;
    fx.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(comp).toBeTruthy();
  });
  it('debería cargar y actualizar un paciente cuando hay id en la ruta', () => {
    
    TestBed.resetTestingModule();

    const apiMock2 = {
      getById: jasmine.createSpy().and.returnValue(of({
        patientId: 1, documentType: 'CC', documentNumber: '123',
        firstName: 'Nombre', lastName: 'Apellido', birthDate: '2000-01-01',
        createdAt: new Date().toISOString()
      })),
      create: jasmine.createSpy(),
      update: jasmine.createSpy().and.returnValue(of({})),
    };

    const routerSpy = jasmine.createSpyObj<Router>('Router', ['navigate']);

    TestBed.configureTestingModule({
      declarations: [FormComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: PatientsService, useValue: apiMock2 },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: convertToParamMap({ id: '1' }) } } },
      ]
    }).compileComponents();

    const fx2 = TestBed.createComponent(FormComponent);
    const comp2 = fx2.componentInstance;
    fx2.detectChanges();

    // Act
    comp2.save();

    // Assert
    expect(apiMock2.getById).toHaveBeenCalledWith(1);
    expect(apiMock2.update).toHaveBeenCalled();
    expect(apiMock2.create).not.toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/patients']);
  });
});
