import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DataService } from './data.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'happywallet - your digital loyalty card';

  constructor(public dataService: DataService) {}

}
