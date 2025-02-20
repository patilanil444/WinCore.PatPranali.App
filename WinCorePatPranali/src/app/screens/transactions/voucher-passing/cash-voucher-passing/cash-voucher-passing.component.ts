import { formatDate } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UiEnumGeneralMaster } from 'src/app/common/models/common-ui-models';
import { TransactionsDeclarations } from 'src/app/common/transaction-declarations';
import { AccountsService } from 'src/app/services/accounts/accounts/accounts.service';
import { SharedService } from 'src/app/services/shared.service';
import { VoucherPassingService } from 'src/app/services/transactions/voucher-passing/voucher-passing.service';
import { PassingInfoComponent } from '../passing-info/passing-info.component';
import { BranchMasterService } from 'src/app/services/masters/branch-master/branch-master.service';
import { UserRoleHeper } from 'src/app/common/utils/user-role-helper';

@Component({
  selector: 'app-cash-voucher-passing',
  templateUrl: './cash-voucher-passing.component.html',
  styleUrls: ['./cash-voucher-passing.component.css']
})
export class CashVoucherPassingComponent implements OnInit {

  cashVoucherPassingForm!: FormGroup;
  passingInfoForm!: FormGroup; 
  uiSavingAccounts: any[] = [];
  uicashTransactionTypes: any[] = [];
  uiBankAccounts : any[] = [];
  voucherTransactionSummary: any = {};

  uiAccountTypes : any[] = [];
  uiModeOfOperations : any[] = [];

  uiVoucherDetails : any[] = [];
  uiBranches: any = [];

  @ViewChild('passingInfoModel', {static: false}) passingInfoModel: PassingInfoComponent

  constructor(private router: Router, private _toastrService: ToastrService, private _sharedService: SharedService,
    private _voucherPassingService: VoucherPassingService, private _accountsService: AccountsService, 
    private _branchMasterService: BranchMasterService,
  ) { }

  ngOnInit(): void {
    this.uicashTransactionTypes = TransactionsDeclarations.voucherTransactionTypes;

    this.cashVoucherPassingForm = new FormGroup({
      transactionType: new FormControl(this.uicashTransactionTypes[0].code, []),
      transactionHeadId : new FormControl(0, []),
      voucherNumber: new FormControl("", []),
      voucherAmount: new FormControl("", []),
      gridAmount: new FormControl("", []),

      // receiptAmount: new FormControl("", []),
      // receiptDesc: new FormControl("By Cash", []),
      // chequeNo: new FormControl("", []),
      // chequeDate: new FormControl(formatDate(new Date(Date.now()), 'yyyy-MM-dd', 'en'), []),
      // balanceWillBe: new FormControl("", []),
      // customerName: new FormControl("", []),
      // accountNumber: new FormControl("", []),
      // accountType: new FormControl("", []),
      // modeOfOperation: new FormControl("", []),
      // balance: new FormControl("", []),
      // minBalance: new FormControl("", []),
      // lastTransactionDate: new FormControl("", []),
      // lastInterestDate: new FormControl("", []),
      // openDate: new FormControl("", []),
      // interestRate : new FormControl("", [])

     
    });

    this.uiAccountTypes = this.retrieveMasters(UiEnumGeneralMaster.ACTYPE);
    this.uiModeOfOperations = this.retrieveMasters(UiEnumGeneralMaster.OPRMODE);
    this.getBranches();
    UserRoleHeper.initialiseUserRoles(this._sharedService.applicationUser);
  }

  isAdministratorUser() {
    return UserRoleHeper.isAdministratorUser();
  }

  isPassingOfficerUser() {
    return UserRoleHeper.isPassingOfficerUser();
  }

  getBranches() {
    this._branchMasterService.getBranches().subscribe((data: any) => {
      this.uiBranches = data.data.data;
    })
  }

  retrieveMasters(uiEnumGeneralMaster: UiEnumGeneralMaster) {
    let mastersData = this._sharedService.uiAllMasters.filter((m: any) => m.identifier == uiEnumGeneralMaster);
    if (mastersData && mastersData.length) {
      let masters = mastersData.filter((m: any) => m.identifier == uiEnumGeneralMaster);
      return masters[0].codeTables;
    }
    return [];
  }

  fetchVoucher()
  {
    if (this.voucherNumber.value && this.voucherNumber.value.trim().length) {

      let voucherRequestModel = {
        VoucherNo: parseInt(this.voucherNumber.value),
        CDFlag: this.transactionType.value === "R" ? 1 : 2,
        UserId: this._sharedService.applicationUser.id,
        IsPassing: true,
        VoucherDate: this._sharedService.getWorkOperationDate()
      };

      this._voucherPassingService.getCashVoucher(voucherRequestModel).subscribe((data: any) => {
        let voucherModel = data.data.data;
        if (voucherModel) {

          if (voucherModel.statusCode == 2) {
            let transactionSummary = voucherModel.transactionSummary;
            this.voucherTransactionSummary = transactionSummary;
              this.cashVoucherPassingForm.patchValue({
                transactionHeadId: transactionSummary.id,
                voucherAmount: transactionSummary.voucherAmount,
                gridAmount: transactionSummary.voucherAmount,
              });

              this.uiVoucherDetails = [];
              transactionSummary.transactionDetails.forEach((td:any)=> {
                let details: any = {};
                details.customerName = td.customerName;
                details.GL = td.glName;
                details.accountNumber = td.accountNumber;
                details.amount = transactionSummary.voucherAmount;
                details.cdFlag = td.cdFlag;
                details.ctFlag = td.ctFlag;
                details.transaction_Narration = td.transaction_Narration;
                details.intFlag = td.intFlag;
                details.intGLName = td.intGLName;
                this.uiVoucherDetails.push(details);
              });

             
          }
          else if(voucherModel.statusCode == 1)
          {
            this._toastrService.error('You cannot pass voucher created by you.', 'Error!');
          }
          else
          {
            this._toastrService.error('Voucher not found.', 'Error!');
          }
          
        }
      })
    }
    else
    {
      this._toastrService.error('Please enter voucher number.', 'Error!');
    }
  }

