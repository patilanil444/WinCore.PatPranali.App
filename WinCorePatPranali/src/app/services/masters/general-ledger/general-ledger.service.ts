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

  getGeneralLedgerTypesAndGroups(glGroupCode: string)
  {
    let options = GlobleDeclarations.getHeaderOptions();
    return this.http.get(GlobleDeclarations.apiBaseURL + "api/GeneralLedger/gl-types-groups?glGroupCode" + glGroupCode, options);
  }

  getGeneralLedgers(branchId: number) {
    let options = GlobleDeclarations.getHeaderOptions();
    return this.http.get(GlobleDeclarations.apiBaseURL + "api/GeneralLedger/general-ledgers" , options);
  }

  getGeneralLedger(code: number): any {
    let options = GlobleDeclarations.getHeaderOptions();
    return this.http.get(GlobleDeclarations.apiBaseURL + "api/GeneralLedger/general-ledger?code=" + code, options);
  }

  saveGeneralLedger(glModel: any): any {
    let options = GlobleDeclarations.getHeaderOptions();
    return this.http.post(GlobleDeclarations.apiBaseURL + "api/GeneralLedger/save-ledger", glModel, options);
  }

  // updateGeneralLedger(id: number, glModel: any): any {
  //   let options = GlobleDeclarations.getHeaderOptions();
  //   return this.http.post(GlobleDeclarations.apiBaseURL + "api/GeneralLedger/update-gl?id=" + id, glModel, options);
  // }

  deleteGeneralLedger(id: number): any {
    let options = GlobleDeclarations.getHeaderOptions();
    return this.http.post(GlobleDeclarations.apiBaseURL + "api/GeneralLedger/delete-gl?id=" + id, options);
  }

  getGeneralLedgerInterestParams(code: number): any {
    let options = GlobleDeclarations.getHeaderOptions();
    return this.http.get(GlobleDeclarations.apiBaseURL + "api/GeneralLedger/gl-interest-parameters?code=" + code, options);
  }

  saveGeneralLedgerInterestParams(glModel: any): any {
    let options = GlobleDeclarations.getHeaderOptions();
    return this.http.post(GlobleDeclarations.apiBaseURL + "api/GeneralLedger/save-gl-interest-parameters", glModel, options);
  }
}
