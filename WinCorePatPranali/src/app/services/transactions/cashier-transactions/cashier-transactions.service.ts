import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { GlobleDeclarations } from 'src/app/common/globle-declarations';
import { IGeneralDTO } from 'src/app/common/models/common-ui-models';

@Injectable({
  providedIn: 'root'
})
export class CashierTransactionsService {

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



  getCashierDailyTransactionSummary(transactionSummaryRequest: any): any {
    let options = GlobleDeclarations.getHeaderOptions();
    return this.http.post(GlobleDeclarations.apiBaseURL + "api/TransactionMaster/cashier-daily-transactions", transactionSummaryRequest , options);
  }

  getCounterDailyTransactionSummary(transactionSummaryRequest: any): any {
    let options = GlobleDeclarations.getHeaderOptions();
    return this.http.post(GlobleDeclarations.apiBaseURL + "api/TransactionMaster/counter-daily-transactions", transactionSummaryRequest, options);
  }
}
