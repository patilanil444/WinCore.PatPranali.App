import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { SharedService } from 'src/app/services/shared.service';
import { CashierTransactionsService } from 'src/app/services/transactions/cashier-transactions/cashier-transactions.service';

export interface UiTransactionDetails {
  VoucherNo: string;
  AccountNumber: string;
  GL: string;
  CustomerName: string;
  Amount: number;
  CDFlag: string;
  IntGL: string;
  Narration: string;
}

@Component({
  selector: 'app-counter-transaction-summary',
  templateUrl: './counter-transaction-summary.component.html',
  styleUrls: ['./counter-transaction-summary.component.css']
})
export class CounterTransactionSummaryComponent implements OnInit {

  counterSummaryForm!: FormGroup;
  pendingTransactions: any[] = [];

  constructor(private _sharedService: SharedService, private _cashierTransactionsService: CashierTransactionsService) { }


  ngOnInit(): void {

    this.counterSummaryForm = new FormGroup({
      totalPayment: new FormControl(0, []),
      pendingPayment: new FormControl(0, []),
      paymentPendingCash: new FormControl(0, []),
    });

    this.getDailyCounterSummary();
  }

  loadSummary()
  {
    this.getDailyCounterSummary();
  }
  
  getDailyCounterSummary() {
    this.pendingTransactions = [];
    this._cashierTransactionsService.getCounterDailyTransactionSummary(this._sharedService.applicationUser.branchId,
      this._sharedService.applicationUser.userName).subscribe((data: any) => {

        if (data.data.data.pendingTransactions && data.data.data.pendingTransactions.length) {
          //this.pendingTransactions = data.data.data.pendingTransactions;
          data.data.data.pendingTransactions.forEach((t: any) => {
            let transaction = {} as UiTransactionDetails;
            transaction.VoucherNo = t.voucherNo;
            transaction.Amount = t.voucherAmount;
            transaction.Narration = t.transactionNarration;
            if (t.transactionDetails && t.transactionDetails.length) {
              transaction.AccountNumber = t.transactionDetails[0].accountNumber;
              transaction.CDFlag = t.voucherType == 1 ? "Credit": "Debit";
              transaction.CustomerName = t.transactionDetails[0].customerName;
              transaction.GL = t.transactionDetails[0].glName;
            }
            this.pendingTransactions.push(transaction);
          });
        }

        this.counterSummaryForm.patchValue({
          totalPayment: data.data.data.todaysTransactionsAmount,
          pendingPayment: data.data.data.todaysPendingAmount,
          transactions: this.pendingTransactions,
        })

      })
  }

  get totalPayment() {
    return this.counterSummaryForm.get('totalPayment')!;
  }

  get pendingPayment() {
    return this.counterSummaryForm.get('pendingPayment')!;
  }

  get transactions() {
    return this.counterSummaryForm.get('transactions')!;
  }
}
