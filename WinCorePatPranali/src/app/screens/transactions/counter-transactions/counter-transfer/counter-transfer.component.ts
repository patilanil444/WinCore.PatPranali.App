import { formatDate } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AccountsService } from 'src/app/services/accounts/accounts/accounts.service';
import { SavingAccountService } from 'src/app/services/accounts/saving-accounts/saving-account.service';
import { BranchMasterService } from 'src/app/services/masters/branch-master/branch-master.service';
import { GeneralLedgerService } from 'src/app/services/masters/general-ledger/general-ledger.service';
import { SharedService } from 'src/app/services/shared.service';
import { AccountSelectorComponent } from '../account-selector/account-selector.component';
import { ConfirmBoxComponent } from 'src/app/common/directives/confirm-box/confirm-box.component';
import { TransactionMasterService } from 'src/app/services/transactions/transaction-master/transaction-master.service';
import { MessageBoxComponent } from 'src/app/common/directives/message-box/message-box.component';
import { UserRoleHeper } from 'src/app/common/utils/user-role-helper';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';

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
  VerifiedBy: number;
  VerifiedDateTime: Date;
  CDType: number;
  TransactionDetails: ITransactionDetailsModel[];
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

@Component({
  selector: 'app-counter-transfer',
  templateUrl: './counter-transfer.component.html',
  styleUrls: ['./counter-transfer.component.css']
})
export class CounterTransferComponent implements OnInit {

  transferCreditForm!: FormGroup;
  uiBranches: any = [];
  uiAllGeneralLedgers: any = [];

  uiDebitAccounts: any = [];
  uiCreditAccounts: any = [];

  messageNote: any = {};
  messageNotes : any = [];
  isResetAccountSearch: boolean = false;
  accountTypeText = "";
  datepickerConfig: BsDatepickerConfig;

  @ViewChild('accountSelectorModal', { static: false }) accountSelectorModal: AccountSelectorComponent
  @ViewChild('confirmModal', { static: false }) confirmModal: ConfirmBoxComponent
  @ViewChild('messageBoxModal', {static: false}) messageBoxModal: MessageBoxComponent

  constructor(private _toastrService: ToastrService, private _sharedService: SharedService, 
    private _transactionMasterService: TransactionMasterService) { }

