import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AccountsService } from 'src/app/services/accounts/accounts/accounts.service';
import { GeneralLedgerService } from 'src/app/services/masters/general-ledger/general-ledger.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-balance-certificate',
  templateUrl: './balance-certificate.component.html',
  styleUrls: ['./balance-certificate.component.css']
})
export class BalanceCertificateComponent implements OnInit {
  uiAllGeneralLedgers: any[] = [];
  uiAccounts: any[] = [];
  asOnDate = formatDate(new Date(Date.now()), 'yyyy-MM-dd', 'en');

  p: number = 1;
  total: number = 0;

  constructor( private _toastrService: ToastrService, private _generalLedgerService: GeneralLedgerService,
    private _accountsService: AccountsService, private _sharedService: SharedService) { }

  ngOnInit(): void {

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

  printCertificate()
  {


  }

}
