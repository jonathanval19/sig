import dayjs from 'dayjs/esm';

import { Acceso } from 'app/entities/enumerations/acceso.model';

import { IDocumento, NewDocumento } from './mapa-documento.model';

export const sampleWithRequiredData: IDocumento = {
  id: 81947,
};

export const sampleWithPartialData: IDocumento = {
  id: 25431,
  acceso: Acceso['CONFIDENCIAL'],
  archivo: '../fake-data/blob/hipster.png',
  archivoContentType: 'unknown',
  enviarNotificacion: 'Comunicaciones',
  observaciones: 'neural port Inversor',
};

export const sampleWithFullData: IDocumento = {
  id: 97312,
  version: 33716,
  fechaElaboracion: dayjs('2023-05-11T09:29'),
  fechaActualizacion: dayjs('2023-05-11T04:09'),
  acceso: Acceso['PUBLICO'],
  archivo: '../fake-data/blob/hipster.png',
  archivoContentType: 'unknown',
  enviarNotificacion: 'PNG',
  observaciones: 'generating Humano',
};

export const sampleWithNewData: NewDocumento = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
