import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AccountsService } from 'src/app/services/accounts/accounts/accounts.service';
import { SavingAccountService } from 'src/app/services/accounts/saving-accounts/saving-account.service';
import { BranchMasterService } from 'src/app/services/masters/branch-master/branch-master.service';
import { GeneralLedgerService } from 'src/app/services/masters/general-ledger/general-ledger.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-counter-transfer-debit',
  templateUrl: './counter-transfer-debit.component.html',
  styleUrls: ['./counter-transfer-debit.component.css']
})
export class CounterTransferDebitComponent implements OnInit {

  transferDebitForm!: FormGroup;
  uiBranches: any = [];
  uiAllGeneralLedgers: any = [];

  uiBankAccounts: any = [];

 constructor(private _branchMasterService: BranchMasterService, private _toastrService: ToastrService,
    private _generalLedgerService: GeneralLedgerService, private _sharedService: SharedService,
    private _accountsService: AccountsService, private _savingAccountService: SavingAccountService) { }

  ngOnInit(): void {
    this.transferDebitForm = new FormGroup({
      branch: new FormControl("", []),
      generalLedger: new FormControl("", []),
      accountNumber: new FormControl("", []),
      transactionAmount: new FormControl("", []),
      transactionDesc: new FormControl("", []),
      chequeNo: new FormControl("", []),
      chequeDate: new FormControl(formatDate(new Date(Date.now()), 'yyyy-MM-dd', 'en'), []),
      balanceAmountWillBe: new FormControl("", []),
    });

    this.getBranches();
    this.getGeneralLedgers();
  }

  getGeneralLedgers() {
    return new Promise((resolve, reject) => {
      this._generalLedgerService.getGeneralLedgers(this._sharedService.applicationUser.branchId).subscribe((data: any) => {
        if (data) {
          this.uiAllGeneralLedgers = data.data.data;
          if (this.uiAllGeneralLedgers) {

            this.uiAllGeneralLedgers.map((gl: any, i: any) => {
              gl.glName = gl.code + "-" + gl.glName;
            });
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
        this.transferDebitForm.patchValue({
          branchId: this.uiBranches[0].branchCode,
        })
      }
    })
  }

  searchToken()
  {
    this.uiBankAccounts = [];
  }

  selectAccount(event:any)
  {
    
  }

  makeTransaction() {

  }

  get branch() {
    return this.transferDebitForm.get('branch')!;
  }

  get generalLedger() {
    return this.transferDebitForm.get('generalLedger')!;
  }

  get accountNumber() {
    return this.transferDebitForm.get('accountNumber')!;
  }

  get transactionAmount() {
    return this.transferDebitForm.get('transactionAmount')!;
  }

  get balanceAmountWillBe() {
    return this.transferDebitForm.get('balanceAmountWillBe')!;
  }

  get transactionDesc() {
    return this.transferDebitForm.get('transactionDesc')!;
  }

  get chequeNo() {
    return this.transferDebitForm.get('chequeNo')!;
  }

  get chequeDate() {
    return this.transferDebitForm.get('chequeDate')!;
  }
}
