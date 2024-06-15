import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { GlobleDeclarations } from 'src/app/common/globle-declarations';
import { IGeneralDTO } from 'src/app/common/models/common-ui-models';

@Injectable({
  providedIn: 'root'
})
export class DepositAccountService {
  serviceBaseURL = "";
  jointCustomerToDelete = -1;

  constructor(private http: HttpClient) { }

  private dto = new BehaviorSubject<IGeneralDTO>({} as IGeneralDTO);
  setDTO(object: any) {
    this.dto.next(object);
  }
  getDTO() {
    return this.dto.asObservable();
  }

  SearchAccountsAsync(branchId: number, glId: number, customerNumber: string, accountNumber: string) {
    let options = GlobleDeclarations.getHeaderOptions();
    return this.http.get(GlobleDeclarations.apiBaseURL + "api/DepositAccount/search-account?branchCode=" + branchId 
    + "&glId="+ glId + "&customerNumber="+ customerNumber+ "&accountNumber="+ accountNumber, options);
  }

  getDepositAccount(accountsId: number) {
    let options = GlobleDeclarations.getHeaderOptions();
    return this.http.get(GlobleDeclarations.apiBaseURL + "api/DepositAccount/deposit-account?accountsId=" + accountsId, options);
  }

  getMaxAccountNumber(branchId: number, code1: number) {
    let options = GlobleDeclarations.getHeaderOptions();
    return this.http.get(GlobleDeclarations.apiBaseURL + "api/DepositAccount/max-account-no?branchCode=" + branchId+ "&code1="+ code1, options);
  }

  saveDepositAccount(accountModel: any): any {
    let options = GlobleDeclarations.getHeaderOptions();
    return this.http.post(GlobleDeclarations.apiBaseURL + "api/DepositAccount/create-deposit-account", accountModel, options);
  }

  // deleteCustomer(accountsId: number): any {
  //   let options = GlobleDeclarations.getHeaderOptions();
  //   return this.http.delete(GlobleDeclarations.apiBaseURL + "api/DepositAccount/delete-account?id=" + accountsId, options);
  // }
}
