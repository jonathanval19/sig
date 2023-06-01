import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ITransaccion, NewTransaccion } from '../transaccion.model';

export type PartialUpdateTransaccion = Partial<ITransaccion> & Pick<ITransaccion, 'id'>;

export type EntityResponseType = HttpResponse<ITransaccion>;
export type EntityArrayResponseType = HttpResponse<ITransaccion[]>;

@Injectable({ providedIn: 'root' })
export class TransaccionService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/transaccions');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(transaccion: NewTransaccion): Observable<EntityResponseType> {
    return this.http.post<ITransaccion>(this.resourceUrl, transaccion, { observe: 'response' });
  }

  findcode(transaccion: ITransaccion): Observable<EntityResponseType> {
    return this.http.post<ITransaccion>(`${this.resourceUrl}/code/find`, transaccion, { observe: 'response' });
  }

  update(transaccion: ITransaccion): Observable<EntityResponseType> {
    return this.http.put<ITransaccion>(`${this.resourceUrl}/${this.getTransaccionIdentifier(transaccion)}`, transaccion, {
      observe: 'response',
    });
  }

  partialUpdate(transaccion: PartialUpdateTransaccion): Observable<EntityResponseType> {
    return this.http.patch<ITransaccion>(`${this.resourceUrl}/${this.getTransaccionIdentifier(transaccion)}`, transaccion, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ITransaccion>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ITransaccion[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getTransaccionIdentifier(transaccion: Pick<ITransaccion, 'id'>): number {
    return transaccion.id;
  }

  compareTransaccion(o1: Pick<ITransaccion, 'id'> | null, o2: Pick<ITransaccion, 'id'> | null): boolean {
    return o1 && o2 ? this.getTransaccionIdentifier(o1) === this.getTransaccionIdentifier(o2) : o1 === o2;
  }

  addTransaccionToCollectionIfMissing<Type extends Pick<ITransaccion, 'id'>>(
    transaccionCollection: Type[],
    ...transaccionsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const transaccions: Type[] = transaccionsToCheck.filter(isPresent);
    if (transaccions.length > 0) {
      const transaccionCollectionIdentifiers = transaccionCollection.map(
        transaccionItem => this.getTransaccionIdentifier(transaccionItem)!
      );
      const transaccionsToAdd = transaccions.filter(transaccionItem => {
        const transaccionIdentifier = this.getTransaccionIdentifier(transaccionItem);
        if (transaccionCollectionIdentifiers.includes(transaccionIdentifier)) {
          return false;
        }
        transaccionCollectionIdentifiers.push(transaccionIdentifier);
        return true;
      });
      return [...transaccionsToAdd, ...transaccionCollection];
    }
    return transaccionCollection;
  }
}
