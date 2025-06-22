import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { GlobleDeclarations } from 'src/app/common/globle-declarations';
import { IGeneralDTO } from 'src/app/common/models/common-ui-models';

@Injectable({
  providedIn: 'root'
})
export class VoucherPassingService {

  
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

  saveTransaction(transactionModel: any): any {
    let options = GlobleDeclarations.getHeaderOptions();
    return this.http.post(GlobleDeclarations.apiBaseURL + "api/TransactionMaster/save-transaction", transactionModel, options);
  }

  getCashVoucher(voucherRequestModel: any): any {
    let options = GlobleDeclarations.getHeaderOptions();
    return this.http.post(GlobleDeclarations.apiBaseURL + "api/TransactionMaster/cash-voucher", voucherRequestModel , options);
  }

  getCashVouchers(voucherRequestModel: any): any {
    let options = GlobleDeclarations.getHeaderOptions();
    return this.http.post(GlobleDeclarations.apiBaseURL + "api/TransactionMaster/cash-vouchers", voucherRequestModel , options);
  }

  getTransferVoucher(voucherRequestModel: any): any {
    let options = GlobleDeclarations.getHeaderOptions();
    return this.http.post(GlobleDeclarations.apiBaseURL + "api/TransactionMaster/transfer-voucher", voucherRequestModel , options);
  }

  passVoucher(voucherRequestModel: any): any {
    let options = GlobleDeclarations.getHeaderOptions();
    return this.http.post(GlobleDeclarations.apiBaseURL + "api/TransactionMaster/pass-voucher", voucherRequestModel , options);
  }

  passTransferVoucher(voucherRequestModel: any): any {
    let options = GlobleDeclarations.getHeaderOptions();
    return this.http.post(GlobleDeclarations.apiBaseURL + "api/TransactionMaster/pass-transfer-voucher", voucherRequestModel , options);
  }
}
