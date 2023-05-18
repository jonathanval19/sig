import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IProceso } from '../proceso.model';
import { ProcesoService } from '../service/proceso.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './proceso-delete-dialog.component.html',
})
export class ProcesoDeleteDialogComponent {
  proceso?: IProceso;

  constructor(protected procesoService: ProcesoService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.procesoService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
