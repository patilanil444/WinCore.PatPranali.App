import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlobleDeclarations } from 'src/app/common/globle-declarations';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { IGeneralDTO } from 'src/app/common/models/common-ui-models';

@Injectable({
  providedIn: 'root'
})
export class BankMasterService {
  serviceBaseURL = "";
  constructor(private http: HttpClient) { }

  private dto = new BehaviorSubject<IGeneralDTO>({} as IGeneralDTO);
  setDTO(object: any) {
    this.dto.next(object);
  }
  getDTO() {
    return this.dto.asObservable();
  }

  getBanks() {
    let options = GlobleDeclarations.getHeaderOptions();
    return this.http.get(GlobleDeclarations.apiBaseURL + "api/bank/banks", options);
  }

  getBank(id: number): any {
    let options = GlobleDeclarations.getHeaderOptions();
    return this.http.get(GlobleDeclarations.apiBaseURL + "api/bank/bank?id=" + id, options);
  }

  createBank(bankModel: any): any {
    let options = GlobleDeclarations.getHeaderOptions();
    return this.http.post(GlobleDeclarations.apiBaseURL + "api/bank/create-bank", bankModel, options);
  }

  updateBank(id: number, bankModel: any): any {
    let options = GlobleDeclarations.getHeaderOptions();
    return this.http.post(GlobleDeclarations.apiBaseURL + "api/bank/update-bank?id=" + id, bankModel, options);
  }

  deleteBank(id: number): any {
    let options = GlobleDeclarations.getHeaderOptions();
    return this.http.post(GlobleDeclarations.apiBaseURL + "api/bank/delete-bank?id=" + id, options);
  }
}
