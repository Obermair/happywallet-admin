import { Routes } from '@angular/router';
import { EcommerceComponent } from './pages/dashboard/ecommerce/ecommerce.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { FormElementsComponent } from './pages/forms/form-elements/form-elements.component';
import { BasicTablesComponent } from './pages/tables/basic-tables/basic-tables.component';
import { BlankComponent } from './pages/blank/blank.component';
import { NotFoundComponent } from './pages/other-page/not-found/not-found.component';
import { AppLayoutComponent } from './shared/layout/app-layout/app-layout.component';
import { InvoicesComponent } from './pages/invoices/invoices.component';
import { LineChartComponent } from './pages/charts/line-chart/line-chart.component';
import { BarChartComponent } from './pages/charts/bar-chart/bar-chart.component';
import { AlertsComponent } from './pages/ui-elements/alerts/alerts.component';
import { AvatarElementComponent } from './pages/ui-elements/avatar-element/avatar-element.component';
import { BadgesComponent } from './pages/ui-elements/badges/badges.component';
import { ButtonsComponent } from './pages/ui-elements/buttons/buttons.component';
import { ImagesComponent } from './pages/ui-elements/images/images.component';
import { VideosComponent } from './pages/ui-elements/videos/videos.component';
import { SignInComponent } from './pages/auth-pages/sign-in/sign-in.component';
import { SignUpComponent } from './pages/auth-pages/sign-up/sign-up.component';
import { CalenderComponent } from './pages/calender/calender.component';
import { AuthGuardService } from './auth-guard.service';
import { LoyaltyProgramsComponent } from './pages/loyalty-programs/loyalty-programs/loyalty-programs.component';
import { StepperComponent } from './pages/stepper/stepper.component';
import { CardComponent } from './pages/stepper/card/card.component';
import { FormComponent } from './pages/stepper/form/form.component';
import { FlyerComponent } from './pages/stepper/flyer/flyer.component';
import { CustomersComponent } from './pages/customers/customers.component';
import { GoogleCallbackComponent } from './pages/google-callback/google-callback.component';
import { ResetPasswordComponent } from './pages/auth-pages/reset-password/reset-password.component';
import { EmailConfirmedComponent } from './pages/email-confirmation/email-confirmation.component';
import { ForgotPasswordComponent } from './pages/auth-pages/forgot-password/forgot-password.component';
import { SetupComponent } from './pages/setup/setup.component';
import { SubscriptionComponent } from './pages/subscription/subscription.component';
import { OnboardGuardService } from './onboard.service';
import { SetupProfileComponent } from './pages/setup/setup-profile/setup-profile.component';
import { SetupCardComponent } from './pages/setup/setup-card/setup-card.component';
import { SetupFormComponent } from './pages/setup/setup-form/setup-form.component';
import { SetupFlyerComponent } from './pages/setup/setup-flyer/setup-flyer.component';

export const routes: Routes = [
  {
    // Parent: nur Token-Check (AuthGuard). Alle wichtigen app-routes sind Kinder.
    path: '',
    canActivate: [AuthGuardService],
    children: [
      // Setup & Subscription bleiben außerhalb des AppLayout (also anderes Design),
      // sind aber trotzdem durch AuthGuard + OnboardGuard geschützt.
      {
        path: 'setup',
        component: SetupComponent,
        canActivate: [OnboardGuardService],
        title: 'happywallet - your digital loyalty card',
        children: [
          { path: 'profile', component: SetupProfileComponent, title: 'happywallet - your digital loyalty card' },
          { path: 'card', component: SetupCardComponent, title: 'happywallet - your digital loyalty card' },
          { path: 'form', component: SetupFormComponent, title: 'happywallet - your digital loyalty card' },
          { path: 'flyer', component: SetupFlyerComponent, title: 'happywallet - your digital loyalty card' },
        ]
      },
      {
        path: 'subscription',
        component: SubscriptionComponent,
        canActivate: [OnboardGuardService],
        title: 'happywallet - your digital loyalty card',
      },

      // AppLayout selbst: OnboardGuard als canActivate → AppLayout wird nicht geladen,
      // bevor OnboardGuard die Checks bestanden hat.
      {
        path: '',
        component: AppLayoutComponent,
        canActivate: [OnboardGuardService],
        children: [
          { path: '', component: EcommerceComponent, pathMatch: 'full', title: 'happywallet - your digital loyalty card' },
          { path: 'loyalty-programs', component: LoyaltyProgramsComponent, title: 'happywallet - your digital loyalty card' },
          {
            path: 'loyalty-programs/create',
            component: StepperComponent,
            title: 'happywallet - your digital loyalty card',
            children: [
              { path: 'card', component: CardComponent, title: 'happywallet - your digital loyalty card' },
              { path: 'form', component: FormComponent, title: 'happywallet - your digital loyalty card' },
              { path: 'flyer', component: FlyerComponent, title: 'happywallet - your digital loyalty card' },
            ]
          },
          { path: 'customers', component: CustomersComponent, title: 'happywallet - your digital loyalty card' },
          { path: 'profile', component: ProfileComponent, title: 'happywallet - your digital loyalty card' },
        ]
      }
    ]
  },

  // public/auth pages (keine AppLayout)
  { path:'auth/google/callback', component: GoogleCallbackComponent, title:'happywallet - your digital loyalty card' },
  { path:'email-confirmation', component: EmailConfirmedComponent, title:'happywallet - your digital loyalty card' },
  { path:'forgot-password', component: ForgotPasswordComponent, title:'happywallet - your digital loyalty card' },
  { path:'reset-password', component: ResetPasswordComponent, title:'happywallet - your digital loyalty card' },
  { path:'signin', component: SignInComponent, title:'happywallet - your digital loyalty card' },
  { path:'signup', component: SignUpComponent, title:'happywallet - your digital loyalty card' },

  // fallback
  { path:'**', component: NotFoundComponent, title:'happywallet - your digital loyalty card' },
];

