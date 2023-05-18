import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IDocumento } from '../documento.model';
import { DataUtils } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-documento-detail',
  templateUrl: './documento-detail.component.html',
})
export class DocumentoDetailComponent implements OnInit {
  documento: IDocumento | null = null;

  constructor(protected dataUtils: DataUtils, protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ documento }) => {
      this.documento = documento;
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  previousState(): void {
    window.history.back();
  }
}
