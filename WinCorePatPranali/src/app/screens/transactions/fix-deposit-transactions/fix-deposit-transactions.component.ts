import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxDropdownConfig } from 'ngx-select-dropdown';
import { ToastrService } from 'ngx-toastr';
import { UiEnumAccountStatus } from 'src/app/common/models/common-ui-models';
import { TransactionsDeclarations } from 'src/app/common/transaction-declarations';
import { AccountsService } from 'src/app/services/accounts/accounts/accounts.service';
import { SavingAccountService } from 'src/app/services/accounts/saving-accounts/saving-account.service';
import { BranchMasterService } from 'src/app/services/masters/branch-master/branch-master.service';
import { GeneralLedgerService } from 'src/app/services/masters/general-ledger/general-ledger.service';
import { SharedService } from 'src/app/services/shared.service';


@Component({
  selector: 'app-fix-deposit-transactions',
  templateUrl: './fix-deposit-transactions.component.html',
  styleUrls: ['./fix-deposit-transactions.component.css']
})
export class FixDepositTransactionsComponent implements OnInit {

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

  cashTransactionForm!: FormGroup;
  transferTransactionForm!: FormGroup;
  accountClosureTransactionForm!: FormGroup;

  uicashTransactionTypes:any = [];
  uiTransferTransactionTypes:any = [];
  uiAccountClosureTransactionTypes:any = [];

  uiBranches:any = [];
  uiAllGeneralLedgers:any = [];
  uiDepositGeneralLedgers:any = [];
  uiSavingAccounts :any = [];

  constructor( private _branchMasterService: BranchMasterService, private _toastrService: ToastrService,
    private _generalLedgerService: GeneralLedgerService, private _sharedService: SharedService,
    private _accountsService: AccountsService, private _savingAccountService: SavingAccountService) { }

  ngOnInit(): void {
    this.uicashTransactionTypes = TransactionsDeclarations.transactionTypes;
    this.uiTransferTransactionTypes = TransactionsDeclarations.transactionTypes;
    this.uiAccountClosureTransactionTypes = TransactionsDeclarations.transactionTypes;
    
    this.cashTransactionForm = new FormGroup({
      cashTransactionType: new FormControl(this.uicashTransactionTypes[0].code, []),
      cashBranchId: new FormControl("", [Validators.required]),
      casgSavingGL: new FormControl("", [Validators.required]),
      cashAccountNumberSearch: new FormControl("", [Validators.required]),
      cashTransactionAmount: new FormControl("", [Validators.required]),
      cashTransactionDesc: new FormControl("", [Validators.required]),
    });

    this.transferTransactionForm = new FormGroup({
      transferTransactionType: new FormControl(this.uiTransferTransactionTypes[0].code, []),
      fromBranchId: new FormControl("", [Validators.required]),
      fromSavingGL: new FormControl("", [Validators.required]),
      fromAccountNumberSearch: new FormControl("", [Validators.required]),
      toBranchId: new FormControl("", [Validators.required]),
      toSavingGL: new FormControl("", [Validators.required]),
      toAccountNumberSearch: new FormControl("", [Validators.required]),
      transferTransactionAmount: new FormControl("", [Validators.required]),
      transferTransactionDesc: new FormControl("", [Validators.required]),
    });

    this.accountClosureTransactionForm = new FormGroup({
      closureTransactionType: new FormControl(this.uiAccountClosureTransactionTypes[1].code, []),
      closureBranchId: new FormControl("", [Validators.required]),
      closureSavingGL: new FormControl("", [Validators.required]),
      closureAccountNumberSearch: new FormControl("", [Validators.required]),
      closureTransactionAmount: new FormControl("", [Validators.required]),
      closureTransactionDesc: new FormControl("", [Validators.required]),
    });

    this.cashTransactionType.disable();
    this.closureTransactionType.disable();

    this.getBranches();
    this.getGeneralLedgers();
  }

  getGeneralLedgers() {
    return new Promise((resolve, reject) => {
      this._generalLedgerService.getGeneralLedgers(this._sharedService.applicationUser.branchId).subscribe((data: any) => {
        console.log(data);
        if (data) {
          this.uiAllGeneralLedgers = data.data.data;
          if (this.uiAllGeneralLedgers) {

            this.uiAllGeneralLedgers.map((gl: any, i: any) => {
              gl.glName = gl.code + "-" + gl.glName;
            });

            this.uiDepositGeneralLedgers = this.uiAllGeneralLedgers.filter((gl:any) => gl.glGroup == 'D');
            
            resolve(true);
          }
        }
        else {
          resolve(false);
        }
      })
    })
  }

