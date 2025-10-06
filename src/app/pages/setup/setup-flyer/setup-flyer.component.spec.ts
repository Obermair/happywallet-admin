import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetupFlyerComponent } from './setup-flyer.component';

describe('SetupFlyerComponent', () => {
  let component: SetupFlyerComponent;
  let fixture: ComponentFixture<SetupFlyerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SetupFlyerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SetupFlyerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
