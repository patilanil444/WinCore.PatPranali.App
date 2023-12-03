import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobleDeclarations } from 'src/app/common/globle-declarations';

@Injectable({
  providedIn: 'root'
})
export class LoanInterestRateService {
  serviceBaseURL = "";
  constructor(private http: HttpClient) { }

  getLoanRatesByGL(id: number): any {
    let options = GlobleDeclarations.getHeaderOptions();
    return this.http.get(GlobleDeclarations.apiBaseURL + "api/LoanInterestRate/loan-rates-by-gl?glId=" + id, options);
  }

  createLoanRateStructure(loanInterestRateModel: any): any {
    let options = GlobleDeclarations.getHeaderOptions();
    return this.http.post(GlobleDeclarations.apiBaseURL + "api/LoanInterestRate/create-loan-rates", loanInterestRateModel, options);
  }

  updateLoanRateStructure(id: number, loanInterestRateModel: any): any {
    let options = GlobleDeclarations.getHeaderOptions();
    return this.http.post(GlobleDeclarations.apiBaseURL + "api/LoanInterestRate/update-loan-rates?id=" + id, loanInterestRateModel, options);
  }

  deleteLoanRateStructure(loanInterestRateModel: any): any {
    let options = GlobleDeclarations.getHeaderOptions();
    return this.http.post(GlobleDeclarations.apiBaseURL + "api/LoanInterestRate/delete-loan-rates" , loanInterestRateModel, options);
  }
}
