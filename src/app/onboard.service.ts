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
      const subscriptionType = user?.subscriptionType;
      const subscribeDate = user?.subscribeDate ? new Date(user.subscribeDate) : null;

      // 1) Wenn Ziel = /setup
      if (url === '/setup/profile' || url === '/setup/card' || url === '/setup/form' || url === '/setup/flyer') {
        // Wenn Profil schon komplett → zurück zum Dashboard
        if (profileComplete && firstProgramAdded) {
          this.router.navigate(['/']);
          return false;
        }

        // Profil unvollständig → Zugriff auf /setup erlauben
        return true;
      }

      // 2) Wenn Ziel = /subscription
      if (url === '/subscription') {
        // kein Abo → Zugriff erlauben (User soll subscriben)
        if (!subscriptionType) return true;

        // trial → prüfen ob abgelaufen
        if (subscriptionType === 'trial' && subscribeDate) {
          const diffDays = Math.ceil(Math.abs(Date.now() - subscribeDate.getTime()) / (1000 * 60 * 60 * 24));
          if (diffDays > 14) {
            // trial abgelaufen → erlaubt, damit er subscriben kann
            return true;
          } else {
            // trial noch aktiv → zurück zum Dashboard
            this.router.navigate(['/']);
            return false;
          }
        }

        // subscriptionType ist 'basic' (oder anderes aktives Abo) → kein Zugriff auf /subscription
        this.router.navigate(['/']);
        return false;
      }

      // 3) Für alle anderen App-Routen: require profile + valid subscription
      if (!profileComplete) {
        this.router.navigate(['/setup/profile']);
        return false;
      }

      if (!firstProgramAdded) {
        this.router.navigate(['/setup/card']);
        return false;
      }

      if (!subscriptionType) {
        this.router.navigate(['/subscription']);
        return false;
      }

      if (subscriptionType === 'trial' && subscribeDate) {
        const diffDays = Math.ceil(Math.abs(Date.now() - subscribeDate.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays > 14) {
          this.router.navigate(['/subscription']);
          return false;
        }
      }

      // alles ok
      return true;
    }).catch(err => {
      console.error('OnboardGuard Fehler', err);
      // falls getCurrentUser fehlschlägt, zurück zur Anmeldung
      this.router.navigate(['/signin']);
      return false;
    });
  }
}
