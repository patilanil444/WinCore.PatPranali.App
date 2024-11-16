import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { GlobleDeclarations } from 'src/app/common/globle-declarations';
import { IGeneralDTO } from 'src/app/common/models/common-ui-models';

@Injectable({
  providedIn: 'root'
})
export class LoanAccountsService {
  serviceBaseURL = "";
  jointCustomerToDelete = -1;
  guarantorCustomerToDelete = -1;
  customerName = "";
  customerCodeStr = "";
  
  private vehicleDataSubject = new BehaviorSubject<any>(null);
  vehicleData = this.vehicleDataSubject.asObservable();

  private goldLoanDataSubject = new BehaviorSubject<any>(null);
  goldLoanData = this.goldLoanDataSubject.asObservable();

  private goldSecurityDataSubject = new BehaviorSubject<any>(null);
  securityData = this.goldSecurityDataSubject.asObservable();

  private goldDepositDataSubject = new BehaviorSubject<any>(null);
  depositData = this.goldDepositDataSubject.asObservable();

  private goldEMIDataSubject = new BehaviorSubject<any>(null);
  emiData = this.goldEMIDataSubject.asObservable();

  updateVehicleData(data: any) {
    this.vehicleDataSubject.next(data);
  }

  updateGoldData(data: any) {
    this.goldLoanDataSubject.next(data);
  }

  updateSecurityData(data: any) {
    this.goldSecurityDataSubject.next(data);
  }

  updateDepositData(data: any) {
    this.goldDepositDataSubject.next(data);
  }

  updateEMIData(data: any) {
    this.goldEMIDataSubject.next(data);
  }

  constructor(private http: HttpClient) { }

  private dto = new BehaviorSubject<IGeneralDTO>({} as IGeneralDTO);
  setDTO(object: any) {
    this.dto.next(object);
  }
  getDTO() {
    return this.dto.asObservable();
  }

  getLoanAccount(accountsId: number) {
    let options = GlobleDeclarations.getHeaderOptions();
    return this.http.get(GlobleDeclarations.apiBaseURL + "api/LoanAccount/loan-account?accountsId=" + accountsId, options);
  }

  getLoanAccountDetails(accountsId: number) {
    let options = GlobleDeclarations.getHeaderOptions();
    return this.http.get(GlobleDeclarations.apiBaseURL + "api/LoanAccount/loan-account-details?accountsId=" + accountsId, options);
  }

  saveLoanAccount(accountModel: any): any {
    let options = GlobleDeclarations.getHeaderOptions();
    return this.http.post(GlobleDeclarations.apiBaseURL + "api/LoanAccount/save-loan-account", accountModel, options);
  }

  saveLoanDetails(accountModel: any): any {
    let options = GlobleDeclarations.getHeaderOptions();
    return this.http.post(GlobleDeclarations.apiBaseURL + "api/LoanAccount/save-loan-details", accountModel, options);
  }
}
