import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxDropdownConfig } from 'ngx-select-dropdown';
import { ToastrService } from 'ngx-toastr';
import { AccountsService } from 'src/app/services/accounts/accounts/accounts.service';
import { SavingAccountService } from 'src/app/services/accounts/saving-accounts/saving-account.service';
import { BranchMasterService } from 'src/app/services/masters/branch-master/branch-master.service';
import { GeneralLedgerService } from 'src/app/services/masters/general-ledger/general-ledger.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-cashier-cash-receipt',
  templateUrl: './cashier-cash-receipt.component.html',
  styleUrls: ['./cashier-cash-receipt.component.css']
})
export class CashierCashReceiptComponent implements OnInit {

  cashierReceiptForm!: FormGroup;

  uiBranches: any = [];
  uiAllGeneralLedgers: any = [];
  uiSavingGeneralLedgers: any = [];
  uiBankAccounts: any = [];

 constructor(private _branchMasterService: BranchMasterService, private _toastrService: ToastrService,
    private _generalLedgerService: GeneralLedgerService, private _sharedService: SharedService,
    private _accountsService: AccountsService, private _savingAccountService: SavingAccountService) { }

  ngOnInit(): void {

    this.cashierReceiptForm = new FormGroup({
      receiptAmount: new FormControl("", [Validators.required]),
      receiptDesc: new FormControl("By Cash", [Validators.required]),
      chequeNo: new FormControl("", []),
      chequeDate: new FormControl(formatDate(new Date(Date.now()), 'yyyy-MM-dd', 'en'), []),
      balanceWillBe: new FormControl("", []),
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

            //this.uiSavingGeneralLedgers = this.uiAllGeneralLedgers.filter((gl: any) => gl.glGroup == 'D' && gl.glType == 'S');

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
        // this.cashierReceiptForm.patchValue({
        //   branchId: this.uiBranches[0].branchCode,
        // })
      }
    })
  }

  selectAccount(event:any)
  {

  }
 
  makeTransaction() {

  }

  

  get receiptAmount() {
    return this.cashierReceiptForm.get('receiptAmount')!;
  }

  get receiptDesc() {
    return this.cashierReceiptForm.get('receiptDesc')!;
  }

  get chequeNo() {
    return this.cashierReceiptForm.get('chequeNo')!;
  }

  get chequeDate() {
    return this.cashierReceiptForm.get('chequeDate')!;
  }

  get balanceWillBe() {
    return this.cashierReceiptForm.get('balanceWillBe')!;
  }
}