  viewVoucherDetails()
  {
    if (this.voucherTransactionSummary && this.voucherTransactionSummary.voucherNo &&
      this.voucherTransactionSummary.voucherNo > 0) {
        this._accountsService.SearchAccountDetailsAsync(this.voucherTransactionSummary.branchCode, 
          this.voucherTransactionSummary.transactionDetails[0].code1, 
          this.voucherTransactionSummary.transactionDetails[0].accountNumber).subscribe((data: any) => {
            let accounts = data.data.data;
            if (accounts) {
              this.uiBankAccounts = accounts.map((acc: any) => (
                {
                  ...acc,
                  accountType: this.uiAccountTypes.filter(at=>at.constantNo == acc.accountType)[0]?.constantname,
                  modeOfOperation: this.uiModeOfOperations.filter(at=>at.constantNo == acc.modeOfOperation)[0]?.constantname,
                  openDate: formatDate(new Date(acc.openDate), 'yyyy-MM-dd', 'en'),
                  lastTransactionDate: formatDate(new Date(acc.lastTransactionDate), 'yyyy-MM-dd', 'en'),
                  lastInterestDate: formatDate(new Date(acc.lastInterestDate), 'yyyy-MM-dd', 'en'),
                  balance: parseFloat(acc.balance).toFixed(2),
                  minBalance: parseFloat(acc.minBalance).toFixed(2),
                }))
    
                let branchName = "";
                let branch = this.uiBranches.filter((b: any) => b.branchCode == this.voucherTransactionSummary.branchCode);
                if (branch && branch.length) {
                  branchName = branch[0].branchName
                }

                this.passingInfoModel.setAccountDetails(branchName, this.uiBankAccounts, this.voucherTransactionSummary);
                this.passingInfoModel.open();
            }
            else {
              this._toastrService.error('No accounts found', 'Warning!');
            }
          })
    }
    else
    {
      this._toastrService.error('Please search voucher to view details.', 'Error!');
    }
   

  }

  passVoucher(isRejected: boolean)
  {
    if (this.voucherNumber.value && this.voucherNumber.value.trim().length) {

      if (this.transactionHeadId.value && this.transactionHeadId.value) {
        let passVoucherRequestModel = {
          TransactionHeadId: parseInt(this.transactionHeadId.value),
          IsRejected: isRejected,
          PassedByUserId: this._sharedService.applicationUser.id,
          PassingDate: this._sharedService.getWorkOperationDate()
        };

        this._voucherPassingService.passVoucher(passVoucherRequestModel).subscribe((data: any) => {
          let result = data.data.data;
          if (result) {
            this._toastrService.success('Transaction has beed passed.', 'Success!');
            this.clearSerach();
          }
        })

      }
      else
      {
        this._toastrService.error('Please search voucher to pass it.', 'Error!');
      }
    }
    else
    {
      this._toastrService.error('Please search voucher to pass it.', 'Error!');
    }
  }

  clearSerach()
  {
    this.voucherTransactionSummary = {};

    this.uiVoucherDetails = [];

    this.cashVoucherPassingForm.patchValue({
      transactionHeadId: 0,
      voucherNumber: "",
      voucherAmount: "",
      gridAmount: "",
    });

  }

  get transactionType() {
    return this.cashVoucherPassingForm.get('transactionType')!;
  }

  get transactionHeadId() {
    return this.cashVoucherPassingForm.get('transactionHeadId')!;
  }
  get voucherNumber() {
    return this.cashVoucherPassingForm.get('voucherNumber')!;
  }
  get voucherAmount() {
    return this.cashVoucherPassingForm.get('voucherAmount')!;
  }
  // get receiptAmount() {
  //   return this.cashVoucherPassingForm.get('receiptAmount')!;
  // }
  // get receiptDesc() {
  //   return this.cashVoucherPassingForm.get('receiptDesc')!;
  // }
  // get chequeNo() {
  //   return this.cashVoucherPassingForm.get('chequeNo')!;
  // }
  // get chequeDate() {
  //   return this.cashVoucherPassingForm.get('chequeDate')!;
  // }
  // get balanceWillBe() {
  //   return this.cashVoucherPassingForm.get('balanceWillBe')!;
  // }
  // get customerName() {
  //   return this.cashVoucherPassingForm.get('customerName')!;
  // }
  // get accountNumber() {
  //   return this.cashVoucherPassingForm.get('accountNumber')!;
  // }
  // get accountType() {
  //   return this.cashVoucherPassingForm.get('accountType')!;
  // }

  // get modeOfOperation() {
  //   return this.cashVoucherPassingForm.get('modeOfOperation')!;
  // }
  // get balance() {
  //   return this.cashVoucherPassingForm.get('balance')!;
  // }
  // get minBalance() {
  //   return this.cashVoucherPassingForm.get('minBalance')!;
  // }
  // get lastTransactionDate() {
  //   return this.cashVoucherPassingForm.get('lastTransactionDate')!;
  // }
  // get lastInterestDate() {
  //   return this.cashVoucherPassingForm.get('lastInterestDate')!;
  // }
  // get openDate() {
  //   return this.cashVoucherPassingForm.get('lastInterestDate')!;
  // }
  //  get interestRate() {
  //   return this.cashVoucherPassingForm.get('lastInterestDate')!;
  // } 
}
