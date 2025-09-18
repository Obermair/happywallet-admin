import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class AuthGuardService  {
  constructor(private router: Router) {}
  canActivate(): boolean {
    if (localStorage.getItem('jwt_token') == null) {
      this.router.navigate(['/signin']);
      return false;
    }
    return true;
  }
}
