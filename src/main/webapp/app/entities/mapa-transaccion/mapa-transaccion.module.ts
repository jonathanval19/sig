import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { TransaccionComponent } from './list/mapa-transaccion.component';
import { TransaccionDetailComponent } from './detail/transaccion-detail.component';
import { TransaccionUpdateComponent } from './update/transaccion-update.component';
import { TransaccionDeleteDialogComponent } from './delete/transaccion-delete-dialog.component';
import { TransaccionRoutingModule } from './route/mapa-transaccion-routing.module';

@NgModule({
  imports: [SharedModule, TransaccionRoutingModule],
  declarations: [TransaccionComponent, TransaccionDetailComponent, TransaccionUpdateComponent, TransaccionDeleteDialogComponent],
})
export class MapaTransaccionModule {}
