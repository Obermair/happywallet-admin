import { Component } from '@angular/core';
import { ComponentCardComponent } from '../../../shared/components/common/component-card/component-card.component';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';
import { LabelComponent } from '../../../shared/components/form/label/label.component';
import { InputFieldComponent } from '../../../shared/components/form/input/input-field.component';
import { Router } from '@angular/router';
import { StepperService } from '../stepper.service';
import { SwitchComponent } from '../../../shared/components/form/input/switch.component';
import { CommonModule } from '@angular/common';
import { CheckboxComponent } from '../../../shared/components/form/input/checkbox.component';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../../data.service';
import { AvatarTextComponent } from '../../../shared/components/ui/avatar/avatar-text.component';

@Component({
  selector: 'app-form',
  imports: [ComponentCardComponent, ButtonComponent, LabelComponent, InputFieldComponent, SwitchComponent, CommonModule, CheckboxComponent, FormsModule, AvatarTextComponent],
  templateUrl: './form.component.html',
  styleUrl: './form.component.css'
})
export class FormComponent {

  constructor(private router: Router, public stepperService: StepperService, public dataService: DataService){}

  ngOnInit() {
    this.stepperService.setStepToActive(2);
  }

  linkToCard() {
    this.stepperService.setStepToComplete(2);
    this.router.navigate(['/loyalty-programs/create/card']);
  }

  linkToFlyer() {
    this.stepperService.setStepToComplete(2);
    this.stepperService.setStepToActive(3);
    this.router.navigate(['/loyalty-programs/create/flyer']);
  }

  // A method that checks that every field is filled
  public isFormValid(): boolean {
    return this.stepperService.loyaltyProgram.formDescription.trim() !== '' &&
           this.stepperService.loyaltyProgram.formSendButton.trim() !== '';
  }

}
