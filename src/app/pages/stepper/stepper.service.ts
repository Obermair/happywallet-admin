import { Injectable } from '@angular/core';
import { DataService } from '../../data.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class StepperService {
  
  public nextIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>`;
  public previousIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>`;
  public downloadIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 15v4c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2v-4M17 9l-5 5-5-5M12 12.8V2.5"/></svg>`
 
  public steps = [
    { 
      id: 1, 
      name: 'Stempelkarte gestalten', 
      description: 'Erstelle das Layout deiner Karte.', 
      link: '/loyalty-programs/create/card',
      status: 'upcoming' 
    },
    { 
      id: 2, 
      name: 'Anmeldeformular erstellen', 
      description: 'Füge ein Formular hinzu, um Kunden zu erfassen.',
      link: '/loyalty-programs/create/form',
      status: 'upcoming' 
    },
    { 
      id: 3, 
      name: 'Flyer generieren', 
      description: 'Erstelle druckbare QR-Code-Flyer.', 
      link: '/loyalty-programs/create/flyer',
      status: 'upcoming' 
    }
  ];

  public loyaltyProgram = { 
    loyaltyProgramCode: '',
    programName: '',
    programDescription: '',
    backgroundColor: '',
    textColor: '',
    stampColor: '',
    maxPoints: 0,
    startPoints: 0,
    formDescription: '',
    formSendButton: '',
    formNameField: true,
    formNameFieldMandatory: true,
    formBirthdayField: false,
    formBirthdayFieldMandatory: false,
    formMarketingConsent: true,
    flyerHeading: '',
    flyerScanInfo: '',
    programType: '',
    user: '',
    active: true
  };

  public defaultLoyaltyProgram = {
    loyaltyProgramCode: '',
    programName: 'Free Burger Club',
    programDescription: 'Erhalte einen Gratis Burger nach dem 7 Besuch bei uns.',
    backgroundColor: '#f2f4f7',
    textColor: '#000000',
    stampColor: '#c38e71',
    maxPoints: 8,
    startPoints: 1,
    formDescription: 'Bitte füllen Sie dieses Formular aus, um unserem Treueprogramm beizutreten.',
    formSendButton: 'Jetzt beitreten!',
    formNameField: true,
    formNameFieldMandatory: true,
    formBirthdayField: false,
    formBirthdayFieldMandatory: false,
    formMarketingConsent: true,
    flyerHeading: 'Erhalte einen Gratis Burger nach dem 7 Besuch bei uns.',
    flyerScanInfo: 'Einfach QR-Code scannen und Stempelkarte zu Apple oder Google Wallet hinzufügen.',
    programType: 'stamps',
    user: '',
    active: true
  }

  constructor(private router: Router) {
  }

  public getSteps() {
    return this.steps;
  }

  setStepToActive(stepId: number) {
    this.steps = this.steps.map(step => {
      if (step.id === stepId) {
        return { ...step, status: 'current' };
      } else {
        return step;
      }
    });
  }

  setStepToComplete(stepId: number) {
    this.steps = this.steps.map(step => {
      if (step.id === stepId) {
        return { ...step, status: 'complete' };
      } else {
        return step;
      }
    });
  }

  setStepsToUpcoming() {
    this.steps = this.steps.map(step => {
      return { ...step, status: 'upcoming' };
    });

    this.setStepToActive(1);
  }

  setStepsToComplete() {
    this.steps = this.steps.map(step => {
      return { ...step, status: 'complete' };
    });
    
    this.setStepToActive(1);
  }

  generateRandomCode(length: number = 15): string {
    return Math.random().toString(36).substring(2, 2 + length);
  }

}
