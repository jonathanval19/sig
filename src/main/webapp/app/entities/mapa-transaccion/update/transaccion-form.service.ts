import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ITransaccion, NewTransaccion } from '../mapa-transaccion.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ITransaccion for edit and NewTransaccionFormGroupInput for create.
 */
type TransaccionFormGroupInput = ITransaccion | PartialWithRequiredKeyOf<NewTransaccion>;

type TransaccionFormDefaults = Pick<NewTransaccion, 'id'>;

type TransaccionFormGroupContent = {
  id: FormControl<ITransaccion['id'] | NewTransaccion['id']>;
  propietario: FormControl<ITransaccion['propietario']>;
  titulo: FormControl<ITransaccion['titulo']>;
  disposicion: FormControl<ITransaccion['disposicion']>;
  codigoDocumento: FormControl<ITransaccion['codigoDocumento']>;
  numeracionDocumento: FormControl<ITransaccion['numeracionDocumento']>;
  proceso: FormControl<ITransaccion['proceso']>;
  tipoDocumento: FormControl<ITransaccion['tipoDocumento']>;
};

export type TransaccionFormGroup = FormGroup<TransaccionFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class TransaccionFormService {
  createTransaccionFormGroup(transaccion: TransaccionFormGroupInput = { id: null }): TransaccionFormGroup {
    const transaccionRawValue = {
      ...this.getFormDefaults(),
      ...transaccion,
    };
    return new FormGroup<TransaccionFormGroupContent>({
      id: new FormControl(
        { value: transaccionRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      propietario: new FormControl(transaccionRawValue.propietario),
      titulo: new FormControl(transaccionRawValue.titulo),
      disposicion: new FormControl(transaccionRawValue.disposicion),
      codigoDocumento: new FormControl(transaccionRawValue.codigoDocumento),
      numeracionDocumento: new FormControl(transaccionRawValue.numeracionDocumento),
      proceso: new FormControl(transaccionRawValue.proceso),
      tipoDocumento: new FormControl(transaccionRawValue.tipoDocumento),
    });
  }

  getTransaccion(form: TransaccionFormGroup): ITransaccion | NewTransaccion {
    return form.getRawValue() as ITransaccion | NewTransaccion;
  }

  resetForm(form: TransaccionFormGroup, transaccion: TransaccionFormGroupInput): void {
    const transaccionRawValue = { ...this.getFormDefaults(), ...transaccion };
    form.reset(
      {
        ...transaccionRawValue,
        id: { value: transaccionRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): TransaccionFormDefaults {
    return {
      id: null,
    };
  }
}
