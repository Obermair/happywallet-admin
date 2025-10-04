import { Component } from '@angular/core';
import { AuthPageLayoutComponent } from '../../../shared/layout/auth-page-layout/auth-page-layout.component';
import { ResetFormComponent } from '../../../shared/components/auth/reset-form/reset-form.component';

@Component({
  selector: 'app-reset-password',
  imports: [AuthPageLayoutComponent , ResetFormComponent],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent {

}
