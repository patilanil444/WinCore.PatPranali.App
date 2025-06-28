import { DatePipe, formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserRoleHeper } from 'src/app/common/utils/user-role-helper';
import { BranchMasterService } from 'src/app/services/masters/branch-master/branch-master.service';
import { GeneralLedgerService } from 'src/app/services/masters/general-ledger/general-ledger.service';
import { SharedService } from 'src/app/services/shared.service';
import { TransactionMasterService } from 'src/app/services/transactions/transaction-master/transaction-master.service';

@Component({
  selector: 'app-standing-instructions-form',
  templateUrl: './standing-instructions-form.component.html',
  styleUrls: ['./standing-instructions-form.component.css']
})
export class StandingInstructionsFormComponent implements OnInit {

  standingInstructionsForm!: FormGroup;

  uiFilteredGeneralLedgers : any = [];
  uiBranches: any = [];
  uiAllGeneralLedgers: any = [];
  uiBankAccount: any = [];
  uiTransactionDenominations : any = [];
  isResetAccountSearch = true;

  constructor(private router: Router, private _branchMasterService: BranchMasterService, private _toastrService: ToastrService,
      private _generalLedgerService: GeneralLedgerService, private _sharedService: SharedService,
      private _transactionMasterService: TransactionMasterService, private datePipe: DatePipe) { }

  ngOnInit(): void {
  
      this.standingInstructionsForm = new FormGroup({
        receiptAmount: new FormControl("", [Validators.required]),
        receiptDesc: new FormControl("By Cash", [Validators.required]),
        chequeNo: new FormControl("", []),
        chequeDate: new FormControl(formatDate(new Date(Date.now()), 'yyyy-MM-dd', 'en'), []),
        balanceWillBe: new FormControl("", []),
        customerName: new FormControl("", []),
        accountNumber: new FormControl("", []),
        accountId: new FormControl("", []),
        glCode: new FormControl("", []),
        accountType: new FormControl("", []),
        modeOfOperation: new FormControl("", []),
        balance: new FormControl("", []),
        minBalance: new FormControl("", []),
        unclearedReceipt: new FormControl("", []),
        unclearedPayment: new FormControl("", []),
        lastTransactionDate: new FormControl("", []),
        lastInterestDate: new FormControl("", []),
        openDate: new FormControl("", []),
        interestRate : new FormControl("", [])
      });
  
      this.getBranches();
      this.getGeneralLedgers();
      UserRoleHeper.initialiseUserRoles(this._sharedService.applicationUser);
    }
  
    isAdministratorUser() {
      return UserRoleHeper.isAdministratorUser();
    }
  
    isCashierUser() {
      return UserRoleHeper.isCashierUser();
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
  
              this.uiFilteredGeneralLedgers = this.uiAllGeneralLedgers.filter((gl: any) => gl.glGroup == 'D' || gl.glGroup == 'L');
  
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
          // this.standingInstructionsForm.patchValue({
          //   branchId: this.uiBranches[0].branchCode,
          // })
        }
      })
    }
  
    getAccounts(accountsData: any) {
      let bankAccounts = accountsData;
      if (bankAccounts && bankAccounts.length) {
        this.uiBankAccount = bankAccounts[0];
  
        this.standingInstructionsForm.patchValue({
          customerName: this.uiBankAccount.custName,
          accountNumber:  this.uiBankAccount.accountNo,
          accountId:  this.uiBankAccount.accountsId,
          glCode: this.uiBankAccount.code1,
          accountType:  this.uiBankAccount.accountType,
          modeOfOperation:  this.uiBankAccount.modeOfOperation,
          balance:  this.uiBankAccount.balance,
          minBalance:  this.uiBankAccount.minBalance,
          unclearedReceipt: isNaN(parseFloat(this.uiBankAccount.unClearedReceiptAmt)) ? "0.00": parseFloat(this.uiBankAccount.unClearedReceiptAmt).toFixed(2),
          unclearedPayment: isNaN(parseFloat(this.uiBankAccount.unClearedPaymentAmt)) ? "0.00": parseFloat(this.uiBankAccount.unClearedPaymentAmt).toFixed(2),
          lastTransactionDate: this.datePipe.transform(this.uiBankAccount.lastTransactionDate, 'dd-MM-yyyy'), //this.uiBankAccount.lastTransactionDate,
          lastInterestDate: this.datePipe.transform(this.uiBankAccount.lastInterestDate, 'dd-MM-yyyy'), //this.uiBankAccount.lastInterestDate,
          openDate: this.datePipe.transform(this.uiBankAccount.openDate, 'dd-MM-yyyy'), // this.uiBankAccount.openDate,
          interestRate :  this.uiBankAccount.interestRate,
          balanceWillBe: this.uiBankAccount.balance
        })
      }
      else
      {
        this.standingInstructionsForm.patchValue({
          customerName: "",
          accountNumber:  "",
          accountId: "",
          glCode: "",
          accountType:  "",
          modeOfOperation:  "",
          balance:  "",
          minBalance: "",
          unclearedReceipt: "",
          unclearedPayment: "",
          lastTransactionDate:  "",
          lastInterestDate:  "",
          openDate:  "",
          interestRate :  "",
          balanceWillBe: "",
        })
      }
    }

  saveInstruction()
  {

  }

  clearInstruction()
  {

  }

  configClick(routeValue: string) {
    sessionStorage.setItem("configMenu", routeValue);
    this.router.navigate(['/app/' + routeValue]);
  }

  get receiptAmount() {
    return this.standingInstructionsForm.get('receiptAmount')!;
  }

  get receiptDesc() {
    return this.standingInstructionsForm.get('receiptDesc')!;
  }

  get chequeNo() {
    return this.standingInstructionsForm.get('chequeNo')!;
  }

  get chequeDate() {
    return this.standingInstructionsForm.get('chequeDate')!;
  }

  get balanceWillBe() {
    return this.standingInstructionsForm.get('balanceWillBe')!;
  }

  get customerName() {
    return this.standingInstructionsForm.get('customerName')!;
  }
  get accountId() {
    return this.standingInstructionsForm.get('accountId')!;
  }

  get glCode() {
    return this.standingInstructionsForm.get('glCode')!;
  }
  
  get accountNumber() {
    return this.standingInstructionsForm.get('accountNumber')!;
  }
  get accountType() {
    return this.standingInstructionsForm.get('accountType')!;
  }
  get modeOfOperation() {
    return this.standingInstructionsForm.get('modeOfOperation')!;
  }
  get balance() {
    return this.standingInstructionsForm.get('balance')!;
  }
  get minBalance() {
    return this.standingInstructionsForm.get('minBalance')!;
  }

  get unclearedReceipt() {
    return this.standingInstructionsForm.get('unclearedReceipt')!;
  }
  get unclearedPayment() {
    return this.standingInstructionsForm.get('unclearedPayment')!;
  }
  get lastTransactionDate() {
    return this.standingInstructionsForm.get('lastTransactionDate')!;
  }
  get lastInterestDate() {
    return this.standingInstructionsForm.get('lastInterestDate')!;
  }
  get openDate() {
    return this.standingInstructionsForm.get('openDate')!;
  }
  get interestRate() {
    return this.standingInstructionsForm.get('interestRate')!;
  }
}
