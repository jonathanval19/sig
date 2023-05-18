import { Disposicion } from 'app/entities/enumerations/disposicion.model';

import { ITransaccion, NewTransaccion } from './transaccion.model';

export const sampleWithRequiredData: ITransaccion = {
  id: 86269,
};

export const sampleWithPartialData: ITransaccion = {
  id: 83491,
  propietario: 'Palladium',
  disposicion: Disposicion['CREACION'],
  codigoDocumento: 'bifurcada Paradigma Plástico',
  numeracionDocumento: 'hacking Gerente',
};

export const sampleWithFullData: ITransaccion = {
  id: 96517,
  propietario: 'efficient',
  titulo: 'CSS definición',
  disposicion: Disposicion['CREACION'],
  codigoDocumento: 'Madrid PNG de',
  numeracionDocumento: 'División Estratega',
};

export const sampleWithNewData: NewTransaccion = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