  getBranches() {
    this._branchMasterService.getBranches().subscribe((data: any) => {
      this.uiBranches = data.data.data;
      if (this.uiBranches && this.uiBranches.length) {
        this.cashTransactionForm.patchValue({
          cashBranchId: this.uiBranches[0].branchCode,
        })
        this.transferTransactionForm.patchValue({
          fromBranchId: this.uiBranches[0].branchCode,
          toBranchId: this.uiBranches[0].branchCode,
        })
        this.accountClosureTransactionForm.patchValue({
          closureBranchId: this.uiBranches[0].branchCode,
        })
      }
    })
  }

  searchSavingAccount() {
    if (this.branchId.value > 0) {
      if (this.savingGL && this.savingGL.value && this.savingGL.value.code > 0) {
        if (this.accountNumberSearch && this.accountNumberSearch.value) {
          this._accountsService.SearchAccountsAsync(this.branchId.value, this.savingGL.value.code, "", 
          this.accountNumberSearch.value).subscribe((data: any) => {
              let accounts = data.data.data;
              if (accounts) {
                this.uiSavingAccounts = accounts.map((acc: any) => (
                  {
                    ...acc,
                    status: this.getStatus(acc.accountStatus)
                  }))
              }
              else {
                this._toastrService.error('No accounts found', 'Warning!');
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

  getStatus(status: number) {
    if (status == UiEnumAccountStatus.OPEN) {
      return "Open";
    }
    else if (status == UiEnumAccountStatus.FREEZE) {
      return "Freeze";
    }
    else if (status == UiEnumAccountStatus.DORMANT) {
      return "Dormant";
    }
    else if (status == UiEnumAccountStatus.CLOSE) {
      return "Closed";
    }
    return "";
  }

  selectSavingAccount(accountsId: number){
    if (accountsId) {
      this._savingAccountService.getSavingAccount(accountsId).subscribe((data: any) => {
        console.log(data);
        if (data) {
          if (data.statusCode == 200 && data.data.data) {
            let fdDetails = data.data.data;
            this.cashTransactionForm.patchValue({
              // accountNumberSearch: fdDetails.accountNo,
              // accountNumber: fdDetails.accountNo,
              // fdAmount : fdDetails.fD_Amt,
              // fdOpenDate : formatDate(new Date(fdDetails.opn_Date), 'yyyy-MM-dd', 'en') ,
              // fdExpiryDate : formatDate(new Date(fdDetails.exp_Date), 'yyyy-MM-dd', 'en') ,
              // fdMatureDate : formatDate(new Date(fdDetails.exp_Date), 'yyyy-MM-dd', 'en') ,
            })
          }
        }
      })
    }
  }

  makeTransaction()
  {
     
  }

  // Cash transaction

  get cashTransactionType() {
    return this.cashTransactionForm.get('cashTransactionType')!;
  }

  get branchId() {
    return this.cashTransactionForm.get('branchId')!;
  }

  get savingGL() {
    return this.cashTransactionForm.get('savingGL')!;
  }

  get accountNumberSearch() {
    return this.cashTransactionForm.get('accountNumberSearch')!;
  }

  get cashTransactionAmount() {
    return this.cashTransactionForm.get('transactionAmount')!;
  }

  get cashTransactionDesc() {
    return this.cashTransactionForm.get('transactionDesc')!;
  }
  
  // Transfer Transactions

  get transferTransactionType() {
    return this.transferTransactionForm.get('transferTransactionType')!;
  }
  get fromBranchId() {
    return this.transferTransactionForm.get('fromBranchId')!;
  }
  get fromSavingGL() {
    return this.transferTransactionForm.get('fromSavingGL')!;
  }
  get fromAccountNumberSearch() {
    return this.transferTransactionForm.get('fromAccountNumberSearch')!;
  }
  get toBranchId() {
    return this.transferTransactionForm.get('toBranchId')!;
  }
  get toSavingGL() {
    return this.transferTransactionForm.get('toSavingGL')!;
  }
  get toAccountNumberSearch() {
    return this.transferTransactionForm.get('toAccountNumberSearch')!;
  }
  get transferTransactionAmount() {
    return this.transferTransactionForm.get('transferTransactionAmount')!;
  }
  get transferTransactionDesc() {
    return this.transferTransactionForm.get('transferTransactionDesc')!;
  }

  // Account Closure

  get closureTransactionType() {
    return this.accountClosureTransactionForm.get('closureTransactionType')!;
  }
  get closureBranchId() {
    return this.accountClosureTransactionForm.get('closureBranchId')!;
  }
  get closureSavingGL() {
    return this.accountClosureTransactionForm.get('closureSavingGL')!;
  }
  get closureAccountNumberSearch() {
    return this.accountClosureTransactionForm.get('closureAccountNumberSearch')!;
  }
  get closureTransactionAmount() {
    return this.accountClosureTransactionForm.get('closureTransactionAmount')!;
  }
  get closureTransactionDesc() {
    return this.accountClosureTransactionForm.get('closureTransactionDesc')!;
  }
  

}
