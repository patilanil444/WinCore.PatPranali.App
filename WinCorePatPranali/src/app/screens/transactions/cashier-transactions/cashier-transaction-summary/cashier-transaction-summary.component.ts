import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { SharedService } from 'src/app/services/shared.service';
import { CashierTransactionsService } from 'src/app/services/transactions/cashier-transactions/cashier-transactions.service';
import { TransactionMasterService } from 'src/app/services/transactions/transaction-master/transaction-master.service';

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
  selector: 'app-cashier-transaction-summary',
  templateUrl: './cashier-transaction-summary.component.html',
  styleUrls: ['./cashier-transaction-summary.component.css']
})
export class CashierTransactionSummaryComponent implements OnInit {

  cashierSummaryForm!: FormGroup;
  pendingTransactions: any[] = [];

  constructor(private _transactionMasterService: TransactionMasterService, private _sharedService: SharedService,
    private _cashierTransactionsService: CashierTransactionsService) { }

  ngOnInit(): void {
    this.cashierSummaryForm = new FormGroup({
      receiptTotal: new FormControl(0, []),
      paymentTotal: new FormControl(0, []),
      receiptPendingCash: new FormControl(0, []),
      paymentPendingCash: new FormControl(0, []),
      transactions: new FormControl([], []),
    });

    this.getDailyCashierSummary();

  }

  getDailyCashierSummary() {
    this._cashierTransactionsService.getCashierDailyTransactionSummary(this._sharedService.applicationUser.branchId,
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
              transaction.CDFlag = t.transactionDetails[0].cdFlag;
              transaction.CustomerName = t.transactionDetails[0].customerName;
              transaction.GL = t.transactionDetails[0].glName;
            }
            this.pendingTransactions.push(transaction);
          });
        }

        this.cashierSummaryForm.patchValue({
          receiptTotal: data.data.data.dailyReceiptTotal,
          paymentTotal: data.data.data.dailyPaymentTotal,
          receiptPendingCash: data.data.data.dailyReceiptPendingCashTotal,
          paymentPendingCash: data.data.data.dailyPaymentPendingCashTotal,
          transactions: this.pendingTransactions,
        })



      })
  }


  get receiptTotal() {
    return this.cashierSummaryForm.get('receiptTotal')!;
  }

  get paymentTotal() {
    return this.cashierSummaryForm.get('paymentTotal')!;
  }

  get receiptPendingCash() {
    return this.cashierSummaryForm.get('receiptPendingCash')!;
  }

  get paymentPendingCash() {
    return this.cashierSummaryForm.get('paymentPendingCash')!;
  }

  get transactions() {
    return this.cashierSummaryForm.get('transactions')!;
  }

}
