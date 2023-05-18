export interface ITipoDocumento {
  id: number;
  codigo?: string | null;
  descripcion?: string | null;
}

export type NewTipoDocumento = Omit<ITipoDocumento, 'id'> & { id: null };
