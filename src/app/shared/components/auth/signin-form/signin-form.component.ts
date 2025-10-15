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

  constructor(public dataService: DataService, private router: Router) {
    if (localStorage.getItem('jwt_token') != null) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit() {
    window.addEventListener("message", (event) => {
      if (event.data.jwt) {    
        console.log("Google Sign-In erfolgreich");
        localStorage.setItem('jwt_token', event.data.jwt);
        localStorage.setItem('jwt_user', event.data.user.username);
        localStorage.setItem('jwt_user_id', event.data.user.id);
        localStorage.setItem('jwt_user_email', event.data.user.email);
        this.dataService.getCurrentUserPromise().then((user: any) => {
          this.router.navigate(['/']);
        });
      }
    });
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

  signInWithGoogle() {
    window.open(
      this.dataService.apiUrl + "/api/connect/google",
      "googleLogin",
      "width=500,height=600,scrollbars=yes"
    );
  }

  
}
