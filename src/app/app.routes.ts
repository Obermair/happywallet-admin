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

export const routes: Routes = [
  {
    path:'',
    component:AppLayoutComponent, 
    canActivate: [AuthGuardService],
    children:[
      {
        path: '',
        component: EcommerceComponent,
        pathMatch: 'full',
        title:
          'happywallet - your digital loyalty card',
      },
      {
        path: 'loyalty-programs',
        component: LoyaltyProgramsComponent,
        title: 'happywallet - your digital loyalty card',
      },
      {
          path: 'loyalty-programs/create',
          component: StepperComponent, 
          title: 'happywallet - your digital loyalty card',
          children: [
            {
              path: 'card',
              component: CardComponent,
              title: 'happywallet - your digital loyalty card'
            },
            {
              path: 'form',
              component: FormComponent,
              title: 'happywallet - your digital loyalty card'
            },
            {
              path: 'flyer',
              component: FlyerComponent,
              title: 'happywallet - your digital loyalty card'
            }
          ]      
      },
      {
        path:'customers',
        component: CustomersComponent,
        title:'happywallet - your digital loyalty card'
      },
      {
        path:'calendar',
        component:CalenderComponent,
        title:'happywallet - your digital loyalty card'
      },
      {
        path:'profile',
        component:ProfileComponent,
        title:'happywallet - your digital loyalty card',
      },
      {
        path:'form-elements',
        component:FormElementsComponent,
        title:'happywallet - your digital loyalty card'
      },
      {
        path:'basic-tables',
        component:BasicTablesComponent,
        title:'happywallet - your digital loyalty card'
      },
      {
        path:'blank',
        component:BlankComponent,
        title:'happywallet - your digital loyalty card'
      },
      // support tickets
      {
        path:'invoice',
        component:InvoicesComponent,
        title:'happywallet - your digital loyalty card'
      },
      {
        path:'line-chart',
        component:LineChartComponent,
        title:'happywallet - your digital loyalty card'
      },
      {
        path:'bar-chart',
        component:BarChartComponent,
        title:'happywallet - your digital loyalty card'
      },
      {
        path:'alerts',
        component:AlertsComponent,
        title:'happywallet - your digital loyalty card'
      },
      {
        path:'avatars',
        component:AvatarElementComponent,
        title:'happywallet - your digital loyalty card'
      },
      {
        path:'badge',
        component:BadgesComponent,
        title:'happywallet - your digital loyalty card'
      },
      {
        path:'buttons',
        component:ButtonsComponent,
        title:'happywallet - your digital loyalty card'
      },
      {
        path:'images',
        component:ImagesComponent,
        title:'happywallet - your digital loyalty card'
      },
      {
        path:'videos',
        component:VideosComponent,
        title:'happywallet - your digital loyalty card'
      },
    ]
  },
  // auth pages
  {
    path:'signin',
    component:SignInComponent,
    title:'happywallet - your digital loyalty card'
  },
  {
    path:'signup',
    component:SignUpComponent,
    title:'happywallet - your digital loyalty card'
  },
  // error pages
  {
    path:'**',
    component:NotFoundComponent,
    title:'happywallet - your digital loyalty card'
  },
];
