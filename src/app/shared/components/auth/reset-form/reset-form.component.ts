import { Component } from '@angular/core';
import { DataService } from '../../../../data.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputFieldComponent } from '../../form/input/input-field.component';
import { LabelComponent } from '../../form/label/label.component';
import { ButtonComponent } from '../../ui/button/button.component';

@Component({
  selector: 'app-reset-form',
  imports: [CommonModule,
    LabelComponent,
    ButtonComponent,
    InputFieldComponent,
    RouterModule,
    FormsModule],
  templateUrl: './reset-form.component.html',
  styleUrl: './reset-form.component.css'
})
export class ResetFormComponent {

  code: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  errorMessage = '';

  constructor(public dataService: DataService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.code = params['code'] || '';
    });
  }

  onSubmit() {
    // check if code is valid
    if (!this.code) {
      this.errorMessage = 'Ungültiger Code zum Zurücksetzen des Passworts.';
      return;
    }

    // check if new password and confirm password match
    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage = 'Die Passwörter stimmen nicht überein.';
      return;
    }

    if (this.newPassword.length < 6) {
      this.errorMessage = 'Das Passwort muss mindestens 6 Zeichen lang sein.';
      return;
    }

    this.dataService.resetPassword(this.code, this.newPassword, this.confirmPassword).subscribe({
      next: () => {
        this.router.navigate(['/signin']);
      },
      error: (error) => {
        console.error('Fehler beim Zurücksetzen des Passworts:', error);
      }
    });
  }
}
