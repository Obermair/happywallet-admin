import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../data.service';

@Component({
  selector: 'app-google-callback',
  imports: [],
  template: `<p>Google Anmeldung wird verarbeitet...</p>`,
  styleUrl: './google-callback.component.css'
})
export class GoogleCallbackComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private dataService: DataService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.http.get(this.dataService.apiUrl + '/api/auth/google/callback?', { params, withCredentials: true })
        .subscribe({
          next: (response) => {
            window.opener?.postMessage(response, window.location.origin);
            window.close();
          },
          error: () => {
            window.close();
          }
        });
    });
  }

}

