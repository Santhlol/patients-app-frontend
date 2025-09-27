import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetailComponent } from './detail.component';
import { PatientsService } from '../../patients.service';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

describe('DetailComponent', () => {
  let comp: DetailComponent;
  let fx: ComponentFixture<DetailComponent>;

  const apiMock = {
    getById: jasmine.createSpy().and.returnValue(of({
      patientId: 1, documentType: 'CC', documentNumber: '123',
      firstName: 'A', lastName: 'B', birthDate: '2000-01-01',
      createdAt: new Date().toISOString()
    }))
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DetailComponent],
      imports: [RouterTestingModule],
      providers: [
        { provide: PatientsService, useValue: apiMock },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: convertToParamMap({ id: '1' }) } } },
      ]
    }).compileComponents();

    fx = TestBed.createComponent(DetailComponent);
    comp = fx.componentInstance;
    fx.detectChanges(); // dispara ngOnInit
  });

  it('debería crear', () => {
    expect(comp).toBeTruthy();
  });
});
