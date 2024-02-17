import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { GlobleDeclarations } from 'src/app/common/globle-declarations';
import { IGeneralLedgerDTO } from 'src/app/common/models/common-ui-models';

@Injectable({
  providedIn: 'root'
})
export class GeneralLedgerService {

  serviceBaseURL = "";
  generalLedgerIdToDelete = -1;
  constructor(private http: HttpClient) { }

  private dto = new BehaviorSubject<IGeneralLedgerDTO>({} as IGeneralLedgerDTO);
  setDTO(object: any) {
    this.dto.next(object);
  }
  getDTO() {
    return this.dto.asObservable();
  }


  getGeneralLedgers(branchId: number) {
    let options = GlobleDeclarations.getHeaderOptions();
    return this.http.get(GlobleDeclarations.apiBaseURL + "api/GLMaster/general-ledgers?branchId=" + branchId, options);
  }

  getGeneralLedger(id: number): any {
    let options = GlobleDeclarations.getHeaderOptions();
    return this.http.get(GlobleDeclarations.apiBaseURL + "api/GLMaster/general-ledger?id=" + id, options);
  }

  createGeneralLedger(glModel: any): any {
    let options = GlobleDeclarations.getHeaderOptions();
    return this.http.post(GlobleDeclarations.apiBaseURL + "api/GLMaster/create-gl", glModel, options);
  }

  updateGeneralLedger(id: number, glModel: any): any {
    let options = GlobleDeclarations.getHeaderOptions();
    return this.http.post(GlobleDeclarations.apiBaseURL + "api/GLMaster/update-gl?id=" + id, glModel, options);
  }

  deleteGeneralLedger(id: number): any {
    let options = GlobleDeclarations.getHeaderOptions();
    return this.http.delete(GlobleDeclarations.apiBaseURL + "api/GLMaster/delete-gl?id=" + id, options);
  }

  getGLGroups() {
    let options = GlobleDeclarations.getHeaderOptions();
    return this.http.get(GlobleDeclarations.apiBaseURL + "api/GLMaster/gl-groups", options);
  }

  getTypeOfAccounts() {
    let options = GlobleDeclarations.getHeaderOptions();
    return this.http.get(GlobleDeclarations.apiBaseURL + "api/common/type-of-accounts", options);
  }


  getGeneralLedgerInterestParams(id: number): any {
    let options = GlobleDeclarations.getHeaderOptions();
    return this.http.get(GlobleDeclarations.apiBaseURL + "api/GLMaster/gl-interest-parameters?id=" + id, options);
  }

  updateGeneralLedgerInterestParams(id: number, glModel: any): any {
    let options = GlobleDeclarations.getHeaderOptions();
    return this.http.post(GlobleDeclarations.apiBaseURL + "api/GLMaster/update-gl-interest-parameters?id=" + id, glModel, options);
  }
}
