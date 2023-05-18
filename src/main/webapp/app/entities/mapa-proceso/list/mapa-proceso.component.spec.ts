import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ProcesoService } from '../service/proceso.service';

import { ProcesoComponent } from './mapa-proceso.component';

describe('Proceso Management Component', () => {
  let comp: ProcesoComponent;
  let fixture: ComponentFixture<ProcesoComponent>;
  let service: ProcesoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'proceso', component: ProcesoComponent }]), HttpClientTestingModule],
      declarations: [ProcesoComponent],
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
      .overrideTemplate(ProcesoComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ProcesoComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ProcesoService);

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
    expect(comp.procesos?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to procesoService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getProcesoIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getProcesoIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
