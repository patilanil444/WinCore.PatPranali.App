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

 

  getCashierDailyTransactionSummary(branchCode: number, username: string): any {
    let options = GlobleDeclarations.getHeaderOptions();
    return this.http.get(GlobleDeclarations.apiBaseURL + "api/TransactionMaster/cashier-daily-transactions?branchCode="+ branchCode +"&userName="+ username , options);
  }

  getCounterDailyTransactionSummary(branchCode: number, username: string): any {
    let options = GlobleDeclarations.getHeaderOptions();
    return this.http.get(GlobleDeclarations.apiBaseURL + "api/TransactionMaster/counter-daily-transactions?branchCode="+ branchCode +"&userName="+ username , options);
  }
}
