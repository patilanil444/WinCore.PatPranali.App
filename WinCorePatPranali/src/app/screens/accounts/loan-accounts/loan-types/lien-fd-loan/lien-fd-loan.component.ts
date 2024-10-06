import { formatDate } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxDropdownConfig } from 'ngx-select-dropdown';
import { ToastrService } from 'ngx-toastr';
import { UiEnumAccountStatus } from 'src/app/common/models/common-ui-models';
import { AccountsService } from 'src/app/services/accounts/accounts/accounts.service';
import { DepositAccountService } from 'src/app/services/accounts/deposit-accounts/deposit-account.service';
import { BranchMasterService } from 'src/app/services/masters/branch-master/branch-master.service';
import { GeneralLedgerService } from 'src/app/services/masters/general-ledger/general-ledger.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-lien-fd-loan',
  templateUrl: './lien-fd-loan.component.html',
  styleUrls: ['./lien-fd-loan.component.css']
})
export class LienFdLoanComponent implements OnInit {

  lienFDForm!: FormGroup;
  fdTotalForm!: FormGroup;

  uiBranches: any[] = [];
  uiFDAccounts: any[] = [];
  uiAddedFDAccounts: any[] = [];

  uiAllGeneralLedgers: any[] = [];
  uiDepositGeneralLedgers: any[] = [];

  @Output() depositLoanDetails = new EventEmitter<any>();

  p_FD: number = 1;
  total_FDs: number = 0;

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

  constructor(private _depositAccountService: DepositAccountService, private _accountsService: AccountsService,
    private _branchMasterService: BranchMasterService, private _toastrService: ToastrService,
  private _generalLedgerService: GeneralLedgerService, private _sharedService: SharedService) { }

