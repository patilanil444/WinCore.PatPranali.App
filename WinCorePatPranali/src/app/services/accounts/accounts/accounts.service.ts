import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobleDeclarations } from 'src/app/common/globle-declarations';

@Injectable({
  providedIn: 'root'
})
export class AccountsService {

  constructor(private http: HttpClient) { }

  getMaxAccountNumber(branchId: number, code1: number) {
    let options = GlobleDeclarations.getHeaderOptions();
    return this.http.get(GlobleDeclarations.apiBaseURL + "api/Account/max-account-no?branchCode=" + branchId+ "&code1="+ code1, options);
  }

  SearchAccountsAsync(branchId: number, glId: number, customerNumber: string, accountNumber: string) {
    let options = GlobleDeclarations.getHeaderOptions();
    return this.http.get(GlobleDeclarations.apiBaseURL + "api/Account/search-account?branchCode=" + branchId 
    + "&glId="+ glId + "&customerNumber="+ customerNumber+ "&accountNumber="+ accountNumber, options);
  }

  getSecurities() {
    let options = GlobleDeclarations.getHeaderOptions();
    return this.http.get(GlobleDeclarations.apiBaseURL + "api/Account/securities", options);
  }

  getDirectors() {
    let options = GlobleDeclarations.getHeaderOptions();
    return this.http.get(GlobleDeclarations.apiBaseURL + "api/Account/directors", options);
  }

  getGoldTypes() {
    let options = GlobleDeclarations.getHeaderOptions();
    return this.http.get(GlobleDeclarations.apiBaseURL + "api/Account/gold-types", options);
  }

  isCustomerValidGuarantor(customerId:number) {
    let options = GlobleDeclarations.getHeaderOptions();
    return this.http.get(GlobleDeclarations.apiBaseURL + "api/Account/valid-guarantor?customerId="+ customerId, options);
  }
}
