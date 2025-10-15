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
import { BadgeComponent } from '../../shared/components/ui/badge/badge.component';



@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    PageBreadcrumbComponent,
    UserMetaCardComponent,
    ComponentCardComponent,
    ModalComponent,
    BadgeComponent
  ],
  templateUrl: './profile.component.html',
  styles: ``
})
export class ProfileComponent {

  currentPlanTitle = '';
  currentPlanPrice = '';
  planInformationText = '';
  showUnsubscribeModal = false;
  errorMessage = '';
  invoices: any[] = [];

  constructor(public dataService: DataService) {
    this.setText();
    this.getInvoices();
  }

  setText() {
    if (this.dataService.currentUser.subscriptionStatus == 'trialing') {
      if (this.dataService.currentUser.temporaryUse) {
        this.currentPlanTitle = 'Testphase (kostenlos)';
        this.currentPlanPrice = '€0';
        if (this.dataService.currentUser.stripeCancelAt) {
          //consider if stripeCancelAt is 0 --> then show different text
          if (this.calculateDaysLeft(this.dataService.currentUser.stripeCancelAt, false) == 0) {
            this.planInformationText = 'Du hast dein Abo bei uns beendet. Du kannst unsere Plattform nur mehr heute nutzen.';
          } else {
            this.planInformationText = 'Du hast dein Abo bei uns beendet. Du kannst unsere Plattform noch ' + this.calculateDaysLeft(this.dataService.currentUser.stripeCancelAt, false) + ' Tage nutzen.';
          }
        } else {
          // consider if stripeCurrentPeriodEnd is 0 --> then show different text
          if (this.calculateDaysLeft(this.dataService.currentUser.stripeCurrentPeriodEnd, false) == 0) {
            this.planInformationText = 'Dein Abo wird heute abgebucht.';
          } else {
            this.planInformationText = 'Du hast noch ' + this.calculateDaysLeft(this.dataService.currentUser.stripeCurrentPeriodEnd, false) + ' Tage bis zur nächsten Abrechnung.';
          }
        }
      }
      else {
        this.currentPlanTitle = 'Testphase (kostenlos)';
        this.currentPlanPrice = '€0';
        if (this.dataService.currentUser.stripeCancelAt) {
          //consider if stripeCancelAt is 0 --> then show different text
          if (this.calculateDaysLeft(this.dataService.currentUser.stripeCancelAt, false) == 0) {
            this.planInformationText = 'Du hast dein Abo bei uns beendet. Du kannst unsere Plattform nur mehr heute nutzen.';
          } else {
            this.planInformationText = 'Du hast dein Abo bei uns beendet. Du kannst unsere Plattform noch ' + this.calculateDaysLeft(this.dataService.currentUser.stripeCancelAt, false) + ' Tage nutzen.';
          }
        } else {
          // consider if stripeCurrentPeriodEnd is 0 --> then show different text
          if (this.calculateDaysLeft(this.dataService.currentUser.stripeCurrentPeriodEnd, false) == 0) {
            this.planInformationText = 'Dein Abo wird heute abgebucht.';
          } else {
            this.planInformationText = 'Du hast noch ' + this.calculateDaysLeft(this.dataService.currentUser.stripeCurrentPeriodEnd, false) + ' Tage bis zur nächsten Abrechnung.';
          }
        }
      }
    }
    if (this.dataService.currentUser.subscriptionStatus == 'active') {
      if ( this.dataService.currentUser.temporaryUse) {
        this.currentPlanTitle = 'Basic Plan (monatlich kündbar)';
        this.currentPlanPrice = '€9';
        if (this.dataService.currentUser.stripeCancelAt) {
          //consider if stripeCancelAt is 0 --> then show different text
          if (this.calculateDaysLeft(this.dataService.currentUser.stripeCancelAt, false) == 0) {
            this.planInformationText = 'Du hast dein Abo bei uns beendet. Du kannst unsere Plattform nur mehr heute nutzen.';
          } else {
            this.planInformationText = 'Du hast dein Abo bei uns beendet. Du kannst unsere Plattform noch ' + this.calculateDaysLeft(this.dataService.currentUser.stripeCancelAt, false) + ' Tage nutzen.';
          }
        } else {
          // consider if stripeCurrentPeriodEnd is 0 --> then show different text
          if (this.calculateDaysLeft(this.dataService.currentUser.stripeCurrentPeriodEnd, false) == 0) {
            this.planInformationText = 'Dein Abo wurde heute abgebucht.';
          } else {
            this.planInformationText = 'Du hast noch ' + this.calculateDaysLeft(this.dataService.currentUser.stripeCurrentPeriodEnd, true) + ' Tage bis zur nächsten Abrechnung.';
          }
        }
      }
      else {
        this.currentPlanTitle = 'Basic Plan (monatlich kündbar)';
        this.currentPlanPrice = '€9';
  
        if (this.dataService.currentUser.stripeCancelAt) {
          //consider if stripeCancelAt is 0 --> then show different text
          if (this.calculateDaysLeft(this.dataService.currentUser.stripeCancelAt, false) == 0) {
            this.planInformationText = 'Du hast dein Abo bei uns beendet. Du kannst unsere Plattform nur mehr heute nutzen.';
          } else {
            this.planInformationText = 'Du hast dein Abo bei uns beendet. Du kannst unsere Plattform noch ' + this.calculateDaysLeft(this.dataService.currentUser.stripeCancelAt, false) + ' Tage nutzen.';
          }
        } else {
          // consider if stripeCurrentPeriodEnd is 0 --> then show different text
          if (this.calculateDaysLeft(this.dataService.currentUser.stripeCurrentPeriodEnd, false) == 0) {
            this.planInformationText = 'Dein Abo wird heute abgebucht.';
          } else {
            this.planInformationText = 'Du hast noch ' + this.calculateDaysLeft(this.dataService.currentUser.stripeCurrentPeriodEnd, true) + ' Tage bis zur nächsten Abrechnung.';
          }
        }
      }
    }
  }

  ngOnInit(): void {
  }

  calculateDaysLeft(endDate: string, addAMonth: boolean): number {
    if (addAMonth) {
      const date = new Date(endDate);
      date.setMonth(date.getMonth() + 1);
      endDate = date.toISOString();
    }

    const currentDate = new Date();
    const planEnd = new Date(endDate);
    const timeDiff = planEnd.getTime() - currentDate.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  }

  unsubscribe() {
    this.dataService.cancelSubscription().then(() => {
      this.showUnsubscribeModal = false;
      this.dataService.getCurrentUserPromise().then((user: any) => {
        this.setText();
      });
    });
  }

  subscribe() {
      this.dataService.checkout().subscribe({
      next: (response: any) => {
        if (response && response.url) {
          window.location.href = response.url;
        } else {
          this.errorMessage = 'Checkout-URL ist nicht verfügbar.';
        }
      },
      error: (error) => {
        this.errorMessage = 'Fehler beim Erstellen der Checkout-Session: ' + error.message;
      }
    }); 
  }

  getInvoices() {
    this.dataService.getInvoices().then((invoices: any) => {
      console.log(invoices);
      this.invoices = invoices;
    });
  }
}

