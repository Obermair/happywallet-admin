import { Component } from '@angular/core';
import { AlertComponent } from '../../shared/components/ui/alert/alert.component';
import { ComponentCardComponent } from '../../shared/components/common/component-card/component-card.component';
import { PageBreadcrumbComponent } from '../../shared/components/common/page-breadcrumb/page-breadcrumb.component';
import { StepperNavComponent } from './stepper-nav/stepper-nav.component';
import { RouterModule } from '@angular/router';
import { StepperService } from './stepper.service';

@Component({
  selector: 'app-stepper',
  imports: [
      StepperNavComponent, RouterModule],
  templateUrl: './stepper.component.html',
  styleUrl: './stepper.component.css'
})
export class StepperComponent {
  public pageTitle = 'Stempelkarte erstellen';

  constructor(public stepperService: StepperService) { }

  ngOnInit() {
    if (this.stepperService.loyaltyProgram.loyaltyProgramCode === '') {
      this.stepperService.loyaltyProgram.loyaltyProgramCode = this.stepperService.generateRandomCode();
      this.stepperService.setStepsToUpcoming();
    }
    else {
      this.stepperService.setStepsToComplete();
    }
  }
}
