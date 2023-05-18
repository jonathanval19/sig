import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { TipoDocumentoService } from '../service/tipo-documento.service';

import { TipoDocumentoComponent } from './tipo-documento.component';

describe('TipoDocumento Management Component', () => {
  let comp: TipoDocumentoComponent;
  let fixture: ComponentFixture<TipoDocumentoComponent>;
  let service: TipoDocumentoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'tipo-documento', component: TipoDocumentoComponent }]), HttpClientTestingModule],
      declarations: [TipoDocumentoComponent],
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
      .overrideTemplate(TipoDocumentoComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(TipoDocumentoComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(TipoDocumentoService);

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
    expect(comp.tipoDocumentos?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to tipoDocumentoService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getTipoDocumentoIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getTipoDocumentoIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
