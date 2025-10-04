import { Component } from '@angular/core';
import { AuthPageLayoutComponent } from '../../../shared/layout/auth-page-layout/auth-page-layout.component';
import { ForgotFormComponent } from '../../../shared/components/auth/forgot-form/forgot-form.component';

@Component({
  selector: 'app-forgot-password',
  imports: [AuthPageLayoutComponent, ForgotFormComponent],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {

}
