import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobleDeclarations } from 'src/app/common/globle-declarations';

@Injectable({
  providedIn: 'root'
})
export class SystemProfileService {
  serviceBaseURL = "";
  constructor(private http: HttpClient) { }

  getSystemProfile(branchId: number): any {
    let options = GlobleDeclarations.getHeaderOptions();
    return this.http.get(GlobleDeclarations.apiBaseURL + "api/SystemProfile/system-profile?branchId=" + branchId, options);
  }

  createSystemProfile(systemProfileModel: any): any {
    let options = GlobleDeclarations.getHeaderOptions();
    return this.http.post(GlobleDeclarations.apiBaseURL + "api/SystemProfile/create-system-profile", systemProfileModel, options);
  }

  updateSystemProfile(id: number, systemProfileModel: any): any {
    let options = GlobleDeclarations.getHeaderOptions();
    return this.http.post(GlobleDeclarations.apiBaseURL + "api/SystemProfile/update-system-profile?id=" + id, systemProfileModel, options);
  }
}
