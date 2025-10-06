import { Component } from '@angular/core';
import { SetupService } from '../setup.service';
import { DataService } from '../../../data.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { ComponentCardComponent } from '../../../shared/components/common/component-card/component-card.component';
import { InputFieldComponent } from '../../../shared/components/form/input/input-field.component';
import { LabelComponent } from '../../../shared/components/form/label/label.component';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';

@Component({
  selector: 'app-setup-flyer',
  imports: [ComponentCardComponent, ButtonComponent, LabelComponent, InputFieldComponent, CommonModule, PdfViewerModule],
  templateUrl: './setup-flyer.component.html',
  styleUrl: './setup-flyer.component.css'
})
export class SetupFlyerComponent {

    constructor(private router: Router, public setupService: SetupService, public dataService: DataService) { }

  async ngOnInit() {
    this.setupService.setStepToActive(4);

    await this.dataService.getCurrentUserPromise();
    await this.setupService.updatePdf(this.dataService.apiUrl + this.dataService.currentUser.shopLogo.url, this.dataService.signUpPageLink + this.setupService.loyaltyProgram.loyaltyProgramCode);
  }

  linkToFlyer() {
    this.setupService.setStepToComplete(4);
    this.router.navigate(['/setup/form']);
  }

  createLoyaltyCard() {
    this.setupService.setStepToComplete(4);
    this.generateLoyaltyCard();
  }

  public generateLoyaltyCard(){
    // check if all steps are complete
    const allComplete = this.setupService.steps.every(step => step.status === 'complete' || step.status === 'current');

    if (allComplete) {
      console.log(this.setupService.loyaltyProgram);
      this.dataService.createLoyaltyProgram(this.setupService.loyaltyProgram).then(() => {
        this.setupService.loyaltyProgram.loyaltyProgramCode = '';
        this.setupService.setStepsToUpcoming();
        this.router.navigate(['/']);
      });
    } else {
      // If not all steps are complete, navigate to the first incomplete step
      const firstIncompleteStep = this.setupService.steps.find(step => step.status === 'current');
      if (firstIncompleteStep) {
        this.router.navigate([firstIncompleteStep.link]);
      }
    }
  }

    // A method that checks that every field is filled
  public isFormValid(): boolean {
    return this.setupService.loyaltyProgram.flyerHeading.trim() !== '' &&
           this.setupService.loyaltyProgram.flyerScanInfo.trim() !== '';
  }

  onPdfLoad(pdf: any) {
    console.log('PDF loaded:', pdf);
  }

  onPdfError(err: any) {
    console.error('PDF failed to load:', err);
  }

}
