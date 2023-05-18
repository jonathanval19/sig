import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ProcesoFormService } from './proceso-form.service';
import { ProcesoService } from '../service/proceso.service';
import { IProceso } from '../proceso.model';

import { ProcesoUpdateComponent } from './proceso-update.component';

describe('Proceso Management Update Component', () => {
  let comp: ProcesoUpdateComponent;
  let fixture: ComponentFixture<ProcesoUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let procesoFormService: ProcesoFormService;
  let procesoService: ProcesoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ProcesoUpdateComponent],
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
      .overrideTemplate(ProcesoUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ProcesoUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    procesoFormService = TestBed.inject(ProcesoFormService);
    procesoService = TestBed.inject(ProcesoService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const proceso: IProceso = { id: 456 };

      activatedRoute.data = of({ proceso });
      comp.ngOnInit();

      expect(comp.proceso).toEqual(proceso);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IProceso>>();
      const proceso = { id: 123 };
      jest.spyOn(procesoFormService, 'getProceso').mockReturnValue(proceso);
      jest.spyOn(procesoService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ proceso });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: proceso }));
      saveSubject.complete();

      // THEN
      expect(procesoFormService.getProceso).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(procesoService.update).toHaveBeenCalledWith(expect.objectContaining(proceso));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IProceso>>();
      const proceso = { id: 123 };
      jest.spyOn(procesoFormService, 'getProceso').mockReturnValue({ id: null });
      jest.spyOn(procesoService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ proceso: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: proceso }));
      saveSubject.complete();

      // THEN
      expect(procesoFormService.getProceso).toHaveBeenCalled();
      expect(procesoService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IProceso>>();
      const proceso = { id: 123 };
      jest.spyOn(procesoService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ proceso });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(procesoService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
