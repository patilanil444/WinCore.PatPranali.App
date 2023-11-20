import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobleDeclarations } from 'src/app/common/globle-declarations';

@Injectable({
  providedIn: 'root'
})
export class GeneralMasterService {

  serviceBaseURL = "";
  constructor(private http: HttpClient) { }

  getMastersList() {
    let options = GlobleDeclarations.getHeaderOptions();
    return this.http.get(GlobleDeclarations.apiBaseURL + "api/GeneralMaster/master-list", options);
  }

  getAllGeneralMasters(branchGeneralMasterModel: any) {
    let options = GlobleDeclarations.getHeaderOptions();
    return this.http.post(GlobleDeclarations.apiBaseURL + "api/GeneralMaster/all-general-masters", branchGeneralMasterModel, options);
  }

  getGeneralMaster(id: number): any {
    let options = GlobleDeclarations.getHeaderOptions();
    return this.http.get(GlobleDeclarations.apiBaseURL + "api/GeneralMaster/general-master?id=" + id, options);
  }

  createGeneralMaster(branchGeneralMasterModel: any): any {
    let options = GlobleDeclarations.getHeaderOptions();
    return this.http.post(GlobleDeclarations.apiBaseURL + "api/GeneralMaster/create-master", branchGeneralMasterModel, options);
  }

  updateGeneralMaster(id: number, branchGeneralMasterModel: any): any {
    let options = GlobleDeclarations.getHeaderOptions();
    return this.http.post(GlobleDeclarations.apiBaseURL + "api/GeneralMaster/update-master?id=" + id, branchGeneralMasterModel, options);
  }

  deleteGeneralMaster(id: number): any {
    let options = GlobleDeclarations.getHeaderOptions();
    return this.http.post(GlobleDeclarations.apiBaseURL + "api/GeneralMaster/delete-master?id=" + id, options);
  }

  getMaxGeneralMasterId(): any {
    let options = GlobleDeclarations.getHeaderOptions();
    return this.http.get(GlobleDeclarations.apiBaseURL + "api/GeneralMaster/max-id", options);
  }

  getMasterType(masterId: number)
  {
    

  }
}
