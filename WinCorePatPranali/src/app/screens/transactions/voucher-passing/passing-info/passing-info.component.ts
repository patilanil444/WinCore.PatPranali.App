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
  branchName: string = "";
  @ViewChild('passingInfoModel', {static: false}) modal: ElementRef;
  
  constructor() { }

  ngOnInit(): void {

  }


  setAccountDetails(branchName: string, accountsData: any, voucherTransactionSummary: any) {
    this.branchName = branchName;
    let bankAccounts = accountsData;
    if (bankAccounts && bankAccounts.length) {
      this.uiBankAccount = bankAccounts[0];
    }
    if (voucherTransactionSummary) {
      

      this.uiVoucherTransactionSummary = voucherTransactionSummary;
      this.uiVoucherTransactionDetails = voucherTransactionSummary.transactionDetails[0];
    }
    if (this.uiBankAccount && this.uiVoucherTransactionDetails) {
      if (voucherTransactionSummary.voucherType == 1 && voucherTransactionSummary.cdType == 0) {
        this.uiBankAccount.nextBalance = parseFloat(this.uiBankAccount.balance) + parseFloat(this.uiVoucherTransactionDetails.transaction_Amount)
      }
      else
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
