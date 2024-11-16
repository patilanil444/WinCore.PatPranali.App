import { Component, OnInit } from '@angular/core';
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
  constructor(private _sharedService: SharedService,
     private _transactionMasterService: TransactionMasterService) { }

  ngOnInit(): void {

    // let uiDenomination = {} as UiDenomination;
    // uiDenomination.id = 0;
    // uiDenomination.denomination= "2000";
    // uiDenomination.paymentNumber="";
    // uiDenomination.paymentTotal = "";
    // uiDenomination.receiptNumber= "";
    // uiDenomination.receiptTotal = "";
    // this.denominationNotes.push(uiDenomination);

    // uiDenomination = {} as UiDenomination;
    // uiDenomination.denomination= "1000";
    // this.denominationNotes.push(uiDenomination);
    
    // uiDenomination = {} as UiDenomination;
    // uiDenomination.denomination= "500";
    // this.denominationNotes.push(uiDenomination);

    // uiDenomination = {} as UiDenomination;
    // uiDenomination.denomination= "200";
    // this.denominationNotes.push(uiDenomination);

    // uiDenomination = {} as UiDenomination;
    // uiDenomination.denomination= "100";
    // this.denominationNotes.push(uiDenomination);

    // uiDenomination = {} as UiDenomination;
    // uiDenomination.denomination= "50";
    // this.denominationNotes.push(uiDenomination);
    
    // uiDenomination = {} as UiDenomination;
    // uiDenomination.denomination= "20";
    // this.denominationNotes.push(uiDenomination);

    // uiDenomination = {} as UiDenomination;
    // uiDenomination.denomination= "10";
    // this.denominationNotes.push(uiDenomination);

    // uiDenomination = {} as UiDenomination;
    // uiDenomination.denomination= "5";
    // this.denominationNotes.push(uiDenomination);

    // uiDenomination = {} as UiDenomination;
    // uiDenomination.denomination= "2";
    // this.denominationNotes.push(uiDenomination);

    // uiDenomination = {} as UiDenomination;
    // uiDenomination.denomination= "1";
    // this.denominationNotes.push(uiDenomination);

    //this.getDenominations();

    this.retrieveDenominations();
  }

  retrieveDenominations() {
    this.denominationNotes = this._sharedService.uiDenominatons;
  }

  // getDenominations(){
  //   this._transactionMasterService.getDenominations().subscribe((data: any) => {
  //     console.log(data);
  //     if (data) {
  //       this.denominationNotes = data.data.data;
  //       //this.total = this.denominationNotes.length;
  //     }
  //   })
  // }

  closeModal()
  {

  }

  saveDenomination()
  {

    // Emit
  }

  changeReceipt(index: number)
  {
    let denominationNote = this.denominationNotes[index];
    if (denominationNote) {
      let receiptNumber = denominationNote.receiptNumber;
      denominationNote.receiptTotal = parseInt(denominationNote.denomination)* parseInt(receiptNumber);
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
      denominationNote.paymentTotal = parseInt(denominationNote.denomination)* parseInt(paymentNumber);
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
