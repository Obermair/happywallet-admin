import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { LabelComponent } from '../../form/label/label.component';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { InputFieldComponent } from '../../form/input/input-field.component';
import { ButtonComponent } from '../../ui/button/button.component';
import { DataService } from '../../../../data.service';

@Component({
  selector: 'app-forgot-form',
  imports: [CommonModule,
    LabelComponent,
    ButtonComponent,
    InputFieldComponent,
    RouterModule,
    FormsModule],
  templateUrl: './forgot-form.component.html',
  styleUrl: './forgot-form.component.css'
})
export class ForgotFormComponent {

  email: string = '';
  forgotMessageSent: boolean = false;

  errorMessage = '';

  constructor(public dataService: DataService) { }

  ngOnInit(): void {
  }

  onSubmit() {
    // check if email is valid
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(this.email)) {
      this.errorMessage = 'Bitte geben Sie eine gültige E-Mail-Adresse ein.';
      return;
    }

    this.dataService.forgotPassword(this.email).subscribe({
      next: () => {
        this.forgotMessageSent = true;
      },
      error: (error) => {
        console.error('Fehler beim Senden der Passwort-Zurücksetzen-E-Mail:', error);
      }
    });
  }
}
