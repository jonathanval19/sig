import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ProcesoDetailComponent } from './proceso-detail.component';

describe('Proceso Management Detail Component', () => {
  let comp: ProcesoDetailComponent;
  let fixture: ComponentFixture<ProcesoDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProcesoDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ proceso: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(ProcesoDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(ProcesoDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load proceso on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.proceso).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
