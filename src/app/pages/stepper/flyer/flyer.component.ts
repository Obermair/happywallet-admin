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

  pdfSrc: Uint8Array | null = null; 
  private pdfBytes: Uint8Array | null = null; 

  constructor(private router: Router, public stepperService: StepperService, public dataService: DataService) { }

  async ngOnInit() {
    await this.dataService.getCurrentUserPromise();
    
    await this.updatePdf();
  }


  linkToFlyer() {
    this.stepperService.setStep(2);
    this.router.navigate(['/loyalty-programs/create/form']);
  }

  createLoyaltyCard() {
    // Logic to create the loyalty card
  }


async updatePdf() {
  // === 1. PDF laden ===
  const pdfDoc = await this.loadPdf('../../images/flyer.pdf');
  const firstPage = pdfDoc.getPages()[0];
  const pageWidth = firstPage.getWidth();

  // === 2. Schrift einbetten ===
  const roboto = await this.loadFont(pdfDoc, '../../images/RobotoBold.ttf');

  // === 3. Texte einfügen ===
  this.addTexts(firstPage, roboto, pageWidth);

  // === 4. Logo & QR Code einfügen ===
  await this.addLogo(pdfDoc, firstPage);
  await this.addQrCode(pdfDoc, firstPage);

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

  const blob = new Blob([this.pdfBytes], { type: 'application/pdf' });
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
  const heading = this.stepperService.flyerData.flyerHeading;
  const scanInfo = this.stepperService.flyerData.flyerScanInfo;

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


private async addLogo(pdfDoc: PDFDocument, page: PDFPage) {
  const logoUrl = this.dataService.apiUrl + this.dataService.currentUser.shopLogo.url;
  const logoBytes = await fetch(logoUrl).then(res => res.arrayBuffer());
  const logoImage = await pdfDoc.embedPng(logoBytes);

  const logoDimsWidth = 170;
  const logoDimsHeight = (logoImage.height / logoImage.width) * logoDimsWidth;

  page.drawImage(logoImage, {
    x: 215,
    y: 520,
    width: logoDimsWidth,
    height: logoDimsHeight,
  });
}


private async addQrCode(pdfDoc: PDFDocument, page: PDFPage) {
  const signupLink = this.stepperService.cardData.signupLink;

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


  onPdfLoad(pdf: any) {
    console.log('PDF loaded:', pdf);
  }

  onPdfError(err: any) {
    console.error('PDF failed to load:', err);
  }


}
