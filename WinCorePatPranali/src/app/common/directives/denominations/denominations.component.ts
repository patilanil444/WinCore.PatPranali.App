import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { SharedService } from 'src/app/services/shared.service';
import { TransactionMasterService } from 'src/app/services/transactions/transaction-master/transaction-master.service';

export interface UiDenomination {
  id: number,
  denomination: string,
  receiptNumber: string,
  receiptTotal: string,
  paymentNumber: string,
  paymentTotal: string,
}

@Component({
  selector: 'app-denominations',
  templateUrl: './denominations.component.html',
  styleUrls: ['./denominations.component.css']
})
export class DenominationsComponent implements OnInit {

  denominationNotes: any[] = [];
  totalReceiptAmount = 0;
  totalPaymentAmount = 0;
 
  @Input() denominationAmount: number;
  @Output() addedDenominations = new EventEmitter<any>();
  @ViewChild('denominationModal', {static: false}) modal: ElementRef;

  constructor(private _sharedService: SharedService, private _toastrService: ToastrService,
     private _transactionMasterService: TransactionMasterService) { }

  ngOnInit(): void {

    this.retrieveDenominations();
  }

  retrieveDenominations() {
    this.denominationNotes = this._sharedService.uiDenominatons;
  }

  open() {
    this.modal.nativeElement.style.display = 'block';
  }

  clear()
  {
    for (let index = 0; index < this.denominationNotes.length; index++) {
      this.denominationNotes[index].receiptNumber = "";
      this.denominationNotes[index].paymentNumber = "";
      this.denominationNotes[index].receiptTotal = "";
      this.denominationNotes[index].paymentTotal = "";
    }
  }

  close() {
    this.modal.nativeElement.style.display = 'none';
  }

  saveDenomination()
  {
    let totalAmount = 0;
    let validDenominations: any[] = [];
    this.denominationNotes.forEach((deno: any)=>{
      if (parseFloat(deno.receiptNumber) > 0 || parseFloat(deno.paymentNumber) > 0) {
        validDenominations.push(deno);
        if (deno.receiptTotal > 0) {
          totalAmount = totalAmount + deno.receiptTotal;
        }
        if (deno.paymentTotal > 0) {
          totalAmount = totalAmount - deno.paymentTotal
        }
      }
    });

    // Emit
    if (totalAmount == this.denominationAmount) {
      this.addedDenominations.emit(validDenominations);
      this.close();
    }
    else
    {
      this._toastrService.error('Transaction amount is not matching with denominations.', 'Error!');
    }
  }

  changeReceipt(index: number)
  {
    let denominationNote = this.denominationNotes[index];
    if (denominationNote) {
      let receiptNumber = denominationNote.receiptNumber;
      denominationNote.receiptTotal = parseInt(denominationNote.denomination_Value)* parseInt(receiptNumber);
    }

    let totalReceiptAmount = 0;
    this.denominationNotes.forEach((d: any) => {
      if (d.receiptTotal) {
        totalReceiptAmount = totalReceiptAmount + parseFloat(d.receiptTotal);
      }
    })

    this.totalReceiptAmount = totalReceiptAmount;

  }

  changePayment(index: number)
  {
    let denominationNote = this.denominationNotes[index];
    if (denominationNote) {
      let paymentNumber = denominationNote.paymentNumber;
      denominationNote.paymentTotal = parseInt(denominationNote.denomination_Value)* parseInt(paymentNumber);
    }

    let totalPaymentAmount = 0;
    this.denominationNotes.forEach((d: any) => {
      if (d.paymentTotal) {
        totalPaymentAmount = totalPaymentAmount + parseFloat(d.paymentTotal);
      }
    })

    this.totalPaymentAmount = totalPaymentAmount;
  }
}
