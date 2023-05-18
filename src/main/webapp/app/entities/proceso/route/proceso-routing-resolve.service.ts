import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IProceso } from '../proceso.model';
import { ProcesoService } from '../service/proceso.service';

@Injectable({ providedIn: 'root' })
export class ProcesoRoutingResolveService implements Resolve<IProceso | null> {
  constructor(protected service: ProcesoService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IProceso | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((proceso: HttpResponse<IProceso>) => {
          if (proceso.body) {
            return of(proceso.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(null);
  }
}