  ngOnInit(): void {

    this.datepickerConfig = this._sharedService.getDatepickerConfig();

    this.transferCreditForm = new FormGroup({
      tokenId: new FormControl("", []),
      branch: new FormControl("", []),
      generalLedger: new FormControl("", []),
      accountNumber: new FormControl("", []),
      debitAmount: new FormControl("0", [Validators.required]),
      creditAmount: new FormControl("0", []),
      differenceAmount: new FormControl("", []),
      transactionDesc: new FormControl("To Cash", [Validators.required]),
      chequeNo: new FormControl("", []),
      chequeDate: new FormControl(new Date(Date.now()), []),
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

    this.getVoucherNumber();
    UserRoleHeper.initialiseUserRoles(this._sharedService.applicationUser);
  }

  isAdministratorUser() {
    return UserRoleHeper.isAdministratorUser();
  }

  isOperatorUser() {
    return UserRoleHeper.isOperatorUser();
  }

  getVoucherNumber()
  {
    let maxVoucherRequest = {
      BranchCode : this._sharedService.applicationUser.branchId,
      VoucherType : 2, 
      VoucherDate : this._sharedService.getWorkOperationDate(),
      CDType: 0 // 1= Credit , 2 = Debit 
    };
    this._transactionMasterService.getMaxVoucherNumber(maxVoucherRequest).subscribe((data: any) => {
     
      if (data) {
        if (data.data.data && data.data.data > 0) {

          this.transferCreditForm.patchValue({
            tokenId: data.data.data,
          });
         
        }
      }
    })

  }

  selectDebitAccount() {
    if (this.uiDebitAccounts && this.uiDebitAccounts.length == 0) {
      this.accountSelectorModal.open("Debit");
    }
    else {
      this._toastrService.warning("Delete existing debit account to add new account!", 'Warning!');
    }
  }

  selectCreditAccount() {
    if (this.uiDebitAccounts && this.uiDebitAccounts.length > 0 && this.debitAmount.value > 0) {
      this.accountSelectorModal.open("Credit");
    }
    else {
      this._toastrService.warning("Add debit account and enter debit amount!", 'Warning!');
    }
  }

  addAccount(bankAccount: any) {
    if (bankAccount != null && bankAccount.accountsId > 0) {

      let account = {
        customerName: bankAccount.custName,
        accountNumber: bankAccount.accountNo,
        accountId: bankAccount.accountsId,
        glCode: bankAccount.code1,
        glName: bankAccount.glName,
        payableGLCode: bankAccount.payableGLCode,
        payableGLName: bankAccount.payableGLName,
        accountType: bankAccount.accountType,
        modeOfOperation: bankAccount.modeOfOperation,
        balance: bankAccount.balance,
        minBalance: bankAccount.minBalance,
        lastTransactionDate: bankAccount.lastTransactionDate,
        lastInterestDate: bankAccount.lastInterestDate,
        openDate: bankAccount.openDate,
        interestRate: bankAccount.interestRate,
        balanceAmountWillBe: bankAccount.balance,
        amount: bankAccount.amount.toFixed(2),
        ctFlag: 2,
        ctFlagText: "Transfer",
        narration: bankAccount.narration
      };

      if (bankAccount.accountTypeText == 'Debit') {
        this.uiDebitAccounts = [];
        //account.narration = "TO TRF";
        this.transferCreditForm.patchValue({
          debitAmount: parseFloat(account.amount)
        });
        this.uiDebitAccounts.push(account);

      }
      if (bankAccount.accountTypeText == 'Credit') {
        // add to Credit Grid

        if (this.uiDebitAccounts.length > 0) {

          let debitIndex = this.uiDebitAccounts.findIndex((da: any) => da.accountId == account.accountId);
          if (debitIndex == -1) {
            //account.narration = "BY TRF";
            let accounts = this.uiCreditAccounts.filter((acc: any) => acc.accountId == account.accountId);
            if (accounts && accounts.length) {
              // confirmation to add amount into existing account
              this.messageNote = { value: "Selected account already exists. Do you wish to add amount " + parseFloat(account.amount) + " in existing credit account?" };
              this.confirmModal.open(account);
            }
            else {
              // add new account
              this.transferCreditForm.patchValue({
                creditAmount: parseFloat(this.creditAmount.value) + parseFloat(account.amount),
              });

              this.transferCreditForm.patchValue({
                differenceAmount: (parseFloat(this.debitAmount.value) - parseFloat(this.creditAmount.value)).toFixed(2)
              });
              this.uiCreditAccounts.push(account);
            }
          }
          else {
            this._toastrService.warning("Debit account cannot be added in credit accounts!", 'Warning!');
          }
        }
        else {
          this._toastrService.warning("Please add debit account before credit account!", 'Warning!');
        }
      }

      this.accountSelectorModal.close();
    }
  }

  onConfirmed(event: any) {
    let account = event;
    if (account && account.accountId > 0) {
      let accounts = this.uiCreditAccounts.filter((acc: any) => acc.accountId == account.accountId);
      if (accounts && accounts.length) {
        accounts[0].amount = parseFloat(accounts[0].amount) + parseFloat(account.amount);

        this.transferCreditForm.patchValue({
          creditAmount: parseFloat(this.creditAmount.value) + parseFloat(account.amount),
        });

        this.transferCreditForm.patchValue({
          differenceAmount: (parseFloat(this.debitAmount.value) - parseFloat(this.creditAmount.value)).toFixed(2)
        });
      }
    }
  }


  deleteDebitAccount(accountIndex: number) {
    if (accountIndex > -1) {
      this.uiDebitAccounts.splice(accountIndex, 1);
      this.transferCreditForm.patchValue({
        debitAmount: 0,
      });

      this.calculateAmounts();
    }
  }

  deleteCreditAccount(accountIndex: any) {
    if (accountIndex > -1) {
      this.uiCreditAccounts.splice(accountIndex, 1);
      this.calculateAmounts();

    }
  }

  calculateAmounts() {
    if (this.uiCreditAccounts && this.uiCreditAccounts.length) {
      let creditAmount = 0;
      this.uiCreditAccounts.forEach((uiCreditAccount:any) => creditAmount += parseFloat(uiCreditAccount.amount))

      let differece = parseFloat(this.debitAmount.value) - creditAmount;
      this.transferCreditForm.patchValue({
        creditAmount: creditAmount,
        differenceAmount: differece
      });
    }
    else{
      this.transferCreditForm.patchValue({
        creditAmount: 0,
        differenceAmount: 0
      });
    }
  }

  clearTransaction() {
    this.uiDebitAccounts = [];
    this.uiCreditAccounts = [];
    this.transferCreditForm.patchValue({
      tokenId: "",
      branch: "",
      generalLedger: "",
      accountNumber:  "",
      debitAmount:  "",
      creditAmount:  "",
      differenceAmount:  "",
      transactionDesc:  "",
      chequeNo:  "",
      chequeDate: new FormControl(new Date(Date.now()), []),
      balanceAmountWillBe:  "",
      customerName:  "",
      accountId:  "",
      glCode:  "",
      accountType:  "",
      modeOfOperation:  "",
      balance:  "",
      minBalance:  "",
      unclearedReceipt:  "",
      unclearedPayment:  "",
      lastTransactionDate:  "",
      lastInterestDate:  "",
      openDate:  "",
      interestRate:  "",
    });

    this.messageNote = {};
    this.isResetAccountSearch= false;
    this.accountTypeText = "";

  }

  isValidTransaction()
  {
    if (this.uiDebitAccounts.length > 0 && this.uiCreditAccounts.length > 0) {
      if (parseFloat(this.debitAmount.value) == parseFloat(this.creditAmount.value)) {
        return true;
      }
      else
      {
        this._toastrService.error("Debit amount and credit amount not matching!", 'Error!');
      }
    }
    else
    {
      this._toastrService.error("Please add accounts to finish transaction!", 'Error!');
    }
    return false;
  }

  onTransactionConfirmed(isConfirmed: any)
  {
    // if (isConfirmed) {
    //   window.location.reload();
    // }
  }

  makeTransaction() {
    if (this.isValidTransaction()) {
      
      // Debit account 

      let uidebitAccount = this.uiDebitAccounts[0];
      let transactionSummaries = [];
      let transactionSummary = {} as ITransactionSummaryModel;
      transactionSummary.Id = 0;
      transactionSummary.BranchCode = this._sharedService.applicationUser.branchId;
      transactionSummary.VoucherDate = new Date( this._sharedService.getWorkOperationDate());
      transactionSummary.VoucherType = 2; // 1 = cash 2 = transfer 3 = UPI
      transactionSummary.VoucherNo = parseInt(this.tokenId.value);
      transactionSummary.VoucherAmount = parseFloat(uidebitAccount.amount);
      transactionSummary.TransactionNarration = uidebitAccount.narration;
      transactionSummary.YearEnd = false;
      transactionSummary.UTR_ChequeNo = this.chequeNo.value.length? this.chequeNo.value : "";
      transactionSummary.UTR_ChequeDate = this.chequeNo.value.length? new Date(this.chequeDate.value) : new Date(Date.now()), [];
      transactionSummary.TransactionPassing = false;
      transactionSummary.CreatedBy = this._sharedService.applicationUser.id;
      transactionSummary.VerifiedBy = 0;
      transactionSummary.CDType = 0;// 1 = CREDIT 2 = Debit
      transactionSummary.VerifiedDateTime = new Date();
      transactionSummary.TransactionDetails = [];


      // Debit account
      let transactionDebitDetails = {} as ITransactionDetailsModel;
      transactionDebitDetails.VoucherHeadId = 0;
      transactionDebitDetails.Code1 = parseInt(uidebitAccount.glCode);
      transactionDebitDetails.AccountId = parseFloat(uidebitAccount.accountId);
      transactionDebitDetails.IntFlag = 0;
      transactionDebitDetails.IntCode1 = uidebitAccount.payableGLCode;
      transactionDebitDetails.CDFlag = 2;  // 1 = CREDIT 2 = Debit
      transactionDebitDetails.CTFlag = 2;  // 1 = Cash 2 = Transfer
      transactionDebitDetails.Transaction_Amount = parseFloat(uidebitAccount.amount);
      transactionDebitDetails.Transaction_Narration = uidebitAccount.narration;
      transactionSummary.TransactionDetails = [];
      transactionSummary.TransactionDetails.push(transactionDebitDetails);

      // Credit accounts

      for (let index = 0; index < this.uiCreditAccounts.length; index++) {
        let uiCreditAccount = this.uiCreditAccounts[index];
        let transactionCreditDetails = {} as ITransactionDetailsModel;
        transactionCreditDetails.VoucherHeadId = 0;
        transactionCreditDetails.Code1 = parseInt(uiCreditAccount.glCode);
        transactionCreditDetails.AccountId = parseFloat(uiCreditAccount.accountId);
        transactionCreditDetails.IntFlag = 0;
        transactionCreditDetails.IntCode1 = uiCreditAccount.payableGLCode;
        transactionCreditDetails.CDFlag = 1;  // 1 = CREDIT 2 = Debit
        transactionCreditDetails.CTFlag = 2;  // 1 = Cash 2 = Transfer
        transactionCreditDetails.Transaction_Amount = parseFloat(uiCreditAccount.amount);
        transactionCreditDetails.Transaction_Narration = uiCreditAccount.narration;
        transactionSummary.TransactionDetails.push(transactionCreditDetails);
      }
     
      transactionSummaries.push(transactionSummary);
      this.executeTransaction(transactionSummaries);

    }
  }

  executeTransaction(transactionSummaries: ITransactionSummaryModel[])
  {
    this._transactionMasterService.saveTransferTransactions(transactionSummaries).subscribe((data: any) => {
     
      if (data) {
        if (data.data.data && data.data.data.retId > 0) {
          if (data.data.data.status == "SUCCESS") {

            let messages = [];
            messages.push({ title: "Token Number :", value: transactionSummaries[0].VoucherNo });

            this.messageNotes = messages;
            this.messageBoxModal.open();

            this.clearTransaction();

            this._toastrService.success("Transaction done for Token : " + transactionSummaries[0].VoucherNo, 'Success!');
            //this.configClick("counter-transactions");
          }
          else {
            this._toastrService.error("Error saving transaction!", 'Error!');
          }
        }
      }
    })
  }

  get tokenId() {
    return this.transferCreditForm.get('tokenId')!;
  }

  get branch() {
    return this.transferCreditForm.get('branch')!;
  }

  get generalLedger() {
    return this.transferCreditForm.get('generalLedger')!;
  }

  get accountNumber() {
    return this.transferCreditForm.get('accountNumber')!;
  }

  get debitAmount() {
    return this.transferCreditForm.get('debitAmount')!;
  }

  get creditAmount() {
    return this.transferCreditForm.get('creditAmount')!;
  }

  get differenceAmount() {
    return this.transferCreditForm.get('differenceAmount')!;
  }

  get balanceAmountWillBe() {
    return this.transferCreditForm.get('balanceAmountWillBe')!;
  }

  get transactionDesc() {
    return this.transferCreditForm.get('transactionDesc')!;
  }

  get chequeNo() {
    return this.transferCreditForm.get('chequeNo')!;
  }

  get chequeDate() {
    return this.transferCreditForm.get('chequeDate')!;
  }

  get customerName() {
    return this.transferCreditForm.get('customerName')!;
  }

  get accountId() {
    return this.transferCreditForm.get('accountId')!;
  }

  get glCode() {
    return this.transferCreditForm.get('glCode')!;
  }

  get accountType() {
    return this.transferCreditForm.get('accountType')!;
  }
  get modeOfOperation() {
    return this.transferCreditForm.get('modeOfOperation')!;
  }
  get balance() {
    return this.transferCreditForm.get('balance')!;
  }
  get minBalance() {
    return this.transferCreditForm.get('minBalance')!;
  }

  get unclearedReceipt() {
    return this.transferCreditForm.get('unclearedReceipt')!;
  }
  get unclearedPayment() {
    return this.transferCreditForm.get('unclearedPayment')!;
  }
  get lastTransactionDate() {
    return this.transferCreditForm.get('lastTransactionDate')!;
  }
  get lastInterestDate() {
    return this.transferCreditForm.get('lastInterestDate')!;
  }
  get openDate() {
    return this.transferCreditForm.get('openDate')!;
  }
  get interestRate() {
    return this.transferCreditForm.get('interestRate')!;
  }

}
