import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-cash-voucher-passing',
  templateUrl: './cash-voucher-passing.component.html',
  styleUrls: ['./cash-voucher-passing.component.css']
})
export class CashVoucherPassingComponent implements OnInit {

  cashVoucherForm!: FormGroup;
  passingInfoForm!: FormGroup; 
  uiSavingAccounts: any[] = [];
  uicashTransactionTypes: any[] = [];
  uiBankAccounts : any[] = [];
  constructor() { }

  ngOnInit(): void {
  }

}
