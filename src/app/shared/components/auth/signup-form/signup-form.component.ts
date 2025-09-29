import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { LabelComponent } from '../../form/label/label.component';
import { CheckboxComponent } from '../../form/input/checkbox.component';
import { InputFieldComponent } from '../../form/input/input-field.component';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../../../data.service';


@Component({
  selector: 'app-signup-form',
  imports: [
    CommonModule,
    LabelComponent,
    CheckboxComponent,
    InputFieldComponent,
    RouterModule,
    FormsModule,
  ],
  templateUrl: './signup-form.component.html',
  styles: ``
})
export class SignupFormComponent {

  showPassword = false;
  isChecked = false;

  email = '';
  password = '';
  shopName = '';
  errorMessage = '';

  constructor(public dataService: DataService, private router: Router) { }

  ngOnInit() {
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSignUp() {
    // Reset error message
    this.errorMessage = '';
    
    // Basic validation
    if (!this.checkFormValidity()) {
      return;
    }
    this.dataService.register(this.shopName, this.email, this.password).subscribe({
      next: (user) => {
        this.router.navigate(['/']);
      },
      error: () => {
        this.errorMessage = 'Die Registrierung ist fehlgeschlagen. Bitte versuchen Sie es erneut.';
      }
    });
  }

  checkFormValidity(): boolean {
    if (!this.checkEmailFormat(this.email)) {
      this.errorMessage = 'Bitte geben Sie eine gültige E-Mail-Adresse ein.';
      return false;
    }
    if (!this.password || this.password.length < 6) {
      this.errorMessage = 'Bitte geben Sie ein Passwort mit mindestens 6 Zeichen ein.';
      return false;
    }
    if (!this.isChecked) {
      this.errorMessage = 'Bitte stimmen Sie den Nutzungsbedingungen und unserer Datenschutzrichtlinie zu.';
      return false;
    }
    this.errorMessage = '';
    return true;
  }

  checkEmailFormat(email: string): boolean {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  }

}
