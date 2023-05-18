import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ProcesoComponent } from '../list/proceso.component';
import { ProcesoDetailComponent } from '../detail/proceso-detail.component';
import { ProcesoUpdateComponent } from '../update/proceso-update.component';
import { ProcesoRoutingResolveService } from './proceso-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const procesoRoute: Routes = [
  {
    path: '',
    component: ProcesoComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ProcesoDetailComponent,
    resolve: {
      proceso: ProcesoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ProcesoUpdateComponent,
    resolve: {
      proceso: ProcesoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ProcesoUpdateComponent,
    resolve: {
      proceso: ProcesoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(procesoRoute)],
  exports: [RouterModule],
})
export class ProcesoRoutingModule {}
