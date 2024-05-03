import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobleDeclarations } from 'src/app/common/globle-declarations';

@Injectable({
  providedIn: 'root'
})
export class DepositInterestRateService {
  serviceBaseURL = "";
  constructor(private http: HttpClient) { }

  getDepositRatesByGL(id: number, interestStructureDate: string): any {
    let options = GlobleDeclarations.getHeaderOptions();
    return this.http.get(GlobleDeclarations.apiBaseURL + "api/InterestStructure/deposit-int-structure?glId=" + id + "&date=" + interestStructureDate, options);
  }

  saveDepositRateStructure(depositInterestModel: any): any {
    let options = GlobleDeclarations.getHeaderOptions();
    return this.http.post(GlobleDeclarations.apiBaseURL + "api/InterestStructure/save-deposit-int-structure", depositInterestModel, options);
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
