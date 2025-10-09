import { Component } from '@angular/core';
import { GridShapeComponent } from '../../shared/components/common/grid-shape/grid-shape.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-payment-failed',
  imports: [
    GridShapeComponent,
    RouterModule,],
  templateUrl: './payment-failed.component.html',
  styleUrl: './payment-failed.component.css'
})
export class PaymentFailedComponent {
  currentYear: number = new Date().getFullYear();
}
