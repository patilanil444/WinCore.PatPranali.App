import { formatDate } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxDropdownConfig } from 'ngx-select-dropdown';
import { ToastrService } from 'ngx-toastr';
import { DenominationsComponent } from 'src/app/common/directives/denominations/denominations.component';
import { MessageBoxComponent } from 'src/app/common/directives/message-box/message-box.component';
import { AccountsService } from 'src/app/services/accounts/accounts/accounts.service';
import { SavingAccountService } from 'src/app/services/accounts/saving-accounts/saving-account.service';
import { BranchMasterService } from 'src/app/services/masters/branch-master/branch-master.service';
import { GeneralLedgerService } from 'src/app/services/masters/general-ledger/general-ledger.service';
import { SharedService } from 'src/app/services/shared.service';
import { CashierTransactionsService } from 'src/app/services/transactions/cashier-transactions/cashier-transactions.service';
import { TransactionMasterService } from 'src/app/services/transactions/transaction-master/transaction-master.service';

export interface ITransactionSummaryModel {
  Id: number;
  BranchCode: number;
  VoucherDate: Date;
  VoucherType: number;
  VoucherNo: number;
  VoucherAmount: number;
  TransactionNarration: string;
  YearEnd: boolean;
  UTR_ChequeNo: string;
  UTR_ChequeDate: Date;
  TransactionPassing: boolean;
  CreatedBy: string;
  VerifiedBy: string;
  VerifiedDateTime: Date;
  TransactionDetails: ITransactionDetailsModel[];
  Denominations: IDenomination[];
}

export interface ITransactionDetailsModel {
  VoucherHeadId: number;
  Code1: number;
  AccountId: number;
  IntFlag: number;
  IntCode1: number;
  CDFlag: number;
  CTFlag: number;
  Transaction_Amount: number;
  Transaction_Narration: string;
}

export interface IDenomination {
  BranchCode: number;
  Scroll_Id: number;
  Denomination_id: number;
  Denomination_Quantity: number;
  denomination_type: number;
}


@Component({
  selector: 'app-cashier-cash-receipt',
  templateUrl: './cashier-cash-receipt.component.html',
  styleUrls: ['./cashier-cash-receipt.component.css']
})
export class CashierCashReceiptComponent implements OnInit {

  @ViewChild('denominationModal', {static: false}) denominationsModal: DenominationsComponent
  @ViewChild('messageBoxModal', {static: false}) messageBoxModal: MessageBoxComponent
  cashierReceiptForm!: FormGroup;

  uiBranches: any = [];
  uiAllGeneralLedgers: any = [];
  uiFilteredGeneralLedgers: any = [];
  uiBankAccount: any = [];
  uiTransactionDenominations : any = [];

  transactionType = "receipt";

  messageNotes : any = [];
  isResetAccountSearch: boolean = false;

  constructor(private router: Router, private _branchMasterService: BranchMasterService, private _toastrService: ToastrService,
    private _generalLedgerService: GeneralLedgerService, private _sharedService: SharedService,
    private _transactionMasterService: TransactionMasterService) { }

