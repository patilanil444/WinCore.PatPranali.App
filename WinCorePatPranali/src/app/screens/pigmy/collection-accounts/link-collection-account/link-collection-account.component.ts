import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxDropdownConfig } from 'ngx-select-dropdown';
import { ToastrService } from 'ngx-toastr';
import { BranchMasterService } from 'src/app/services/masters/branch-master/branch-master.service';
import { GeneralLedgerService } from 'src/app/services/masters/general-ledger/general-ledger.service';
import { PigmyMasterService } from 'src/app/services/pigmy/pigmy-master/pigmy-master.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-link-collection-account',
  templateUrl: './link-collection-account.component.html',
  styleUrls: ['./link-collection-account.component.css']
})
export class LinkCollectionAccountComponent implements OnInit {

  collectionAccountForm!: FormGroup;

  // config: NgxDropdownConfig = {
  //   displayKey: "glName",
  //   height: "auto",
  //   search: true,
  //   placeholder: "Select GL",
  //   searchPlaceholder: "Search GL by name...",
  //   limitTo: 0,
  //   customComparator: undefined,
  //   noResultsFound: "No results found",
  //   moreText: "more",
  //   clearOnSelection: false,
  //   inputDirection: "ltr",
  //   enableSelectAll: false,
  // };

  configAgent: NgxDropdownConfig = {
    displayKey: "name",
    height: "auto",
    search: true,
    placeholder: "Select Agent",
    searchPlaceholder: "Search by name...",
    limitTo: 0,
    customComparator: undefined,
    noResultsFound: "No results found",
    moreText: "more",
    clearOnSelection: false,
    inputDirection: "ltr",
    enableSelectAll: false,
  };

  uiPigmyAgents: any[] = [];
  uiGeneralLedgers: any = [];
  uiBranches: any[] = [];
  isResetAccountSearch: boolean = false;
  uiBankAccount:any = {};

  constructor(private router: Router, private _sharedService: SharedService, private _toastrService: ToastrService,
    private _generalLedgerService: GeneralLedgerService, private _pigmyMasterService: PigmyMasterService,
    private _branchMasterService: BranchMasterService) { }

  ngOnInit(): void {
    this.collectionAccountForm = new FormGroup({
      pigmyAgent: new FormControl("", []),
      generalLedger: new FormControl("", []),
      balanceWillBe: new FormControl("", []),
      customerName: new FormControl("", []),
      accountNumber: new FormControl("", []),
      accountId: new FormControl("", []),
      glCode: new FormControl("", []),
      accountType: new FormControl("", []),
      modeOfOperation: new FormControl("", []),
      balance: new FormControl("", []),
      minBalance: new FormControl("", []),
      unclearedReceipt: new FormControl("", []),
      unclearedPayment: new FormControl("", []),
      lastTransactionDate: new FormControl("", []),
      lastInterestDate: new FormControl("", []),
      openDate: new FormControl("", []),
      interestRate : new FormControl("", [])
    });

    this.getGeneralLedgers().then(result => {
      if (result) {
        this.getBranches();
        this.getPigmyAgents();
      }
    }).catch(error => {
      this._toastrService.error('Error loading general ledgers', 'Warning!');
    });
  }

  getBranches() {
    this._branchMasterService.getBranches().subscribe((data: any) => {
      this.uiBranches = data.data.data;
    })
  }

  getGeneralLedgers() {
    return new Promise((resolve, reject) => {
      this._generalLedgerService.getGeneralLedgers(this._sharedService.applicationUser.branchId).subscribe((data: any) => {
        this.uiGeneralLedgers = [];
        if (data) {
          let generalLedgers = data.data.data;
          if (generalLedgers) {

            generalLedgers.map((gl: any, i: any) => {
              gl.glName = gl.code + "-" + gl.glName;
            });

            this.uiGeneralLedgers = generalLedgers.filter((gl:any) => (gl.glGroup == 'D' || gl.glGroup == 'L') && gl.glType != 'P');
            resolve(true);
          }
        }
        else {
          resolve(false);
        }
      })
    })
  }

  getPigmyAgents() {
    return new Promise((resolve, reject) => {
      this.uiPigmyAgents = [];
      this._pigmyMasterService.getBranchAgents(this._sharedService.applicationUser.branchId).subscribe((data: any) => {
        if (data) {
          if (data.statusCode == 200 && data.data.data) {
            var agents = data.data.data;
            if (agents && agents.length) {
              this.uiPigmyAgents = agents;

              this.uiPigmyAgents.map((pa: any, i: any) => {
                pa.name = pa.agentNumber + "-" + pa.name;
              });
              // this.summaryForm.patchValue({
              //   pigmyAgent: this.uiPigmyAgents[0],
              // });
            }
            resolve(true);
          }
        }
      })
    })
  }

