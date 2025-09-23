import { Component } from '@angular/core';
import { ComponentCardComponent } from '../../../shared/components/common/component-card/component-card.component';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';
import { LabelComponent } from '../../../shared/components/form/label/label.component';
import { InputFieldComponent } from '../../../shared/components/form/input/input-field.component';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { StepperService } from '../stepper.service';
import { PDFDocument, PDFFont, PDFPage, StandardFonts } from 'pdf-lib';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { DataService } from '../../../data.service';
import fontkit from '@pdf-lib/fontkit';
import QRCode from 'qrcode';

@Component({
  selector: 'app-flyer',
  imports: [ComponentCardComponent, ButtonComponent, LabelComponent, InputFieldComponent, CommonModule, PdfViewerModule],
  templateUrl: './flyer.component.html',
  styleUrl: './flyer.component.css'
})
export class FlyerComponent {

  constructor(private router: Router, public stepperService: StepperService, public dataService: DataService) { }

  async ngOnInit() {
    this.stepperService.setStepToActive(3);

    await this.dataService.getCurrentUserPromise();
    await this.stepperService.updatePdf(this.dataService.apiUrl + this.dataService.currentUser.shopLogo.url, this.dataService.signUpPageLink + this.stepperService.loyaltyProgram.loyaltyProgramCode);
  }


  linkToFlyer() {
    this.stepperService.setStepToComplete(3);
    this.router.navigate(['/loyalty-programs/create/form']);
  }

  createLoyaltyCard() {
    this.stepperService.setStepToComplete(3);
    this.generateLoyaltyCard();
  }

  public generateLoyaltyCard(){
    // check if all steps are complete
    const allComplete = this.stepperService.steps.every(step => step.status === 'complete' || step.status === 'current');

    if (allComplete) {
      if (this.stepperService.loyaltyProgram.loyaltyProgramCode && this.dataService.loyaltyPrograms?.some((p: any) => p.attributes.loyaltyProgramCode === this.stepperService.loyaltyProgram.loyaltyProgramCode)) {
        this.dataService.updateLoyaltyProgramWithoutId(this.stepperService.loyaltyProgram).then(() => {
          this.stepperService.loyaltyProgram.loyaltyProgramCode = '';
          this.stepperService.setStepsToUpcoming();
          this.router.navigate(['/loyalty-programs']);
        });
      } else {
        this.dataService.createLoyaltyProgram(this.stepperService.loyaltyProgram).then(() => {
          this.stepperService.loyaltyProgram.loyaltyProgramCode = '';
          this.stepperService.setStepsToUpcoming();
          this.router.navigate(['/loyalty-programs']);
        });
      } 
    } else {
      // If not all steps are complete, navigate to the first incomplete step
      const firstIncompleteStep = this.stepperService.steps.find(step => step.status === 'current');
      if (firstIncompleteStep) {
        this.router.navigate([firstIncompleteStep.link]);
      }
    }
  }

    // A method that checks that every field is filled
  public isFormValid(): boolean {
    return this.stepperService.loyaltyProgram.flyerHeading.trim() !== '' &&
           this.stepperService.loyaltyProgram.flyerScanInfo.trim() !== '';
  }

  onPdfLoad(pdf: any) {
    console.log('PDF loaded:', pdf);
  }

  onPdfError(err: any) {
    console.error('PDF failed to load:', err);
  }
}