  ngOnInit(): void {

    this.cashierReceiptForm = new FormGroup({
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
        // this.cashierReceiptForm.patchValue({
        //   branchId: this.uiBranches[0].branchCode,
        // })
      }
    })
  }

  getAccounts(accountsData: any) {
    let bankAccounts = accountsData;
    if (bankAccounts && bankAccounts.length) {
      this.uiBankAccount = bankAccounts[0];

      this.cashierReceiptForm.patchValue({
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
        lastTransactionDate:  this.uiBankAccount.lastTransactionDate,
        lastInterestDate:  this.uiBankAccount.lastInterestDate,
        openDate:  this.uiBankAccount.openDate,
        interestRate :  this.uiBankAccount.interestRate,
        balanceWillBe: this.uiBankAccount.balance
      })
    }
    else
    {
      this.cashierReceiptForm.patchValue({
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

  updateBalance(event: any)
  {
    if (event) {
      let balance = isNaN(parseFloat(this.balance.value)) ? 0 : parseFloat(this.balance.value);
      this.cashierReceiptForm.patchValue({
        balanceWillBe: (balance + parseFloat(event.target.value)).toFixed(2)
      })
    }
  }

  openDenominations()
  {
    if (this.receiptAmount.value && parseFloat(this.receiptAmount.value) > 0) {
      this.denominationsModal.clear();
      this.denominationsModal.open();
    }
    else
    {
      this._toastrService.warning('Please enter transaction amount.', 'Warning!');
    }
  }

  setDenominations(denominationData:any)
  {
    if (denominationData && denominationData.length) {
      this.uiTransactionDenominations = denominationData;
    }
  }

  isValidateTransaction() {
    if (parseInt(this.accountId.value) > 0) {
      if (parseInt(this.receiptAmount.value) > 0) {
        if (this.uiTransactionDenominations && this.uiTransactionDenominations.length) {

          let totalReceiptAmount = 0;
          this.uiTransactionDenominations.forEach((d: any) => {
            if (d.receiptTotal) {
              totalReceiptAmount = totalReceiptAmount + parseFloat(d.receiptTotal);
            }
          })
          if (totalReceiptAmount == parseInt(this.receiptAmount.value)) {
            return true;
          }
          else
          {
            this._toastrService.error('Transaction amount and denomination sum is not matching.', 'Error!');
            return false;
          }
        }
        else {
          this._toastrService.error('Please add denominations.', 'Error!');
          return false;
        }
      }
      else {
        this._toastrService.error('Please enter valid transaction amount.', 'Error!');
        return false;
      }
    }
    else {
      this._toastrService.error('Please search account for transaction.', 'Error!');
      return false;
    }
  }

  makeTransaction() {
    // Save transcher and get a voucher ID for transaction. Show voucher Id to user in pop up
    //1. Validate Transaction details
    if (this.isValidateTransaction()) {
      //2. Save Transaction 
      let transactionSummary = {} as ITransactionSummaryModel;
      transactionSummary.Id = 0;
      transactionSummary.BranchCode = this._sharedService.applicationUser.branchId;
      transactionSummary.VoucherDate = new Date();
      transactionSummary.VoucherType = 1; // 1 = Receipt 2 = Payment
      transactionSummary.VoucherNo = 0;
      transactionSummary.VoucherAmount = parseFloat(this.receiptAmount.value);
      transactionSummary.TransactionNarration = this.receiptDesc.value;
      transactionSummary.YearEnd = false;
      transactionSummary.UTR_ChequeNo = "";
      transactionSummary.UTR_ChequeDate = new Date();
      transactionSummary.TransactionPassing = false;
      transactionSummary.CreatedBy = this._sharedService.applicationUser.userName;
      transactionSummary.VerifiedBy = "";
      transactionSummary.VerifiedDateTime = new Date();

      let transactionDetails = {} as ITransactionDetailsModel;
      transactionDetails.VoucherHeadId = 0;
      transactionDetails.Code1 = parseInt(this.glCode.value);
      transactionDetails.AccountId = parseFloat(this.accountId.value);
      transactionDetails.IntFlag = 0;

      //payableGL
      let payableGL = this.uiAllGeneralLedgers.filter((gl:any) =>gl.code == transactionDetails.Code1);
      if (payableGL && payableGL.length) {
        transactionDetails.IntCode1 = payableGL[0].glParameters.payableGL;
      }
      
      transactionDetails.CDFlag = 1;  // 1 = CREDIT 2 = Debit
      transactionDetails.CTFlag = 1;  // 1 = Cash 2 = Transfer
      transactionDetails.Transaction_Amount = parseFloat(this.receiptAmount.value);
      transactionDetails.Transaction_Narration = this.receiptDesc.value;
      transactionSummary.TransactionDetails = [];
      transactionSummary.TransactionDetails.push(transactionDetails);

      transactionSummary.Denominations = [];
      if (this.uiTransactionDenominations.length) {
        this.uiTransactionDenominations.forEach((d: any) => {
          let denomination = {} as IDenomination;
          denomination.BranchCode = this._sharedService.applicationUser.branchId;
          denomination.Denomination_id = d.denomination_id;
          denomination.Scroll_Id = 0;
          denomination.Denomination_Quantity = d.receiptNumber > 0 ? d.receiptNumber : d.paymentNumber;
          denomination.denomination_type = d.receiptTotal > 0 ? 1 : 2;
          transactionSummary.Denominations.push(denomination);
        });
      }

      
      // get voucher number before saving transaction 

      this.messageNotes = [];
      this._transactionMasterService.getMaxVoucherNumber(this._sharedService.applicationUser.branchId, 1).subscribe((data: any) => {
        console.log(data);
        if (data) {
          if (data.data.data && data.data.data > 0) {
            // Show Pop up modal here and confirm transaction 

            let messages = [];
            messages.push({ title: "Customer Name :", value: this.customerName.value });
            messages.push({ title: "Voucher Number :", value: data.data.data });

            this.messageNotes = messages;
            this.messageBoxModal.open();

            transactionSummary.VoucherNo = data.data.data;
            this.executeTransaction(transactionSummary);
            this.clearTransaction();
          }
        }
      })
    }
  }

  executeTransaction(transactionSummary: ITransactionSummaryModel)
  {
    this._transactionMasterService.saveTransaction(transactionSummary).subscribe((data: any) => {
      console.log(data);
      if (data) {
        if (data.data.data && data.data.data.retId > 0) {
          if (data.data.data.status == "SUCCESS") {
            this._toastrService.success("Transaction done for voucher : " + transactionSummary.VoucherNo, 'Success!');
          }
          else {
            this._toastrService.success("Error saving transaction!", 'Error!');
          }

          // this.loadForm();
        }
      }
    })
  }

  onTransactionConfirmed(isConfirmed: any)
  {
    // if (isConfirmed) {
    //   window.location.reload();
    // }
  }

  clearTransaction() {
    this.isResetAccountSearch = true;
    this.uiTransactionDenominations = [];
    this.cashierReceiptForm.patchValue({
      receiptAmount: "",
      receiptDesc: "By Cash",
      chequeNo: "",
      chequeDate: "",
      balanceWillBe: "",
      customerName: "",
      accountNumber: "",
      accountId: "",
      glCode: "",
      accountType: "",
      modeOfOperation: "",
      balance: "",
      minBalance: "",
      lastTransactionDate: "",
      lastInterestDate: "",
      openDate: "",
      interestRate: "",
    });
  }

  configClick(routeValue: string) {
    sessionStorage.setItem("configMenu", routeValue);
    this.router.navigate(['/app/' + routeValue]);
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

  get customerName() {
    return this.cashierReceiptForm.get('customerName')!;
  }
  get accountId() {
    return this.cashierReceiptForm.get('accountId')!;
  }

  get glCode() {
    return this.cashierReceiptForm.get('glCode')!;
  }
  
  get accountNumber() {
    return this.cashierReceiptForm.get('accountNumber')!;
  }
  get accountType() {
    return this.cashierReceiptForm.get('accountType')!;
  }
  get modeOfOperation() {
    return this.cashierReceiptForm.get('modeOfOperation')!;
  }
  get balance() {
    return this.cashierReceiptForm.get('balance')!;
  }
  get minBalance() {
    return this.cashierReceiptForm.get('minBalance')!;
  }

  get unclearedReceipt() {
    return this.cashierReceiptForm.get('unclearedReceipt')!;
  }
  get unclearedPayment() {
    return this.cashierReceiptForm.get('unclearedPayment')!;
  }
  get lastTransactionDate() {
    return this.cashierReceiptForm.get('lastTransactionDate')!;
  }
  get lastInterestDate() {
    return this.cashierReceiptForm.get('lastInterestDate')!;
  }
  get openDate() {
    return this.cashierReceiptForm.get('openDate')!;
  }
  get interestRate() {
    return this.cashierReceiptForm.get('interestRate')!;
  }
}
