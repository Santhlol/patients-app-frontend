// src/app/app.component.spec.ts
import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { AppComponent } from './app.component';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';

@Component({ template: '' })
class DummyPatientsComponent {}

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          { path: 'patients', component: DummyPatientsComponent },
          { path: '', pathMatch: 'full', redirectTo: 'patients' },
          { path: '**', redirectTo: 'patients' },
        ]),
        BrowserAnimationsModule,
        ToastModule,
        ConfirmDialogModule,
      ],
      declarations: [AppComponent, DummyPatientsComponent],
      providers: [MessageService, ConfirmationService],
    }).compileComponents();
  });

  it('debería crear la app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
