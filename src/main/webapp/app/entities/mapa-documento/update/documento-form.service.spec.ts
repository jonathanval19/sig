import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../mapa-documento.test-samples';

import { DocumentoFormService } from './documento-form.service';

describe('Documento Form Service', () => {
  let service: DocumentoFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DocumentoFormService);
  });

  describe('Service methods', () => {
    describe('createDocumentoFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createDocumentoFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            version: expect.any(Object),
            fechaElaboracion: expect.any(Object),
            fechaActualizacion: expect.any(Object),
            acceso: expect.any(Object),
            archivo: expect.any(Object),
            enviarNotificacion: expect.any(Object),
            observaciones: expect.any(Object),
            transaccion: expect.any(Object),
          })
        );
      });

      it('passing IDocumento should create a new form with FormGroup', () => {
        const formGroup = service.createDocumentoFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            version: expect.any(Object),
            fechaElaboracion: expect.any(Object),
            fechaActualizacion: expect.any(Object),
            acceso: expect.any(Object),
            archivo: expect.any(Object),
            enviarNotificacion: expect.any(Object),
            observaciones: expect.any(Object),
            transaccion: expect.any(Object),
          })
        );
      });
    });

    describe('getDocumento', () => {
      it('should return NewDocumento for default Documento initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createDocumentoFormGroup(sampleWithNewData);

        const documento = service.getDocumento(formGroup) as any;

        expect(documento).toMatchObject(sampleWithNewData);
      });

      it('should return NewDocumento for empty Documento initial value', () => {
        const formGroup = service.createDocumentoFormGroup();

        const documento = service.getDocumento(formGroup) as any;

        expect(documento).toMatchObject({});
      });

      it('should return IDocumento', () => {
        const formGroup = service.createDocumentoFormGroup(sampleWithRequiredData);

        const documento = service.getDocumento(formGroup) as any;

        expect(documento).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IDocumento should not enable id FormControl', () => {
        const formGroup = service.createDocumentoFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewDocumento should disable id FormControl', () => {
        const formGroup = service.createDocumentoFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
