import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse,
  HttpStatusCode
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize, map, switchMap } from 'rxjs/operators';
import { SharedService } from 'src/app/services/shared.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth/auth.service';

@Injectable()
export class LoaderInterceptor implements HttpInterceptor {

  constructor(private _sharedService: SharedService, private _authService: AuthService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    this._sharedService.showLoader();
    let accessToken = this._authService.getAccessToken();
    // if (this._authService.isTokenExpired(accessToken ? accessToken : "")) {
    //   this._authService.refreshToken();
    //   accessToken = this._authService.getAccessToken();
    // }

    // Clone the request and add the Authorization header
    if (accessToken) {
      request = request.clone({
        setHeaders: { Authorization: `Bearer ${accessToken}` }
      });
    }

    return next.handle(request).pipe(
      finalize(() => this._sharedService.hideLoader()),
      catchError((error) => {
        if (error.status === 401) {  // Token expired or invalid
          console.log("API error code 401!");
          if (!this._authService.isTokenExpired(accessToken ? accessToken : "")) {
            let token = localStorage.getItem("accessToken");
            const clonedReqWithNewToken = request.clone({
              setHeaders: {
                Authorization: `Bearer ${token}`
              }
            });
            return next.handle(clonedReqWithNewToken);
          }
          else
          {
            console.log("Requested token refresh!");
            this._authService.refreshToken();
            let token = localStorage.getItem("accessToken");
            const clonedReqWithNewToken = request.clone({
              setHeaders: {
                Authorization: `Bearer ${token}`
              }
            });
            return next.handle(clonedReqWithNewToken);
          }
        } else {
          return throwError(error);
        }
      })
    );
  }
}