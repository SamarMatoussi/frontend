import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionParametrageKpiComponent } from './list.component';

describe('ListComponent', () => {
  let component: GestionParametrageKpiComponent;
  let fixture: ComponentFixture<GestionParametrageKpiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GestionParametrageKpiComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionParametrageKpiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
