import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { PageBreadcrumbComponent } from '../../shared/components/common/page-breadcrumb/page-breadcrumb.component';
import { UserMetaCardComponent } from '../../shared/components/user-profile/user-meta-card/user-meta-card.component';
import { UserInfoCardComponent } from '../../shared/components/user-profile/user-info-card/user-info-card.component';
import { UserAddressCardComponent } from '../../shared/components/user-profile/user-address-card/user-address-card.component';
import { ButtonComponent } from '../../shared/components/ui/button/button.component';
import { CardComponent } from '../stepper/card/card.component';
import { ComponentCardComponent } from '../../shared/components/common/component-card/component-card.component';
import { DataService } from '../../data.service';
import { ModalComponent } from '../../shared/components/ui/modal/modal.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    PageBreadcrumbComponent,
    UserMetaCardComponent,
    ComponentCardComponent,
    ModalComponent
  ],
  templateUrl: './profile.component.html',
  styles: ``
})
export class ProfileComponent {

  currentPlanTitle = '';
  currentPlanPrice = '';
  planInformationText = '';
  showUnsubscribeModal = false;

  constructor(public dataService: DataService) {

    if (this.dataService.currentUser.subscriptionStatus == 'trialing') {
      this.currentPlanTitle = 'Testphase (kostenlos)';
      this.currentPlanPrice = '€0';
      this.planInformationText = 'Du hast noch ' + this.calculateDaysLeft(this.dataService.currentUser.stripeTrialEnd) + ' Tage in deiner kostenlosen Testphase.';
    }
    if (this.dataService.currentUser.subscriptionStatus == 'active') {
      this.currentPlanTitle = 'Basic Plan (monatlich kündbar)';
      this.currentPlanPrice = '€9';
      this.planInformationText = 'Du hast noch ' + this.calculateDaysLeft(this.dataService.currentUser.stripeCurrentPeriodEnd) + ' Tage bis zur nächsten Abrechnung.';
    }
  }

  ngOnInit(): void {
  }

  calculateDaysLeft(endDate: string): number {
    const currentDate = new Date();
    const planEnd = new Date(endDate);
    console.log('Current Date:', currentDate);
    const timeDiff = planEnd.getTime() - currentDate.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  }

  unsubscribe() {
    this.dataService.cancelSubscription().then(() => {
      this.showUnsubscribeModal = false;
      this.dataService.getCurrentUserPromise().then((user: any) => {
        if (user.subscriptionStatus === 'canceled') {
          this.currentPlanTitle = 'Abonnement gekündigt';
          this.currentPlanPrice = '€0';
          this.planInformationText = 'Dein Abonnement wurde gekündigt und wird in ' + this.calculateDaysLeft(user.stripeCurrentPeriodEnd) + ' weiter.';
        }
      });
    });
  }
}
