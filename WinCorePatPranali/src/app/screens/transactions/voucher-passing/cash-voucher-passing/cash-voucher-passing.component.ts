import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TransactionsDeclarations } from 'src/app/common/transaction-declarations';

@Component({
  selector: 'app-cash-voucher-passing',
  templateUrl: './cash-voucher-passing.component.html',
  styleUrls: ['./cash-voucher-passing.component.css']
})
export class CashVoucherPassingComponent implements OnInit {

  cashVoucherPassingForm!: FormGroup;
  passingInfoForm!: FormGroup; 
  uiSavingAccounts: any[] = [];
  uicashTransactionTypes: any[] = [];
  uiBankAccounts : any[] = [];
  constructor() { }

  ngOnInit(): void {
    this.uicashTransactionTypes = TransactionsDeclarations.voucherTransactionTypes;

    this.cashVoucherPassingForm = new FormGroup({
      transactionType: new FormControl(this.uicashTransactionTypes[0].code, []),
      voucherNumber: new FormControl("", []),
      voucherAmount: new FormControl("", []),
      gridAmount: new FormControl("", []),

      receiptAmount: new FormControl("", []),
      receiptDesc: new FormControl("By Cash", []),
      chequeNo: new FormControl("", []),
      chequeDate: new FormControl(formatDate(new Date(Date.now()), 'yyyy-MM-dd', 'en'), []),
      balanceWillBe: new FormControl("", []),
      customerName: new FormControl("", []),
      accountNumber: new FormControl("", []),
      accountType: new FormControl("", []),
      modeOfOperation: new FormControl("", []),
      balance: new FormControl("", []),
      minBalance: new FormControl("", []),
      lastTransactionDate: new FormControl("", []),
      lastInterestDate: new FormControl("", []),
      openDate: new FormControl("", []),
      interestRate : new FormControl("", [])
    });
  }


  fetchVoucher()
  {

  }

  get transactionType() {
    return this.cashVoucherPassingForm.get('transactionType')!;
  }
  get voucherNumber() {
    return this.cashVoucherPassingForm.get('voucherNumber')!;
  }
  get voucherAmount() {
    return this.cashVoucherPassingForm.get('voucherAmount')!;
  }
  get receiptAmount() {
    return this.cashVoucherPassingForm.get('receiptAmount')!;
  }
  get receiptDesc() {
    return this.cashVoucherPassingForm.get('receiptDesc')!;
  }
  get chequeNo() {
    return this.cashVoucherPassingForm.get('chequeNo')!;
  }
  get chequeDate() {
    return this.cashVoucherPassingForm.get('chequeDate')!;
  }
  get balanceWillBe() {
    return this.cashVoucherPassingForm.get('balanceWillBe')!;
  }
  get customerName() {
    return this.cashVoucherPassingForm.get('customerName')!;
  }
  get accountNumber() {
    return this.cashVoucherPassingForm.get('accountNumber')!;
  }
  get accountType() {
    return this.cashVoucherPassingForm.get('accountType')!;
  }

  get modeOfOperation() {
    return this.cashVoucherPassingForm.get('modeOfOperation')!;
  }
  get balance() {
    return this.cashVoucherPassingForm.get('balance')!;
  }
  get minBalance() {
    return this.cashVoucherPassingForm.get('minBalance')!;
  }
  get lastTransactionDate() {
    return this.cashVoucherPassingForm.get('lastTransactionDate')!;
  }
  get lastInterestDate() {
    return this.cashVoucherPassingForm.get('lastInterestDate')!;
  }
  get openDate() {
    return this.cashVoucherPassingForm.get('lastInterestDate')!;
  }
   get interestRate() {
    return this.cashVoucherPassingForm.get('lastInterestDate')!;
  } 
}
