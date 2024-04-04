import { Injectable } from '@angular/core';
import { BranchMasterService } from '../masters/branch-master/branch-master.service';
import { SharedService } from '../shared.service';
import { GeneralMasterService } from '../masters/general-master/general-master.service';
import { GeneralLedgerService } from '../masters/general-ledger/general-ledger.service';
import { GlobleDeclarations } from 'src/app/common/globle-declarations';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MasterDataService {

  constructor(private http: HttpClient, private _sharedService:SharedService) { }

  getUiStates(): Observable<any> 
  {
    let options = GlobleDeclarations.getHeaderOptions();
    return this.http.get(GlobleDeclarations.apiBaseURL + "api/master/states", options);
  }

  getUiDistricts(): Observable<any> 
  {
    let options = GlobleDeclarations.getHeaderOptions();
    return this.http.get(GlobleDeclarations.apiBaseURL + "api/master/districts", options);
  }

  getUiTalukas(): Observable<any> 
  {
    let options = GlobleDeclarations.getHeaderOptions();
    return this.http.get(GlobleDeclarations.apiBaseURL + "api/master/talukas", options);
  }
  
  getUiVillages(): Observable<any> 
  {
    let options = GlobleDeclarations.getHeaderOptions();
    return this.http.get(GlobleDeclarations.apiBaseURL + "api/master/villages", options);
  }

  getUiCurrencies(): Observable<any>  {
    let options = GlobleDeclarations.getHeaderOptions();
    return this.http.get(GlobleDeclarations.apiBaseURL + "api/master/currencies", options);
  }

  getUiGLGroups(): Observable<any> 
  {
    let options = GlobleDeclarations.getHeaderOptions();
    return this.http.get(GlobleDeclarations.apiBaseURL + "api/GeneralLedger/gl-groups", options);
  }

  getUiTypeOfAccounts(): Observable<any> {
    let options = GlobleDeclarations.getHeaderOptions();
    return this.http.get(GlobleDeclarations.apiBaseURL + "api/common/type-of-accounts", options);
  }

  getAllUiGeneralMasterData(): Observable<any> {
    let options = GlobleDeclarations.getHeaderOptions();
    return this.http.get(GlobleDeclarations.apiBaseURL + "api/GeneralMaster/all-general-masters-data", options);
    //return this._sharedService.uiAllMasters;
  }
}
