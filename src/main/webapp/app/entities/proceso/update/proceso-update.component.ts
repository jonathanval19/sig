import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { ProcesoFormService, ProcesoFormGroup } from './proceso-form.service';
import { IProceso } from '../proceso.model';
import { ProcesoService } from '../service/proceso.service';
import { TipoProceso } from 'app/entities/enumerations/tipo-proceso.model';

@Component({
  selector: 'jhi-proceso-update',
  templateUrl: './proceso-update.component.html',
})
export class ProcesoUpdateComponent implements OnInit {
  isSaving = false;
  proceso: IProceso | null = null;
  tipoProcesoValues = Object.keys(TipoProceso);

  editForm: ProcesoFormGroup = this.procesoFormService.createProcesoFormGroup();

  constructor(
    protected procesoService: ProcesoService,
    protected procesoFormService: ProcesoFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ proceso }) => {
      this.proceso = proceso;
      if (proceso) {
        this.updateForm(proceso);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const proceso = this.procesoFormService.getProceso(this.editForm);
    if (proceso.id !== null) {
      this.subscribeToSaveResponse(this.procesoService.update(proceso));
    } else {
      this.subscribeToSaveResponse(this.procesoService.create(proceso));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IProceso>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(proceso: IProceso): void {
    this.proceso = proceso;
    this.procesoFormService.resetForm(this.editForm, proceso);
  }
}
