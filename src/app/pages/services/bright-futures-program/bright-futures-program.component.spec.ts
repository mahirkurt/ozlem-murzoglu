import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrightFuturesProgramComponent } from './bright-futures-program.component';

describe('BrightFuturesProgramComponent', () => {
  let component: BrightFuturesProgramComponent;
  let fixture: ComponentFixture<BrightFuturesProgramComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrightFuturesProgramComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BrightFuturesProgramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
