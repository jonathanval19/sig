import { ITipoDocumento, NewTipoDocumento } from './tipo-documento.model';

export const sampleWithRequiredData: ITipoDocumento = {
  id: 59406,
};

export const sampleWithPartialData: ITipoDocumento = {
  id: 7540,
  codigo: 'circuito',
};

export const sampleWithFullData: ITipoDocumento = {
  id: 52093,
  codigo: 'value-added Funcionario Investment',
  descripcion: 'navigate compress Sorprendente',
};

export const sampleWithNewData: NewTipoDocumento = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
