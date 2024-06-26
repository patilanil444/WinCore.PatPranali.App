import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxDropdownConfig } from 'ngx-select-dropdown';
import { ToastrService } from 'ngx-toastr';
import { IGeneralDTO, UiEnumAccountStatus } from 'src/app/common/models/common-ui-models';
import { DepositAccountService } from 'src/app/services/accounts/deposit-accounts/deposit-account.service';
import { SavingAccountService } from 'src/app/services/accounts/saving-accounts/saving-account.service';
import { GeneralLedgerService } from 'src/app/services/masters/general-ledger/general-ledger.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-account-search',
  templateUrl: './account-search.component.html',
  styleUrls: ['./account-search.component.css']
})
export class AccountSearchComponent implements OnInit {

  config: NgxDropdownConfig = {
    displayKey: "glName",
    height: "auto",
    search: true,
    placeholder: "Select GL",
    searchPlaceholder: "Search GL by name...",
    limitTo: 0,
    customComparator: undefined,
    noResultsFound: "No results found",
    moreText: "more",
    clearOnSelection: false,
    inputDirection: "ltr",
    enableSelectAll: false,
  };

  searchForm!: FormGroup;

  uiAllGeneralLedgers: any[] = [];
  uiAccounts: any[] = [];
  p: number = 1;
  total: number = 0;

  constructor(private router: Router, private _sharedService: SharedService,
    private _toastrService: ToastrService, private _generalLedgerService: GeneralLedgerService,
    private _depositAccountService: DepositAccountService,private _savingAccountService: SavingAccountService) { }

  ngOnInit(): void {
    this.searchForm = new FormGroup({
      generalLedger: new FormControl("", []),
      accountNumber: new FormControl("", []),
      customerNumber: new FormControl("", []),
    });

    this.getGeneralLedgers();
  }

  getGeneralLedgers() {
    this._generalLedgerService.getGeneralLedgers(this._sharedService.applicationUser.branchId).subscribe((data: any) => {
      console.log(data);
      if (data) {
        this.uiAllGeneralLedgers = data.data.data;
        if (this.uiAllGeneralLedgers) {

          this.uiAllGeneralLedgers.map((gl: any, i: any) => {
            gl.glName = gl.code + "-" + gl.glName;
          });
        }
      }
    })
  }

  // getCustomers(custData: any) {
  //   this.uiCustomers = custData;
  // }

  searchAccounts() {
    let ledgerId = 0;
    let custNumber = '';
    let accNumber = '';
    if (this.generalLedger && this.generalLedger.value && this.generalLedger.value.code > 0) {
      ledgerId = this.generalLedger.value.code;
    }
    //  else
    //   {
    //     this._toastrService.info('Please select GL', 'Info!');
    //   }

    if (this.customerNumber) {
      custNumber = this.customerNumber.value;
    }

    if (this.accountNumber) {
      accNumber = this.accountNumber.value;
    }

    if (ledgerId > 0 || custNumber.length || accNumber.length) {
      this._depositAccountService.SearchAccountsAsync(this._sharedService.applicationUser.branchId, ledgerId, custNumber, accNumber).subscribe((data: any) => {
        console.log(data);
        if (data) {
          let accounts = data.data.data;
          if (this.uiAccounts) {
            this.uiAccounts = accounts.map((acc: any) => (
              {
                ...acc,
                status: this.getStatus(acc.accountStatus)
              }))
            //this.uiDepositGeneralLedgers = this.uiAllGeneralLedgers.filter(gl => gl.glGroup == 'D');
          }
        }
      })
    }
  }

  getStatus(status: number) {
    if (status == UiEnumAccountStatus.OPEN) {
      return "Open";
    }
    else if (status == UiEnumAccountStatus.FREEZE) {
      return "Freeze";
    }
    else if (status == UiEnumAccountStatus.DORMANT) {
      return "Dormant";
    }
    else if (status == UiEnumAccountStatus.CLOSE) {
      return "Closed";
    }
    return "";
  }

  pageChangeEvent(event: number) {
    this.p = event;
  }


  cancelDelete() {


  }

  delete(uiCustomer: any) {
    // if (uiCustomer.id > 0) {
    //   this._customerService.customerIdToDelete = uiCustomer.id;
    // }
  }

  onDelete() {

  }


  clear() {
    // this.custSearch.clear();
  }

  addAccount(route: string) {
    this._depositAccountService.setDTO({});
    this._savingAccountService.setDTO({});
    this.configClick(route);
  }

  edit(uiAccount: any) {
    let dtObject: IGeneralDTO = {
      route: "customer",
      action: "editRecord",
      id: uiAccount.accountsId,
      maxId: 0,
    }
    if (uiAccount.glGroup == 'D' && uiAccount.glType =='S') {
      // Saving accounts
      this._savingAccountService.setDTO(dtObject);
      this.configClick("saving-accounts");
    }
    else if (uiAccount.glGroup == 'D' && uiAccount.glType !='S') {
      // Deposit accounts
      this._depositAccountService.setDTO(dtObject);
      this.configClick("deposit-accounts");
    }
    else if (uiAccount.glGroup == 'L') {
      
    }
    else if (uiAccount.glGroup == 'G') {
      
    }
    else if (uiAccount.glGroup == 'B') {
      
    }
  }

  configClick(routeValue: string) {
    sessionStorage.setItem("configMenu", routeValue);
    this.router.navigate(['/app/' + routeValue]);
  }

  get generalLedger() {
    return this.searchForm.get('generalLedger')!;
  }
  get customerNumber() {
    return this.searchForm.get('customerNumber')!;
  }
  get accountNumber() {
    return this.searchForm.get('accountNumber')!;
  }
}
