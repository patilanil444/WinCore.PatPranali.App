import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UiEnumGeneralMaster } from 'src/app/common/models/common-ui-models';
import { TransactionsDeclarations } from 'src/app/common/transaction-declarations';
import { UserRoleHeper } from 'src/app/common/utils/user-role-helper';
import { AccountsService } from 'src/app/services/accounts/accounts/accounts.service';
import { SharedService } from 'src/app/services/shared.service';
import { VoucherPassingService } from 'src/app/services/transactions/voucher-passing/voucher-passing.service';

@Component({
  selector: 'app-pending-vouchers',
  templateUrl: './pending-vouchers.component.html',
  styleUrls: ['./pending-vouchers.component.css']
})
export class PendingVouchersComponent implements OnInit {

  pendingVoucherForm!: FormGroup;
  uicashTransactionTypes: any[] = [];
  voucherTransactionSummary: any = {};
  uiVoucherDetails: any[] = [];

  constructor(private router: Router, private _toastrService: ToastrService, private _sharedService: SharedService,
    private _voucherPassingService: VoucherPassingService, private _accountsService: AccountsService,
  ) { }

  ngOnInit(): void {
    this.uicashTransactionTypes = TransactionsDeclarations.voucherTransactionTypes;

    this.pendingVoucherForm = new FormGroup({
      transactionType: new FormControl(this.uicashTransactionTypes[0].code, []),
    });

    //this.getBranches();
    UserRoleHeper.initialiseUserRoles(this._sharedService.applicationUser);
  }

  isAdministratorUser() {
    return UserRoleHeper.isAdministratorUser();
  }

  isPassingOfficerUser() {
    return UserRoleHeper.isPassingOfficerUser();
  }

  retrieveMasters(uiEnumGeneralMaster: UiEnumGeneralMaster) {
    let mastersData = this._sharedService.uiAllMasters.filter((m: any) => m.identifier == uiEnumGeneralMaster);
    if (mastersData && mastersData.length) {
      let masters = mastersData.filter((m: any) => m.identifier == uiEnumGeneralMaster);
      return masters[0].codeTables;
    }
    return [];
  }

  fetchVouchers() {
    let voucherRequestModel = {
      CDFlag: this.transactionType.value === "R" ? 1 : 2,
      VoucherDate: this._sharedService.getWorkOperationDate()
    };

    this.uiVoucherDetails = [];
    this._voucherPassingService.getCashVouchers(voucherRequestModel).subscribe((data: any) => {
      let voucherModels = data.data;
      if (voucherModels) {
        voucherModels.forEach((vm: any) => {
          let transactionSummary = vm;
          transactionSummary.transactionDetails.forEach((td: any) => {
            let details: any = {};
            details.customerName = td.customerName;
            details.GL = td.glName;
            details.voucherNo = transactionSummary.voucherNo;
            details.accountNumber = td.accountNumber;
            details.amount = transactionSummary.voucherAmount;
            details.cdFlag = td.cdFlag;
            details.ctFlag = td.ctFlag;
            details.transaction_Narration = td.transaction_Narration;
            details.intFlag = td.intFlag;
            details.intGLName = td.intGLName;
            this.uiVoucherDetails.push(details);
          });
        });
      }
    })
  }

  viewVoucherDetails() {
    //  if (this.voucherTransactionSummary && this.voucherTransactionSummary.voucherNo &&
    //    this.voucherTransactionSummary.voucherNo > 0) {
    //      this._accountsService.SearchAccountDetailsAsync(this.voucherTransactionSummary.branchCode, 
    //        this.voucherTransactionSummary.transactionDetails[0].code1, 
    //        this.voucherTransactionSummary.transactionDetails[0].accountNumber).subscribe((data: any) => {
    //          let accounts = data.data.data;
    //          if (accounts) {
    //            this.uiBankAccounts = accounts.map((acc: any) => (
    //              {
    //                ...acc,
    //                accountType: this.uiAccountTypes.filter(at=>at.constantNo == acc.accountType)[0]?.constantname,
    //                modeOfOperation: this.uiModeOfOperations.filter(at=>at.constantNo == acc.modeOfOperation)[0]?.constantname,
    //                openDate: formatDate(new Date(acc.openDate), 'yyyy-MM-dd', 'en'),
    //                lastTransactionDate: formatDate(new Date(acc.lastTransactionDate), 'yyyy-MM-dd', 'en'),
    //                lastInterestDate: formatDate(new Date(acc.lastInterestDate), 'yyyy-MM-dd', 'en'),
    //                balance: parseFloat(acc.balance).toFixed(2),
    //                minBalance: parseFloat(acc.minBalance).toFixed(2),
    //              }))

    //              let branchName = "";
    //              let branch = this.uiBranches.filter((b: any) => b.branchCode == this.voucherTransactionSummary.branchCode);
    //              if (branch && branch.length) {
    //                branchName = branch[0].branchName
    //              }

    //              this.passingInfoModel.setAccountDetails(branchName, this.uiBankAccounts, this.voucherTransactionSummary);
    //              this.passingInfoModel.open();
    //          }
    //          else {
    //            this._toastrService.error('No accounts found', 'Warning!');
    //          }
    //        })
    //  }
    //  else
    //  {
    //    this._toastrService.error('Please search voucher to view details.', 'Error!');
    //  }


  }

  passVoucher(isRejected: boolean) {
    //  if (this.voucherNumber.value && this.voucherNumber.value.trim().length) {

    //    if (this.transactionHeadId.value && this.transactionHeadId.value) {
    //      let passVoucherRequestModel = {
    //        TransactionHeadId: parseInt(this.transactionHeadId.value),
    //        IsRejected: isRejected,
    //        PassedByUserId: this._sharedService.applicationUser.id,
    //        PassingDate: this._sharedService.getWorkOperationDate()
    //      };

    //      this._voucherPassingService.passVoucher(passVoucherRequestModel).subscribe((data: any) => {
    //        let result = data.data.data;
    //        if (result) {
    //          this._toastrService.success('Transaction has beed passed.', 'Success!');
    //          this.clearSerach();
    //        }
    //      })

    //    }
    //    else
    //    {
    //      this._toastrService.error('Please search voucher to pass it.', 'Error!');
    //    }
    //  }
    //  else
    //  {
    //    this._toastrService.error('Please search voucher to pass it.', 'Error!');
    //  }
  }

  clearSerach() {
    //  this.voucherTransactionSummary = {};

    //  this.uiVoucherDetails = [];

    //  this.pendingVoucherForm.patchValue({
    //    transactionHeadId: 0,
    //    voucherNumber: "",
    //    voucherAmount: "",
    //    gridAmount: "",
    //  });

  }

  get transactionType() {
    return this.pendingVoucherForm.get('transactionType')!;
  }
}
