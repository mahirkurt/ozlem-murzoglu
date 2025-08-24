import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaglikliUykularComponent } from './saglikli-uykular.component';

describe('SaglikliUykularComponent', () => {
  let component: SaglikliUykularComponent;
  let fixture: ComponentFixture<SaglikliUykularComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SaglikliUykularComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SaglikliUykularComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
