import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { TransaccionFormService, TransaccionFormGroup } from './transaccion-form.service';
import { ITransaccion } from '../mapa-transaccion.model';
import { TransaccionService } from '../service/transaccion.service';
import { IProceso } from 'app/entities/proceso/proceso.model';
import { ProcesoService } from 'app/entities/proceso/service/proceso.service';
import { ITipoDocumento } from 'app/entities/tipo-documento/tipo-documento.model';
import { TipoDocumentoService } from 'app/entities/tipo-documento/service/tipo-documento.service';
import { Disposicion } from 'app/entities/enumerations/disposicion.model';

@Component({
  selector: 'jhi-transaccion-update',
  templateUrl: './transaccion-update.component.html',
})
export class TransaccionUpdateComponent implements OnInit {
  isSaving = false;
  transaccion: ITransaccion | null = null;
  disposicionValues = Object.keys(Disposicion);

  procesosSharedCollection: IProceso[] = [];
  tipoDocumentosSharedCollection: ITipoDocumento[] = [];

  editForm: TransaccionFormGroup = this.transaccionFormService.createTransaccionFormGroup();

  constructor(
    protected transaccionService: TransaccionService,
    protected transaccionFormService: TransaccionFormService,
    protected procesoService: ProcesoService,
    protected tipoDocumentoService: TipoDocumentoService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareProceso = (o1: IProceso | null, o2: IProceso | null): boolean => this.procesoService.compareProceso(o1, o2);

  compareTipoDocumento = (o1: ITipoDocumento | null, o2: ITipoDocumento | null): boolean =>
    this.tipoDocumentoService.compareTipoDocumento(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ transaccion }) => {
      this.transaccion = transaccion;
      if (transaccion) {
        this.updateForm(transaccion);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const transaccion = this.transaccionFormService.getTransaccion(this.editForm);
    if (transaccion.id !== null) {
      this.subscribeToSaveResponse(this.transaccionService.update(transaccion));
    } else {
      this.subscribeToSaveResponse(this.transaccionService.create(transaccion));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITransaccion>>): void {
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

  protected updateForm(transaccion: ITransaccion): void {
    this.transaccion = transaccion;
    this.transaccionFormService.resetForm(this.editForm, transaccion);

    this.procesosSharedCollection = this.procesoService.addProcesoToCollectionIfMissing<IProceso>(
      this.procesosSharedCollection,
      transaccion.proceso
    );
    this.tipoDocumentosSharedCollection = this.tipoDocumentoService.addTipoDocumentoToCollectionIfMissing<ITipoDocumento>(
      this.tipoDocumentosSharedCollection,
      transaccion.tipoDocumento
    );
  }

  protected loadRelationshipsOptions(): void {
    this.procesoService
      .query()
      .pipe(map((res: HttpResponse<IProceso[]>) => res.body ?? []))
      .pipe(
        map((procesos: IProceso[]) => this.procesoService.addProcesoToCollectionIfMissing<IProceso>(procesos, this.transaccion?.proceso))
      )
      .subscribe((procesos: IProceso[]) => (this.procesosSharedCollection = procesos));

    this.tipoDocumentoService
      .query()
      .pipe(map((res: HttpResponse<ITipoDocumento[]>) => res.body ?? []))
      .pipe(
        map((tipoDocumentos: ITipoDocumento[]) =>
          this.tipoDocumentoService.addTipoDocumentoToCollectionIfMissing<ITipoDocumento>(tipoDocumentos, this.transaccion?.tipoDocumento)
        )
      )
      .subscribe((tipoDocumentos: ITipoDocumento[]) => (this.tipoDocumentosSharedCollection = tipoDocumentos));
  }
}
