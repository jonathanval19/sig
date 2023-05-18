import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../proceso.test-samples';

import { ProcesoFormService } from './proceso-form.service';

describe('Proceso Form Service', () => {
  let service: ProcesoFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProcesoFormService);
  });

  describe('Service methods', () => {
    describe('createProcesoFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createProcesoFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            tipoproceso: expect.any(Object),
            codigo: expect.any(Object),
            descripcion: expect.any(Object),
          })
        );
      });

      it('passing IProceso should create a new form with FormGroup', () => {
        const formGroup = service.createProcesoFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            tipoproceso: expect.any(Object),
            codigo: expect.any(Object),
            descripcion: expect.any(Object),
          })
        );
      });
    });

    describe('getProceso', () => {
      it('should return NewProceso for default Proceso initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createProcesoFormGroup(sampleWithNewData);

        const proceso = service.getProceso(formGroup) as any;

        expect(proceso).toMatchObject(sampleWithNewData);
      });

      it('should return NewProceso for empty Proceso initial value', () => {
        const formGroup = service.createProcesoFormGroup();

        const proceso = service.getProceso(formGroup) as any;

        expect(proceso).toMatchObject({});
      });

      it('should return IProceso', () => {
        const formGroup = service.createProcesoFormGroup(sampleWithRequiredData);

        const proceso = service.getProceso(formGroup) as any;

        expect(proceso).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IProceso should not enable id FormControl', () => {
        const formGroup = service.createProcesoFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewProceso should disable id FormControl', () => {
        const formGroup = service.createProcesoFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
