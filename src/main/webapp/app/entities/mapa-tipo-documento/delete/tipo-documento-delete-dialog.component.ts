import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ITipoDocumento } from '../mapa-tipo-documento.model';
import { TipoDocumentoService } from '../service/tipo-documento.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './tipo-documento-delete-dialog.component.html',
})
export class TipoDocumentoDeleteDialogComponent {
  tipoDocumento?: ITipoDocumento;

  constructor(protected tipoDocumentoService: TipoDocumentoService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.tipoDocumentoService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
