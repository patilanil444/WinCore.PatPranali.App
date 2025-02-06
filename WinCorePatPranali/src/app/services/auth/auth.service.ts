import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable } from 'rxjs';
import { UserService } from '../users/user.service';
import { jwtDecode } from 'jwt-decode';
import { UiUser } from 'src/app/common/models/common-ui-models';
import { SharedService } from '../shared.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  //private apiUrl = `${environment.apiUrl}/auth`; // Your API base URL
  authSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(this.isAuthenticated());
  private currentUser: any;

  constructor(private http: HttpClient, private _userService: UserService, private _sharedService: SharedService) { }

  // Get the current authentication state
  get isAuthenticated$(): Observable<boolean> {
    return this.authSubject.asObservable();
  }

  // Store JWT and refresh token in localStorage
  storeTokens(accessToken: string, refreshToken: string) {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  }

  decodeToken(accessToken: string) {
    if (!this.isTokenExpired(accessToken)) {
      let decodedToken: any = this.getDecodedToken(accessToken);
      if (decodedToken) {
        let userData = JSON.parse(decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/userdata']);

        let loggedInUser: UiUser = {
          id: userData.Id,
          name: userData.name,
          branchId: userData.BranchCode,
          userName: userData.UserName,
          emailId: userData.EmailId,
          authority: userData.Authority,
          access: userData.Access,
          transferLimit: userData.Transfer_Limit,
          cashRect: userData.Cash_Rect,
          cashPayt: userData.Cash_Payt,
          passRect: userData.Pass_Rect,
          passPayt: userData.Pass_Payt,
          todayAccess: userData.TodayAccess,
          todayCashRect: userData.Today_Cash_Rect,
          todayCashPayt: userData.Today_Cash_Payt,
          todayPassRect: userData.Today_Pass_Rect,
          todayPassPayt: userData.Today_Pass_Payt,
          allowAdd: userData.AllowAdd,
          allowChange: userData.AllowChange,
          allowDelete: userData.AllowDelete,
          allowList: userData.AllowList,
          userLocked: userData.IsUserLocked,
          isSuperUser: userData.IsSuperUser
        }

        this._sharedService.applicationUser = loggedInUser;
      }
    }
    else {
      this.refreshToken();
    }

  }

  isTokenExpired(accessToken: string): boolean {
    const decoded = this.getDecodedToken(accessToken);
    if (decoded && decoded.exp) {
      const currentTime = Math.floor(Date.now() / 1000); // Current Unix timestamp
      return decoded.exp < currentTime;
    }
    return false;
  }

  private getDecodedToken(accessToken: string) {
    return jwtDecode(accessToken);
  }

  // Get the access token from localStorage
  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  // Login method: authenticate user and store tokens
  login(loginModel: any): any {
    this._userService.authenticateUser(loginModel).subscribe((response: any) => {
      let responseData: any = {};
      if (response && response.data.data.data) {
        responseData = response.data.data.data;
        this.storeTokens(responseData.token, responseData.refreshToken);
        this.authSubject.next(true);
      }
      else {
        this.authSubject.next(false);
      }
      return responseData;
    });
  }

  // Check if user is authenticated (based on stored token)
  isAuthenticated(): boolean {
    const token = this.getAccessToken();
    return !!token;
  }

  // Logout user and remove tokens
  logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    this.authSubject.next(false);
  }

  // Refresh the access token using the refresh token
  refreshToken() {
    return new Promise((resolve, reject) => {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    let refreshModel = {
      Token: accessToken,
      RefreshToken: refreshToken
    };

    this._userService.refreshUserToken(refreshModel).subscribe((response: any) => {
      if (response) {
        let responseData = response.data;
        this.storeTokens(responseData.token, responseData.refreshToken);
        this.authSubject.next(true);

        resolve(true);
      }
      else {
        this.authSubject.next(false);

        resolve(false);
      }
    });
  });
  }

  getApplicationUser()
  {
    return this._sharedService.applicationUser;
  }
}
