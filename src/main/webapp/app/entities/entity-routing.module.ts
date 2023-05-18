import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'mapa-proceso',
        data: { pageTitle: 'Mapa de Procesos' },
        loadChildren: () => import('./mapa-proceso/mapa-proceso.module').then(m => m.MapaProcesoModule),
      },
      {
        path: 'proceso',
        data: { pageTitle: 'Procesos' },
        loadChildren: () => import('./proceso/proceso.module').then(m => m.ProcesoModule),
      },
      {
        path: 'mapa-tipo-documento',
        data: { pageTitle: 'Mapa Tipo Documentos' },
        loadChildren: () => import('./mapa-tipo-documento/mapa-tipo-documento.module').then(m => m.MapaTipoDocumentoModule),
      },
      {
        path: 'tipo-documento',
        data: { pageTitle: 'TipoDocumentos' },
        loadChildren: () => import('./tipo-documento/tipo-documento.module').then(m => m.TipoDocumentoModule),
      },
      {
        path: 'mapa-transaccion',
        data: { pageTitle: 'Mapa de Transaccions' },
        loadChildren: () => import('./mapa-transaccion/mapa-transaccion.module').then(m => m.MapaTransaccionModule),
      },
      {
        path: 'transaccion',
        data: { pageTitle: 'Transaccions' },
        loadChildren: () => import('./transaccion/transaccion.module').then(m => m.TransaccionModule),
      },
      {
        path: 'mapa-documento',
        data: { pageTitle: 'Mapa de Documentos' },
        loadChildren: () => import('./mapa-documento/mapa-documento.module').then(m => m.MapaDocumentoModule),
      },
      {
        path: 'documento',
        data: { pageTitle: 'Documentos' },
        loadChildren: () => import('./documento/documento.module').then(m => m.DocumentoModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
