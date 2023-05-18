import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ITipoDocumento, NewTipoDocumento } from '../tipo-documento.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ITipoDocumento for edit and NewTipoDocumentoFormGroupInput for create.
 */
type TipoDocumentoFormGroupInput = ITipoDocumento | PartialWithRequiredKeyOf<NewTipoDocumento>;

type TipoDocumentoFormDefaults = Pick<NewTipoDocumento, 'id'>;

type TipoDocumentoFormGroupContent = {
  id: FormControl<ITipoDocumento['id'] | NewTipoDocumento['id']>;
  codigo: FormControl<ITipoDocumento['codigo']>;
  descripcion: FormControl<ITipoDocumento['descripcion']>;
};

export type TipoDocumentoFormGroup = FormGroup<TipoDocumentoFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class TipoDocumentoFormService {
  createTipoDocumentoFormGroup(tipoDocumento: TipoDocumentoFormGroupInput = { id: null }): TipoDocumentoFormGroup {
    const tipoDocumentoRawValue = {
      ...this.getFormDefaults(),
      ...tipoDocumento,
    };
    return new FormGroup<TipoDocumentoFormGroupContent>({
      id: new FormControl(
        { value: tipoDocumentoRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      codigo: new FormControl(tipoDocumentoRawValue.codigo),
      descripcion: new FormControl(tipoDocumentoRawValue.descripcion),
    });
  }

  getTipoDocumento(form: TipoDocumentoFormGroup): ITipoDocumento | NewTipoDocumento {
    return form.getRawValue() as ITipoDocumento | NewTipoDocumento;
  }

  resetForm(form: TipoDocumentoFormGroup, tipoDocumento: TipoDocumentoFormGroupInput): void {
    const tipoDocumentoRawValue = { ...this.getFormDefaults(), ...tipoDocumento };
    form.reset(
      {
        ...tipoDocumentoRawValue,
        id: { value: tipoDocumentoRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): TipoDocumentoFormDefaults {
    return {
      id: null,
    };
  }
}
