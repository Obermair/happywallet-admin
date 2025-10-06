import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../../../data.service';
import { SetupService } from '../setup.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ComponentCardComponent } from '../../../shared/components/common/component-card/component-card.component';
import { CheckboxComponent } from '../../../shared/components/form/input/checkbox.component';
import { InputFieldComponent } from '../../../shared/components/form/input/input-field.component';
import { SwitchComponent } from '../../../shared/components/form/input/switch.component';
import { LabelComponent } from '../../../shared/components/form/label/label.component';
import { AvatarTextComponent } from '../../../shared/components/ui/avatar/avatar-text.component';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';

@Component({
  selector: 'app-setup-form',
  imports: [ComponentCardComponent, ButtonComponent, LabelComponent, InputFieldComponent, SwitchComponent, CommonModule, CheckboxComponent, FormsModule, AvatarTextComponent],
  templateUrl: './setup-form.component.html',
  styleUrl: './setup-form.component.css'
})
export class SetupFormComponent {

  constructor(private router: Router, public setupService: SetupService, public dataService: DataService){}

  ngOnInit() {
    this.setupService.setStepToActive(3);
  }

  linkToCard() {
    this.setupService.setStepToComplete(4);
    this.router.navigate(['/setup/card']);
  }

  linkToFlyer() {
    this.setupService.setStepToComplete(3);
    this.setupService.setStepToActive(4);
    this.router.navigate(['/setup/flyer']);
  }

  // A method that checks that every field is filled
  public isFormValid(): boolean {
    return this.setupService.loyaltyProgram.formDescription.trim() !== '' &&
           this.setupService.loyaltyProgram.formSendButton.trim() !== '';
  }
}
