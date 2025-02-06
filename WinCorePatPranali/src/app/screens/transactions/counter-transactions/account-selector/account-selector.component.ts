import { formatDate } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AccountsService } from 'src/app/services/accounts/accounts/accounts.service';
import { BranchMasterService } from 'src/app/services/masters/branch-master/branch-master.service';
import { GeneralLedgerService } from 'src/app/services/masters/general-ledger/general-ledger.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-account-selector',
  templateUrl: './account-selector.component.html',
  styleUrls: ['./account-selector.component.css']
})
export class AccountSelectorComponent implements OnInit {

  accountSelectorForm!: FormGroup;
  @Output() account = new EventEmitter<any>();
  @ViewChild('accountSelectorModal', { static: false }) modal: ElementRef;

  accountTypeText: string;
  uiBranches: any = [];
  uiAllGeneralLedgers: any = [];
  selectedAccount = {
    customerName: "",
    accountNumber: "",
    accountId: "",
    glCode: "",
    accountType: "",
    modeOfOperation: "",
    balance: "",
    minBalance: "",
    unclearedReceipt: 0,
    unclearedPayment: 0,
    lastTransactionDate: "",
    lastInterestDate: "",
    openDate: "",
    interestRate: "",
    balanceAmountWillBe: "",
    amount: ""
  };

  uiBankAccounts: any = [];
  uiBankAccount: any = [];

  isResetAccountSearch = false;

  constructor(private _branchMasterService: BranchMasterService, private _toastrService: ToastrService,
    private _generalLedgerService: GeneralLedgerService, private _sharedService: SharedService,
    private _accountsService: AccountsService) { }

  ngOnInit(): void {

    this.getBranches();
    this.getGeneralLedgers();
  }

  open(accountTypeText: string) {
    this.modal.nativeElement.style.display = 'block';
    this.accountTypeText = accountTypeText;
  }

  clear() {

  }

  close() {
    this.modal.nativeElement.style.display = 'none';
    this.isResetAccountSearch = true;
    this.selectedAccount = {
      customerName: "",
      accountNumber: "",
      accountId: "",
      glCode: "",
      accountType: "",
      modeOfOperation: "",
      balance: "",
      minBalance: "",
      unclearedReceipt: 0,
      unclearedPayment: 0,
      lastTransactionDate: "",
      lastInterestDate: "",
      openDate: "",
      interestRate: "",
      balanceAmountWillBe: "",
      amount: ""
    };
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
      // if (this.uiBranches && this.uiBranches.length) {
      //   this.transferCreditForm.patchValue({
      //     branchId: this.uiBranches[0].branchCode,
      //   })
      // }
    })
  }

  getAccounts(accountsData: any) {
    let bankAccounts = accountsData;
    if (bankAccounts && bankAccounts.length) {
      this.uiBankAccount = bankAccounts[0];

      this.selectedAccount = {
        customerName: this.uiBankAccount.custName,
        accountNumber: this.uiBankAccount.accountNo,
        accountId: this.uiBankAccount.accountsId,
        glCode: this.uiBankAccount.code1,
        accountType: this.uiBankAccount.accountType,
        modeOfOperation: this.uiBankAccount.modeOfOperation,
        balance: this.uiBankAccount.balance,
        minBalance: this.uiBankAccount.minBalance,
        unclearedReceipt: isNaN(parseFloat(this.uiBankAccount.unClearedReceiptAmt)) ? 0.00 : parseFloat(parseFloat(this.uiBankAccount.unClearedReceiptAmt).toFixed(2)),
        unclearedPayment: isNaN(parseFloat(this.uiBankAccount.unClearedPaymentAmt)) ? 0.00 : parseFloat(parseFloat(this.uiBankAccount.unClearedPaymentAmt).toFixed(2)),
        lastTransactionDate: this.uiBankAccount.lastTransactionDate,
        lastInterestDate: this.uiBankAccount.lastInterestDate,
        openDate: this.uiBankAccount.openDate,
        interestRate: this.uiBankAccount.interestRate,
        balanceAmountWillBe: this.uiBankAccount.balance,
        amount: ""
      };
    }
    else {
      this.selectedAccount = {
        customerName: "",
        accountNumber: "",
        accountId: "",
        glCode: "",
        accountType: "",
        modeOfOperation: "",
        balance: "",
        minBalance: "",
        unclearedReceipt: 0,
        unclearedPayment: 0,
        lastTransactionDate: "",
        lastInterestDate: "",
        openDate: "",
        interestRate: "",
        balanceAmountWillBe: "",
        amount: ""
      }
    }
  }

  addAccount() {
    if (this.uiBankAccount && this.uiBankAccount.accountsId > 0) {
      if (parseFloat(this.selectedAccount.amount) > 0) {

        let availableAmount = parseFloat(this.selectedAccount.balance) - parseFloat(this.selectedAccount.minBalance);

        if (parseFloat(this.selectedAccount.amount) > availableAmount && this.accountTypeText == "Debit") {
          this._toastrService.error("Entered amount not available in account!", 'Warning!');
          return;
        }

        this.uiBankAccount.accountTypeText = this.accountTypeText;
        this.uiBankAccount.amount = parseFloat(this.selectedAccount.amount);

        let gls = this.uiAllGeneralLedgers.filter((gl: any) => gl.code == this.selectedAccount.glCode);
        if (gls && gls.length) {
          this.uiBankAccount.glName = gls[0].glName;
          if (gls[0].glParameters && gls[0].glParameters.payableGL) {
            let payableGLs = this.uiAllGeneralLedgers.filter((gl: any) => gl.code == gls[0].glParameters.payableGL);
            if (payableGLs && payableGLs.length) {
              this.uiBankAccount.payableGLCode = payableGLs[0].code;
              this.uiBankAccount.payableGLName = payableGLs[0].glName;
            }
          }
        }

        this.account.emit(this.uiBankAccount);

      }
      else {
        this._toastrService.warning("Please enter amount to add for transaction!", 'Warning!');
      }
    }
    else {
      this._toastrService.warning("Please search account to add for transaction!", 'Warning!');
    }
  }
}
