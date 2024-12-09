import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-passing-info',
  templateUrl: './passing-info.component.html',
  styleUrls: ['./passing-info.component.css']
})
export class PassingInfoComponent implements OnInit {

  uiBankAccount: any = {};
  uiVoucherTransactionSummary: any={};
  uiVoucherTransactionDetails: any={};
  @ViewChild('passingInfoModel', {static: false}) modal: ElementRef;
  
  constructor() { }

  ngOnInit(): void {

  }


  setAccountDetails(accountsData: any, voucherTransactionSummary: any) {
    let bankAccounts = accountsData;
    if (bankAccounts && bankAccounts.length) {
      this.uiBankAccount = bankAccounts[0];
      
    }
    if (voucherTransactionSummary) {
      this.uiVoucherTransactionSummary = voucherTransactionSummary;
      this.uiVoucherTransactionDetails = voucherTransactionSummary.transactionDetails[0];
    }
    if (this.uiBankAccount && this.uiVoucherTransactionDetails) {
      this.uiBankAccount.nextBalance = parseFloat(this.uiBankAccount.balance) + parseFloat(this.uiVoucherTransactionDetails.transaction_Amount)
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
