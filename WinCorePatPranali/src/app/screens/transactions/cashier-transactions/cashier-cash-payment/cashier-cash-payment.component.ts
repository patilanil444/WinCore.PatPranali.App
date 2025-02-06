import { formatDate } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DenominationsComponent } from 'src/app/common/directives/denominations/denominations.component';
import { UiEnumGeneralMaster } from 'src/app/common/models/common-ui-models';
import { AccountsService } from 'src/app/services/accounts/accounts/accounts.service';
import { SavingAccountService } from 'src/app/services/accounts/saving-accounts/saving-account.service';
import { BranchMasterService } from 'src/app/services/masters/branch-master/branch-master.service';
import { GeneralLedgerService } from 'src/app/services/masters/general-ledger/general-ledger.service';
import { SharedService } from 'src/app/services/shared.service';
import { TransactionMasterService } from 'src/app/services/transactions/transaction-master/transaction-master.service';
import { VoucherPassingService } from 'src/app/services/transactions/voucher-passing/voucher-passing.service';

export interface ITransactionSummaryModel {
  Id: number;
  BranchCode: number;
  VoucherDate: Date;
  VoucherType: number;
  VoucherNo: number;
  VoucherAmount: number;
  TransactionNarration: string;
  YearEnd: boolean;
  UTR_ChequeNo: string;
  UTR_ChequeDate: Date;
  TransactionPassing: boolean;
  CreatedBy: number;
  VerifiedBy: string;
  VerifiedDateTime: Date;
  TransactionDetails: ITransactionDetailsModel[];
  Denominations: IDenomination[];
}

export interface ITransactionDetailsModel {
  VoucherHeadId: number;
  Code1: number;
  AccountId: number;
  IntFlag: number;
  IntCode1: number;
  CDFlag: number;
  CTFlag: number;
  Transaction_Amount: number;
  Transaction_Narration: string;
}

export interface IDenomination {
  BranchCode: number;
  Scroll_Id: number;
  Denomination_id: number;
  Denomination_Quantity: number;
  denomination_type: number;
}

@Component({
  selector: 'app-cashier-cash-payment',
  templateUrl: './cashier-cash-payment.component.html',
  styleUrls: ['./cashier-cash-payment.component.css']
})
export class CashierCashPaymentComponent implements OnInit {

  cashierPaymentForm!: FormGroup;
  uiBranches: any = [];
  uiAllGeneralLedgers: any = [];
  voucherTransactionSummary: any = {};
  uiTransactionDenominations: any = [];
  uiAccountTypes: any[] = [];
  uiModeOfOperations: any[] = [];

  uiBankAccounts: any = [];
  uiBankAccount: any = [];
  uiVoucherDetails: any[] = [];
  transactionType = "payment";

  @ViewChild('denominationModal', { static: false }) denominationsModal: DenominationsComponent

  constructor(private router: Router, private _branchMasterService: BranchMasterService, private _toastrService: ToastrService,
    private _generalLedgerService: GeneralLedgerService, private _sharedService: SharedService,
    private _voucherPassingService: VoucherPassingService, private _accountsService: AccountsService,
    private _transactionMasterService: TransactionMasterService) { }

  ngOnInit(): void {
    this.cashierPaymentForm = new FormGroup({
      tokenId: new FormControl("", [Validators.required]),
      transactionHeadId: new FormControl("", []),
      branch: new FormControl("", []),
      generalLedger: new FormControl("", []),
      accountNumber: new FormControl("", []),
      transactionAmount: new FormControl("", []),
      transactionDesc: new FormControl("", []),
      chequeNo: new FormControl("", []),
      chequeDate: new FormControl(formatDate(new Date(Date.now()), 'yyyy-MM-dd', 'en'), []),
      balanceAmountWillBe: new FormControl("", []),
      customerName: new FormControl("", []),
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
      interestRate: new FormControl("", [])
    });

    this.uiAccountTypes = this.retrieveMasters(UiEnumGeneralMaster.ACTYPE);
    this.uiModeOfOperations = this.retrieveMasters(UiEnumGeneralMaster.OPRMODE);

    this.getBranches();
    this.getGeneralLedgers();
  }

