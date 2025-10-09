import { Component } from '@angular/core';
import { DataService } from '../../data.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { AlertComponent } from '../../shared/components/ui/alert/alert.component';

@Component({
  selector: 'app-subscription',
  imports: [CommonModule],
  templateUrl: './subscription.component.html',
  styleUrl: './subscription.component.css'
})
export class SubscriptionComponent {
  
  headline: string = 'Dein Setup ist fast abgeschlossen!';
  subline: string = 'Teste unseren Service jetzt 14 Tage kostenlos.';
  isTrialAvailable: boolean = false;
  errorMessage: string = '';

  constructor(public dataService: DataService, private route: ActivatedRoute) { 
    if (!this.dataService.currentUser) {
      this.dataService.getCurrentUserPromise().then(() => {
        this.init();
      });
    }
    else {
      this.init();
    }
  }

  init() {
    if (!this.dataService.currentUser?.subscriptionStatus) {
      this.headline = 'Dein Setup ist fast abgeschlossen!';
      this.subline = 'Teste unseren Service jetzt 14 Tage kostenlos.';
      this.isTrialAvailable = true;
    }
    else {
      if (this.dataService.currentUser?.subscriptionStatus === 'canceled') {
        this.headline = 'Dein Abo ist leider gekündigt.';
        this.subline = 'Möchtest du dein Abo reaktivieren?';
        this.isTrialAvailable = false;
      }
    }
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
}
