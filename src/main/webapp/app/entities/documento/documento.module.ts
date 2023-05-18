import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { DocumentoComponent } from './list/documento.component';
import { DocumentoDetailComponent } from './detail/documento-detail.component';
import { DocumentoUpdateComponent } from './update/documento-update.component';
import { DocumentoDeleteDialogComponent } from './delete/documento-delete-dialog.component';
import { DocumentoRoutingModule } from './route/documento-routing.module';

@NgModule({
  imports: [SharedModule, DocumentoRoutingModule],
  declarations: [DocumentoComponent, DocumentoDetailComponent, DocumentoUpdateComponent, DocumentoDeleteDialogComponent],
})
export class DocumentoModule {}
