import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrightFuturesJourneyComponent } from './bright-futures-journey.component';

describe('BrightFuturesJourneyComponent', () => {
  let component: BrightFuturesJourneyComponent;
  let fixture: ComponentFixture<BrightFuturesJourneyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrightFuturesJourneyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BrightFuturesJourneyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
