import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ProcesoComponent } from './list/mapa-proceso.component';
import { ProcesoDetailComponent } from './detail/mapa-proceso-detail.component';
import { ProcesoUpdateComponent } from './update/proceso-update.component';
import { ProcesoDeleteDialogComponent } from './delete/proceso-delete-dialog.component';
import { ProcesoRoutingModule } from './route/proceso-routing.module';

@NgModule({
  imports: [SharedModule, ProcesoRoutingModule],
  declarations: [ProcesoComponent, ProcesoDetailComponent, ProcesoUpdateComponent, ProcesoDeleteDialogComponent],
})
export class MapaProcesoModule {}
