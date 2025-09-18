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

  public nextIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>`;
  
  constructor(public dataService: DataService, private router: Router, public stepperService: StepperService) {
  }

  public linkToForm() {
    this.stepperService.setStep(2);
    this.router.navigate(['/loyalty-programs/create/form']);
  }

  public increaseMaxPoints() {
    if (this.stepperService.cardData.maxPoints < 12) {
      this.stepperService.cardData.maxPoints++;
    }
  }

  public decreaseMaxPoints() {
    if (this.stepperService.cardData.maxPoints > 1) {
      this.stepperService.cardData.maxPoints--;
      if (this.stepperService.cardData.startPoints > this.stepperService.cardData.maxPoints) {
        this.stepperService.cardData.startPoints = this.stepperService.cardData.maxPoints;
      }
    }
  }

  public increaseStartPoints() {
    if (this.stepperService.cardData.startPoints < this.stepperService.cardData.maxPoints) {
      this.stepperService.cardData.startPoints++;
    }
  }
  
  public decreaseStartPoints() {
    if (this.stepperService.cardData.startPoints > 0) {
      this.stepperService.cardData.startPoints--;
    }
  }
}
