import { Component } from '@angular/core';
import { SetupService } from '../setup.service';
import { Router } from '@angular/router';
import { DataService } from '../../../data.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QrCodeComponent } from 'ng-qrcode';
import { ComponentCardComponent } from '../../../shared/components/common/component-card/component-card.component';
import { InputFieldComponent } from '../../../shared/components/form/input/input-field.component';
import { LabelComponent } from '../../../shared/components/form/label/label.component';
import { AvatarTextComponent } from '../../../shared/components/ui/avatar/avatar-text.component';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';

@Component({
  selector: 'app-setup-card',
  imports: [ComponentCardComponent, QrCodeComponent, CommonModule, AvatarTextComponent, LabelComponent, InputFieldComponent, ButtonComponent, FormsModule],
  templateUrl: './setup-card.component.html',
  styleUrl: './setup-card.component.css'
})
export class SetupCardComponent {

  constructor(public dataService: DataService, private router: Router, public setupService: SetupService) {
  }

  ngOnInit() {
    this.setupService.setStepToActive(2);
  }

  public backToProfile() {
    this.setupService.setStepToComplete(2);
    this.router.navigate(['/setup/profile']);
  }

  public linkToForm() {
    this.setupService.setStepToComplete(2);
    this.setupService.setStepToActive(3);
    this.router.navigate(['/setup/form']);
  }

  public increaseMaxPoints() {
    if (this.setupService.loyaltyProgram.maxPoints < 12) {
      this.setupService.loyaltyProgram.maxPoints++;
    }
  }

  public decreaseMaxPoints() {
    if (this.setupService.loyaltyProgram.maxPoints > 1) {
      this.setupService.loyaltyProgram.maxPoints--;
      if (this.setupService.loyaltyProgram.startPoints > this.setupService.loyaltyProgram.maxPoints) {
        this.setupService.loyaltyProgram.startPoints = this.setupService.loyaltyProgram.maxPoints;
      }
    }
  }

  public increaseStartPoints() {
    if (this.setupService.loyaltyProgram.startPoints < this.setupService.loyaltyProgram.maxPoints) {
      this.setupService.loyaltyProgram.startPoints++;
    }
  }
  
  public decreaseStartPoints() {
    if (this.setupService.loyaltyProgram.startPoints > 0) {
      this.setupService.loyaltyProgram.startPoints--;
    }
  }

  // A method that checks that every field is filled
  public isFormValid(): boolean {
    return this.setupService.loyaltyProgram.programName.trim() !== '' &&
           this.setupService.loyaltyProgram.programDescription.trim() !== '' &&
           this.setupService.loyaltyProgram.backgroundColor.trim() !== '' &&
           this.setupService.loyaltyProgram.textColor.trim() !== '' &&
           this.setupService.loyaltyProgram.stampColor.trim() !== '' &&
           this.setupService.loyaltyProgram.maxPoints > 0 &&
           this.setupService.loyaltyProgram.startPoints >= 0;
  }
}