  ngOnInit(): void {

    this.lienFDForm = new FormGroup({
      branchId: new FormControl(0, []),
      lienFDGL: new FormControl(0, []),
      accountNumberSearch: new FormControl("", []),
      accountNumber: new FormControl("", [Validators.required]),
      fdAmount : new FormControl("", []),
      fdOpenDate : new FormControl("", []),
      fdExpiryDate : new FormControl("", []),
      fdMatureDate : new FormControl("", []),
      markOn : new FormControl(formatDate(new Date(Date.now()), 'yyyy-MM-dd', 'en'), [Validators.required]),
      markBy : new FormControl("", [Validators.required]),
      releaseOn : new FormControl(formatDate(new Date(Date.now()), 'yyyy-MM-dd', 'en'), []),
      releaseBy : new FormControl("", []),
    });

    this.fdTotalForm = new FormGroup({
      totalAmount: new FormControl(0, []),
    });

    this.getBranches();
    this.getGeneralLedgers();
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

            this.uiDepositGeneralLedgers = this.uiAllGeneralLedgers.filter(gl => gl.glGroup == 'D' && gl.glType != 'S');
            
            resolve(true);
          }
        }
        else {
          resolve(false);
        }
      })
    })
  }

  getBranches() {
    this._branchMasterService.getBranches().subscribe((data: any) => {
      this.uiBranches = data.data.data;
      if (this.uiBranches && this.uiBranches.length) {
        this.lienFDForm.patchValue({
          branchId: this.uiBranches[0].branchCode,
        })
      }
    })
  }

  selectLienFDAccount(accountsId: number){
    if (accountsId) {
      this._depositAccountService.getDepositAccount(accountsId).subscribe((data: any) => {
        console.log(data);
        if (data) {
          if (data.statusCode == 200 && data.data.data) {
            let fdDetails = data.data.data;
            this.lienFDForm.patchValue({
              accountNumberSearch: fdDetails.accountNo,
              accountNumber: fdDetails.accountNo,
              fdAmount : fdDetails.fD_Amt,
              fdOpenDate : formatDate(new Date(fdDetails.opn_Date), 'yyyy-MM-dd', 'en') ,
              fdExpiryDate : formatDate(new Date(fdDetails.exp_Date), 'yyyy-MM-dd', 'en') ,
              fdMatureDate : formatDate(new Date(fdDetails.exp_Date), 'yyyy-MM-dd', 'en') ,
            })
          }
        }
      })
    }
  }

  searchLienFDAccount() {
    if (this.branchId.value > 0) {
      if (this.lienFDGL && this.lienFDGL.value && this.lienFDGL.value.code > 0) {
        if (this.accountNumberSearch && this.accountNumberSearch.value) {
          this._accountsService.SearchAccountsAsync(this.branchId.value, this.lienFDGL.value.code, "", 
          this.accountNumberSearch.value).subscribe((data: any) => {
              let accounts = data.data.data;
              if (accounts) {
                this.uiFDAccounts = accounts.map((acc: any) => (
                  {
                    ...acc,
                    status: this.getStatus(acc.accountStatus)
                  }))
              }
            })
        }
        else {
          this._toastrService.error('Please enter account number', 'Error!');
        }
      }
      else {
        this._toastrService.error('Please select general ledger', 'Error!');
      }
    }
    else {
      this._toastrService.error('Please select branch', 'Error!');
    }
  }

  changeFDLienGeneralLedger(event: any) {
    let glValue = event.value;
    if (glValue) {
      this.lienFDForm.patchValue({
        lienFDGL: glValue.code,
      })
    }
  }

  AddFD() {
    // Check if FD is not matured
    let maturityDate = new Date(this.fdMatureDate.value);
    let todaysDate = new Date();

    if (!isNaN(maturityDate.getTime())) {
      if (todaysDate.getTime() <= maturityDate.getTime()) {
        // Add FD into list
  
        if (!isNaN(parseInt(this.lienFDGL.value.code)) && !isNaN(parseInt(this.branchId.value)) &&
          !isNaN(parseInt(this.accountNumber.value))) {
          let selectedGL = this.uiDepositGeneralLedgers.filter(gl => gl.code == parseInt(this.lienFDGL.value.code));
          let selectedGLName = "";
          if (selectedGL && selectedGL.length > 0) {
            selectedGLName = selectedGL[0].glName;
          }
  
          let selectedBranch = this.uiBranches.filter(b => b.branchCode == parseInt(this.branchId.value));
          let selectedBranchName = "";
          if (selectedBranch && selectedBranch.length > 0) {
            selectedBranchName = selectedBranch[0].branchName;
          }
  
          let validFd = {
            branch: selectedBranchName,
            gl: selectedGLName,
            accountNumber: this.accountNumber.value,
            fdAmount: this.fdAmount.value,
            opening: formatDate(new Date(this.fdOpenDate.value), 'yyyy-MM-dd', 'en'),
            maturity: formatDate(new Date(this.fdMatureDate.value), 'yyyy-MM-dd', 'en'),
            markOn: formatDate(new Date(this.markOn.value), 'yyyy-MM-dd', 'en'),
            markBy: this.markBy.value,
            releaseOn: formatDate(new Date(this.releaseOn.value), 'yyyy-MM-dd', 'en'),
            releaseBy: this.releaseBy.value,
            status:'A'
          };
          this.uiAddedFDAccounts.push(validFd);

          this.depositLoanDetails.emit(this.uiAddedFDAccounts);

          this.calculateTotalAmount();
        }
        else {
          this._toastrService.error('Please search FD to add.', 'Error!');
        }
      }
      else {
        this._toastrService.error('FD is already matured and can not be added.', 'Error!');
      }
    }
    else
    {
      this._toastrService.error('Please search FD to add.', 'Error!');
    }  
  }

  calculateTotalAmount() {
    let totalLoanAmount = 0;
    this.uiAddedFDAccounts.forEach(item => {
      if (item.status != "D") {
        totalLoanAmount = totalLoanAmount + parseFloat(item.fdAmount);
      }
    });

    this.fdTotalForm.patchValue({
      totalAmount: totalLoanAmount
    })
  }

  clearFD()
  {

  }

  deleteAccount(uiAddedFDAccount: any, index: number)
  {

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

  get branchId() {
    return this.lienFDForm.get('branchId')!;
  } 
  get lienFDGL() {
    return this.lienFDForm.get('lienFDGL')!;
  }
  get accountNumberSearch() {
    return this.lienFDForm.get('accountNumberSearch')!;
  }
  get accountNumber() {
    return this.lienFDForm.get('accountNumber')!;
  }
  get fdAmount() {
    return this.lienFDForm.get('fdAmount')!;
  }
  get fdOpenDate() {
    return this.lienFDForm.get('fdOpenDate')!;
  }
  get fdExpiryDate() {
    return this.lienFDForm.get('fdExpiryDate')!;
  }
  get fdMatureDate() {
    return this.lienFDForm.get('fdMatureDate')!;
  }
  get markOn() {
    return this.lienFDForm.get('markOn')!;
  }
  get markBy() {
    return this.lienFDForm.get('markBy')!;
  }
  get releaseOn() {
    return this.lienFDForm.get('releaseOn')!;
  }
  get releaseBy() {
    return this.lienFDForm.get('releaseBy')!;
  }

  ///

  get totalAmount() {
    return this.fdTotalForm.get('totalAmount')!;
  }
}
