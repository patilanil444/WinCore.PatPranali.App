import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobleDeclarations } from 'src/app/common/globle-declarations';

@Injectable({
  providedIn: 'root'
})
export class GeneralLedgerService {

  serviceBaseURL = "";
  constructor(private http: HttpClient) { }

  getGeneralLedgers() {
    let options = GlobleDeclarations.getHeaderOptions();
    return this.http.get(GlobleDeclarations.apiBaseURL + "api/bank/banks", options);
  }
}
