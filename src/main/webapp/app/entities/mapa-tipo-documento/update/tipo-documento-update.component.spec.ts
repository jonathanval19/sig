import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { TipoDocumentoFormService } from './tipo-documento-form.service';
import { TipoDocumentoService } from '../service/tipo-documento.service';
import { ITipoDocumento } from '../mapa-tipo-documento.model';

import { TipoDocumentoUpdateComponent } from './tipo-documento-update.component';

describe('TipoDocumento Management Update Component', () => {
  let comp: TipoDocumentoUpdateComponent;
  let fixture: ComponentFixture<TipoDocumentoUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let tipoDocumentoFormService: TipoDocumentoFormService;
  let tipoDocumentoService: TipoDocumentoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [TipoDocumentoUpdateComponent],
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
      .overrideTemplate(TipoDocumentoUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(TipoDocumentoUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    tipoDocumentoFormService = TestBed.inject(TipoDocumentoFormService);
    tipoDocumentoService = TestBed.inject(TipoDocumentoService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const tipoDocumento: ITipoDocumento = { id: 456 };

      activatedRoute.data = of({ tipoDocumento });
      comp.ngOnInit();

      expect(comp.tipoDocumento).toEqual(tipoDocumento);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITipoDocumento>>();
      const tipoDocumento = { id: 123 };
      jest.spyOn(tipoDocumentoFormService, 'getTipoDocumento').mockReturnValue(tipoDocumento);
      jest.spyOn(tipoDocumentoService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ tipoDocumento });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: tipoDocumento }));
      saveSubject.complete();

      // THEN
      expect(tipoDocumentoFormService.getTipoDocumento).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(tipoDocumentoService.update).toHaveBeenCalledWith(expect.objectContaining(tipoDocumento));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITipoDocumento>>();
      const tipoDocumento = { id: 123 };
      jest.spyOn(tipoDocumentoFormService, 'getTipoDocumento').mockReturnValue({ id: null });
      jest.spyOn(tipoDocumentoService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ tipoDocumento: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: tipoDocumento }));
      saveSubject.complete();

      // THEN
      expect(tipoDocumentoFormService.getTipoDocumento).toHaveBeenCalled();
      expect(tipoDocumentoService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITipoDocumento>>();
      const tipoDocumento = { id: 123 };
      jest.spyOn(tipoDocumentoService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ tipoDocumento });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(tipoDocumentoService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
