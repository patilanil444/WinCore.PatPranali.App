import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxDropdownConfig } from 'ngx-select-dropdown';
import { ToastrService } from 'ngx-toastr';
import { AccountsService } from 'src/app/services/accounts/accounts/accounts.service';
import { CustomerService } from 'src/app/services/customers/customer/customer.service';
import { GeneralLedgerService } from 'src/app/services/masters/general-ledger/general-ledger.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-opening-balance',
  templateUrl: './opening-balance.component.html',
  styleUrls: ['./opening-balance.component.css']
})
export class OpeningBalanceComponent implements OnInit {

  uiAllGeneralLedgers: any[] = [];
  uiAccounts: any[] = [];
  balanceForm!: FormGroup;

  p: number = 1;
  total: number = 0;

  constructor(private router: Router, private _sharedService: SharedService, private _toastrService: ToastrService,
    private _generalLedgerService: GeneralLedgerService, private _customerService: CustomerService,
    private _accountsService: AccountsService) { }

  ngOnInit(): void {

    this.balanceForm = new FormGroup({
      generalLedger: new FormControl(0, []),
      accountId: new FormControl(0, []),
      openingBalance: new FormControl("", [Validators.required]),
      principalisedInterest: new FormControl("", [Validators.required]),
      seperateInterest: new FormControl("", [Validators.required]),
      customerName :new FormControl("", []),
    });

    this.getGeneralLedgers().then(result => {
      if (result) {
        //this.loadForm();
      }
    }).catch(error => {
      this._toastrService.error('Error loading general ledgers', 'Warning!');
    });
  }

  pageChangeEvent(event: number) {
    this.p = event;
  }

  getGeneralLedgers() {
    return new Promise((resolve, reject) => {
      this._generalLedgerService.getGeneralLedgers(this._sharedService.applicationUser.branchId).subscribe((data: any) => {
        console.log(data);
        if (data) {
          this.uiAllGeneralLedgers = data.data.data;
          if (this.uiAllGeneralLedgers) {

            this.uiAllGeneralLedgers.map((gl: any, i: any) => {
              gl.glName = gl.code + "-" + gl.glName;
            });

            resolve(true);
          }
        }
        else {
          resolve(false);
        }
      })
    })
  }

  getAccounts(accountsData: any) {
    this.uiAccounts = accountsData;
  }

  selectAccount(account: any)
  {
    
  }

  saveBalance()
  {
    
  }

  // changeGeneralLedger(event: any) {
  //   let glValue = event.value;
  //   if (glValue) {
  //     if (glValue.glGroup == 'D' && glValue.glType == 'F') {
  //       this.isFDAccount = true;
  //     }
  //     if (glValue.glGroup == 'D' && glValue.glType == 'R') {
  //       this.isRDAccount = true;
  //     }
  //     this.getMaxAccountNumber(glValue.code);
  //   }
  // }

}
