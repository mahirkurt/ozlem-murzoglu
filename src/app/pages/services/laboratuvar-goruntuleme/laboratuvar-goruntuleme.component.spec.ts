import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LaboratuvarGoruntulemeComponent } from './laboratuvar-goruntuleme.component';

describe('LaboratuvarGoruntulemeComponent', () => {
  let component: LaboratuvarGoruntulemeComponent;
  let fixture: ComponentFixture<LaboratuvarGoruntulemeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LaboratuvarGoruntulemeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LaboratuvarGoruntulemeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
