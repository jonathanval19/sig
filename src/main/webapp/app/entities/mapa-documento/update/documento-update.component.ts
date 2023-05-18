import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { DocumentoFormService, DocumentoFormGroup } from './documento-form.service';
import { IDocumento } from '../mapa-documento.model';
import { DocumentoService } from '../service/documento.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { ITransaccion } from 'app/entities/transaccion/transaccion.model';
import { TransaccionService } from 'app/entities/transaccion/service/transaccion.service';
import { Acceso } from 'app/entities/enumerations/acceso.model';

@Component({
  selector: 'jhi-documento-update',
  templateUrl: './documento-update.component.html',
})
export class DocumentoUpdateComponent implements OnInit {
  isSaving = false;
  documento: IDocumento | null = null;
  accesoValues = Object.keys(Acceso);

  transaccionsSharedCollection: ITransaccion[] = [];

  editForm: DocumentoFormGroup = this.documentoFormService.createDocumentoFormGroup();

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected documentoService: DocumentoService,
    protected documentoFormService: DocumentoFormService,
    protected transaccionService: TransaccionService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareTransaccion = (o1: ITransaccion | null, o2: ITransaccion | null): boolean => this.transaccionService.compareTransaccion(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ documento }) => {
      this.documento = documento;
      if (documento) {
        this.updateForm(documento);
      }

      this.loadRelationshipsOptions();
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  setFileData(event: Event, field: string, isImage: boolean): void {
    this.dataUtils.loadFileToForm(event, this.editForm, field, isImage).subscribe({
      error: (err: FileLoadError) =>
        this.eventManager.broadcast(new EventWithContent<AlertError>('sigApp.error', { message: err.message })),
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const documento = this.documentoFormService.getDocumento(this.editForm);
    if (documento.id !== null) {
      this.subscribeToSaveResponse(this.documentoService.update(documento));
    } else {
      this.subscribeToSaveResponse(this.documentoService.create(documento));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IDocumento>>): void {
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

  protected updateForm(documento: IDocumento): void {
    this.documento = documento;
    this.documentoFormService.resetForm(this.editForm, documento);

    this.transaccionsSharedCollection = this.transaccionService.addTransaccionToCollectionIfMissing<ITransaccion>(
      this.transaccionsSharedCollection,
      documento.transaccion
    );
  }

  protected loadRelationshipsOptions(): void {
    this.transaccionService
      .query()
      .pipe(map((res: HttpResponse<ITransaccion[]>) => res.body ?? []))
      .pipe(
        map((transaccions: ITransaccion[]) =>
          this.transaccionService.addTransaccionToCollectionIfMissing<ITransaccion>(transaccions, this.documento?.transaccion)
        )
      )
      .subscribe((transaccions: ITransaccion[]) => (this.transaccionsSharedCollection = transaccions));
  }
}
