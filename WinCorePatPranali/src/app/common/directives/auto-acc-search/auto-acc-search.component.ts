import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AccountsService } from 'src/app/services/accounts/accounts/accounts.service';
import { SharedService } from 'src/app/services/shared.service';
import { UiEnumAccountStatus } from '../../models/common-ui-models';
import { NgxDropdownConfig } from 'ngx-select-dropdown';

@Component({
  selector: 'app-auto-acc-search',
  templateUrl: './auto-acc-search.component.html',
  styleUrls: ['./auto-acc-search.component.css']
})
export class AutoAccSearchComponent implements OnInit {

  searchForm!: FormGroup;
  uiAccountSearchBy: any[] = [];
  uiAccounts:any [] = [];
  keyword = "accountNo";

  @Output() accounts = new EventEmitter<any>();
  @Input() generalLedgers: any[] = [];

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

  constructor(private _accountsService: AccountsService, private _sharedService: SharedService,
    private _toastrService: ToastrService) { }

  ngOnInit(): void {
    this.searchForm = new FormGroup({
      generalLedger: new FormControl(0, []),
      searchText: new FormControl("", []),
    });

  }

  selectEvent(event:any)
  {

  }

  onChangeSearch(val: string)
  {
    this.searchForm.patchValue({
      searchText: val
    })

    this.searchAccount();
  }

  onFocused(event:any)
  {

  }

  searchAccount() {
    this.uiAccounts = [];
    if (this.searchText.value.length > 10) {

      let ledgerId = 0;
      let custNumber = '';
      let accNumber = '';
      if (this.generalLedger && this.generalLedger.value && this.generalLedger.value.code > 0) {
        ledgerId = this.generalLedger.value.code;
      }

      if (this.searchText.value && this.searchText.value.length > 0) {
        accNumber = this.searchText.value;
      }

      if (ledgerId > 0 || custNumber.length || accNumber.length) {
        this._accountsService.SearchAccountsAsync(this._sharedService.applicationUser.branchId,
          ledgerId, custNumber, accNumber).subscribe((data: any) => {
            console.log(data);
            if (data) {
              let accounts = data.data.data;
              if (this.uiAccounts) {
                this.uiAccounts = accounts.map((acc: any) => (
                  {
                    ...acc,
                    status: this.getStatus(acc.accountStatus)
                  }))
              }
            }
            this.accounts.emit(this.uiAccounts);
          })
      }
    }
    else {
      //this._toastrService.info('Enter account details to search.', 'Information!');
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

  get generalLedger() {
    return this.searchForm.get('generalLedger')!;
  }
  get searchText() {
    return this.searchForm.get('searchText')!;
  }

}
