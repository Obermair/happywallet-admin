import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { DataService } from './data.service';

@Injectable({ providedIn: 'root' })
export class OnboardGuardService implements CanActivate {
  constructor(private router: Router, private dataService: DataService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    const url = state.url;

    return this.dataService.getCurrentUserPromise().then((user: any) => {
      const profileComplete = !!(user?.shopLogo?.url && user?.username);
      const firstProgramAdded = user?.loyalty_programs && user.loyalty_programs.length > 0;
      const subscriptionStatus = user?.subscriptionStatus;
      
      // 1) Wenn Ziel = /setup
      if (url === '/setup/profile' || url === '/setup/card' || url === '/setup/form' || url === '/setup/flyer') {
        // Wenn Profil schon komplett → zurück zum Dashboard
        if (profileComplete && firstProgramAdded) {
          if (subscriptionStatus === 'active' || subscriptionStatus === 'trialing') {
            this.router.navigate(['/']);
            return false;
          } 
          if (subscriptionStatus === 'canceled') {
            this.router.navigate(['/subscription']);
            return false;
          }
          if (!subscriptionStatus) {
            this.router.navigate(['/subscription']);
            return false;
          }
        }
        // Profil unvollständig → Zugriff auf /setup erlauben
        return true;
      }
      
      // 2) Wenn Ziel = /subscription
      if (url === '/subscription') {
        // Wenn Profil unvollständig → weiter zu /setup/profile
        if (!profileComplete || !firstProgramAdded) {
          this.router.navigate(['/setup/profile']);
          return false;
        }
        // Profil komplett, aber kein aktives Abo → Zugriff auf /subscription erlauben
        if (subscriptionStatus !== 'active' && subscriptionStatus !== 'trialing') {
          return true;
        }
        // Profil komplett und aktives Abo → zurück zum Dashboard
        this.router.navigate(['/']);
        return false;
      }
      // 3) Wenn Ziel = /
      if (url === '/') {
        // Wenn Profil unvollständig → weiter zu /setup/profile
        if (!profileComplete || !firstProgramAdded) {
          this.router.navigate(['/setup/profile']);
          return false;
        }
        // Profil komplett, aber kein aktives Abo → weiter zu /subscription
        if (subscriptionStatus !== 'active' && subscriptionStatus !== 'trialing') {
          this.router.navigate(['/subscription']);
          return false;
        }
        // Profil komplett und aktives Abo → Zugriff auf Dashboard erlauben
        return true;
      }
      
      // 4) Alle anderen URLs
      // Wenn Profil unvollständig → weiter zu /setup/profile
      if (!profileComplete || !firstProgramAdded) {
        this.router.navigate(['/setup/profile']);
        return false;
      }
      // Profil komplett, aber kein aktives Abo → weiter zu /subscription
      if (subscriptionStatus !== 'active' && subscriptionStatus !== 'trialing') {
        this.router.navigate(['/subscription']);
        return false;
      }

      // Profil komplett und aktives Abo → Zugriff erlauben
      return true;
    }).catch(err => {
      console.error('OnboardGuard Fehler', err);
      // falls getCurrentUser fehlschlägt, zurück zur Anmeldung
      this.router.navigate(['/signin']);
      return false;
    });
  }
}
