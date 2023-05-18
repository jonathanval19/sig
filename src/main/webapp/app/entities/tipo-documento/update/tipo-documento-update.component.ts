import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { TipoDocumentoFormService, TipoDocumentoFormGroup } from './tipo-documento-form.service';
import { ITipoDocumento } from '../tipo-documento.model';
import { TipoDocumentoService } from '../service/tipo-documento.service';

@Component({
  selector: 'jhi-tipo-documento-update',
  templateUrl: './tipo-documento-update.component.html',
})
export class TipoDocumentoUpdateComponent implements OnInit {
  isSaving = false;
  tipoDocumento: ITipoDocumento | null = null;

  editForm: TipoDocumentoFormGroup = this.tipoDocumentoFormService.createTipoDocumentoFormGroup();

  constructor(
    protected tipoDocumentoService: TipoDocumentoService,
    protected tipoDocumentoFormService: TipoDocumentoFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ tipoDocumento }) => {
      this.tipoDocumento = tipoDocumento;
      if (tipoDocumento) {
        this.updateForm(tipoDocumento);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const tipoDocumento = this.tipoDocumentoFormService.getTipoDocumento(this.editForm);
    if (tipoDocumento.id !== null) {
      this.subscribeToSaveResponse(this.tipoDocumentoService.update(tipoDocumento));
    } else {
      this.subscribeToSaveResponse(this.tipoDocumentoService.create(tipoDocumento));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITipoDocumento>>): void {
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

  protected updateForm(tipoDocumento: ITipoDocumento): void {
    this.tipoDocumento = tipoDocumento;
    this.tipoDocumentoFormService.resetForm(this.editForm, tipoDocumento);
  }
}
