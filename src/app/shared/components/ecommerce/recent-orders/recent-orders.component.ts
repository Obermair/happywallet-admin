// import { CommonModule } from '@angular/common';
// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-recent-orders',
//   imports: [CommonModule],
//   templateUrl: './recent-orders.component.html',
//   styleUrl: './recent-orders.component.css'
// })
// export class RecentOrdersComponent {

// }


import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { BadgeComponent } from '../../ui/badge/badge.component';
import { DataService } from '../../../../data.service';
import { AvatarTextComponent } from '../../ui/avatar/avatar-text.component';


@Component({
  selector: 'app-recent-orders',
  imports: [
    CommonModule,
    AvatarTextComponent,
    BadgeComponent
  ],
  templateUrl: './recent-orders.component.html'
})
export class RecentOrdersComponent {

  lastFiveCustomers: any[] = [
    // Example structure of customer data
    // { customerName: 'John Doe', customerEmail: 'john.doe@example.com' }
    { customerName: 'John Doe', customerEmail: 'john.doe@example.com' },
    { customerName: 'Jane Smith', customerEmail: 'jane.smith@example.com' },
    { customerName: 'Alice Johnson', customerEmail: 'alice.johnson@example.com' },
    { customerName: 'Bob Brown', customerEmail: 'bob.brown@example.com' },
    { customerName: 'Charlie Davis', customerEmail: 'charlie.davis@example.com' }
  ];

  constructor(public dataService: DataService) { }
  
   ngOnInit(): void {
      const userId = localStorage.getItem('jwt_user_id');
      if (userId) {
        this.dataService.getLastFiveCustomers(userId).then((data: any) => {
          this.lastFiveCustomers = data;

          // order by updatedAt descending
          this.lastFiveCustomers.sort((a, b) => {
            return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
          });
        });
      }
      else {
        console.warn('jwt_user_id not found in localStorage');
      }
    }

    formatdate(dateString: string): string {
      //you get datestring and i want to format it to vor 10 min, oder vor 2 stunden, oder vor 3 tagen
      const date = new Date(dateString);
      const now = new Date();
      const diff = now.getTime() - date.getTime(); // difference in milliseconds

      const minutes = Math.floor(diff / (1000 * 60));
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));

      if (minutes < 1) {
        return 'gerade eben';
      } else if (minutes < 60) {
        return `vor ${minutes} ${minutes === 1 ? 'Minute' : 'Minuten'}`;
      } else if (hours < 24) {
        return `vor ${hours} ${hours === 1 ? 'Stunde' : 'Stunden'}`;
      } else {
        return `vor ${days} ${days === 1 ? 'Tag' : 'Tagen'}`;
      } 
    }


    getColorForLastInteraction(dateString: string) {
      const date = new Date(dateString);
      const now = new Date();
      const diff = now.getTime() - date.getTime(); // difference in milliseconds

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));

      if (days <= 7) {
        return 'success'; 
      } else if (days <= 30) {
        return 'warning'; 
      } else {
        return 'error';
      }
    }
}