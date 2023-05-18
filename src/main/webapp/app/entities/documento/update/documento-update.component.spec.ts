import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { DocumentoFormService } from './documento-form.service';
import { DocumentoService } from '../service/documento.service';
import { IDocumento } from '../documento.model';
import { ITransaccion } from 'app/entities/transaccion/transaccion.model';
import { TransaccionService } from 'app/entities/transaccion/service/transaccion.service';

import { DocumentoUpdateComponent } from './documento-update.component';

describe('Documento Management Update Component', () => {
  let comp: DocumentoUpdateComponent;
  let fixture: ComponentFixture<DocumentoUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let documentoFormService: DocumentoFormService;
  let documentoService: DocumentoService;
  let transaccionService: TransaccionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [DocumentoUpdateComponent],
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
      .overrideTemplate(DocumentoUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(DocumentoUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    documentoFormService = TestBed.inject(DocumentoFormService);
    documentoService = TestBed.inject(DocumentoService);
    transaccionService = TestBed.inject(TransaccionService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Transaccion query and add missing value', () => {
      const documento: IDocumento = { id: 456 };
      const transaccion: ITransaccion = { id: 75120 };
      documento.transaccion = transaccion;

      const transaccionCollection: ITransaccion[] = [{ id: 34102 }];
      jest.spyOn(transaccionService, 'query').mockReturnValue(of(new HttpResponse({ body: transaccionCollection })));
      const additionalTransaccions = [transaccion];
      const expectedCollection: ITransaccion[] = [...additionalTransaccions, ...transaccionCollection];
      jest.spyOn(transaccionService, 'addTransaccionToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ documento });
      comp.ngOnInit();

      expect(transaccionService.query).toHaveBeenCalled();
      expect(transaccionService.addTransaccionToCollectionIfMissing).toHaveBeenCalledWith(
        transaccionCollection,
        ...additionalTransaccions.map(expect.objectContaining)
      );
      expect(comp.transaccionsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const documento: IDocumento = { id: 456 };
      const transaccion: ITransaccion = { id: 10460 };
      documento.transaccion = transaccion;

      activatedRoute.data = of({ documento });
      comp.ngOnInit();

      expect(comp.transaccionsSharedCollection).toContain(transaccion);
      expect(comp.documento).toEqual(documento);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IDocumento>>();
      const documento = { id: 123 };
      jest.spyOn(documentoFormService, 'getDocumento').mockReturnValue(documento);
      jest.spyOn(documentoService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ documento });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: documento }));
      saveSubject.complete();

      // THEN
      expect(documentoFormService.getDocumento).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(documentoService.update).toHaveBeenCalledWith(expect.objectContaining(documento));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IDocumento>>();
      const documento = { id: 123 };
      jest.spyOn(documentoFormService, 'getDocumento').mockReturnValue({ id: null });
      jest.spyOn(documentoService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ documento: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: documento }));
      saveSubject.complete();

      // THEN
      expect(documentoFormService.getDocumento).toHaveBeenCalled();
      expect(documentoService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IDocumento>>();
      const documento = { id: 123 };
      jest.spyOn(documentoService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ documento });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(documentoService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareTransaccion', () => {
      it('Should forward to transaccionService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(transaccionService, 'compareTransaccion');
        comp.compareTransaccion(entity, entity2);
        expect(transaccionService.compareTransaccion).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
