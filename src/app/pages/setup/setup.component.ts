import { Component } from '@angular/core';
import { AppHeaderComponent } from '../../shared/layout/app-header/app-header.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DataService } from '../../data.service';
import { SetupService } from './setup.service';
import { SetupStepperNavComponent } from './setup-stepper-nav/setup-stepper-nav.component';

@Component({
  selector: 'app-setup',
  imports: [CommonModule, RouterModule, SetupStepperNavComponent],
  templateUrl: './setup.component.html',
  styleUrl: './setup.component.css'
})
export class SetupComponent {

  constructor(public dataService: DataService, public setupService: SetupService) {
  }
    ngOnInit() {
    if (this.setupService.loyaltyProgram.loyaltyProgramCode === '') {
      this.setupService.loyaltyProgram = this.setupService.defaultLoyaltyProgram;
      this.setupService.loyaltyProgram.loyaltyProgramCode = this.setupService.generateRandomCode();
      this.setupService.loyaltyProgram.user = this.dataService.currentUser.id;
      this.setupService.setStepsToUpcoming();
    }
    else {
      this.setupService.setStepsToComplete();
    }
  }
}
