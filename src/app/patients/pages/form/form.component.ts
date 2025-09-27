import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PatientsService, Patient, CreatePatientDto, UpdatePatientDto } from '../../patients.service';

@Component({
  selector: 'app-patient-form',
  templateUrl: './form.component.html'
})
export class FormComponent implements OnInit {
  id?: number;
  loading = false;
  documentTypeOptions = [
    { label: 'Cédula de ciudadanía', value: 'CC' },
    { label: 'Tarjeta de identidad', value: 'TI' },
    { label: 'Cédula de extranjería', value: 'CE' },
    { label: 'Pasaporte', value: 'PA' },
  ];

  form = this.fb.group({
    documentType: ['CC', Validators.required],
    documentNumber: ['', [Validators.required, Validators.maxLength(20)]],
    firstName: ['', [Validators.required, Validators.maxLength(80)]],
    lastName: ['', [Validators.required, Validators.maxLength(80)]],
    birthDate: ['', Validators.required],
    phoneNumber: [''],
    email: ['']
  });

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private router: Router, private api: PatientsService) {}

  ngOnInit() {
    const param = this.route.snapshot.paramMap.get('id');
    if (param && !isNaN(+param)) {
      this.id = +param;
      this.loading = true;
      this.api.getById(this.id).subscribe({
        next: (p: Patient) => {
          this.form.patchValue({
            documentType: p.documentType,
            documentNumber: p.documentNumber,
            firstName: p.firstName,
            lastName: p.lastName,
            birthDate: p.birthDate,
            phoneNumber: p.phoneNumber ?? '',
            email: p.email ?? '',
          });
          this.loading = false;
        },
        error: () => this.loading = false
      });
    }
  }

  save() {
    if (this.form.invalid) return;
    this.loading = true;
    const dto = this.form.value as CreatePatientDto;

    const req = this.id
      ? this.api.update(this.id, dto as UpdatePatientDto)
      : this.api.create(dto);

    req.subscribe({
      next: () => this.router.navigate(['/patients']),
      error: () => this.loading = false
    });
  }
}