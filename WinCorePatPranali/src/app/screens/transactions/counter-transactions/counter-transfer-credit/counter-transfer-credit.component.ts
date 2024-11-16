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
  selector: 'app-counter-transfer-credit',
  templateUrl: './counter-transfer-credit.component.html',
  styleUrls: ['./counter-transfer-credit.component.css']
})
export class CounterTransferCreditComponent implements OnInit {

  transferCreditForm!: FormGroup;
  uiBranches: any = [];
  uiAllGeneralLedgers: any = [];

  uiBankAccounts: any = [];

 constructor(private _branchMasterService: BranchMasterService, private _toastrService: ToastrService,
    private _generalLedgerService: GeneralLedgerService, private _sharedService: SharedService,
    private _accountsService: AccountsService, private _savingAccountService: SavingAccountService) { }

  ngOnInit(): void {
    this.transferCreditForm = new FormGroup({
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
        this.transferCreditForm.patchValue({
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
    return this.transferCreditForm.get('branch')!;
  }

  get generalLedger() {
    return this.transferCreditForm.get('generalLedger')!;
  }

  get accountNumber() {
    return this.transferCreditForm.get('accountNumber')!;
  }

  get transactionAmount() {
    return this.transferCreditForm.get('transactionAmount')!;
  }

  get balanceAmountWillBe() {
    return this.transferCreditForm.get('balanceAmountWillBe')!;
  }

  get transactionDesc() {
    return this.transferCreditForm.get('transactionDesc')!;
  }

  get chequeNo() {
    return this.transferCreditForm.get('chequeNo')!;
  }

  get chequeDate() {
    return this.transferCreditForm.get('chequeDate')!;
  }

}
