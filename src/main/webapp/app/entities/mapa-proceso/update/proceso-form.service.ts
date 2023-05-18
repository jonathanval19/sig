import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IProceso, NewProceso } from '../mapa-proceso.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IProceso for edit and NewProcesoFormGroupInput for create.
 */
type ProcesoFormGroupInput = IProceso | PartialWithRequiredKeyOf<NewProceso>;

type ProcesoFormDefaults = Pick<NewProceso, 'id'>;

type ProcesoFormGroupContent = {
  id: FormControl<IProceso['id'] | NewProceso['id']>;
  tipoproceso: FormControl<IProceso['tipoproceso']>;
  codigo: FormControl<IProceso['codigo']>;
  descripcion: FormControl<IProceso['descripcion']>;
};

export type ProcesoFormGroup = FormGroup<ProcesoFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ProcesoFormService {
  createProcesoFormGroup(proceso: ProcesoFormGroupInput = { id: null }): ProcesoFormGroup {
    const procesoRawValue = {
      ...this.getFormDefaults(),
      ...proceso,
    };
    return new FormGroup<ProcesoFormGroupContent>({
      id: new FormControl(
        { value: procesoRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      tipoproceso: new FormControl(procesoRawValue.tipoproceso),
      codigo: new FormControl(procesoRawValue.codigo),
      descripcion: new FormControl(procesoRawValue.descripcion),
    });
  }

  getProceso(form: ProcesoFormGroup): IProceso | NewProceso {
    return form.getRawValue() as IProceso | NewProceso;
  }

  resetForm(form: ProcesoFormGroup, proceso: ProcesoFormGroupInput): void {
    const procesoRawValue = { ...this.getFormDefaults(), ...proceso };
    form.reset(
      {
        ...procesoRawValue,
        id: { value: procesoRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): ProcesoFormDefaults {
    return {
      id: null,
    };
  }
}
