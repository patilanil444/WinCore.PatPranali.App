import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, Route } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UiUserRole } from '../models/common-ui-models';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router, private _toastrService: ToastrService) { }

  canActivate(next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    const currentUrl = state.url;
    const requiredRoles = next.data['roles'];
    return this.checkAuth(currentUrl, requiredRoles);
  }

  isAdminUserFeature(currentUrl: string) {
    return currentUrl.includes("user-search") || currentUrl.includes("user") ||
      currentUrl.includes("role-access") || currentUrl.includes("daily-role") ||
      currentUrl.includes("activity");
  }

  canActivateChild(next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    const currentUrl = state.url;
    return this.checkAuth(currentUrl);
  }

  canLoad(next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    const currentUrl = state.url;
    return this.checkAuth(currentUrl);
  }

  private checkAuth(currentUrl: string, requiredRoles: any = null): boolean {
    if (this.authService.isAuthenticated()) {
      this.authService.decodeToken(this.authService.getAccessToken()!);

      let appUser = this.authService.getApplicationUser();
      if (appUser != null) {
        if (appUser.userLocked) {
          // If user account is locked
          if (appUser.isSuperUser) {
            return true;
          }
          else if ((appUser.todayAccess == UiUserRole.MANAGER || appUser.todayAccess == UiUserRole.GENERAL_MANAGER) &&
            this.isAdminUserFeature(currentUrl)) {
            return true;
          }
          else {
            this._toastrService.warning('Please unlock user access for today.', 'Warning!');
            return false;
          }
        }
        else {

          if (requiredRoles != null && requiredRoles.length > 0) {
            if (requiredRoles.includes(appUser.todayAccess)) {
              return true;
            }
          }
          this._toastrService.warning('Access to this feature is not allowed. Please contact branch manager.', 'Warning!');
          return false;
        }
      }
      else {
        this.router.navigate(['/login']);
        return false;
      }
    } else {
      // Redirect to the login page if the user is not authenticated
      this.router.navigate(['/login']);
      return false;
    }
  }
}
