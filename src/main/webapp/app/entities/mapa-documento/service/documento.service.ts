import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IDocumento, NewDocumento } from '../mapa-documento.model';

export type PartialUpdateDocumento = Partial<IDocumento> & Pick<IDocumento, 'id'>;

type RestOf<T extends IDocumento | NewDocumento> = Omit<T, 'fechaElaboracion' | 'fechaActualizacion'> & {
  fechaElaboracion?: string | null;
  fechaActualizacion?: string | null;
};

export type RestDocumento = RestOf<IDocumento>;

export type NewRestDocumento = RestOf<NewDocumento>;

export type PartialUpdateRestDocumento = RestOf<PartialUpdateDocumento>;

export type EntityResponseType = HttpResponse<IDocumento>;
export type EntityArrayResponseType = HttpResponse<IDocumento[]>;

@Injectable({ providedIn: 'root' })
export class DocumentoService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/documentos');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(documento: NewDocumento): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(documento);
    return this.http
      .post<RestDocumento>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(documento: IDocumento): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(documento);
    return this.http
      .put<RestDocumento>(`${this.resourceUrl}/${this.getDocumentoIdentifier(documento)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(documento: PartialUpdateDocumento): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(documento);
    return this.http
      .patch<RestDocumento>(`${this.resourceUrl}/${this.getDocumentoIdentifier(documento)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestDocumento>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestDocumento[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getDocumentoIdentifier(documento: Pick<IDocumento, 'id'>): number {
    return documento.id;
  }

  compareDocumento(o1: Pick<IDocumento, 'id'> | null, o2: Pick<IDocumento, 'id'> | null): boolean {
    return o1 && o2 ? this.getDocumentoIdentifier(o1) === this.getDocumentoIdentifier(o2) : o1 === o2;
  }

  addDocumentoToCollectionIfMissing<Type extends Pick<IDocumento, 'id'>>(
    documentoCollection: Type[],
    ...documentosToCheck: (Type | null | undefined)[]
  ): Type[] {
    const documentos: Type[] = documentosToCheck.filter(isPresent);
    if (documentos.length > 0) {
      const documentoCollectionIdentifiers = documentoCollection.map(documentoItem => this.getDocumentoIdentifier(documentoItem)!);
      const documentosToAdd = documentos.filter(documentoItem => {
        const documentoIdentifier = this.getDocumentoIdentifier(documentoItem);
        if (documentoCollectionIdentifiers.includes(documentoIdentifier)) {
          return false;
        }
        documentoCollectionIdentifiers.push(documentoIdentifier);
        return true;
      });
      return [...documentosToAdd, ...documentoCollection];
    }
    return documentoCollection;
  }

  protected convertDateFromClient<T extends IDocumento | NewDocumento | PartialUpdateDocumento>(documento: T): RestOf<T> {
    return {
      ...documento,
      fechaElaboracion: documento.fechaElaboracion?.toJSON() ?? null,
      fechaActualizacion: documento.fechaActualizacion?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restDocumento: RestDocumento): IDocumento {
    return {
      ...restDocumento,
      fechaElaboracion: restDocumento.fechaElaboracion ? dayjs(restDocumento.fechaElaboracion) : undefined,
      fechaActualizacion: restDocumento.fechaActualizacion ? dayjs(restDocumento.fechaActualizacion) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestDocumento>): HttpResponse<IDocumento> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestDocumento[]>): HttpResponse<IDocumento[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
