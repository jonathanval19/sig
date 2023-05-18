import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ITipoDocumento, NewTipoDocumento } from '../tipo-documento.model';

export type PartialUpdateTipoDocumento = Partial<ITipoDocumento> & Pick<ITipoDocumento, 'id'>;

export type EntityResponseType = HttpResponse<ITipoDocumento>;
export type EntityArrayResponseType = HttpResponse<ITipoDocumento[]>;

@Injectable({ providedIn: 'root' })
export class TipoDocumentoService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/tipo-documentos');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(tipoDocumento: NewTipoDocumento): Observable<EntityResponseType> {
    return this.http.post<ITipoDocumento>(this.resourceUrl, tipoDocumento, { observe: 'response' });
  }

  update(tipoDocumento: ITipoDocumento): Observable<EntityResponseType> {
    return this.http.put<ITipoDocumento>(`${this.resourceUrl}/${this.getTipoDocumentoIdentifier(tipoDocumento)}`, tipoDocumento, {
      observe: 'response',
    });
  }

  partialUpdate(tipoDocumento: PartialUpdateTipoDocumento): Observable<EntityResponseType> {
    return this.http.patch<ITipoDocumento>(`${this.resourceUrl}/${this.getTipoDocumentoIdentifier(tipoDocumento)}`, tipoDocumento, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ITipoDocumento>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ITipoDocumento[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getTipoDocumentoIdentifier(tipoDocumento: Pick<ITipoDocumento, 'id'>): number {
    return tipoDocumento.id;
  }

  compareTipoDocumento(o1: Pick<ITipoDocumento, 'id'> | null, o2: Pick<ITipoDocumento, 'id'> | null): boolean {
    return o1 && o2 ? this.getTipoDocumentoIdentifier(o1) === this.getTipoDocumentoIdentifier(o2) : o1 === o2;
  }

  addTipoDocumentoToCollectionIfMissing<Type extends Pick<ITipoDocumento, 'id'>>(
    tipoDocumentoCollection: Type[],
    ...tipoDocumentosToCheck: (Type | null | undefined)[]
  ): Type[] {
    const tipoDocumentos: Type[] = tipoDocumentosToCheck.filter(isPresent);
    if (tipoDocumentos.length > 0) {
      const tipoDocumentoCollectionIdentifiers = tipoDocumentoCollection.map(
        tipoDocumentoItem => this.getTipoDocumentoIdentifier(tipoDocumentoItem)!
      );
      const tipoDocumentosToAdd = tipoDocumentos.filter(tipoDocumentoItem => {
        const tipoDocumentoIdentifier = this.getTipoDocumentoIdentifier(tipoDocumentoItem);
        if (tipoDocumentoCollectionIdentifiers.includes(tipoDocumentoIdentifier)) {
          return false;
        }
        tipoDocumentoCollectionIdentifiers.push(tipoDocumentoIdentifier);
        return true;
      });
      return [...tipoDocumentosToAdd, ...tipoDocumentoCollection];
    }
    return tipoDocumentoCollection;
  }
}
