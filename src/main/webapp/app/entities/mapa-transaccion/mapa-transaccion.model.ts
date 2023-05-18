import { IProceso } from 'app/entities/mapa-proceso/mapa-proceso.model';
import { ITipoDocumento } from 'app/entities/mapa-tipo-documento/mapa-tipo-documento.model';
import { Disposicion } from 'app/entities/enumerations/disposicion.model';

export interface ITransaccion {
  id: number;
  propietario?: string | null;
  titulo?: string | null;
  disposicion?: Disposicion | null;
  codigoDocumento?: string | null;
  numeracionDocumento?: string | null;
  proceso?: IProceso | null;
  tipoDocumento?: ITipoDocumento | null;
}

export type NewTransaccion = Omit<ITransaccion, 'id'> & { id: null };
