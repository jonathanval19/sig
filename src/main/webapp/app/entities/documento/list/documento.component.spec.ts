import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { DocumentoService } from '../service/documento.service';

import { DocumentoComponent } from './documento.component';

describe('Documento Management Component', () => {
  let comp: DocumentoComponent;
  let fixture: ComponentFixture<DocumentoComponent>;
  let service: DocumentoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'documento', component: DocumentoComponent }]), HttpClientTestingModule],
      declarations: [DocumentoComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              defaultSort: 'id,asc',
            }),
            queryParamMap: of(
              jest.requireActual('@angular/router').convertToParamMap({
                page: '1',
                size: '1',
                sort: 'id,desc',
              })
            ),
            snapshot: { queryParams: {} },
          },
        },
      ],
    })
      .overrideTemplate(DocumentoComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(DocumentoComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(DocumentoService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.documentos?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to documentoService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getDocumentoIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getDocumentoIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
