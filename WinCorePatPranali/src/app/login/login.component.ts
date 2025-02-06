import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/users/user.service';
import { ToastrService } from 'ngx-toastr';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { jwtDecode } from "jwt-decode";
import { log } from 'console';
import { UiUser } from '../common/models/common-ui-models';
import { SharedService } from '../services/shared.service';
import { AuthService } from '../services/auth/auth.service';
import { catchError, throwError } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  loginForm!: FormGroup;
  constructor(private router: Router, private _authService: AuthService, private _toastrService: ToastrService,
    private _sharedService: SharedService, private _userService: UserService) { }

  ngOnInit(): void {

    this.loginForm = new FormGroup({
      userName: new FormControl("", [Validators.required]),
      password: new FormControl("", [Validators.required]),
    });
  }


  login() {
    if (this.userName.value && this.password.value) {
      if (this.userName.value.trim().length > 0 && this.password.value.trim().length > 0) {

        let loginModel = {
          UserName: this.userName.value.trim(),
          Password: this.password.value.trim()
        };

        this._userService.authenticateUser(loginModel).pipe(
          catchError(error => {
            if (error.status === 401) {
              this._toastrService.error('Unauthorised login. Enter valid credentials', 'Error!');
            }
            return throwError(() => new Error('Oops! Something went wrong. Please try again later.'));
          })
        ).subscribe((response: any) => {
          if (response && response.data.data.data) {
            let responseData = response.data.data.data;
            if (responseData.token) {
              this._authService.storeTokens(responseData.token, responseData.refreshToken);
              this._authService.authSubject.next(true);
              this.configClick("home");
            }
           else{
            this._toastrService.error('Invalid credentials.', 'Error!');
           }
          }
          else {
            this._authService.authSubject.next(false);
            this._toastrService.error('Invalid credentials.', 'Error!');
          }
        })
      }
      else {
        this._toastrService.error('Please enter incorrect credentials.', 'Error!');
      }
    }
    else
    {
      this._toastrService.error('Please enter credentials.', 'Error!');
    }
  }

  configClick(routeValue: string) {
    sessionStorage.setItem("configMenu", routeValue);
    this.router.navigate(['/app/' + routeValue]);
  }

  get userName() {
    return this.loginForm.get('userName')!;
  }

  get password() {
    return this.loginForm.get('password')!;
  }
}


