import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-passing-info',
  templateUrl: './passing-info.component.html',
  styleUrls: ['./passing-info.component.css'],
  providers: [DatePipe]
})
export class PassingInfoComponent implements OnInit {

  uiBankAccount: any = {};
  uiVoucherTransactionSummary: any={};
  uiVoucherTransactionDetails: any={};
  branchName: string = "";
  @ViewChild('passingInfoModel', {static: false}) modal: ElementRef;
  
  constructor(private datePipe: DatePipe) { }

  ngOnInit(): void {

  }


  setAccountDetails(branchName: string, accountsData: any, voucherTransactionSummary: any) {
    this.branchName = branchName;
    let bankAccounts = accountsData;
    if (bankAccounts && bankAccounts.length) {
      this.uiBankAccount = bankAccounts[0];
      this.uiBankAccount.lastTransactionDate = this.datePipe.transform(this.uiBankAccount.lastTransactionDate, 'dd-MM-yyyy')
      this.uiBankAccount.lastInterestDate = this.datePipe.transform(this.uiBankAccount.lastInterestDate, 'dd-MM-yyyy')
      this.uiBankAccount.openDate = this.datePipe.transform(this.uiBankAccount.openDate, 'dd-MM-yyyy')
      if (voucherTransactionSummary.utR_ChequeNo.length) {
        this.uiBankAccount.chequeDate = this.datePipe.transform(voucherTransactionSummary.utR_ChequeDate,'dd-MM-yyyy');
        this.uiBankAccount.chequeNo =voucherTransactionSummary.utR_ChequeNo;
      }
      
    }
    if (voucherTransactionSummary) {
      

      this.uiVoucherTransactionSummary = voucherTransactionSummary;
      this.uiVoucherTransactionDetails = voucherTransactionSummary.transactionDetails[0];
    }
    if (this.uiBankAccount && this.uiVoucherTransactionDetails) {
      if (voucherTransactionSummary.voucherType == 1 && voucherTransactionSummary.cdType == 1) {
        this.uiBankAccount.nextBalance = parseFloat(this.uiBankAccount.balance) + parseFloat(this.uiVoucherTransactionDetails.transaction_Amount)
      }
      else if(voucherTransactionSummary.voucherType == 1 && voucherTransactionSummary.cdType == 2)
      {
        this.uiBankAccount.nextBalance = parseFloat(this.uiBankAccount.balance) - parseFloat(this.uiVoucherTransactionDetails.transaction_Amount)
      }
    }
  }


  open() {
    this.modal.nativeElement.style.display = 'block';
  }

  clear()
  {
   
  }

  close() {
    this.modal.nativeElement.style.display = 'none';
  }
}
