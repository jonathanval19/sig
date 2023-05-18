import dayjs from 'dayjs/esm';
import { ITransaccion } from 'app/entities/transaccion/transaccion.model';
import { Acceso } from 'app/entities/enumerations/acceso.model';

export interface IDocumento {
  id: number;
  version?: number | null;
  fechaElaboracion?: dayjs.Dayjs | null;
  fechaActualizacion?: dayjs.Dayjs | null;
  acceso?: Acceso | null;
  archivo?: string | null;
  archivoContentType?: string | null;
  enviarNotificacion?: string | null;
  observaciones?: string | null;
  transaccion?: ITransaccion | null;
}

export type NewDocumento = Omit<IDocumento, 'id'> & { id: null };
