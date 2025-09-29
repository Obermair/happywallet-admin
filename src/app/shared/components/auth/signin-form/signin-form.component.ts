import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { LabelComponent } from '../../form/label/label.component';
import { CheckboxComponent } from '../../form/input/checkbox.component';
import { ButtonComponent } from '../../ui/button/button.component';
import { InputFieldComponent } from '../../form/input/input-field.component';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../../../data.service';

@Component({
  selector: 'app-signin-form',
  imports: [
    CommonModule,
    LabelComponent,
    ButtonComponent,
    InputFieldComponent,
    RouterModule,
    FormsModule,
  ],
  templateUrl: './signin-form.component.html',
  styles: ``
})
export class SigninFormComponent {

  showPassword = false;
  isChecked = false;

  email = '';
  password = '';

  errorMessage = '';

  constructor(public dataService: DataService, private router: Router) { }

  ngOnInit() {
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSignIn() {
    // Reset error message
    this.errorMessage = '';

    // Basic validation
    if (!this.email) {
      this.errorMessage = 'Bitte geben Sie Ihre E-Mail-Adresse ein.';
      return;
    }
    if (!this.password) {
      this.errorMessage = 'Bitte geben Sie Ihr Passwort ein.';
      return;
    }

    this.dataService.signIn(this.email, this.password).then((user) => {
      this.router.navigate(['/']);
    }).catch(() => {
      this.errorMessage = 'Anmeldung fehlgeschlagen. Bitte überprüfen Sie Ihre E-Mail-Adresse und Ihr Passwort.';
    });
  }
}
