import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, Route } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router, private _toastrService: ToastrService) {}

  canActivate(): boolean {
    return this.checkAuth();
  }

  canActivateChild(): boolean {
    return this.checkAuth();
  }

  canLoad(): boolean {
    return this.checkAuth();
  }

  private checkAuth(): boolean {
    if (this.authService.isAuthenticated()) {
      this.authService.decodeToken(this.authService.getAccessToken()!);

      let appUser = this.authService.getApplicationUser();
      if (appUser.isSuperUser || (!appUser.userLocked && appUser.todayAccess > 0)) {
        return true;
      }
      else {
        this._toastrService.error('Please unlock user access for today.', 'Error!');
        return false;
      }
    } else {
      // Redirect to the login page if the user is not authenticated
      this.router.navigate(['/login']);
      return false;
    }
  }

}
