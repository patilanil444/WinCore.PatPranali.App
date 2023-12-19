import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { GlobleDeclarations } from 'src/app/common/globle-declarations';
import { IGeneralDTO } from 'src/app/common/models/common-ui-models';

@Injectable({
  providedIn: 'root'
})
export class GeneralMasterService {

  serviceBaseURL = "";
  generalMasterIdToDelete = -1;
  constructor(private http: HttpClient) { }

  private dto = new BehaviorSubject<IGeneralDTO>({} as IGeneralDTO);
  setDTO(object: any) {
    this.dto.next(object);
  }
  getDTO() {
    return this.dto.asObservable();
  }

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
    return this.http.delete(GlobleDeclarations.apiBaseURL + "api/GeneralMaster/delete-master?id=" + id, options);
  }

  getMaxGeneralMasterId(): any {
    let options = GlobleDeclarations.getHeaderOptions();
    return this.http.get(GlobleDeclarations.apiBaseURL + "api/GeneralMaster/max-id", options);
  }

  getMasterType(masterId: number)
  {
    

  }
}
