import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobleDeclarations } from 'src/app/common/globle-declarations';

@Injectable({
  providedIn: 'root'
})
export class BranchMasterService {
  serviceBaseURL = "";
  constructor(private http: HttpClient) { }

  getBranches() {
    let options = GlobleDeclarations.getHeaderOptions();
    return this.http.get(GlobleDeclarations.apiBaseURL + "api/branch/branches", options);
  }

  getBranch(id: number): any {
    let options = GlobleDeclarations.getHeaderOptions();
    return this.http.get(GlobleDeclarations.apiBaseURL + "api/branch/branch?id=" + id, options);
  }

  createBranch(branchModel: any): any {
    let options = GlobleDeclarations.getHeaderOptions();
    return this.http.post(GlobleDeclarations.apiBaseURL + "api/branch/create-branch", branchModel, options);
  }

  updateBranch(id: number, branchModel: any): any {
    let options = GlobleDeclarations.getHeaderOptions();
    return this.http.post(GlobleDeclarations.apiBaseURL + "api/branch/update-branch?id=" + id, branchModel, options);
  }

  deleteBranch(id: number): any {
    let options = GlobleDeclarations.getHeaderOptions();
    return this.http.post(GlobleDeclarations.apiBaseURL + "api/branch/delete-branch?id=" + id, options);
  }

  getStates() {
    let options = GlobleDeclarations.getHeaderOptions();
    return this.http.get(GlobleDeclarations.apiBaseURL + "api/common/states", options);
  }

  getDistricts() {
    let options = GlobleDeclarations.getHeaderOptions();
    return this.http.get(GlobleDeclarations.apiBaseURL + "api/common/districts", options);
  }

  getTahshils() {
    let options = GlobleDeclarations.getHeaderOptions();
    return this.http.get(GlobleDeclarations.apiBaseURL + "api/common/tahshils", options);
  }
}
