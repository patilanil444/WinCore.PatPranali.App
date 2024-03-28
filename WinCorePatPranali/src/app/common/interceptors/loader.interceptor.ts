import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse,
  HttpStatusCode
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import { SharedService } from 'src/app/services/shared.service';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class LoaderInterceptor implements HttpInterceptor {
  
  constructor(private _sharedService: SharedService, private _toastrService: ToastrService) {}
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    this._sharedService.showLoader();
    return next.handle(request).pipe(
      finalize(() => this._sharedService.hideLoader()),
      catchError((err :HttpErrorResponse) => {
        this._toastrService.error(err.message, 'Error!');
        throw err;
      })
    );
  }
}