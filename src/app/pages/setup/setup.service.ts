import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import fontkit from '@pdf-lib/fontkit';
import QRCode from 'qrcode';
import { PDFDocument, PDFPage, PDFFont } from 'pdf-lib';

@Injectable({
  providedIn: 'root'
})
export class SetupService {

  public nextIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>`;
  public previousIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>`;
  public downloadIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 15v4c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2v-4M17 9l-5 5-5-5M12 12.8V2.5"/></svg>`
 
  public steps = [
    { 
      id: 1, 
      name: 'Profil erstellen', 
      description: 'Lade das Logo für deinen Shop hoch und wähle deinen Shop-Namen.', 
      link: '/setup/profile',
      status: 'upcoming' 
    },
    { 
      id: 2, 
      name: 'Stempelkarte gestalten', 
      description: 'Erstelle das Layout deiner Karte.', 
      link: '/setup/card',
      status: 'upcoming' 
    },
    { 
      id: 3, 
      name: 'Anmeldeformular erstellen', 
      description: 'Füge ein Formular hinzu, um Kunden zu erfassen.',
      link: '/setup/form',
      status: 'upcoming' 
    },
    { 
      id: 4, 
      name: 'Flyer generieren', 
      description: 'Erstelle druckbare QR-Code-Flyer.', 
      link: '/setup/flyer',
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

  public pdfSrc: Uint8Array | null = null; 
  public pdfBytes: Uint8Array | null = null; 

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


  async updatePdf(logoUrl?: string, qrCodeUrl?: string) {
    // === 1. PDF laden ===
    const pdfDoc = await this.loadPdf('../../images/flyer.pdf');
    const firstPage = pdfDoc.getPages()[0];
    const pageWidth = firstPage.getWidth();
  
    // === 2. Schrift einbetten ===
    const roboto = await this.loadFont(pdfDoc, '../../images/RobotoBold.ttf');
  
    // === 3. Texte einfügen ===
    this.addTexts(firstPage, roboto, pageWidth);
  
    // === 4. Logo & QR Code einfügen ===
    await this.addLogo(pdfDoc, firstPage, logoUrl);
    await this.addQrCode(pdfDoc, firstPage, qrCodeUrl);

    // === 5. PDF speichern ===
    this.pdfBytes = await pdfDoc.save();
    this.pdfSrc = this.pdfBytes; 
    // in updatePdf()
    this.pdfBytes = new Uint8Array(await pdfDoc.save());
  }
  
  downloadPdf() {
    if (!this.pdfBytes) {
      console.error("Kein PDF erzeugt.");
      return;
    }
  
    const blob = new Blob([new Uint8Array(this.pdfBytes as Uint8Array)], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
  
    const a = document.createElement('a');
    a.href = url;
    a.download = 'flyer.pdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  
    URL.revokeObjectURL(url);
  }
  
  
  
  private async loadPdf(url: string): Promise<PDFDocument> {
    const existingPdfBytes = await fetch(url).then(res => res.arrayBuffer());
    return PDFDocument.load(existingPdfBytes);
  }
  
  private async loadFont(pdfDoc: PDFDocument, fontUrl: string) {
    pdfDoc.registerFontkit(fontkit);
    const fontBytes = await fetch(fontUrl).then(res => res.arrayBuffer());
    return pdfDoc.embedFont(fontBytes);
  }
  
  private addTexts(page: PDFPage, font: PDFFont, pageWidth: number) {
    const heading = this.loyaltyProgram.flyerHeading;
    const scanInfo = this.loyaltyProgram.flyerScanInfo;
  
    // max. Textbreite für Überschrift und ScanInfo
    const maxHeadingWidth = 400;
    const maxScanWidth = 400;
  
    // Überschrift zentriert
    this.drawWrappedText(
      page, heading, font, 24,
      (pageWidth - maxHeadingWidth) / 2, // Basis-X für Zentrierung
      485, maxHeadingWidth, true
    );
  
    // Scan-Info auch zentriert
    this.drawWrappedText(
      page, scanInfo, font, 14,
      (pageWidth - maxScanWidth) / 2,    // Basis-X für Zentrierung
      150, maxScanWidth, true
    );
  
      // === Powered by Text ganz oben, sehr klein ===
    const poweredBy = "powered by happywallet.at";
    const textWidth = font.widthOfTextAtSize(poweredBy, 8);
  
    page.drawText(poweredBy, {
      x: (pageWidth - textWidth) / 2, // zentriert
      y: page.getHeight() - 20,       // 20pt vom oberen Rand
      size: 8,                        // sehr klein
      font
    });
  }
  
  
  private drawWrappedText(
    page: PDFPage,
    text: string,
    font: PDFFont,
    fontSize: number,
    x: number,
    y: number,
    maxWidth: number,
    center: boolean = false
  ) {
    const words = text.split(' ');
    let line = '';
    const lineHeight = fontSize + 4;
    let currentY = y;
  
    for (let i = 0; i < words.length; i++) {
      const testLine = line + words[i] + ' ';
      const testWidth = font.widthOfTextAtSize(testLine, fontSize);
  
      if (testWidth > maxWidth && line !== '') {
        const lineX = center ? x + (maxWidth - font.widthOfTextAtSize(line.trim(), fontSize)) / 2 : x;
        page.drawText(line.trim(), { x: lineX, y: currentY, size: fontSize, font });
        line = words[i] + ' ';
        currentY -= lineHeight;
      } else {
        line = testLine;
      }
    }
  
    if (line) {
      const lineX = center ? x + (maxWidth - font.widthOfTextAtSize(line.trim(), fontSize)) / 2 : x;
      page.drawText(line.trim(), { x: lineX, y: currentY, size: fontSize, font });
    }
  }
  
  
  private async addLogo(pdfDoc: PDFDocument, page: PDFPage, logoUrl?: string) {
    const logoUrlParam = logoUrl || '../../assets/images/logo-happywallet.png';
    const logoBytes = await fetch(logoUrlParam).then(res => res.arrayBuffer());
    
    // Einbetten des Logos als PNG / JPEG / JPG
    const logoImage = logoUrlParam.endsWith('.png') ?
      await pdfDoc.embedPng(logoBytes) :
      await pdfDoc.embedJpg(logoBytes);

    const logoDimsWidth = 170;
    const logoDimsHeight = (logoImage.height / logoImage.width) * logoDimsWidth;
  
    page.drawImage(logoImage, {
      x: 215,
      y: 520,
      width: logoDimsWidth,
      height: logoDimsHeight,
    });
  }
  
  
  private async addQrCode(pdfDoc: PDFDocument, page: PDFPage, qrCodeUrl?: string) {
    const signupLink = qrCodeUrl || '';

    // 1. QR Code als DataURL erzeugen
    const qrDataUrl = await QRCode.toDataURL(signupLink, { margin: 1, width: 200 });
  
    // 2. Base64 in Bytes umwandeln
    const qrBytes = Uint8Array.from(
      atob(qrDataUrl.split(',')[1]),
      c => c.charCodeAt(0)
    );
  
    // 3. PNG ins PDF einbetten
    const qrImage = await pdfDoc.embedPng(qrBytes);
  
    // 4. Größe und Position festlegen
    const qrSize = 140; // Breite/Höhe in px
    page.drawImage(qrImage, {
      x: 235,  // rechts mit 50pt Abstand
      y: 245,                            // von unten 100pt
      width: qrSize,
      height: qrSize
    });
  }
}
