import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { GlobleDeclarations } from 'src/app/common/globle-declarations';
import { IGeneralDTO } from 'src/app/common/models/common-ui-models';

@Injectable({
  providedIn: 'root'
})
export class TransactionMasterService {
  serviceBaseURL = "";
  //districtIdToDelete = -1;

  constructor(private http: HttpClient) { }

  private dto = new BehaviorSubject<IGeneralDTO>({} as IGeneralDTO);
  setDTO(object: any) {
    this.dto.next(object);
  }
  getDTO() {
    return this.dto.asObservable();
  }

  getDenominations() {
    let options = GlobleDeclarations.getHeaderOptions();
    return this.http.get(GlobleDeclarations.apiBaseURL + "api/TransactionMaster/denominations", options);
  }

  getMaxVoucherNumber(branchCode: number, voucherType : number) {
    let options = GlobleDeclarations.getHeaderOptions();
    return this.http.get(GlobleDeclarations.apiBaseURL + "api/TransactionMaster/max-voucher?branchCode="
      + branchCode +"&voucherType=" + voucherType , options);
  }

  saveTransaction(transactionModel: any): any {
    let options = GlobleDeclarations.getHeaderOptions();
    return this.http.post(GlobleDeclarations.apiBaseURL + "api/TransactionMaster/save-transaction", transactionModel, options);
  }

  saveTransferTransactions(transactionModel: any): any {
    let options = GlobleDeclarations.getHeaderOptions();
    return this.http.post(GlobleDeclarations.apiBaseURL + "api/TransactionMaster/save-transfer-transaction", transactionModel, options);
  }

  updatePaymentTransaction(transactionModel: any): any {
    let options = GlobleDeclarations.getHeaderOptions();
    return this.http.post(GlobleDeclarations.apiBaseURL + "api/TransactionMaster/update-payment-transaction", transactionModel, options);
  }

  saveCashTransaction(transactionModel: any): any {
    let options = GlobleDeclarations.getHeaderOptions();
    return this.http.post(GlobleDeclarations.apiBaseURL + "api/TransactionMaster/save-cash-exchange", transactionModel, options);
  }
  
}
