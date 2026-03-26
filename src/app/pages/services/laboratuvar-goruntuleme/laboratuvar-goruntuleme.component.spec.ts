import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LaboratuvarGoruntulemeComponent } from './laboratuvar-goruntuleme.component';
import { provideStandaloneTestbed } from '../../../testing/standalone-testbed';

describe('LaboratuvarGoruntulemeComponent', () => {
  let component: LaboratuvarGoruntulemeComponent;
  let fixture: ComponentFixture<LaboratuvarGoruntulemeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LaboratuvarGoruntulemeComponent],
      providers: provideStandaloneTestbed(),
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
