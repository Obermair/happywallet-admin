import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { StepperService } from '../stepper.service';

@Component({
  selector: 'app-stepper-nav',
  imports: [CommonModule],
  templateUrl: './stepper-nav.component.html',
  styleUrl: './stepper-nav.component.css'
})
export class StepperNavComponent {
  @Input() steps: { id: number, name: string, description: string, link: string, status: string }[] = [];

  constructor(private router: Router, private stepperService: StepperService){}

  stepClicked(step: { id: number, name: string, description: string, link:string, status: string }) {
    if (step.status === 'complete' || step.status === 'current') {
      // Navigate to the step's link
      this.router.navigate([step.link]);
    }
  }
}
