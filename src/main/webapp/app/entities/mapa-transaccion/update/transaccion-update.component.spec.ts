import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { TransaccionFormService } from './transaccion-form.service';
import { TransaccionService } from '../service/transaccion.service';
import { ITransaccion } from '../transaccion.model';
import { IProceso } from 'app/entities/proceso/proceso.model';
import { ProcesoService } from 'app/entities/proceso/service/proceso.service';
import { ITipoDocumento } from 'app/entities/tipo-documento/tipo-documento.model';
import { TipoDocumentoService } from 'app/entities/tipo-documento/service/tipo-documento.service';

import { TransaccionUpdateComponent } from './transaccion-update.component';

describe('Transaccion Management Update Component', () => {
  let comp: TransaccionUpdateComponent;
  let fixture: ComponentFixture<TransaccionUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let transaccionFormService: TransaccionFormService;
  let transaccionService: TransaccionService;
  let procesoService: ProcesoService;
  let tipoDocumentoService: TipoDocumentoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [TransaccionUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(TransaccionUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(TransaccionUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    transaccionFormService = TestBed.inject(TransaccionFormService);
    transaccionService = TestBed.inject(TransaccionService);
    procesoService = TestBed.inject(ProcesoService);
    tipoDocumentoService = TestBed.inject(TipoDocumentoService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Proceso query and add missing value', () => {
      const transaccion: ITransaccion = { id: 456 };
      const proceso: IProceso = { id: 46128 };
      transaccion.proceso = proceso;

      const procesoCollection: IProceso[] = [{ id: 15529 }];
      jest.spyOn(procesoService, 'query').mockReturnValue(of(new HttpResponse({ body: procesoCollection })));
      const additionalProcesos = [proceso];
      const expectedCollection: IProceso[] = [...additionalProcesos, ...procesoCollection];
      jest.spyOn(procesoService, 'addProcesoToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ transaccion });
      comp.ngOnInit();

      expect(procesoService.query).toHaveBeenCalled();
      expect(procesoService.addProcesoToCollectionIfMissing).toHaveBeenCalledWith(
        procesoCollection,
        ...additionalProcesos.map(expect.objectContaining)
      );
      expect(comp.procesosSharedCollection).toEqual(expectedCollection);
    });

    it('Should call TipoDocumento query and add missing value', () => {
      const transaccion: ITransaccion = { id: 456 };
      const tipoDocumento: ITipoDocumento = { id: 66149 };
      transaccion.tipoDocumento = tipoDocumento;

      const tipoDocumentoCollection: ITipoDocumento[] = [{ id: 72267 }];
      jest.spyOn(tipoDocumentoService, 'query').mockReturnValue(of(new HttpResponse({ body: tipoDocumentoCollection })));
      const additionalTipoDocumentos = [tipoDocumento];
      const expectedCollection: ITipoDocumento[] = [...additionalTipoDocumentos, ...tipoDocumentoCollection];
      jest.spyOn(tipoDocumentoService, 'addTipoDocumentoToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ transaccion });
      comp.ngOnInit();

      expect(tipoDocumentoService.query).toHaveBeenCalled();
      expect(tipoDocumentoService.addTipoDocumentoToCollectionIfMissing).toHaveBeenCalledWith(
        tipoDocumentoCollection,
        ...additionalTipoDocumentos.map(expect.objectContaining)
      );
      expect(comp.tipoDocumentosSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const transaccion: ITransaccion = { id: 456 };
      const proceso: IProceso = { id: 32348 };
      transaccion.proceso = proceso;
      const tipoDocumento: ITipoDocumento = { id: 53453 };
      transaccion.tipoDocumento = tipoDocumento;

      activatedRoute.data = of({ transaccion });
      comp.ngOnInit();

      expect(comp.procesosSharedCollection).toContain(proceso);
      expect(comp.tipoDocumentosSharedCollection).toContain(tipoDocumento);
      expect(comp.transaccion).toEqual(transaccion);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITransaccion>>();
      const transaccion = { id: 123 };
      jest.spyOn(transaccionFormService, 'getTransaccion').mockReturnValue(transaccion);
      jest.spyOn(transaccionService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ transaccion });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: transaccion }));
      saveSubject.complete();

      // THEN
      expect(transaccionFormService.getTransaccion).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(transaccionService.update).toHaveBeenCalledWith(expect.objectContaining(transaccion));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITransaccion>>();
      const transaccion = { id: 123 };
      jest.spyOn(transaccionFormService, 'getTransaccion').mockReturnValue({ id: null });
      jest.spyOn(transaccionService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ transaccion: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: transaccion }));
      saveSubject.complete();

      // THEN
      expect(transaccionFormService.getTransaccion).toHaveBeenCalled();
      expect(transaccionService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITransaccion>>();
      const transaccion = { id: 123 };
      jest.spyOn(transaccionService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ transaccion });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(transaccionService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareProceso', () => {
      it('Should forward to procesoService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(procesoService, 'compareProceso');
        comp.compareProceso(entity, entity2);
        expect(procesoService.compareProceso).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareTipoDocumento', () => {
      it('Should forward to tipoDocumentoService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(tipoDocumentoService, 'compareTipoDocumento');
        comp.compareTipoDocumento(entity, entity2);
        expect(tipoDocumentoService.compareTipoDocumento).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
