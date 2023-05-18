import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IProceso } from '../proceso.model';

@Component({
  selector: 'jhi-proceso-detail',
  templateUrl: './proceso-detail.component.html',
})
export class ProcesoDetailComponent implements OnInit {
  proceso: IProceso | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ proceso }) => {
      this.proceso = proceso;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
