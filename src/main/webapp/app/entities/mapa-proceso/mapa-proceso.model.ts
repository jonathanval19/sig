import { TipoProceso } from 'app/entities/enumerations/tipo-proceso.model';

export interface IProceso {
  id: number;
  tipoproceso?: TipoProceso | null;
  codigo?: string | null;
  descripcion?: string | null;
}

export type NewProceso = Omit<IProceso, 'id'> & { id: null };
