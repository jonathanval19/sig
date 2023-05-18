import { TipoProceso } from 'app/entities/enumerations/tipo-proceso.model';

import { IProceso, NewProceso } from './mapa-proceso.model';

export const sampleWithRequiredData: IProceso = {
  id: 61260,
};

export const sampleWithPartialData: IProceso = {
  id: 41281,
  tipoproceso: TipoProceso['VALOR'],
  codigo: 'feed Dinánmico',
  descripcion: 'users',
};

export const sampleWithFullData: IProceso = {
  id: 17580,
  tipoproceso: TipoProceso['VALOR'],
  codigo: 'Senior',
  descripcion: 'e-services',
};

export const sampleWithNewData: NewProceso = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
