import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable, forkJoin } from 'rxjs';
import { MasterDataService } from 'src/app/services/common/master-data.service';
import { DocumentsService } from 'src/app/services/documents/documents.service';
import { GeneralLedgerService } from 'src/app/services/masters/general-ledger/general-ledger.service';
import { TransactionMasterService } from 'src/app/services/transactions/transaction-master/transaction-master.service';

@Injectable({
  providedIn: 'root'
})
export class MasterDataResolverService {

  constructor(private _masterDataService: MasterDataService,private _generalLedgerService: GeneralLedgerService,
    private _transactionMasterService: TransactionMasterService, private _documentsService: DocumentsService
   ) {}
  
  resolve(route: ActivatedRouteSnapshot): Observable<any> {
      return forkJoin(
      {
        masters: this._masterDataService.getAllUiGeneralMasterData(),
        currencies: this._masterDataService.getUiCurrencies(),
        states: this._masterDataService.getUiStates(),
        districts: this._masterDataService.getUiDistricts(),
        talukas: this._masterDataService.getUiTalukas(),
        villages: this._masterDataService.getUiVillages(),
        glTypesAndGroups: this._generalLedgerService.getGeneralLedgerTypesAndGroups(""),
        denominations: this._transactionMasterService.getDenominations(),
        documentTypes: this._documentsService.getDocumentTypes(),
        documentMasters: this._documentsService.getDocumentMasters(),
        //typeOfAccounts: this._masterDataService.getUiTypeOfAccounts()
      }
    );
  }
}
