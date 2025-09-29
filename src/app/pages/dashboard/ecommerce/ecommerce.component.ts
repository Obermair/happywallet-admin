import { Component } from '@angular/core';
import { EcommerceMetricsComponent } from '../../../shared/components/ecommerce/ecommerce-metrics/ecommerce-metrics.component';
import { MonthlySalesChartComponent } from '../../../shared/components/ecommerce/monthly-sales-chart/monthly-sales-chart.component';
import { MonthlyTargetComponent } from '../../../shared/components/ecommerce/monthly-target/monthly-target.component';
import { StatisticsChartComponent } from '../../../shared/components/ecommerce/statics-chart/statics-chart.component';
import { DemographicCardComponent } from '../../../shared/components/ecommerce/demographic-card/demographic-card.component';
import { RecentOrdersComponent } from '../../../shared/components/ecommerce/recent-orders/recent-orders.component';
import { DataService } from '../../../data.service';
import { cos } from '@amcharts/amcharts5/.internal/core/util/Math';
import { SafeHtmlPipe } from '../../../shared/pipe/safe-html.pipe';
import {
  ApexNonAxisChartSeries,
  ApexChart,
  ApexPlotOptions,
  ApexFill,
  ApexStroke,
  ApexOptions,
  NgApexchartsModule,
} from 'ng-apexcharts';


@Component({
  selector: 'app-ecommerce',
  imports: [
    MonthlySalesChartComponent,
    RecentOrdersComponent,
    SafeHtmlPipe,
    NgApexchartsModule
  ],
  templateUrl: './ecommerce.component.html',
})
export class EcommerceComponent  {

  currentStampCardsCount = 0;
  currentLoyaltyProgramsCount = 0;
  currentCustomersCount = 0;

  stampCardsCompleted = 0;
  stampCardPercentage = 0;

  public fill: ApexFill = {
    type: 'solid',
    colors: ['#c38e70'],
  };

  public stroke: ApexStroke = {
    lineCap: 'round',
  };

  public series: ApexNonAxisChartSeries = [0];
  public chart: ApexChart = {
    fontFamily: 'Outfit, sans-serif',
    type: 'radialBar',
    height: 330,
    sparkline: { enabled: true },
  };

  public labels: string[] = ['Progress'];
  public colors: string[] = ['#465FFF'];

  constructor(public dataService: DataService) {
  }

  ngOnInit() {
    const userId = localStorage.getItem('jwt_user_id');
    if (userId) {
      this.dataService.getCurrentLoyaltyProgramsCount(userId).then((count: number) => {
        this.currentLoyaltyProgramsCount = count;
      });

      this.dataService.getCurrentCustomersCount().then((count: any) => {
        this.currentCustomersCount = count;
      });

      this.dataService.getCompletedStampCardsStats(userId).then((data: any) => {
        this.stampCardsCompleted = data.completed;
        this.stampCardPercentage = data.percentage;
        this.currentStampCardsCount = data.total;

        this.series = [this.stampCardPercentage];
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

  public plotOptions: ApexPlotOptions = {
    radialBar: {
      startAngle: -85,
      endAngle: 85,
      hollow: { size: '80%' },
      track: {
        background: '#E4E7EC',
        strokeWidth: '100%',
        margin: 5,
      },
      dataLabels: {
        name: { show: false },
        value: {
          fontSize: '36px',
          fontWeight: '600',
          offsetY: -40,
          color: '#1D2939',
          formatter: (val: number) => `${val}%`,
        },
      },
    },
  };



}


