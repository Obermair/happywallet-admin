import { Component, Input } from '@angular/core';
import { SetupService } from '../setup.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-setup-stepper-nav',
  imports: [CommonModule],
  templateUrl: './setup-stepper-nav.component.html',
  styleUrl: './setup-stepper-nav.component.css'
})
export class SetupStepperNavComponent {

  @Input() steps: { id: number, name: string, description: string, link: string, status: string }[] = [];
  
  constructor(private router: Router, private setupService: SetupService) {
  }

  stepClicked(step: { id: number, name: string, description: string, link:string, status: string }) {
    if (step.status === 'complete' || step.status === 'current') {
      // Navigate to the step's link
      this.setupService.setStepToActive(step.id);
      this.router.navigate([step.link]);
    }
  }

}
