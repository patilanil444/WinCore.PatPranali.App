import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { DenominationsComponent } from 'src/app/common/directives/denominations/denominations.component';
import { SharedService } from 'src/app/services/shared.service';
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
  Denominations: IDenomination[];
}

export interface IDenomination {
  BranchCode: number;
  Scroll_Id: number;
  Denomination_id: number;
  Denomination_Quantity: number;
  denomination_type: number;
}


@Component({
  selector: 'app-cashier-cash-exchange',
  templateUrl: './cashier-cash-exchange.component.html',
  styleUrls: ['./cashier-cash-exchange.component.css']
})
export class CashierCashExchangeComponent implements OnInit {

  @ViewChild('denominationModal', {static: false}) denominationsModal: DenominationsComponent
  cashExchangeForm!: FormGroup;

  uiTransactionDenominations : any = [];
  transactionType = "exchange";

  constructor( private _toastrService: ToastrService, private _sharedService: SharedService,
    private _transactionMasterService: TransactionMasterService) { }

  ngOnInit(): void {
    this.cashExchangeForm = new FormGroup({
      receiptAmount: new FormControl("", [Validators.required]),
    });
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

  isValidTransaction()
  {
    if (parseFloat(this.receiptAmount.value) > 0) {
      if (this.uiTransactionDenominations && this.uiTransactionDenominations.length) {
        return true;
      }
    }

    this._toastrService.error('Please enter transaction amount and denominations.', 'Error!');

    return false;
  }

  makeTransaction()
  {
    if (this.isValidTransaction()) {
      let transactionSummary = {} as ITransactionSummaryModel;
      transactionSummary.Id = 0;
      transactionSummary.BranchCode = this._sharedService.applicationUser.branchId;
      transactionSummary.VoucherDate = new Date();
      transactionSummary.VoucherType = 3; // 1 = Receipt 2 = Payment
      transactionSummary.VoucherNo = 0;
      transactionSummary.VoucherAmount = parseFloat(this.receiptAmount.value);
      transactionSummary.TransactionNarration = "";
      transactionSummary.YearEnd = false;
      transactionSummary.UTR_ChequeNo = "";
      transactionSummary.UTR_ChequeDate = new Date();
      transactionSummary.TransactionPassing = false;
      transactionSummary.CreatedBy = this._sharedService.applicationUser.userName;
      transactionSummary.VerifiedBy = "";
      transactionSummary.VerifiedDateTime = new Date();

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

      this.executeTransaction(transactionSummary);
      this.clearTransaction();
    }
  }

  executeTransaction(transactionSummary: ITransactionSummaryModel)
  {
    this._transactionMasterService.saveCashTransaction(transactionSummary).subscribe((data: any) => {
      console.log(data);
      if (data) {
        if (data.data.data && data.data.data.retId > 0) {
          if (data.data.data.status == "SUCCESS") {
            this._toastrService.success("Exchange transaction completed", 'Success!');
          }
          else {
            this._toastrService.success("Error saving transaction!", 'Error!');
          }
        }
      }
    })
  }

  clearTransaction() {
    this.uiTransactionDenominations = [];
    this.cashExchangeForm.patchValue({
      receiptAmount: ""
    });
  }

  get receiptAmount() {
    return this.cashExchangeForm.get('receiptAmount')!;
  }

}
