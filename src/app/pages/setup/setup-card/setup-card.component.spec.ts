import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetupCardComponent } from './setup-card.component';

describe('SetupCardComponent', () => {
  let component: SetupCardComponent;
  let fixture: ComponentFixture<SetupCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SetupCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SetupCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
