import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxDropdownConfig } from 'ngx-select-dropdown';
import { ToastrService } from 'ngx-toastr';
import { IGeneralDTO, UiEnumAccountStatus } from 'src/app/common/models/common-ui-models';
import { UserRoleHeper } from 'src/app/common/utils/user-role-helper';
import { AccountsService } from 'src/app/services/accounts/accounts/accounts.service';
import { GeneralLedgerService } from 'src/app/services/masters/general-ledger/general-ledger.service';
import { PigmyAccountService } from 'src/app/services/pigmy/pigmy-account/pigmy-account.service';
import { PigmyMasterService } from 'src/app/services/pigmy/pigmy-master/pigmy-master.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-pigmy-account-search',
  templateUrl: './pigmy-account-search.component.html',
  styleUrls: ['./pigmy-account-search.component.css']
})
export class PigmyAccountSearchComponent implements OnInit {

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
  uiPigmyGeneralLedgers: any[] = [];

  uiAccounts: any[] = [];
  p: number = 1;
  total: number = 0;

  constructor(private router: Router, private _sharedService: SharedService,
    private _toastrService: ToastrService, private _generalLedgerService: GeneralLedgerService,
    private _pigmyAccountService: PigmyAccountService) { }

  ngOnInit(): void {
    this.searchForm = new FormGroup({
      generalLedger: new FormControl("", []),
      accountNumber: new FormControl("", []),
    });

    this.getGeneralLedgers();
    UserRoleHeper.initialiseUserRoles(this._sharedService.applicationUser);
  }

  isOperatorUser() {
    return UserRoleHeper.isOperatorUser();
  }

  isDepositOfficerUser() {
    return UserRoleHeper.isDepositOfficerUser();
  }

  isPassingOfficerUser() {
    return UserRoleHeper.isPassingOfficerUser();
  }

  isLoanOfficerUser() {
    return UserRoleHeper.isLoanOfficerUser();
  }

  getGeneralLedgers() {
    this.uiPigmyGeneralLedgers = [];
    this._generalLedgerService.getGeneralLedgers(this._sharedService.applicationUser.branchId).subscribe((data: any) => {
     
      if (data) {
        this.uiAllGeneralLedgers = data.data.data;
        if (this.uiAllGeneralLedgers) {

          this.uiAllGeneralLedgers.map((gl: any, i: any) => {
            gl.glName = gl.code + "-" + gl.glName;
          });

          this.uiPigmyGeneralLedgers = this.uiAllGeneralLedgers.filter(gl => gl.glGroup == 'D' && gl.glType == 'P');
        }
      }
    })
  }

  searchAccounts() {
    let ledgerId = 0;
    let accNumber = '';
    if (this.generalLedger && this.generalLedger.value && this.generalLedger.value.code > 0) {
      ledgerId = this.generalLedger.value.code;
    }
    //  else
    //   {
    //     this._toastrService.info('Please select GL', 'Info!');
    //   }

    if (this.accountNumber) {
      accNumber = this.accountNumber.value;
    }

    if (ledgerId > 0 || accNumber.length) {
      this._pigmyAccountService.SearchAccountsAsync(this._sharedService.applicationUser.branchId, 
        ledgerId, accNumber).subscribe((data: any) => {
       
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
    this._pigmyAccountService.setDTO({id: 0});
    this.configClick(route);
  }

  edit(uiAccount: any) {
    let dtObject: IGeneralDTO = {
      route: "accounts",
      action: "editRecord",
      id: uiAccount.accountsId,
      maxId: 0,
      models: this.uiAccounts
    }

    this._pigmyAccountService.setDTO(dtObject);
    this.configClick("pigmy-account");
  }

  configClick(routeValue: string) {
    sessionStorage.setItem("configMenu", routeValue);
    this.router.navigate(['/app/' + routeValue]);
  }

  get generalLedger() {
    return this.searchForm.get('generalLedger')!;
  }
 
  get accountNumber() {
    return this.searchForm.get('accountNumber')!;
  }
}
