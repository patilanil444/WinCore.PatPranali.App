import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobleDeclarations } from 'src/app/common/globle-declarations';

@Injectable({
  providedIn: 'root'
})
export class DepositInterestRateService {
  serviceBaseURL = "";
  constructor(private http: HttpClient) { }

  getDepositRatesByGL(id: number): any {
    let options = GlobleDeclarations.getHeaderOptions();
    return this.http.get(GlobleDeclarations.apiBaseURL + "api/DepositInterestRate/deposit-rates-by-gl?glId=" + id, options);
  }

  createDepositRateStructure(depositInterestModel: any): any {
    let options = GlobleDeclarations.getHeaderOptions();
    return this.http.post(GlobleDeclarations.apiBaseURL + "api/DepositInterestRate/create-deposit-rates", depositInterestModel, options);
  }

  updateDepositRateStructure(id: number, depositInterestModel: any): any {
    let options = GlobleDeclarations.getHeaderOptions();
    return this.http.post(GlobleDeclarations.apiBaseURL + "api/DepositInterestRate/update-deposit-rates?id=" + id, depositInterestModel, options);
  }

  deleteDepositRateStructure(depositInterestModel: any): any {
    let options = GlobleDeclarations.getHeaderOptions();
    return this.http.post(GlobleDeclarations.apiBaseURL + "api/DepositInterestRate/delete-deposit-rates" , depositInterestModel, options);
  }
}