  retrieveMasters(uiEnumGeneralMaster: UiEnumGeneralMaster) {
    let mastersData = this._sharedService.uiAllMasters.filter((m: any) => m.identifier == uiEnumGeneralMaster);
    if (mastersData && mastersData.length) {
      let masters = mastersData.filter((m: any) => m.identifier == uiEnumGeneralMaster);
      return masters[0].codeTables;
    }
    return [];
  }

  getGeneralLedgers() {
    return new Promise((resolve, reject) => {
      this._generalLedgerService.getGeneralLedgers(this._sharedService.applicationUser.branchId).subscribe((data: any) => {
       
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

  getBranches() {
    this._branchMasterService.getBranches().subscribe((data: any) => {
      this.uiBranches = data.data.data;
      if (this.uiBranches && this.uiBranches.length) {
        this.cashierPaymentForm.patchValue({
          branchId: this.uiBranches[0].branchCode,
        })
      }
    })
  }

  // searchToken()
  // {
  //   this.uiBankAccounts = [];
  // }

  fetchVoucher() {
    if (this.tokenId.value && this.tokenId.value.trim().length) {

      let voucherRequestModel = {
        VoucherNo: parseInt(this.tokenId.value),
        CDFlag: 2,
        UserId: this._sharedService.applicationUser.id,
        IsPassing: false
      };

      this._voucherPassingService.getVoucher(voucherRequestModel).subscribe((data: any) => {
        let voucherModel = data.data.data;
        if (voucherModel) {

          if (voucherModel.statusCode == 2) {
            let transactionSummary = voucherModel.transactionSummary;
            this.voucherTransactionSummary = transactionSummary;
            this.cashierPaymentForm.patchValue({
              transactionHeadId: transactionSummary.id,
              transactionAmount: transactionSummary.voucherAmount,
              transactionDesc: transactionSummary.transactionNarration,
              chequeNo: transactionSummary.utR_ChequeNo,
              chequeDate: formatDate(new Date(transactionSummary.utR_ChequeDate), 'yyyy-MM-dd', 'en'),
            });

            this.uiVoucherDetails = [];
            transactionSummary.transactionDetails.forEach((td: any) => {
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

            if (transactionSummary.transactionDetails.length) {
              this.searchAccount(transactionSummary.branchCode, transactionSummary.transactionDetails[0].accountNumber, transactionSummary.transactionDetails[0].code1);

              // set GL and Branch
              let accountGL = this.uiAllGeneralLedgers.filter((gl: any) => gl.code == transactionSummary.transactionDetails[0].code1)
              if (accountGL && accountGL.length) {

                this.cashierPaymentForm.patchValue({
                  generalLedger: accountGL[0].glName
                });
              }
            }

            let branch = this.uiBranches.filter((b: any) => b.branchCode == transactionSummary.branchCode);
            if (branch && branch.length) {
              this.cashierPaymentForm.patchValue({
                branch: branch[0].branchName
              });
            }

          }
          else if (voucherModel.statusCode == 1) {
            this._toastrService.error('You cannot pay voucher created by you.', 'Error!');
          }
          else {
            this._toastrService.error('Voucher not found.', 'Error!');
          }

        }
      })
    }
    else {
      this._toastrService.error('Please enter voucher number.', 'Error!');
    }
  }

  searchAccount(brachCode: number, accountNumber: string, glCode: number) {
    if (brachCode > 0) {
      if (glCode > 0) {
        if (accountNumber) {
          this._accountsService.SearchAccountDetailsAsync(brachCode, glCode, accountNumber).subscribe((data: any) => {
            let accounts = data.data.data;
            if (accounts) {
              this.uiBankAccounts = accounts.map((acc: any) => (
                {
                  ...acc,
                  accountType: this.uiAccountTypes.filter(at => at.constantNo == acc.accountType)[0]?.constantname,
                  modeOfOperation: this.uiModeOfOperations.filter(at => at.constantNo == acc.modeOfOperation)[0]?.constantname,
                  openDate: formatDate(new Date(acc.openDate), 'yyyy-MM-dd', 'en'),
                  lastTransactionDate: formatDate(new Date(acc.lastTransactionDate), 'yyyy-MM-dd', 'en'),
                  lastInterestDate: formatDate(new Date(acc.lastInterestDate), 'yyyy-MM-dd', 'en'),
                  balance: parseFloat(acc.balance).toFixed(2),
                  minBalance: parseFloat(acc.minBalance).toFixed(2),
                }))

              if (this.uiBankAccounts && this.uiBankAccounts.length) {
                this.uiBankAccount = this.uiBankAccounts[0];

                this.cashierPaymentForm.patchValue({
                  customerName: this.uiBankAccount.custName,
                  accountNumber: this.uiBankAccount.accountNo,
                  accountId: this.uiBankAccount.accountsId,
                  glCode: this.uiBankAccount.code1,
                  accountType: this.uiBankAccount.accountType,
                  modeOfOperation: this.uiBankAccount.modeOfOperation,
                  balance: this.uiBankAccount.balance,
                  minBalance: this.uiBankAccount.minBalance,
                  unclearedReceipt: isNaN(parseFloat(this.uiBankAccount.unClearedReceiptAmt)) ? "0.00" : parseFloat(this.uiBankAccount.unClearedReceiptAmt).toFixed(2),
                  unclearedPayment: isNaN(parseFloat(this.uiBankAccount.unClearedPaymentAmt)) ? "0.00" : parseFloat(this.uiBankAccount.unClearedPaymentAmt).toFixed(2),
                  lastTransactionDate: this.uiBankAccount.lastTransactionDate,
                  lastInterestDate: this.uiBankAccount.lastInterestDate,
                  openDate: this.uiBankAccount.openDate,
                  interestRate: this.uiBankAccount.interestRate,
                  balanceAmountWillBe: isNaN(parseFloat(this.transactionAmount.value)) ? this.uiBankAccount.balance : (parseFloat(this.uiBankAccount.balance) - parseFloat(this.transactionAmount.value)) 
                })
              }
              else {
                this.cashierPaymentForm.patchValue({
                  customerName: "",
                  accountNumber: "",
                  accountId: "",
                  glCode: "",
                  accountType: "",
                  modeOfOperation: "",
                  balance: "",
                  minBalance: "",
                  unclearedReceipt: "",
                  unclearedPayment: "",
                  lastTransactionDate: "",
                  lastInterestDate: "",
                  openDate: "",
                  interestRate: "",
                  balanceAmountWillBe: "",
                })
              }
            }
            else {
              this._toastrService.error('No accounts found', 'Error!');
            }
          })
        }
      }
    }
  }

  openDenominations() {
    if (this.transactionAmount.value && parseFloat(this.transactionAmount.value) > 0) {
      this.denominationsModal.clear();
      this.denominationsModal.open();
    }
    else {
      this._toastrService.warning('Please enter transaction amount.', 'Warning!');
    }
  }

  setDenominations(denominationData: any) {
    if (denominationData && denominationData.length) {
      this.uiTransactionDenominations = denominationData;
    }
  }

  isValidateTransaction() {
    if (parseInt(this.accountId.value) > 0) {
      if (parseInt(this.transactionAmount.value) > 0) {
        if (this.uiTransactionDenominations && this.uiTransactionDenominations.length) {
          return true;
        }
        else {
          this._toastrService.warning('Please add denominations.', 'Error!');
        }
      }
      else {
        this._toastrService.warning('Transaction do not have amount.', 'Error!');
      }
    }
    else {
      this._toastrService.warning('Invalid transaction.', 'Error!');
    }
    return false;
  }

  makeTransaction() {
    // Save transcher and get a voucher ID for transaction. Show voucher Id to user in pop up
    //1. Validate Transaction details
    if (this.isValidateTransaction()) {
      //2. Save Transaction 
      let transactionSummary = {} as ITransactionSummaryModel;
      transactionSummary.Id = parseInt(this.transactionHeadId.value);
      transactionSummary.VoucherNo = parseInt(this.tokenId.value);
      transactionSummary.CreatedBy = this._sharedService.applicationUser.id;

      transactionSummary.Denominations = [];
      if (this.uiTransactionDenominations.length) {
        this.uiTransactionDenominations.forEach((d: any) => {
          let denomination = {} as IDenomination;
          denomination.BranchCode = this._sharedService.applicationUser.branchId;
          denomination.Denomination_id = d.denomination_id;
          denomination.Scroll_Id = 0;
          denomination.Denomination_Quantity = d.receiptNumber > 0 ? d.receiptNumber : d.paymentNumber;
          denomination.denomination_type = d.receiptTotal > 0 ? 1 : 2;
          transactionSummary.Denominations.push(denomination);
        });
      }

      // get voucher number before saving transaction 
       this.executeTransaction(transactionSummary);
       this.clearTransaction();
    }
  }

  executeTransaction(transactionSummary: ITransactionSummaryModel)
  {
    this._transactionMasterService.updatePaymentTransaction(transactionSummary).subscribe((data: any) => {
     
      if (data) {
        if (data.data.data && data.data.data.retId > 0) {
          if (data.data.data.status == "SUCCESS") {
            this._toastrService.success("Transaction done for voucher : " + transactionSummary.VoucherNo, 'Success!');
            this.onTransactionConfirmed(true);
          }
          else {
            this._toastrService.error("Error saving transaction!", 'Error!');
          }
        }
      }
    })
  }

  onTransactionConfirmed(isConfirmed: any)
  {
    // if (isConfirmed) {
    //   window.location.reload();
    // }
  }

  clearTransaction() {
    this.uiTransactionDenominations = [];
    this.uiVoucherDetails = [];
    this.cashierPaymentForm.patchValue({
      tokenId: "",
      transactionHeadId: 0,
      branch: "",
      generalLedger: "",
      accountNumber: "",
      transactionAmount: "",
      transactionDesc: "",
      chequeNo: "",
      chequeDate: new FormControl(formatDate(new Date(Date.now()), 'yyyy-MM-dd', 'en'), []),
      balanceAmountWillBe: "",
      customerName: "",
      accountId: "",
      glCode: "",
      accountType: "",
      modeOfOperation: "",
      balance: "",
      minBalance: "",
      unclearedReceipt: "",
      unclearedPayment: "",
      lastTransactionDate: "",
      lastInterestDate: "",
      openDate: "",
      interestRate: "",
    });
  }

  configClick(routeValue: string) {
    sessionStorage.setItem("configMenu", routeValue);
    this.router.navigate(['/app/' + routeValue]);
  }

  get tokenId() {
    return this.cashierPaymentForm.get('tokenId')!;
  }

  get transactionHeadId() {
    return this.cashierPaymentForm.get('transactionHeadId')!;
  }

  get branch() {
    return this.cashierPaymentForm.get('branch')!;
  }

  get generalLedger() {
    return this.cashierPaymentForm.get('generalLedger')!;
  }

  get accountNumber() {
    return this.cashierPaymentForm.get('accountNumber')!;
  }

  get transactionAmount() {
    return this.cashierPaymentForm.get('transactionAmount')!;
  }

  get balanceAmountWillBe() {
    return this.cashierPaymentForm.get('balanceAmountWillBe')!;
  }

  get transactionDesc() {
    return this.cashierPaymentForm.get('transactionDesc')!;
  }

  get chequeNo() {
    return this.cashierPaymentForm.get('chequeNo')!;
  }

  get chequeDate() {
    return this.cashierPaymentForm.get('chequeDate')!;
  }

  ///////////

  get customerName() {
    return this.cashierPaymentForm.get('customerName')!;
  }

  get accountId() {
    return this.cashierPaymentForm.get('accountId')!;
  }

  get glCode() {
    return this.cashierPaymentForm.get('glCode')!;
  }

  get accountType() {
    return this.cashierPaymentForm.get('accountType')!;
  }
  get modeOfOperation() {
    return this.cashierPaymentForm.get('modeOfOperation')!;
  }
  get balance() {
    return this.cashierPaymentForm.get('balance')!;
  }
  get minBalance() {
    return this.cashierPaymentForm.get('minBalance')!;
  }

  get unclearedReceipt() {
    return this.cashierPaymentForm.get('unclearedReceipt')!;
  }
  get unclearedPayment() {
    return this.cashierPaymentForm.get('unclearedPayment')!;
  }
  get lastTransactionDate() {
    return this.cashierPaymentForm.get('lastTransactionDate')!;
  }
  get lastInterestDate() {
    return this.cashierPaymentForm.get('lastInterestDate')!;
  }
  get openDate() {
    return this.cashierPaymentForm.get('openDate')!;
  }
  get interestRate() {
    return this.cashierPaymentForm.get('interestRate')!;
  }


}
