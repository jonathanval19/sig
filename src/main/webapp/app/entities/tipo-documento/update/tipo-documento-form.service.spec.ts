import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../tipo-documento.test-samples';

import { TipoDocumentoFormService } from './tipo-documento-form.service';

describe('TipoDocumento Form Service', () => {
  let service: TipoDocumentoFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TipoDocumentoFormService);
  });

  describe('Service methods', () => {
    describe('createTipoDocumentoFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createTipoDocumentoFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            codigo: expect.any(Object),
            descripcion: expect.any(Object),
          })
        );
      });

      it('passing ITipoDocumento should create a new form with FormGroup', () => {
        const formGroup = service.createTipoDocumentoFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            codigo: expect.any(Object),
            descripcion: expect.any(Object),
          })
        );
      });
    });

    describe('getTipoDocumento', () => {
      it('should return NewTipoDocumento for default TipoDocumento initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createTipoDocumentoFormGroup(sampleWithNewData);

        const tipoDocumento = service.getTipoDocumento(formGroup) as any;

        expect(tipoDocumento).toMatchObject(sampleWithNewData);
      });

      it('should return NewTipoDocumento for empty TipoDocumento initial value', () => {
        const formGroup = service.createTipoDocumentoFormGroup();

        const tipoDocumento = service.getTipoDocumento(formGroup) as any;

        expect(tipoDocumento).toMatchObject({});
      });

      it('should return ITipoDocumento', () => {
        const formGroup = service.createTipoDocumentoFormGroup(sampleWithRequiredData);

        const tipoDocumento = service.getTipoDocumento(formGroup) as any;

        expect(tipoDocumento).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ITipoDocumento should not enable id FormControl', () => {
        const formGroup = service.createTipoDocumentoFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewTipoDocumento should disable id FormControl', () => {
        const formGroup = service.createTipoDocumentoFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
