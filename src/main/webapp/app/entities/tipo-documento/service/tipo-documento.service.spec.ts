import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ITipoDocumento } from '../tipo-documento.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../tipo-documento.test-samples';

import { TipoDocumentoService } from './tipo-documento.service';

const requireRestSample: ITipoDocumento = {
  ...sampleWithRequiredData,
};

describe('TipoDocumento Service', () => {
  let service: TipoDocumentoService;
  let httpMock: HttpTestingController;
  let expectedResult: ITipoDocumento | ITipoDocumento[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(TipoDocumentoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a TipoDocumento', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const tipoDocumento = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(tipoDocumento).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a TipoDocumento', () => {
      const tipoDocumento = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(tipoDocumento).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a TipoDocumento', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of TipoDocumento', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a TipoDocumento', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addTipoDocumentoToCollectionIfMissing', () => {
      it('should add a TipoDocumento to an empty array', () => {
        const tipoDocumento: ITipoDocumento = sampleWithRequiredData;
        expectedResult = service.addTipoDocumentoToCollectionIfMissing([], tipoDocumento);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(tipoDocumento);
      });

      it('should not add a TipoDocumento to an array that contains it', () => {
        const tipoDocumento: ITipoDocumento = sampleWithRequiredData;
        const tipoDocumentoCollection: ITipoDocumento[] = [
          {
            ...tipoDocumento,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addTipoDocumentoToCollectionIfMissing(tipoDocumentoCollection, tipoDocumento);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a TipoDocumento to an array that doesn't contain it", () => {
        const tipoDocumento: ITipoDocumento = sampleWithRequiredData;
        const tipoDocumentoCollection: ITipoDocumento[] = [sampleWithPartialData];
        expectedResult = service.addTipoDocumentoToCollectionIfMissing(tipoDocumentoCollection, tipoDocumento);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(tipoDocumento);
      });

      it('should add only unique TipoDocumento to an array', () => {
        const tipoDocumentoArray: ITipoDocumento[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const tipoDocumentoCollection: ITipoDocumento[] = [sampleWithRequiredData];
        expectedResult = service.addTipoDocumentoToCollectionIfMissing(tipoDocumentoCollection, ...tipoDocumentoArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const tipoDocumento: ITipoDocumento = sampleWithRequiredData;
        const tipoDocumento2: ITipoDocumento = sampleWithPartialData;
        expectedResult = service.addTipoDocumentoToCollectionIfMissing([], tipoDocumento, tipoDocumento2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(tipoDocumento);
        expect(expectedResult).toContain(tipoDocumento2);
      });

      it('should accept null and undefined values', () => {
        const tipoDocumento: ITipoDocumento = sampleWithRequiredData;
        expectedResult = service.addTipoDocumentoToCollectionIfMissing([], null, tipoDocumento, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(tipoDocumento);
      });

      it('should return initial array if no TipoDocumento is added', () => {
        const tipoDocumentoCollection: ITipoDocumento[] = [sampleWithRequiredData];
        expectedResult = service.addTipoDocumentoToCollectionIfMissing(tipoDocumentoCollection, undefined, null);
        expect(expectedResult).toEqual(tipoDocumentoCollection);
      });
    });

    describe('compareTipoDocumento', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareTipoDocumento(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareTipoDocumento(entity1, entity2);
        const compareResult2 = service.compareTipoDocumento(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareTipoDocumento(entity1, entity2);
        const compareResult2 = service.compareTipoDocumento(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareTipoDocumento(entity1, entity2);
        const compareResult2 = service.compareTipoDocumento(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
