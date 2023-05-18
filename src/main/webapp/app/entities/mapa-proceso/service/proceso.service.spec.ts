import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IProceso } from '../mapa-proceso.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../mapa-proceso.test-samples';

import { ProcesoService } from './proceso.service';

const requireRestSample: IProceso = {
  ...sampleWithRequiredData,
};

describe('Proceso Service', () => {
  let service: ProcesoService;
  let httpMock: HttpTestingController;
  let expectedResult: IProceso | IProceso[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ProcesoService);
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

    it('should create a Proceso', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const proceso = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(proceso).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Proceso', () => {
      const proceso = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(proceso).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Proceso', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Proceso', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Proceso', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addProcesoToCollectionIfMissing', () => {
      it('should add a Proceso to an empty array', () => {
        const proceso: IProceso = sampleWithRequiredData;
        expectedResult = service.addProcesoToCollectionIfMissing([], proceso);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(proceso);
      });

      it('should not add a Proceso to an array that contains it', () => {
        const proceso: IProceso = sampleWithRequiredData;
        const procesoCollection: IProceso[] = [
          {
            ...proceso,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addProcesoToCollectionIfMissing(procesoCollection, proceso);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Proceso to an array that doesn't contain it", () => {
        const proceso: IProceso = sampleWithRequiredData;
        const procesoCollection: IProceso[] = [sampleWithPartialData];
        expectedResult = service.addProcesoToCollectionIfMissing(procesoCollection, proceso);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(proceso);
      });

      it('should add only unique Proceso to an array', () => {
        const procesoArray: IProceso[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const procesoCollection: IProceso[] = [sampleWithRequiredData];
        expectedResult = service.addProcesoToCollectionIfMissing(procesoCollection, ...procesoArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const proceso: IProceso = sampleWithRequiredData;
        const proceso2: IProceso = sampleWithPartialData;
        expectedResult = service.addProcesoToCollectionIfMissing([], proceso, proceso2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(proceso);
        expect(expectedResult).toContain(proceso2);
      });

      it('should accept null and undefined values', () => {
        const proceso: IProceso = sampleWithRequiredData;
        expectedResult = service.addProcesoToCollectionIfMissing([], null, proceso, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(proceso);
      });

      it('should return initial array if no Proceso is added', () => {
        const procesoCollection: IProceso[] = [sampleWithRequiredData];
        expectedResult = service.addProcesoToCollectionIfMissing(procesoCollection, undefined, null);
        expect(expectedResult).toEqual(procesoCollection);
      });
    });

    describe('compareProceso', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareProceso(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareProceso(entity1, entity2);
        const compareResult2 = service.compareProceso(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareProceso(entity1, entity2);
        const compareResult2 = service.compareProceso(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareProceso(entity1, entity2);
        const compareResult2 = service.compareProceso(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
