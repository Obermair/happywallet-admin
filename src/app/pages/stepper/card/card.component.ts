import { Component } from '@angular/core';
import { AlertComponent } from '../../../shared/components/ui/alert/alert.component';
import { ComponentCardComponent } from '../../../shared/components/common/component-card/component-card.component';
import { DataService } from '../../../data.service';
import { QrCodeComponent } from 'ng-qrcode';
import { CommonModule } from '@angular/common';
import { AvatarTextComponent } from '../../../shared/components/ui/avatar/avatar-text.component';
import { LabelComponent } from '../../../shared/components/form/label/label.component';
import { InputFieldComponent } from '../../../shared/components/form/input/input-field.component';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';
import { Router } from '@angular/router';
import { StepperService } from '../stepper.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-card',
  imports: [
        ComponentCardComponent, QrCodeComponent, CommonModule, AvatarTextComponent, LabelComponent, InputFieldComponent, ButtonComponent, FormsModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent {

  constructor(public dataService: DataService, private router: Router, public stepperService: StepperService) {
  }

  ngOnInit() {
    this.stepperService.setStepToActive(1);
  }

  public backToLoyaltyPrograms() {
    this.stepperService.loyaltyProgram.loyaltyProgramCode = '';
    this.stepperService.setStepsToUpcoming();
    this.router.navigate(['/loyalty-programs']);
  }


  public linkToForm() {
    this.stepperService.setStepToComplete(1);
    this.stepperService.setStepToActive(2);
    this.router.navigate(['/loyalty-programs/create/form']);
  }

  public increaseMaxPoints() {
    if (this.stepperService.loyaltyProgram.maxPoints < 12) {
      this.stepperService.loyaltyProgram.maxPoints++;
    }
  }

  public decreaseMaxPoints() {
    if (this.stepperService.loyaltyProgram.maxPoints > 1) {
      this.stepperService.loyaltyProgram.maxPoints--;
      if (this.stepperService.loyaltyProgram.startPoints > this.stepperService.loyaltyProgram.maxPoints) {
        this.stepperService.loyaltyProgram.startPoints = this.stepperService.loyaltyProgram.maxPoints;
      }
    }
  }

  public increaseStartPoints() {
    if (this.stepperService.loyaltyProgram.startPoints < this.stepperService.loyaltyProgram.maxPoints) {
      this.stepperService.loyaltyProgram.startPoints++;
    }
  }
  
  public decreaseStartPoints() {
    if (this.stepperService.loyaltyProgram.startPoints > 0) {
      this.stepperService.loyaltyProgram.startPoints--;
    }
  }

  // A method that checks that every field is filled
  public isFormValid(): boolean {
    return this.stepperService.loyaltyProgram.programName.trim() !== '' &&
           this.stepperService.loyaltyProgram.programDescription.trim() !== '' &&
           this.stepperService.loyaltyProgram.backgroundColor.trim() !== '' &&
           this.stepperService.loyaltyProgram.textColor.trim() !== '' &&
           this.stepperService.loyaltyProgram.stampColor.trim() !== '' &&
           this.stepperService.loyaltyProgram.maxPoints > 0 &&
           this.stepperService.loyaltyProgram.startPoints >= 0;
  }
}
