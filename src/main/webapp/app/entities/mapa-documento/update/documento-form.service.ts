import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IDocumento, NewDocumento } from '../mapa-documento.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IDocumento for edit and NewDocumentoFormGroupInput for create.
 */
type DocumentoFormGroupInput = IDocumento | PartialWithRequiredKeyOf<NewDocumento>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IDocumento | NewDocumento> = Omit<T, 'fechaElaboracion' | 'fechaActualizacion'> & {
  fechaElaboracion?: string | null;
  fechaActualizacion?: string | null;
};

type DocumentoFormRawValue = FormValueOf<IDocumento>;

type NewDocumentoFormRawValue = FormValueOf<NewDocumento>;

type DocumentoFormDefaults = Pick<NewDocumento, 'id' | 'fechaElaboracion' | 'fechaActualizacion'>;

type DocumentoFormGroupContent = {
  id: FormControl<DocumentoFormRawValue['id'] | NewDocumento['id']>;
  version: FormControl<DocumentoFormRawValue['version']>;
  fechaElaboracion: FormControl<DocumentoFormRawValue['fechaElaboracion']>;
  fechaActualizacion: FormControl<DocumentoFormRawValue['fechaActualizacion']>;
  acceso: FormControl<DocumentoFormRawValue['acceso']>;
  archivo: FormControl<DocumentoFormRawValue['archivo']>;
  archivoContentType: FormControl<DocumentoFormRawValue['archivoContentType']>;
  enviarNotificacion: FormControl<DocumentoFormRawValue['enviarNotificacion']>;
  observaciones: FormControl<DocumentoFormRawValue['observaciones']>;
  transaccion: FormControl<DocumentoFormRawValue['transaccion']>;
};

export type DocumentoFormGroup = FormGroup<DocumentoFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class DocumentoFormService {
  createDocumentoFormGroup(documento: DocumentoFormGroupInput = { id: null }): DocumentoFormGroup {
    const documentoRawValue = this.convertDocumentoToDocumentoRawValue({
      ...this.getFormDefaults(),
      ...documento,
    });
    return new FormGroup<DocumentoFormGroupContent>({
      id: new FormControl(
        { value: documentoRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      version: new FormControl(documentoRawValue.version),
      fechaElaboracion: new FormControl(documentoRawValue.fechaElaboracion),
      fechaActualizacion: new FormControl(documentoRawValue.fechaActualizacion),
      acceso: new FormControl(documentoRawValue.acceso),
      archivo: new FormControl(documentoRawValue.archivo),
      archivoContentType: new FormControl(documentoRawValue.archivoContentType),
      enviarNotificacion: new FormControl(documentoRawValue.enviarNotificacion),
      observaciones: new FormControl(documentoRawValue.observaciones),
      transaccion: new FormControl(documentoRawValue.transaccion),
    });
  }

  getDocumento(form: DocumentoFormGroup): IDocumento | NewDocumento {
    return this.convertDocumentoRawValueToDocumento(form.getRawValue() as DocumentoFormRawValue | NewDocumentoFormRawValue);
  }

  resetForm(form: DocumentoFormGroup, documento: DocumentoFormGroupInput): void {
    const documentoRawValue = this.convertDocumentoToDocumentoRawValue({ ...this.getFormDefaults(), ...documento });
    form.reset(
      {
        ...documentoRawValue,
        id: { value: documentoRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): DocumentoFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      fechaElaboracion: currentTime,
      fechaActualizacion: currentTime,
    };
  }

  private convertDocumentoRawValueToDocumento(rawDocumento: DocumentoFormRawValue | NewDocumentoFormRawValue): IDocumento | NewDocumento {
    return {
      ...rawDocumento,
      fechaElaboracion: dayjs(rawDocumento.fechaElaboracion, DATE_TIME_FORMAT),
      fechaActualizacion: dayjs(rawDocumento.fechaActualizacion, DATE_TIME_FORMAT),
    };
  }

  private convertDocumentoToDocumentoRawValue(
    documento: IDocumento | (Partial<NewDocumento> & DocumentoFormDefaults)
  ): DocumentoFormRawValue | PartialWithRequiredKeyOf<NewDocumentoFormRawValue> {
    return {
      ...documento,
      fechaElaboracion: documento.fechaElaboracion ? documento.fechaElaboracion.format(DATE_TIME_FORMAT) : undefined,
      fechaActualizacion: documento.fechaActualizacion ? documento.fechaActualizacion.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
