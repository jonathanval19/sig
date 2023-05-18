import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IProceso, NewProceso } from '../proceso.model';

export type PartialUpdateProceso = Partial<IProceso> & Pick<IProceso, 'id'>;

export type EntityResponseType = HttpResponse<IProceso>;
export type EntityArrayResponseType = HttpResponse<IProceso[]>;

@Injectable({ providedIn: 'root' })
export class ProcesoService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/procesos');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(proceso: NewProceso): Observable<EntityResponseType> {
    return this.http.post<IProceso>(this.resourceUrl, proceso, { observe: 'response' });
  }

  update(proceso: IProceso): Observable<EntityResponseType> {
    return this.http.put<IProceso>(`${this.resourceUrl}/${this.getProcesoIdentifier(proceso)}`, proceso, { observe: 'response' });
  }

  partialUpdate(proceso: PartialUpdateProceso): Observable<EntityResponseType> {
    return this.http.patch<IProceso>(`${this.resourceUrl}/${this.getProcesoIdentifier(proceso)}`, proceso, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IProceso>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IProceso[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getProcesoIdentifier(proceso: Pick<IProceso, 'id'>): number {
    return proceso.id;
  }

  compareProceso(o1: Pick<IProceso, 'id'> | null, o2: Pick<IProceso, 'id'> | null): boolean {
    return o1 && o2 ? this.getProcesoIdentifier(o1) === this.getProcesoIdentifier(o2) : o1 === o2;
  }

  addProcesoToCollectionIfMissing<Type extends Pick<IProceso, 'id'>>(
    procesoCollection: Type[],
    ...procesosToCheck: (Type | null | undefined)[]
  ): Type[] {
    const procesos: Type[] = procesosToCheck.filter(isPresent);
    if (procesos.length > 0) {
      const procesoCollectionIdentifiers = procesoCollection.map(procesoItem => this.getProcesoIdentifier(procesoItem)!);
      const procesosToAdd = procesos.filter(procesoItem => {
        const procesoIdentifier = this.getProcesoIdentifier(procesoItem);
        if (procesoCollectionIdentifiers.includes(procesoIdentifier)) {
          return false;
        }
        procesoCollectionIdentifiers.push(procesoIdentifier);
        return true;
      });
      return [...procesosToAdd, ...procesoCollection];
    }
    return procesoCollection;
  }
}
