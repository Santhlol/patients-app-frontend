import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PatientsService, Patient } from '../../patients.service';

@Component({
  selector: 'app-patient-detail',
  templateUrl: './detail.component.html'
})
export class DetailComponent implements OnInit {
  p?: Patient;
  loading = false;

  constructor(private route: ActivatedRoute, private api: PatientsService) {}

  ngOnInit() {
    const id = +(this.route.snapshot.paramMap.get('id') || 0);
    if (!id) return;
    this.loading = true;
    this.api.getById(id).subscribe({
      next: x => { this.p = x; this.loading = false; },
      error: () => this.loading = false
    });
  }
}