  getAccounts(accountsData: any) {
    let bankAccounts = accountsData;
    if (bankAccounts && bankAccounts.length) {
      this.uiBankAccount = bankAccounts[0];

      this.collectionAccountForm.patchValue({
        customerName: this.uiBankAccount.custName,
        accountNumber:  this.uiBankAccount.accountNo,
        accountId:  this.uiBankAccount.accountsId,
        glCode: this.uiBankAccount.code1,
        accountType:  this.uiBankAccount.accountType,
        modeOfOperation:  this.uiBankAccount.modeOfOperation,
        balance:  this.uiBankAccount.balance,
        minBalance:  this.uiBankAccount.minBalance,
        unclearedReceipt: isNaN(parseFloat(this.uiBankAccount.unClearedReceiptAmt)) ? "0.00": parseFloat(this.uiBankAccount.unClearedReceiptAmt).toFixed(2),
        unclearedPayment: isNaN(parseFloat(this.uiBankAccount.unClearedPaymentAmt)) ? "0.00": parseFloat(this.uiBankAccount.unClearedPaymentAmt).toFixed(2),
        lastTransactionDate:  this.uiBankAccount.lastTransactionDate,
        lastInterestDate:  this.uiBankAccount.lastInterestDate,
        openDate:  this.uiBankAccount.openDate,
        interestRate :  this.uiBankAccount.interestRate,
        balanceWillBe: this.uiBankAccount.balance
      })
    }
    else
    {
      this.collectionAccountForm.patchValue({
        customerName: "",
        accountNumber:  "",
        accountId: "",
        glCode: "",
        accountType:  "",
        modeOfOperation:  "",
        balance:  "",
        minBalance: "",
        unclearedReceipt: "",
        unclearedPayment: "",
        lastTransactionDate:  "",
        lastInterestDate:  "",
        openDate:  "",
        interestRate :  "",
        balanceWillBe: "",
      })
    }
  }

  linkAccount()
  {

    if (this.pigmyAgent.value.id > 0 && this.accountId.value > 0) {
      let collectionModel = {
        PigmyAgentId: this.pigmyAgent.value.id,
        AccountsId: this.accountId.value,
        CreatedBy: this._sharedService.applicationUser.id
      };
  
      this._pigmyMasterService.linkAgentCollectionAccount(collectionModel).subscribe((data: any) => {
        if (data) {
          if (data.statusCode == 200 && data.data.data) {
           if (data.data.data.retId > 0) {
              this._toastrService.success('Account linked with pigmy agent.', 'Success!');
           }
           else if(data.data.data.retId == -1){
            this._toastrService.warning('Account already linked with agent.', 'Warning!');
           }
           else
           {
            this._toastrService.error('Error in linking account', 'Error!');
           }
          }
        }
      })
    }
    else
    {
      this._toastrService.error('Please select agent and search account to link.', 'Error!');
    }
  }

  get pigmyAgent() {
    return this.collectionAccountForm.get('pigmyAgent')!;
  }

  get generalLedger() {
    return this.collectionAccountForm.get('generalLedger')!;
  }

  get balanceWillBe() {
    return this.collectionAccountForm.get('balanceWillBe')!;
  }

  get customerName() {
    return this.collectionAccountForm.get('customerName')!;
  }
  get accountId() {
    return this.collectionAccountForm.get('accountId')!;
  }

  get glCode() {
    return this.collectionAccountForm.get('glCode')!;
  }
  
  get accountNumber() {
    return this.collectionAccountForm.get('accountNumber')!;
  }
  get accountType() {
    return this.collectionAccountForm.get('accountType')!;
  }
  get modeOfOperation() {
    return this.collectionAccountForm.get('modeOfOperation')!;
  }
  get balance() {
    return this.collectionAccountForm.get('balance')!;
  }
  get minBalance() {
    return this.collectionAccountForm.get('minBalance')!;
  }

  get unclearedReceipt() {
    return this.collectionAccountForm.get('unclearedReceipt')!;
  }
  get unclearedPayment() {
    return this.collectionAccountForm.get('unclearedPayment')!;
  }
  get lastTransactionDate() {
    return this.collectionAccountForm.get('lastTransactionDate')!;
  }
  get lastInterestDate() {
    return this.collectionAccountForm.get('lastInterestDate')!;
  }
  get openDate() {
    return this.collectionAccountForm.get('openDate')!;
  }
  get interestRate() {
    return this.collectionAccountForm.get('interestRate')!;
  }
}
