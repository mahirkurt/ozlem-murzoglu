import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TriplePComponent } from './triple-p.component';

describe('TriplePComponent', () => {
  let component: TriplePComponent;
  let fixture: ComponentFixture<TriplePComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TriplePComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TriplePComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
