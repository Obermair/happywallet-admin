import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepperNavComponent } from './stepper-nav.component';

describe('StepperNavComponent', () => {
  let component: StepperNavComponent;
  let fixture: ComponentFixture<StepperNavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StepperNavComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StepperNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
