import { Component } from '@angular/core';
import { EcommerceMetricsComponent } from '../../../shared/components/ecommerce/ecommerce-metrics/ecommerce-metrics.component';
import { MonthlySalesChartComponent } from '../../../shared/components/ecommerce/monthly-sales-chart/monthly-sales-chart.component';
import { MonthlyTargetComponent } from '../../../shared/components/ecommerce/monthly-target/monthly-target.component';
import { StatisticsChartComponent } from '../../../shared/components/ecommerce/statics-chart/statics-chart.component';
import { DemographicCardComponent } from '../../../shared/components/ecommerce/demographic-card/demographic-card.component';
import { RecentOrdersComponent } from '../../../shared/components/ecommerce/recent-orders/recent-orders.component';
import { DataService } from '../../../data.service';
import { cos } from '@amcharts/amcharts5/.internal/core/util/Math';

@Component({
  selector: 'app-ecommerce',
  imports: [
    EcommerceMetricsComponent,
    MonthlySalesChartComponent,
    MonthlyTargetComponent,
    StatisticsChartComponent,
    DemographicCardComponent,
    RecentOrdersComponent,
  ],
  templateUrl: './ecommerce.component.html',
})
export class EcommerceComponent  {

  currentStampCardsCount = 0;
  currentLoyaltyProgramsCount = 0;
  currentCustomersCount = 0;

  stampCardsCompleted = 0;
  stampCardPercentage = 0;


  constructor(public dataService: DataService) {
  }

  ngOnInit() {
    const userId = localStorage.getItem('jwt_user_id');
    if (userId) {
      this.dataService.getCurrentLoyaltyProgramsCount(userId).then((count: number) => {
        this.currentLoyaltyProgramsCount = count;
        console.log('Aktuelle Anzahl der Treueprogramme:', count);
      });

      this.dataService.getCurrentCustomersCount().then((count: any) => {
        this.currentCustomersCount = count;
        console.log('Aktuelle Anzahl der Kunden:', count);
      });

      this.dataService.getCompletedStampCardsStats(userId).then((data: any) => {
        this.stampCardsCompleted = data.completed;
        this.stampCardPercentage = data.percentage;
        this.currentCustomersCount = data.total;
        console.log('Aktuelle Anzahl der vergebenen Stempelkarten:', data.total);
        console.log('Anzahl der abgeschlossenen Stempelkarten:', data.completed);
        console.log('Prozentsatz der abgeschlossenen Stempelkarten:', data.percentage);
      });

      this.dataService.getProgramUsersByMonth(userId).then((data: any) => {
        console.log('Nutzer pro Monat:', data);
      });

      this.dataService.getLastFiveCustomers(userId).then((data: any) => {
        console.log('Letzte 5 Kunden:', data);
      });

    } else {
      console.warn('jwt_user_id not found in localStorage');
      this.currentStampCardsCount = 0;
      this.currentLoyaltyProgramsCount = 0;
      this.currentCustomersCount = 0;
    }
  }

}


