import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { GlobleDeclarations } from 'src/app/common/globle-declarations';
import { IGeneralDTO } from 'src/app/common/models/common-ui-models';

@Injectable({
  providedIn: 'root'
})
export class PigmyAccountService {

  serviceBaseURL = "";
  agentIdToDelete = -1;

  jointCustomerToDelete = -1;

  constructor(private http: HttpClient) { }

  private dto = new BehaviorSubject<IGeneralDTO>({} as IGeneralDTO);
  setDTO(object: any) {
    this.dto.next(object);
  }
  getDTO() {
    return this.dto.asObservable();
  }

  getMaxAccountNumber(branchId: number, code1: number, agentId: number) {
    let options = GlobleDeclarations.getHeaderOptions();
    return this.http.get(GlobleDeclarations.apiBaseURL + "api/PigmyAccount/max-account-number?branchCode=" + branchId+ "&code1="+ code1 + "&agentId="+ agentId, options);
  }

  SearchAccountsAsync(branchId: number, glId: number, accountNumber: string) {
    let options = GlobleDeclarations.getHeaderOptions();
    return this.http.get(GlobleDeclarations.apiBaseURL + "api/PigmyAccount/search-account?branchCode=" + branchId 
    + "&glId="+ glId + "&accountNumber="+ accountNumber, options);
  }

  getPigmyAccount(accountsId: number)
  {
    let options = GlobleDeclarations.getHeaderOptions();
    return this.http.get(GlobleDeclarations.apiBaseURL + "api/PigmyAccount/pigmy-account?accountsId=" + accountsId , options);
  }
  
  savePigmyAccount(accountModel: any): any {
    let options = GlobleDeclarations.getHeaderOptions();
    return this.http.post(GlobleDeclarations.apiBaseURL + "api/PigmyAccount/save-pigmy-account", accountModel, options);
  }

  getPigmyAccountsByAgent(agentId: number, pigmyDate: string)
  {
    let options = GlobleDeclarations.getHeaderOptions();
    return this.http.get(GlobleDeclarations.apiBaseURL + "api/PigmyAccount/pigmy-accounts-by-agent?agentId=" + agentId +"&pigmyDate=" + pigmyDate , options);
  }

  savePigmyCollection(CollectionModel: any): any {
    let options = GlobleDeclarations.getHeaderOptions();
    return this.http.post(GlobleDeclarations.apiBaseURL + "api/PigmyAccount/save-pigmy-collection", CollectionModel, options);
  }

  getPigmyCollections(pigmyCollectionRequest: any)
  {
    let options = GlobleDeclarations.getHeaderOptions();
    return this.http.post(GlobleDeclarations.apiBaseURL + "api/PigmyAccount/pigmy-collections", pigmyCollectionRequest, options);
  }

  passPigmyCollection(requestModel: any): any {
    let options = GlobleDeclarations.getHeaderOptions();
    return this.http.post(GlobleDeclarations.apiBaseURL + "api/PigmyAccount/pass-collection", requestModel, options);
  }
}
