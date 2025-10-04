import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DataService } from '../../data.service';

@Component({
  selector: 'app-email-confirmation',
  template: `<p>{{ message }}</p>`
})
export class EmailConfirmedComponent implements OnInit {
  message = 'Confirming your email...';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private dataService: DataService
  ) {}

  ngOnInit() {
    const savedUser = JSON.parse(localStorage.getItem('registerUser') || '{}');

    console.log('Saved user from localStorage:', savedUser);

    if (savedUser?.email && savedUser?.password) {
      this.dataService.signIn(savedUser.email, savedUser.password).then((user) => {
        this.router.navigate(['/']);
      }).catch(() => {
        this.message = 'Email bestätigt, aber die automatische Anmeldung ist fehlgeschlagen. Bitte melden Sie sich manuell an.';
      });
    } else {
      this.message = 'Email bestätigt! Bitte melden Sie sich an.';
      this.router.navigate(['/signin']);
    }
  }
}
