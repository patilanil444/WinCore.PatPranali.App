import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxDropdownConfig } from 'ngx-select-dropdown';
import { ToastrService } from 'ngx-toastr';
import { AccountsService } from 'src/app/services/accounts/accounts/accounts.service';
import { SharedService } from 'src/app/services/shared.service';
import { UiEnumGeneralMaster } from '../../models/common-ui-models';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-bank-acc-search',
  templateUrl: './bank-acc-search.component.html',
  styleUrls: ['./bank-acc-search.component.css']
})
export class BankAccSearchComponent implements OnInit {

  config: NgxDropdownConfig = {
    displayKey: "glName",
    height: "auto",
    search: true,
    placeholder: "Select GL",
    searchPlaceholder: "Search GL by name...",
    limitTo: 0,
    customComparator: undefined,
    noResultsFound: "No results found",
    moreText: "more",
    clearOnSelection: false,
    inputDirection: "ltr",
    enableSelectAll: false,
  };
  
  bankAccSearchForm!: FormGroup;
  @Output() accounts = new EventEmitter<any>();
  
  @Input() generalLedgers(value: any[]) {
    this._uiGeneralLedger = value;
  }

  @Input() set uiBranches(value: any[]) {
    this._uiBranches = value;
    if (this._uiBranches.length) {
      this.bankAccSearchForm.patchValue({
        branchId: this._uiBranches[0].branchCode,
      })
    }
  }

  get uiBranches() {
    return this._uiBranches;
  }

  get uiGeneralLedger() {
    return this._uiGeneralLedger;
  }

  uiAccountTypes : any[] = [];
  uiModeOfOperations : any[] = [];

  private _uiBranches: any[] = [];
  private _uiGeneralLedger: any[] = [];
  uiBankAccounts: any[] = [];

  constructor(private _toastrService: ToastrService, private _sharedService: SharedService,
    private _accountsService: AccountsService) { }

  ngOnInit(): void {
    this.bankAccSearchForm = new FormGroup({
      branchId: new FormControl("", [Validators.required]),
      generalLedger: new FormControl("", [Validators.required]),
      accountNumberSearch: new FormControl("", [Validators.required]),
    });

    this.uiAccountTypes = this.retrieveMasters(UiEnumGeneralMaster.ACTYPE);
    this.uiModeOfOperations = this.retrieveMasters(UiEnumGeneralMaster.OPRMODE);
    
  }

  retrieveMasters(uiEnumGeneralMaster: UiEnumGeneralMaster) {
    let mastersData = this._sharedService.uiAllMasters.filter((m: any) => m.identifier == uiEnumGeneralMaster);
    if (mastersData && mastersData.length) {
      let masters = mastersData.filter((m: any) => m.identifier == uiEnumGeneralMaster);
      return masters[0].codeTables;
    }
    return [];
  }

  searchAccount() {
    if (this.branchId.value > 0) {
      if (this.generalLedger && this.generalLedger.value && this.generalLedger.value.code > 0) {
        if (this.accountNumberSearch && this.accountNumberSearch.value) {
          this._accountsService.SearchAccountDetailsAsync(this.branchId.value, this.generalLedger.value.code, 
            this.accountNumberSearch.value).subscribe((data: any) => {
              let accounts = data.data.data;
              if (accounts) {
                this.uiBankAccounts = accounts.map((acc: any) => (
                  {
                    ...acc,
                    accountType: this.uiAccountTypes.filter(at=>at.constantNo == acc.accountType)[0]?.constantname,
                    modeOfOperation: this.uiModeOfOperations.filter(at=>at.constantNo == acc.modeOfOperation)[0]?.constantname,
                    openDate: formatDate(new Date(acc.openDate), 'yyyy-MM-dd', 'en'),
                    lastTransactionDate: formatDate(new Date(acc.lastTransactionDate), 'yyyy-MM-dd', 'en'),
                    lastInterestDate: formatDate(new Date(acc.lastInterestDate), 'yyyy-MM-dd', 'en'),
                    balance: parseFloat(acc.balance).toFixed(2),
                    minBalance: parseFloat(acc.minBalance).toFixed(2),
                  }))

                  this.accounts.emit(this.uiBankAccounts);
              }
              else {
                this._toastrService.error('No accounts found', 'Error!');
              }
            })
        }
        else {
          this._toastrService.error('Please enter valid account number', 'Error!');
        }
      }
      else {
        this._toastrService.error('Please select general ledger', 'Error!');
      }
    }
    else {
      this._toastrService.error('Please select branch', 'Error!');
    }
  }

  selectAccount(accountsId: number) {
    if (accountsId) {
      // this._savingAccountService.getSavingAccount(accountsId).subscribe((data: any) => {
      //   console.log(data);
      //   if (data) {
      //     if (data.statusCode == 200 && data.data.data) {
      //       let fdDetails = data.data.data;
      //       this.cashierReceiptForm.patchValue({
      //         // accountNumberSearch: fdDetails.accountNo,
      //         // accountNumber: fdDetails.accountNo,
      //         // fdAmount : fdDetails.fD_Amt,
      //         // fdOpenDate : formatDate(new Date(fdDetails.opn_Date), 'yyyy-MM-dd', 'en') ,
      //         // fdExpiryDate : formatDate(new Date(fdDetails.exp_Date), 'yyyy-MM-dd', 'en') ,
      //         // fdMatureDate : formatDate(new Date(fdDetails.exp_Date), 'yyyy-MM-dd', 'en') ,
      //       })
      //     }
      //   }
      // })
    }
  }


  get branchId() {
    return this.bankAccSearchForm.get('branchId')!;
  }

  get generalLedger() {
    return this.bankAccSearchForm.get('generalLedger')!;
  }

  get accountNumberSearch() {
    return this.bankAccSearchForm.get('accountNumberSearch')!;
  }

}
