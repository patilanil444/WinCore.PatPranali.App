import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { GlobleDeclarations } from 'src/app/common/globle-declarations';
import { IGeneralDTO } from 'src/app/common/models/common-ui-models';

@Injectable({
  providedIn: 'root'
})
export class PigmyMasterService {

  serviceBaseURL = "";
  agentIdToDelete = -1;

  CollectionAccountToDelete = -1;

  constructor(private http: HttpClient) { }

  private dto = new BehaviorSubject<IGeneralDTO>({} as IGeneralDTO);
  setDTO(object: any) {
    this.dto.next(object);
  }
  getDTO() {
    return this.dto.asObservable();
  }

  getMaxAgentNumber(branchCode: number) {
    let options = GlobleDeclarations.getHeaderOptions();
    return this.http.get(GlobleDeclarations.apiBaseURL + "api/PigmyMaster/max-agent-number?branchCode=" + branchCode, options);
  }

  validateAccountNumber(branchCode: number, accountNumber: string) {
    let options = GlobleDeclarations.getHeaderOptions();
    return this.http.get(GlobleDeclarations.apiBaseURL + "api/PigmyMaster/validate-account?branchCode="+ branchCode + "&accountNumber=" + accountNumber, options);
  }


  getBranchAgents(branchCode: number) {
    let options = GlobleDeclarations.getHeaderOptions();
    return this.http.get(GlobleDeclarations.apiBaseURL + "api/PigmyMaster/branch-agents?branchCode=" + branchCode, options);
  }

  getAgent(branchCode: number, agentId: number) {
    let options = GlobleDeclarations.getHeaderOptions();
    return this.http.get(GlobleDeclarations.apiBaseURL + "api/PigmyMaster/agent?branchCode ="+ branchCode + "&agentId=" + agentId, options);
  }

  deleteAgent(branchCode: number, agentIdToDelete: number) {
    let options = GlobleDeclarations.getHeaderOptions();
    return this.http.get(GlobleDeclarations.apiBaseURL + "api/PigmyMaster/delete-agent?branchCode=" + branchCode+ "&agentId=" + agentIdToDelete, options);
  }

  saveAgent(agentModel: any): any {
    let options = GlobleDeclarations.getHeaderOptions();
    return this.http.post(GlobleDeclarations.apiBaseURL + "api/PigmyMaster/save-agent", agentModel, options);
  }

  linkAgentCollectionAccount(collectionModel: any): any {
    let options = GlobleDeclarations.getHeaderOptions();
    return this.http.post(GlobleDeclarations.apiBaseURL + "api/PigmyMaster/link-collection-account", collectionModel, options);
  }

  getLinkedAgentCollectionAccounts(agentId: number) {
    let options = GlobleDeclarations.getHeaderOptions();
    return this.http.get(GlobleDeclarations.apiBaseURL + "api/PigmyMaster/linked-collection-accounts?agentId=" + agentId , options);
  }

  deleteLinkedAccount(deleteModel: any)
  {
    let options = GlobleDeclarations.getHeaderOptions();
    return this.http.post(GlobleDeclarations.apiBaseURL + "api/PigmyMaster/delete-link-account", deleteModel, options);
  }

  getMaxAccountNumber(branchId: number, code1: number, agentId: number) {
    let options = GlobleDeclarations.getHeaderOptions();
    return this.http.get(GlobleDeclarations.apiBaseURL + "api/PigmyMaster/max-account-no?branchCode=" + branchId+ "&code1="+ code1, options);
  }

  
}
