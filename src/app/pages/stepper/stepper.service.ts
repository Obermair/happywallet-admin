import { Injectable } from '@angular/core';

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
      status: 'current' 
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

  public cardData = {
    programName: 'Free Burger Club',
    programDescription: 'Erhalte einen Gratis Burger nach dem 7 Besuch bei uns.',
    backgroundColor: '#f2f4f7',
    textColor: '#000000',
    stampColor: '#c38e71',
    maxPoints: 8,
    startPoints: 1,
    signupLink: 'https://signup.happywallet.at/?loyaltyProgram=',
  };

  public formData = {
    formDescription: 'Bitte füllen Sie dieses Formular aus, um unserem Treueprogramm beizutreten.',
    formSendButton: 'Jetzt beitreten!',
    formNameField: true,
    formNameFieldMandatory: true,
    formBirthdayField: false,
    formBirthdayFieldMandatory: false,
    formMarketingConsent: true,
  }

  flyerData = {
    flyerHeading: 'Erhalte einen Gratis Burger nach dem 7 Besuch bei uns.',
    flyerScanInfo: 'Scannen Sie den QR-Code, und fügen Sie Ihre Stempelkarte Ihrer Apple oder Google Wallet hinzu.',
  }

  constructor() { }

  public getSteps() {
    return this.steps;
  }
  
  // Set the current step by id and update statuses
  public setStep(stepId: number) {
    this.steps = this.steps.map(step => {
      if (step.id < stepId) {
        return { ...step, status: 'complete' };
      } else if (step.id === stepId) {
        return { ...step, status: 'current' };
      } else {
        return { ...step, status: 'upcoming' };
      }
    });
  }
}
