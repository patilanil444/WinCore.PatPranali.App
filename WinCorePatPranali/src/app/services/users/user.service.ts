import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { GlobleDeclarations } from 'src/app/common/globle-declarations';
import { IGeneralDTO } from 'src/app/common/models/common-ui-models';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  serviceBaseURL = "";

  userIdToDelete = -1;

  jwtToken: string= "";
  refreshToken: string = "";

  constructor(private http: HttpClient) { }

  private dto = new BehaviorSubject<IGeneralDTO>({} as IGeneralDTO);
  setDTO(object: any) {
    this.dto.next(object);
  }
  getDTO() {
    return this.dto.asObservable();
  }

  getUsers(branchCode: number) {
    let options = GlobleDeclarations.getHeaderOptions();
    return this.http.get(GlobleDeclarations.apiBaseURL + "api/User/users?branchCode=" + branchCode, options);
  }

  getUser(branchCode: number, userId: number): any {
    let options = GlobleDeclarations.getHeaderOptions();
    return this.http.get(GlobleDeclarations.apiBaseURL + "api/User/user?branchCode=" + branchCode + "&id=" + userId, options);
  }

  saveUser(userModel: any): any {
    let options = GlobleDeclarations.getHeaderOptions();
    return this.http.post(GlobleDeclarations.apiBaseURL + "api/User/save-user", userModel, options);
  }

  saveUsersTodaysRole(userModel: any): any {
    let options = GlobleDeclarations.getHeaderOptions();
    return this.http.post(GlobleDeclarations.apiBaseURL + "api/User/update-todays-role", userModel, options);
  }

  deleteUser(branchCode: number, userId: number): any {
    let options = GlobleDeclarations.getHeaderOptions();
    return this.http.post(GlobleDeclarations.apiBaseURL + "api/User/delete-user?branchCode=" + branchCode + "&id=" + userId, options);
  }

  isUserNameExists(userName: string): any {
    let options = GlobleDeclarations.getHeaderOptions();
    return this.http.get(GlobleDeclarations.apiBaseURL + "api/User/check-username?username=" + userName, options);
  }

  getUserRoles(): any {
    let options = GlobleDeclarations.getHeaderOptions();
    return this.http.get(GlobleDeclarations.apiBaseURL + "api/User/user-roles", options);
  }

  getModules(): any {
    let options = GlobleDeclarations.getHeaderOptions();
    return this.http.get(GlobleDeclarations.apiBaseURL + "api/User/access-modules", options);
  }

  authenticateUser(userModel: any): any {
    let options = GlobleDeclarations.getHeaderOptions();
    return this.http.post(GlobleDeclarations.apiBaseURL + "api/User/authenticate-user", userModel, options);
  }

  unlockUser(unlockModel: any): any {
    let options = GlobleDeclarations.getHeaderOptions();
    return this.http.post(GlobleDeclarations.apiBaseURL + "api/User/unlock-user", unlockModel, options);
  }

  refreshUserToken(tokenModel: any): any {
    let options = GlobleDeclarations.getHeaderOptions();
    return this.http.post(GlobleDeclarations.apiBaseURL + "api/User/refresh-token", tokenModel, options);
  }
  
}
