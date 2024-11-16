import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AccountsService } from 'src/app/services/accounts/accounts/accounts.service';
import { SavingAccountService } from 'src/app/services/accounts/saving-accounts/saving-account.service';
import { BranchMasterService } from 'src/app/services/masters/branch-master/branch-master.service';
import { GeneralLedgerService } from 'src/app/services/masters/general-ledger/general-ledger.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-counter-cash-payment',
  templateUrl: './counter-cash-payment.component.html',
  styleUrls: ['./counter-cash-payment.component.css']
})
export class CounterCashPaymentComponent implements OnInit {

  counterPaymentForm!: FormGroup;
  uiBranches: any = [];
  uiAllGeneralLedgers: any = [];

  uiBankAccounts: any = [];

 constructor(private _branchMasterService: BranchMasterService, private _toastrService: ToastrService,
    private _generalLedgerService: GeneralLedgerService, private _sharedService: SharedService,
    private _accountsService: AccountsService, private _savingAccountService: SavingAccountService) { }

  ngOnInit(): void {
    this.counterPaymentForm = new FormGroup({
      tokenId: new FormControl("", [Validators.required]),
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
        console.log(data);
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
        this.counterPaymentForm.patchValue({
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

  get tokenId() {
    return this.counterPaymentForm.get('tokenId')!;
  }

  get branch() {
    return this.counterPaymentForm.get('branch')!;
  }

  get generalLedger() {
    return this.counterPaymentForm.get('generalLedger')!;
  }

  get accountNumber() {
    return this.counterPaymentForm.get('accountNumber')!;
  }

  get transactionAmount() {
    return this.counterPaymentForm.get('transactionAmount')!;
  }

  get balanceAmountWillBe() {
    return this.counterPaymentForm.get('balanceAmountWillBe')!;
  }

  get transactionDesc() {
    return this.counterPaymentForm.get('transactionDesc')!;
  }

  get chequeNo() {
    return this.counterPaymentForm.get('chequeNo')!;
  }

  get chequeDate() {
    return this.counterPaymentForm.get('chequeDate')!;
  }

}
