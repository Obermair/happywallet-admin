import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetupStepperNavComponent } from './setup-stepper-nav.component';

describe('SetupStepperNavComponent', () => {
  let component: SetupStepperNavComponent;
  let fixture: ComponentFixture<SetupStepperNavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SetupStepperNavComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SetupStepperNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
