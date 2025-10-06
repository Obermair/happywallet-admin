import { Component } from '@angular/core';
import { DataService } from '../../data.service';

@Component({
  selector: 'app-subscription',
  imports: [],
  templateUrl: './subscription.component.html',
  styleUrl: './subscription.component.css'
})
export class SubscriptionComponent {
  
  headline: string = 'Dein Setup ist fast abgeschlossen!';
  subline: string = 'Teste unseren Service jetzt 14 Tage kostenlos.';


  constructor(public dataService: DataService) { 
    if (!this.dataService.currentUser) {
      this.dataService.getCurrentUserPromise().then(() => {
        this.setText();
      });
    }
    else {
      this.setText();
    }
  }

  setText() {
    // wenn subscriptionType == null oder subscriptionType == trial und subscriptionDate ist weniger als 14 tage her
    if (this.dataService.currentUser?.subscriptionType === 'trial') {
      const subscriptionDate = new Date(this.dataService.currentUser?.subscriptionDate);
      const currentDate = new Date();
      const diffTime = Math.abs(currentDate.getTime() - subscriptionDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
      if (diffDays <= 14) {
        this.trialMode();
      }
      else {
        this.paidMode();
      }
    }
    else {
      this.trialMode();
    }
  }

  trialMode() {
    this.headline = 'Dein Setup ist fast abgeschlossen!';
    this.subline = 'Teste unseren Service jetzt 14 Tage kostenlos.';
  }

  paidMode() {
    this.headline = 'Deine 14 Tage Testphase ist beendet!';
    this.subline = 'Wähle jetzt unseren Basic Plan, um unseren Service weiter zu nutzen.';
  }
}
