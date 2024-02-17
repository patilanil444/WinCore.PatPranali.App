import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, NumberValueAccessor, Validators } from '@angular/forms';
import { NgxDropdownConfig } from 'ngx-select-dropdown';
import { ToastrService } from 'ngx-toastr';
import { SystemEntryDeclarations } from 'src/app/common/system-entry-declarations';
import { GeneralLedgerService } from 'src/app/services/masters/general-ledger/general-ledger.service';
import { SystemProfileService } from 'src/app/services/masters/system-profile/system-profile.service';
import { SharedService } from 'src/app/services/shared.service';

interface ISystemProfileModel {
  SystemGeneral: ISystemGeneralModel;
  SystemInterests: ISystemInterestsModel;
}

interface ISystemGeneralModel {
  Id: number;
  BranchId: number;
  DayOpen: string;
  StandingInstructionExecute: string;
  StartDate: Date;
  CorrectionDate: Date;
  MaxGIBalance: number;
  MaxScheduleBalance: number;
  ActualProfit: string;
  RegularShareValue: number;
  RegularShareGL: number;
  RegularShareDividentGL: number;
  AssociateShareValue: number;
  AssociateShareGL: number;
  AssociateShareDividentGL: number;
  AuthorisedShareCapital: number;
  NominalShareGL: number;
  SCCast: number;
  STCast: number;
  DepositSecurity: number;
  GoldSecurity: number;
  PhotoSeperate: string;
  PhotoExtention: string;
  SignatureExtension: string;
  Clearing: string;
  ClearingMember: string;
  ClearingHouseNo: number;
  DailyAuthorisation: string;
  BankAdvice: number;
  EnglishFont: string;
  EnglishFontSize: number;
  MarathiFont: string;
  MarathiFontSize: number;
  CommonFont: string;
  CommonFontSize: number;
  SoftwareType: string;
  SoftwareLanguage: string;
  BankType: string;
  SharesLanguage: string;
}

interface ISystemInterestsModel {
  Id: number;
  BranchId: number;
  LoanPrincipInterestReceivedGL: number;
  LoanPrincipInterestReceivableGL: number;
  LoanInterestAutoCR: boolean;
  LoanPenalInterestReceivedGL: number;
  LoanPenalInterestReceivableGL: number;
  LoanPenalInterestAddToBal: boolean;
  LoanPenalInterestAutoCR: boolean;
  LoanPostageReceivedGL: number;
  LoanPostageReceivableGL: number;
  LoanPostageAddToBal: boolean;
  LoanPostageAutoCR: boolean;
  LoanExpensesNoticeReceivedGL: number;
  LoanExpensesNoticeReceivableGL: number;
  LoanNoticeExpensesAddToBal: boolean;
  LoanNoticeExpensesAutoCR: boolean;
  LoanInsuranceReceivedGL: number;
  LoanInsuranceReceivableGL: number;
  LoanInsuranceAddToBal: boolean;
  LoanInsuranceAutoCR: boolean;
  LoanSurchargeReceivedGL: number;
  LoanSurchargeReceivableGL: number;
  LoanSurchargeAddToBal: boolean;
  LoanSurchargeAutoCR: boolean;
  LoanOtherReceivedGL: number;
  LoanOtherReceivableGL: number;
  LoanOtherAddToBal: boolean;
  LoanOtherAutoCR: boolean;
  LoanCalculateInterestAtReceipt: boolean;
  LoanTreatPenalAsInterest: string;
  LoanCalcInterestOnReceivables: boolean;
  LoanInterestDayMonth: string;
  LoanMaxDaysCCLimit: number;
  CashCode: number;
  HOCode: number;
  PigmyCommisionReceivedCode: number;
  PigmyCommisionReceivableCode: number;
  RecurringPenalCode: number;
  IncidentalChargesGL: number;
  BillsReceivableCode: number;
  BillsSendForCollectionCode: number;
  InwardBillReceivableCode: number;
  InwardBillCollectionCode: number;
  IBCOBCCommisionReceivedCode: number;
  IBCOBCCommisionPaidCode: number;
  DDPayableWithAdvice: number;
  DDPayableWithoutAdvice: number;
  OverdueInterestReserve: number;
  DepositSavingStartDay: number;
  DepositSavingEndDay: number;
  DepositSavingMaxBalance: number;
  DepositSavingMinInterest: number;
  DepositPigmyCalcType: string;
  DepositPigmyStartDay: number;
  DepositPigmyEndDay: number;
  DepositPigmyInterestDay: string;
  DepositPigmyBalanceType: string;
  DepositRecurringInterestDay: string;
  DepositRecurringBalanceType: string;
  DepositRecurringCalcIntOnDemand: boolean;
  DepositFDInterestCalcType: string;
  DepositFDMonthlyDiscountRate: boolean;
  DepositReInvIntCalcCode: string;
  DepositReInvPrematureCode: string;
  DepositInterestDRAuto: boolean;
}


@Component({
  selector: 'app-bank-profile-master',
  templateUrl: './bank-profile-master.component.html',
  styleUrls: ['./bank-profile-master.component.css']
})
export class BankProfileMasterComponent implements OnInit {
  //FrmsysAdd
  profileForm!: FormGroup;
  loanForm!: FormGroup;
  fixGIForm!: FormGroup;
  depositForm!: FormGroup;

  uiGeneralLedgers = [];
  isAddMode = true;
  uiSystemProfile: any;

  config: NgxDropdownConfig = {
    displayKey: "name",
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

  constructor(private _generalLedgerService: GeneralLedgerService, private _sharedService: SharedService,
    private _systemProfileService: SystemProfileService, private _toastrService: ToastrService) { }

  ngOnInit(): void {

    this.profileForm = new FormGroup({
      code: new FormControl("", []),
      today: new FormControl(formatDate(new Date(Date.now()), 'yyyy-MM-dd', 'en'), [Validators.required]),
      dayOpen: new FormControl(this.dayOpenGeneral[0].code, []),
      standingInstructionExe: new FormControl(this.standingInstructionGeneral[0].code, []),
      startDate: new FormControl(formatDate(new Date(Date.now()), 'yyyy-MM-dd', 'en'), [Validators.required]),
      correctionDate: new FormControl(formatDate(new Date(Date.now()), 'yyyy-MM-dd', 'en'), [Validators.required]),
      maxGIBalanceSheet: new FormControl("", []),
      maxScheduleBalanceSheet: new FormControl("", []),
      regularShareValue: new FormControl("", []),
      regularShareGL: new FormControl("", []),
      regularShareGI: new FormControl("", []),
      associatedShareValue: new FormControl("", []),
      associatedShareGL: new FormControl("", []),
      associatedShareGI: new FormControl("", []),
      authorisedShareCapital: new FormControl("", []),
      nominalShareGICode: new FormControl("", []),
      scCastNo: new FormControl("", []),
      stCastNo: new FormControl("", []),
      depositSecurityNumber: new FormControl("", []),
      goldSecurityNumber: new FormControl("", []),
      actualProfit: new FormControl(this.actualProfitGeneral[0].code, []),
      photoSignatureSeperate: new FormControl(this.photoSignatureGeneral[0].code, []),
      photoExtension: new FormControl(this.photoExtentionsGeneral[0].code, []),
      signatureExtension: new FormControl(this.photoExtentionsGeneral[0].code, []),
      clearing: new FormControl(this.clearingGeneral[0].code, []),
      clearingMember: new FormControl(this.clearingMemberGeneral[0].code, []),
      clearingHouseNumber: new FormControl("", []),
      dailyAuthorisation: new FormControl(this.dailyAuthorisationGeneral[0].code, []),
      bankAdvice: new FormControl("", []),
      englishFont: new FormControl("", []),
      englishFontSize: new FormControl("", []),
      marathiFont: new FormControl("", []),
      marathiFontSize: new FormControl("", []),
      commonFont: new FormControl("", []),
      commonFontSize: new FormControl("", []),
      softwareType: new FormControl(this.softwareTypesGeneral[0].code, []),
      softwareLanguage: new FormControl(this.softwareLanguageGeneral[0].code, []),
      bankType: new FormControl(this.bankTypeGeneral[0].code, []),
      sharesLanguage: new FormControl(this.sharesLanguageGeneral[0].code, []),
    });

    this.loanForm = new FormGroup({
      principaliseInterestReceivedGL: new FormControl("", []),
      principaliseInterestReceivableGL: new FormControl("", []),
      overdueLoanInterestAutoCR: new FormControl(this.automaticTransferEntryLoan[0].code, []),
      penalInterestReceivedGL: new FormControl("", []),
      penalInterestReceivableGL: new FormControl("", []),
      penalInterestAddBalance: new FormControl(this.addReceivableInBalanceLoan[0].code, []),
      penalInterestAutoCR: new FormControl(this.automaticTransferEntryLoan[0].code, []),
      postageReceivedGL: new FormControl("", []),
      postageReceivableGL: new FormControl("", []),
      postageInterestAddBalance: new FormControl(this.addReceivableInBalanceLoan[0].code, []),
      postageAutoCR: new FormControl(this.automaticTransferEntryLoan[1].code, []),
      noticeExpensesReceivedGL: new FormControl("", []),
      noticeExpensesReceivableGL: new FormControl("", []),
      noticeExpensesAddBalance: new FormControl(this.addReceivableInBalanceLoan[0].code, []),
      noticeExpensesAutoCR: new FormControl(this.automaticTransferEntryLoan[1].code, []),
      insuranceReceivedGL: new FormControl("", []),
      insuranceReceivableGL: new FormControl("", []),
      insuranceAddBalance: new FormControl(this.addReceivableInBalanceLoan[0].code, []),
      insuranceAutoCR: new FormControl(this.automaticTransferEntryLoan[1].code, []),
      surchargeReceivedGL: new FormControl("", []),
      surchargeReceivableGL: new FormControl("", []),
      surchargeAddBalance: new FormControl(this.addReceivableInBalanceLoan[0].code, []),
      surchargeAutoCR: new FormControl(this.automaticTransferEntryLoan[1].code, []),
      otherExpenseReceivedGL: new FormControl("", []),
      otherExpenseReceivableGL: new FormControl("", []),
      otherExpenseAddBalance: new FormControl(this.addReceivableInBalanceLoan[0].code, []),
      otherExpenseAutoCR: new FormControl(this.automaticTransferEntryLoan[1].code, []),
      calcInterestOnReceipt: new FormControl(this.calcInterestAtReceiptLoan[0].code, []),
      treatPenalAsInterest: new FormControl(this.treatPenalAsInterestLoan[0].code, []),
      calcInterestOnReceivables: new FormControl(this.calcInterestOnReceivablesLoan[1].code, []),
      loanInterest: new FormControl(this.loanInterestLoan[0].code, []),
      maxDaysReceiptCCLimit: new FormControl("", []),
    });

    this.fixGIForm = new FormGroup({
      cashCode: new FormControl("", []),
      hoCode: new FormControl("", []),
      pigmyCommisionReceivedCode: new FormControl("", []),
      pigmyCommisionReceivableCode: new FormControl("", []),
      recurringPenalCode: new FormControl("", []),
      incidentalChargesGL: new FormControl("", []),
      billsReceivableCode: new FormControl("", []),
      billsSendForCollectionCode: new FormControl("", []),
      inwardBillsReceivableCode: new FormControl("", []),
      inwardBillsSendCollectionCode: new FormControl("", []),
      ibcOBCCommisionReceivedCode: new FormControl("", []),
      ibcOBCCommisionPaidCode: new FormControl("", []),
      ddPayableWithAdvice: new FormControl("", []),
      ddPayableWithoutAdvice: new FormControl("", []),
      overdueInterestReserve: new FormControl("", []),
    });

    this.depositForm = new FormGroup({
      savingMinBalanceStart: new FormControl("", []),
      savingMinBalanceEnd: new FormControl("", []),
      maxAmount: new FormControl("", []),
      minInterest: new FormControl("", []),
      pigmyCalculationType: new FormControl(this.pigmyCalcTypeDeposit[0].code, []),
      pigmyMinBalanceStart: new FormControl("", []),
      pigmyMinBalanceEnd: new FormControl("", []),
      pigmyMontlyBalanceType: new FormControl(this.pigmyMonthlyBalanceDeposit[0].code, []),
      pigmyBalanceType: new FormControl(this.pigmyBalanceTypeDeposit[0].code, []),
      recurringMonthlyBalanceType: new FormControl(this.recurringMonthlyBalanceDeposit[0].code, []),
      recurringBalanceType: new FormControl(this.recurringBalanceTypeDeposit[0].code, []),
      recurringCalcIntOnDemand: new FormControl(this.recurringCalcIntOnDemandDeposit[1].code, []),
      fdIntCalcType: new FormControl(this.fdintCalcTypeDeposit[0].code, []),
      monthlyDicountRate: new FormControl(this.fdMonthlyDiscountRateDeposit[0].code, []),
      reinvestmentIntCalcType: new FormControl(this.riIntCalcTypeDeposit[0].code, []),
      prematureIntCalc: new FormControl(this.riPrematureIntCalcDeposit[0].code, []),
      drIntAutoTransfer: new FormControl(this.autoDRIntDeposit[0].code, []),
    });


    this.code.disable();
    this.today.disable();
    this.dayOpen.disable();
    this.standingInstructionExe.disable();
    this.startDate.disable();
    //this.maxGIBalanceSheet.disable();
    //this.maxScheduleBalanceSheet.disable();
    this.clearing.disable();
    this.clearingMember.disable();
    this.dailyAuthorisation.disable();
    this.softwareType.disable();
    this.softwareLanguage.disable();
    this.bankType.disable();
    this.sharesLanguage.disable();
    this.actualProfit.disable();
    this.photoSignatureSeperate.disable();

    this.overdueLoanInterestAutoCR.disable();
    this.penalInterestAddBalance.disable();
    this.penalInterestAutoCR.disable();
    this.postageInterestAddBalance.disable();
    this.postageAutoCR.disable();
    this.noticeExpensesAddBalance.disable();
    this.noticeExpensesAutoCR.disable();
    this.insuranceAddBalance.disable();
    this.insuranceAutoCR.disable();
    this.surchargeAddBalance.disable();
    this.surchargeAutoCR.disable();
    this.otherExpenseAddBalance.disable();
    this.otherExpenseAutoCR.disable();
    this.calcInterestOnReceipt.disable();
    this.treatPenalAsInterest.disable();

    this.pigmyCalculationType.disable();
    this.pigmyMontlyBalanceType.disable();
    this.pigmyBalanceType.disable();
    this.recurringMonthlyBalanceType.disable();
    this.recurringBalanceType.disable();
    this.recurringCalcIntOnDemand.disable();
    this.fdIntCalcType.disable();
    this.monthlyDicountRate.disable();
    this.reinvestmentIntCalcType.disable();
    this.drIntAutoTransfer.disable();


    this.getGeneralLedgers();
  }

  getGeneralLedgers() {
    this._generalLedgerService.getGeneralLedgers(this._sharedService.applicationUser.branchId).subscribe((data: any) => {
      console.log(data);
      if (data) {
        this.uiGeneralLedgers = data.data.data;
        if (this.uiGeneralLedgers) {

          this.uiGeneralLedgers.map((gl: any, i: any) => {
            gl.name = gl.id + "-" + gl.name;
          });

          this.getSystemProfile();
        }
      }
    })
  }

  getSystemProfile()
  {
    this._systemProfileService.getSystemProfile(this._sharedService.applicationUser.branchId).subscribe((data: any) => {
      console.log(data);
      if (data) {
        this.uiSystemProfile = data.data.data;
        if (this.uiSystemProfile && this.uiSystemProfile.systemGeneral) {

          if (this.uiSystemProfile.systemGeneral.id > 0 && this.uiSystemProfile.systemInterests.id > 0) {

            let systemGeneral = this.uiSystemProfile.systemGeneral;
            let systemInterests = this.uiSystemProfile.systemInterests;

            // patch forms
            this.profileForm.patchValue({
              code: systemGeneral.branchId,
              dayOpen: systemGeneral.dayOpen ,
              standingInstructionExe: systemGeneral.standingInstructionExecute,
              startDate: formatDate(new Date(systemGeneral.startDate), 'yyyy-MM-dd', 'en'),
              //correctionDate: formatDate(new Date(systemGeneral.correctionDate), 'yyyy-MM-dd', 'en'),
              maxGIBalanceSheet: systemGeneral.maxGIBalance,
              maxScheduleBalanceSheet: systemGeneral.maxScheduleBalance,
              regularShareValue: systemGeneral.regularShareValue,
              regularShareGL: this.bindGLValue(systemGeneral.regularShareGL),
              regularShareGI: systemGeneral.regularShareDividentGL,
              associatedShareValue: systemGeneral.associateShareValue,
              associatedShareGL: this.bindGLValue(systemGeneral.associateShareGL),
              associatedShareGI: systemGeneral.associateShareDividentGL,
              authorisedShareCapital: systemGeneral.authorisedShareCapital,
              nominalShareGICode:systemGeneral.nominalShareGL,
              scCastNo: systemGeneral.scCast,
              stCastNo: systemGeneral.stCast,
              depositSecurityNumber: systemGeneral.depositSecurity,
              goldSecurityNumber: systemGeneral.goldSecurity,
              actualProfit: systemGeneral.actualProfit,
              photoSignatureSeperate: systemGeneral.photoSeperate,
              photoExtension: systemGeneral.photoExtention,
              signatureExtension: systemGeneral.signatureExtension,
              clearing: systemGeneral.clearing,
              clearingMember: systemGeneral.clearingMember,
              clearingHouseNumber: systemGeneral.clearingHouseNo,
              dailyAuthorisation: systemGeneral.dailyAuthorisation,
              bankAdvice: systemGeneral.bankAdvice,
              englishFont: systemGeneral.englishFont,
              englishFontSize:systemGeneral.englishFontSize,
              marathiFont: systemGeneral.marathiFont,
              marathiFontSize: systemGeneral.marathiFontSize,
              commonFont: systemGeneral.commonFont,
              commonFontSize: systemGeneral.commonFontSize,
              softwareType: systemGeneral.softwareType,
              softwareLanguage: systemGeneral.softwareLanguage,
              bankType: systemGeneral.bankType,
              sharesLanguage: systemGeneral.sharesLanguage
            });

            this.loanForm.patchValue({
              principaliseInterestReceivedGL: this.bindGLValue(systemInterests.loanPrincipInterestReceivedGL),
              principaliseInterestReceivableGL: this.bindGLValue(systemInterests.loanPrincipInterestReceivableGL),
              overdueLoanInterestAutoCR: systemInterests.loanInterestAutoCR ? 'Y': 'N',
              penalInterestReceivedGL: this.bindGLValue(systemInterests.loanPenalInterestReceivedGL),
              penalInterestReceivableGL:  this.bindGLValue(systemInterests.loanPenalInterestReceivableGL),
              penalInterestAddBalance: systemInterests.loanPenalInterestAddToBal ? 'Y': 'N',
              penalInterestAutoCR: systemInterests.loanPenalInterestAutoCR ? 'Y': 'N',
              postageReceivedGL: this.bindGLValue(systemInterests.loanPostageReceivedGL),
              postageReceivableGL: this.bindGLValue(systemInterests.loanPostageReceivableGL),
              postageInterestAddBalance: systemInterests.loanPostageAddToBal ? 'Y': 'N',
              postageAutoCR: systemInterests.loanPostageAutoCR ? 'Y': 'N',
              noticeExpensesReceivedGL: this.bindGLValue(systemInterests.loanExpensesNoticeReceivedGL),
              noticeExpensesReceivableGL: this.bindGLValue(systemInterests.loanExpensesNoticeReceivableGL),
              noticeExpensesAddBalance: systemInterests.loanNoticeExpensesAddToBal ? 'Y': 'N',
              noticeExpensesAutoCR: systemInterests.loanNoticeExpensesAutoCR ? 'Y': 'N',
              insuranceReceivedGL: this.bindGLValue(systemInterests.loanInsuranceReceivedGL),
              insuranceReceivableGL: this.bindGLValue(systemInterests.loanInsuranceReceivableGL),
              insuranceAddBalance: systemInterests.loanInsuranceAddToBal ? 'Y': 'N',
              insuranceAutoCR: systemInterests.loanInsuranceAutoCR ? 'Y': 'N',
              surchargeReceivedGL: this.bindGLValue(systemInterests.loanSurchargeReceivedGL),
              surchargeReceivableGL: this.bindGLValue(systemInterests.loanSurchargeReceivableGL),
              surchargeAddBalance: systemInterests.loanSurchargeAddToBal ? 'Y': 'N',
              surchargeAutoCR: systemInterests.loanSurchargeAutoCR ? 'Y': 'N',
              otherExpenseReceivedGL: this.bindGLValue(systemInterests.loanOtherReceivedGL),
              otherExpenseReceivableGL: this.bindGLValue(systemInterests.loanOtherReceivableGL),
              otherExpenseAddBalance: systemInterests.loanOtherAddToBal ? 'Y': 'N',
              otherExpenseAutoCR: systemInterests.loanOtherAutoCR ? 'Y': 'N',
              calcInterestOnReceipt: systemInterests.loanCalculateInterestAtReceipt ? 'Y': 'N',
              treatPenalAsInterest: systemInterests.loanTreatPenalAsInterest,
              calcInterestOnReceivables: systemInterests.loanCalcInterestOnReceivables ? 'Y': 'N',
              loanInterest: systemInterests.loanInterestDayMonth,
              maxDaysReceiptCCLimit: systemInterests.loanMaxDaysCCLimit
            });


            this.fixGIForm.patchValue({
              cashCode: systemInterests.cashCode,
              hoCode:  systemInterests.hoCode,
              pigmyCommisionReceivedCode:  systemInterests.pigmyCommisionReceivedCode,
              pigmyCommisionReceivableCode:  systemInterests.pigmyCommisionReceivableCode,
              recurringPenalCode:  systemInterests.recurringPenalCode,
              incidentalChargesGL:  systemInterests.incidentalChargesGL,
              billsReceivableCode:  systemInterests.billsReceivableCode,
              billsSendForCollectionCode:  systemInterests.billsSendForCollectionCode,
              inwardBillsReceivableCode:  systemInterests.inwardBillReceivableCode,
              inwardBillsSendCollectionCode:  systemInterests.inwardBillCollectionCode,
              ibcOBCCommisionReceivedCode:  systemInterests.ibcobcCommisionReceivedCode,
              ibcOBCCommisionPaidCode:  systemInterests.ibcobcCommisionPaidCode,
              ddPayableWithAdvice:  systemInterests.ddPayableWithAdvice,
              ddPayableWithoutAdvice:  systemInterests.ddPayableWithoutAdvice,
              overdueInterestReserve:  systemInterests.overdueInterestReserve,
            });
        
            this.depositForm.patchValue({
              savingMinBalanceStart: systemInterests.depositSavingStartDay,
              savingMinBalanceEnd: systemInterests.depositSavingEndDay,
              maxAmount: systemInterests.depositSavingMaxBalance,
              minInterest: systemInterests.depositSavingMinInterest,
              pigmyCalculationType: systemInterests.depositPigmyCalcType,
              pigmyMinBalanceStart: systemInterests.depositPigmyStartDay,
              pigmyMinBalanceEnd: systemInterests.depositPigmyEndDay,
              pigmyMontlyBalanceType: systemInterests.depositPigmyInterestDay,
              pigmyBalanceType: systemInterests.depositPigmyBalanceType,
              recurringMonthlyBalanceType: systemInterests.depositRecurringInterestDay,
              recurringBalanceType: systemInterests.depositRecurringBalanceType,
              recurringCalcIntOnDemand: systemInterests.depositRecurringCalcIntOnDemand ? 'Y': 'N',
              fdIntCalcType: systemInterests.depositFDInterestCalcType,
              monthlyDicountRate: systemInterests.depositFDMonthlyDiscountRate ? 'Y': 'N',
              reinvestmentIntCalcType: systemInterests.depositReInvIntCalcCode,
              prematureIntCalc: systemInterests.depositReInvPrematureCode,
              drIntAutoTransfer: systemInterests.depositInterestDRAuto ? 'Y': 'N',
            });

            this.isAddMode = false;
          }
          else
          {
            this.isAddMode = true;
          }
        }
        else
        {
          this.isAddMode = true;
        }
      }
    })

  }


  bindGLValue(glValue: number)
  {
    let filteredGLs = this.uiGeneralLedgers.filter((gl: any) => gl.id == glValue);
    if (filteredGLs && filteredGLs.length) {
      return filteredGLs[0];
    }
  }


  saveProfile() {
    if (this.validateForm()) {
      let systemProfileModel = {} as ISystemProfileModel;
      let systemGeneralModel = {} as ISystemGeneralModel;
      let systemInterestsModel = {} as ISystemInterestsModel;

      systemGeneralModel.BranchId = this._sharedService.applicationUser.branchId;
      systemGeneralModel.DayOpen =  this.dayOpen.value.toString();
      systemGeneralModel.StandingInstructionExecute = this.standingInstructionExe.value.toString();
      systemGeneralModel.StartDate = this.startDate.value.toString();
      systemGeneralModel.CorrectionDate = this.correctionDate.value.toString();
      systemGeneralModel.MaxGIBalance = this.maxGIBalanceSheet.value.toString();
      systemGeneralModel.MaxScheduleBalance = this.maxScheduleBalanceSheet.value.toString();
      systemGeneralModel.ActualProfit = this.actualProfit.value.toString();
      systemGeneralModel.RegularShareValue = this.regularShareValue.value.toString();
      systemGeneralModel.RegularShareGL = this.regularShareGL.value.id.toString();
      systemGeneralModel.RegularShareDividentGL = this.regularShareGI.value.toString();
      systemGeneralModel.AssociateShareValue = this.associatedShareValue.value.toString();
      systemGeneralModel.AssociateShareGL = this.associatedShareGL.value.id.toString();
      systemGeneralModel.AssociateShareDividentGL = this.associatedShareGI.value.toString();
      systemGeneralModel.AuthorisedShareCapital = this.authorisedShareCapital.value.toString();
      systemGeneralModel.NominalShareGL = this.nominalShareGICode.value.toString();
      systemGeneralModel.SCCast = this.scCastNo.value.toString();
      systemGeneralModel.STCast = this.stCastNo.value.toString();
      systemGeneralModel.DepositSecurity = this.depositSecurityNumber.value.toString();
      systemGeneralModel.GoldSecurity = this.goldSecurityNumber.value.toString();
      systemGeneralModel.PhotoSeperate = this.photoSignatureSeperate.value.toString();
      systemGeneralModel.PhotoExtention = this.photoExtension.value.toString();
      systemGeneralModel.SignatureExtension = this.signatureExtension.value.toString();
      systemGeneralModel.Clearing = this.clearing.value.toString();
      systemGeneralModel.ClearingMember = this.clearingMember.value.toString();
      systemGeneralModel.ClearingHouseNo = this.clearingHouseNumber.value.toString();
      systemGeneralModel.DailyAuthorisation = this.dailyAuthorisation.value.toString();
      systemGeneralModel.BankAdvice = this.bankAdvice.value.toString();
      systemGeneralModel.EnglishFont = this.englishFont.value.toString();
      systemGeneralModel.EnglishFontSize = this.englishFontSize.value.toString();
      systemGeneralModel.MarathiFont = this.marathiFont.value.toString();
      systemGeneralModel.MarathiFontSize = this.marathiFontSize.value.toString();
      systemGeneralModel.CommonFont = this.commonFont.value.toString();
      systemGeneralModel.CommonFontSize = this.commonFontSize.value.toString();
      systemGeneralModel.SoftwareType = this.softwareType.value.toString();
      systemGeneralModel.SoftwareLanguage = this.softwareLanguage.value.toString();
      systemGeneralModel.BankType = this.bankType.value.toString();
      systemGeneralModel.SharesLanguage = this.sharesLanguage.value.toString();

      systemInterestsModel.BranchId = this._sharedService.applicationUser.branchId;
      systemInterestsModel.LoanPrincipInterestReceivedGL = this.principaliseInterestReceivedGL.value.id.toString();
      systemInterestsModel.LoanPrincipInterestReceivableGL = this.principaliseInterestReceivableGL.value.id.toString();
      systemInterestsModel.LoanInterestAutoCR = this.overdueLoanInterestAutoCR.value.toString() == 'Y' ? true : false;
      systemInterestsModel.LoanPenalInterestReceivedGL = this.penalInterestReceivedGL.value.id.toString();
      systemInterestsModel.LoanPenalInterestReceivableGL = this.penalInterestReceivableGL.value.id.toString();
      systemInterestsModel.LoanPenalInterestAddToBal = this.penalInterestAddBalance.value.toString() == 'Y' ? true : false;
      systemInterestsModel.LoanPenalInterestAutoCR = this.penalInterestAutoCR.value.toString() == 'Y' ? true : false;
      systemInterestsModel.LoanPostageReceivedGL = this.postageReceivedGL.value.id.toString();
      systemInterestsModel.LoanPostageReceivableGL = this.postageReceivableGL.value.id.toString();
      systemInterestsModel.LoanPostageAddToBal = this.postageInterestAddBalance.value.toString() == 'Y' ? true : false;
      systemInterestsModel.LoanPostageAutoCR = this.postageAutoCR.value.toString() == 'Y' ? true : false;
      systemInterestsModel.LoanExpensesNoticeReceivedGL = this.noticeExpensesReceivedGL.value.id.toString();
      systemInterestsModel.LoanExpensesNoticeReceivableGL = this.noticeExpensesReceivableGL.value.id.toString();
      systemInterestsModel.LoanNoticeExpensesAddToBal = this.noticeExpensesAddBalance.value.toString() == 'Y' ? true : false;
      systemInterestsModel.LoanNoticeExpensesAutoCR = this.noticeExpensesAutoCR.value.toString() == 'Y' ? true : false;
      systemInterestsModel.LoanInsuranceReceivedGL = this.insuranceReceivedGL.value.id.toString();
      systemInterestsModel.LoanInsuranceReceivableGL = this.insuranceReceivableGL.value.id.toString();
      systemInterestsModel.LoanInsuranceAddToBal = this.insuranceAddBalance.value.toString() == 'Y' ? true : false;
      systemInterestsModel.LoanInsuranceAutoCR = this.insuranceAutoCR.value.toString() == 'Y' ? true : false;
      systemInterestsModel.LoanSurchargeReceivedGL = this.surchargeReceivedGL.value.id.toString();
      systemInterestsModel.LoanSurchargeReceivableGL = this.surchargeReceivableGL.value.id.toString();
      systemInterestsModel.LoanSurchargeAddToBal = this.surchargeAddBalance.value.toString() == 'Y' ? true : false;
      systemInterestsModel.LoanSurchargeAutoCR = this.surchargeAutoCR.value.toString() == 'Y' ? true : false;
      systemInterestsModel.LoanOtherReceivedGL = this.otherExpenseReceivedGL.value.id.toString();
      systemInterestsModel.LoanOtherReceivableGL = this.otherExpenseReceivableGL.value.id.toString();
      systemInterestsModel.LoanOtherAddToBal = this.otherExpenseAddBalance.value.toString() == 'Y' ? true : false;
      systemInterestsModel.LoanOtherAutoCR = this.otherExpenseAutoCR.value.toString() == 'Y' ? true : false;
      systemInterestsModel.LoanCalculateInterestAtReceipt = this.calcInterestOnReceipt.value.toString() == 'Y' ? true : false;
      systemInterestsModel.LoanTreatPenalAsInterest = this.treatPenalAsInterest.value.toString();
      systemInterestsModel.LoanCalcInterestOnReceivables = this.calcInterestOnReceivables.value.toString() == 'Y' ? true : false;
      systemInterestsModel.LoanInterestDayMonth = this.loanInterest.value.toString();
      systemInterestsModel.LoanMaxDaysCCLimit = this.maxDaysReceiptCCLimit.value.toString();
      systemInterestsModel.CashCode = this.cashCode.value.toString();
      systemInterestsModel.HOCode = this.hoCode.value.toString();
      systemInterestsModel.PigmyCommisionReceivedCode = this.pigmyCommisionReceivedCode.value.toString();
      systemInterestsModel.PigmyCommisionReceivableCode = this.pigmyCommisionReceivableCode.value.toString();
      systemInterestsModel.RecurringPenalCode = this.recurringPenalCode.value.toString();
      systemInterestsModel.IncidentalChargesGL = this.incidentalChargesGL.value.toString();
      systemInterestsModel.BillsReceivableCode = this.billsReceivableCode.value.toString();
      systemInterestsModel.BillsSendForCollectionCode = this.billsSendForCollectionCode.value.toString();
      systemInterestsModel.InwardBillReceivableCode = this.inwardBillsReceivableCode.value.toString();
      systemInterestsModel.InwardBillCollectionCode = this.inwardBillsSendCollectionCode.value.toString();
      systemInterestsModel.IBCOBCCommisionReceivedCode = this.ibcOBCCommisionReceivedCode.value.toString();
      systemInterestsModel.IBCOBCCommisionPaidCode = this.ibcOBCCommisionPaidCode.value.toString();
      systemInterestsModel.DDPayableWithAdvice = this.ddPayableWithAdvice.value.toString();
      systemInterestsModel.DDPayableWithoutAdvice = this.ddPayableWithoutAdvice.value.toString();
      systemInterestsModel.OverdueInterestReserve = this.overdueInterestReserve.value.toString();
      systemInterestsModel.DepositSavingStartDay = this.savingMinBalanceStart.value.toString();
      systemInterestsModel.DepositSavingEndDay = this.savingMinBalanceEnd.value.toString();
      systemInterestsModel.DepositSavingMaxBalance = this.maxAmount.value.toString();
      systemInterestsModel.DepositSavingMinInterest = this.minInterest.value.toString();
      systemInterestsModel.DepositPigmyCalcType = this.pigmyCalculationType.value.toString();
      systemInterestsModel.DepositPigmyStartDay = this.pigmyMinBalanceStart.value.toString();
      systemInterestsModel.DepositPigmyEndDay = this.pigmyMinBalanceEnd.value.toString();
      systemInterestsModel.DepositPigmyInterestDay = this.pigmyMontlyBalanceType.value.toString();
      systemInterestsModel.DepositPigmyBalanceType = this.pigmyBalanceType.value.toString();
      systemInterestsModel.DepositRecurringInterestDay = this.recurringMonthlyBalanceType.value.toString();
      systemInterestsModel.DepositRecurringBalanceType = this.recurringBalanceType.value.toString();
      systemInterestsModel.DepositRecurringCalcIntOnDemand = this.recurringCalcIntOnDemand.value.toString() == 'Y' ? true : false;
      systemInterestsModel.DepositFDInterestCalcType = this.fdIntCalcType.value.toString();
      systemInterestsModel.DepositFDMonthlyDiscountRate = this.monthlyDicountRate.value.toString() == 'Y' ? true : false;
      systemInterestsModel.DepositReInvIntCalcCode = this.reinvestmentIntCalcType.value.toString();
      systemInterestsModel.DepositReInvPrematureCode = this.prematureIntCalc.value.toString();
      systemInterestsModel.DepositInterestDRAuto = this.drIntAutoTransfer.value.toString() == 'Y' ? true : false;

      systemProfileModel.SystemGeneral = systemGeneralModel;
      systemProfileModel.SystemInterests = systemInterestsModel;

      console.log(systemProfileModel);

      if (this.isAddMode) {
        this._systemProfileService.createSystemProfile(systemProfileModel).subscribe((data: any) => {
          console.log(data);
          if (data) {
            if (data.statusCode == 200 && data.data.data > 0) {
              this._toastrService.success('System profile saved.', 'Success!');
              this.getSystemProfile();
            }
          }
        })
      }
      else  
      {
        this._systemProfileService.updateSystemProfile(this._sharedService.applicationUser.branchId, systemProfileModel).subscribe((data: any) => {
          console.log(data);
          if (data) {
            if (data.statusCode == 200 && data.data.data > 0) {
              this._toastrService.success('System profile saved.', 'Success!');
            }
          }
        })
      }
    }
  }

  public validateForm(): boolean {

    if (this.profileForm.invalid) {
      for (const control of Object.keys(this.profileForm.controls)) {
        this.profileForm.controls[control].markAsTouched();
      }
      return false;
    }

    if (this.loanForm.invalid) {
      for (const control of Object.keys(this.loanForm.controls)) {
        this.loanForm.controls[control].markAsTouched();
      }
      return false;
    }
    if (this.fixGIForm.invalid) {
      for (const control of Object.keys(this.fixGIForm.controls)) {
        this.fixGIForm.controls[control].markAsTouched();
      }
      return false;
    }
    if (this.depositForm.invalid) {
      for (const control of Object.keys(this.depositForm.controls)) {
        this.depositForm.controls[control].markAsTouched();
      }
      return false;
    }
    return true;
  }

  //#region "General"

  dayOpenGeneral = SystemEntryDeclarations.dayOpenGeneral;
  standingInstructionGeneral = SystemEntryDeclarations.standingInstructionGeneral;
  actualProfitGeneral = SystemEntryDeclarations.actualProfitGeneral;
  photoSignatureGeneral = SystemEntryDeclarations.photoSignatureGeneral;
  photoExtentionsGeneral = SystemEntryDeclarations.photoExtentionsGeneral;
  clearingGeneral = SystemEntryDeclarations.clearingGeneral;
  clearingMemberGeneral = SystemEntryDeclarations.clearingMemberGeneral
  dailyAuthorisationGeneral = SystemEntryDeclarations.dailyAuthorisationGeneral;
  softwareTypesGeneral = SystemEntryDeclarations.softwareTypeGeneral;
  softwareLanguageGeneral = SystemEntryDeclarations.softwareLanguageGeneral;
  bankTypeGeneral = SystemEntryDeclarations.bankTypeGeneral;
  sharesLanguageGeneral = SystemEntryDeclarations.sharesLanguageGeneral;

  get code() {
    return this.profileForm.get('code')!;
  }
  get today() {
    return this.profileForm.get('today')!;
  }
  get dayOpen() {
    return this.profileForm.get('dayOpen')!;
  }
  get standingInstructionExe() {
    return this.profileForm.get('standingInstructionExe')!;
  }
  get startDate() {
    return this.profileForm.get('startDate')!;
  }
  get correctionDate() {
    return this.profileForm.get('correctionDate')!;
  }
  get maxGIBalanceSheet() {
    return this.profileForm.get('maxGIBalanceSheet')!;
  }
  get maxScheduleBalanceSheet() {
    return this.profileForm.get('maxScheduleBalanceSheet')!;
  }
  get regularShareValue() {
    return this.profileForm.get('regularShareValue')!;
  }
  get regularShareGL() {
    return this.profileForm.get('regularShareGL')!;
  }
  get regularShareGI() {
    return this.profileForm.get('regularShareGI')!;
  }
  get associatedShareValue() {
    return this.profileForm.get('associatedShareValue')!;
  }
  get associatedShareGL() {
    return this.profileForm.get('associatedShareGL')!;
  }
  get associatedShareGI() {
    return this.profileForm.get('associatedShareGI')!;
  }
  get authorisedShareCapital() {
    return this.profileForm.get('authorisedShareCapital')!;
  }
  get nominalShareGICode() {
    return this.profileForm.get('nominalShareGICode')!;
  }
  get scCastNo() {
    return this.profileForm.get('scCastNo')!;
  }
  get stCastNo() {
    return this.profileForm.get('stCastNo')!;
  }
  get depositSecurityNumber() {
    return this.profileForm.get('depositSecurityNumber')!;
  }
  get goldSecurityNumber() {
    return this.profileForm.get('goldSecurityNumber')!;
  }
  get actualProfit() {
    return this.profileForm.get('actualProfit')!;
  }
  get photoSignatureSeperate() {
    return this.profileForm.get('photoSignatureSeperate')!;
  }
  get photoExtension() {
    return this.profileForm.get('photoExtension')!;
  }
  get signatureExtension() {
    return this.profileForm.get('signatureExtension')!;
  }

  get clearing() {
    return this.profileForm.get('clearing')!;
  }
  get clearingMember() {
    return this.profileForm.get('clearingMember')!;
  }
  get clearingHouseNumber() {
    return this.profileForm.get('clearingHouseNumber')!;
  }
  get dailyAuthorisation() {
    return this.profileForm.get('dailyAuthorisation')!;
  }
  get bankAdvice() {
    return this.profileForm.get('bankAdvice')!;
  }
  get englishFont() {
    return this.profileForm.get('englishFont')!;
  }
  get englishFontSize() {
    return this.profileForm.get('englishFontSize')!;
  }
  get marathiFont() {
    return this.profileForm.get('marathiFont')!;
  }
  get marathiFontSize() {
    return this.profileForm.get('marathiFontSize')!;
  }
  get commonFont() {
    return this.profileForm.get('commonFont')!;
  }
  get commonFontSize() {
    return this.profileForm.get('commonFontSize')!;
  }
  get softwareType() {
    return this.profileForm.get('softwareType')!;
  }
  get softwareLanguage() {
    return this.profileForm.get('softwareLanguage')!;
  }
  get bankType() {
    return this.profileForm.get('bankType')!;
  }
  get sharesLanguage() {
    return this.profileForm.get('sharesLanguage')!;
  }

  //#endregion "General"

  //#region "Loan"
  automaticTransferEntryLoan = SystemEntryDeclarations.automaticTransferEntryLoan;
  addReceivableInBalanceLoan = SystemEntryDeclarations.addReceivableInBalanceLoan;
  calcInterestAtReceiptLoan = SystemEntryDeclarations.calcInterestAtReceiptLoan;
  treatPenalAsInterestLoan = SystemEntryDeclarations.treatPenalAsInterestLoan;
  calcInterestOnReceivablesLoan = SystemEntryDeclarations.calcInterestOnReceivablesLoan;
  loanInterestLoan = SystemEntryDeclarations.loanInterestLoan;

  get principaliseInterestReceivedGL() {
    return this.loanForm.get('principaliseInterestReceivedGL')!;
  }
  get principaliseInterestReceivableGL() {
    return this.loanForm.get('principaliseInterestReceivableGL')!;
  }
  get overdueLoanInterestAutoCR() {
    return this.loanForm.get('overdueLoanInterestAutoCR')!;
  }
  get penalInterestReceivedGL() {
    return this.loanForm.get('penalInterestReceivedGL')!;
  }
  get penalInterestReceivableGL() {
    return this.loanForm.get('penalInterestReceivableGL')!;
  }
  get penalInterestAddBalance() {
    return this.loanForm.get('penalInterestAddBalance')!;
  }
  get penalInterestAutoCR() {
    return this.loanForm.get('penalInterestAutoCR')!;
  }
  get postageReceivedGL() {
    return this.loanForm.get('postageReceivedGL')!;
  }
  get postageReceivableGL() {
    return this.loanForm.get('postageReceivableGL')!;
  }
  get postageInterestAddBalance() {
    return this.loanForm.get('postageInterestAddBalance')!;
  }
  get postageAutoCR() {
    return this.loanForm.get('postageAutoCR')!;
  }
  get noticeExpensesReceivedGL() {
    return this.loanForm.get('noticeExpensesReceivedGL')!;
  }
  get noticeExpensesReceivableGL() {
    return this.loanForm.get('noticeExpensesReceivableGL')!;
  }
  get noticeExpensesAddBalance() {
    return this.loanForm.get('noticeExpensesAddBalance')!;
  }
  get noticeExpensesAutoCR() {
    return this.loanForm.get('noticeExpensesAutoCR')!;
  }
  get insuranceReceivedGL() {
    return this.loanForm.get('insuranceReceivedGL')!;
  }
  get insuranceReceivableGL() {
    return this.loanForm.get('insuranceReceivableGL')!;
  }
  get insuranceAddBalance() {
    return this.loanForm.get('insuranceAddBalance')!;
  }
  get insuranceAutoCR() {
    return this.loanForm.get('insuranceAutoCR')!;
  }
  get surchargeReceivedGL() {
    return this.loanForm.get('surchargeReceivedGL')!;
  }
  get surchargeReceivableGL() {
    return this.loanForm.get('surchargeReceivableGL')!;
  }
  get surchargeAddBalance() {
    return this.loanForm.get('surchargeAddBalance')!;
  }
  get surchargeAutoCR() {
    return this.loanForm.get('surchargeAutoCR')!;
  }
  get otherExpenseReceivedGL() {
    return this.loanForm.get('otherExpenseReceivedGL')!;
  }
  get otherExpenseReceivableGL() {
    return this.loanForm.get('otherExpenseReceivableGL')!;
  }
  get otherExpenseAddBalance() {
    return this.loanForm.get('otherExpenseAddBalance')!;
  }
  get otherExpenseAutoCR() {
    return this.loanForm.get('otherExpenseAutoCR')!;
  }
  get calcInterestOnReceipt() {
    return this.loanForm.get('calcInterestOnReceipt')!;
  }
  get treatPenalAsInterest() {
    return this.loanForm.get('treatPenalAsInterest')!;
  }
  get calcInterestOnReceivables() {
    return this.loanForm.get('calcInterestOnReceivables')!;
  }
  get loanInterest() {
    return this.loanForm.get('loanInterest')!;
  }
  get maxDaysReceiptCCLimit() {
    return this.loanForm.get('maxDaysReceiptCCLimit')!;
  }

  //#endregion "Loan"

  //#region "Fixed GI"

  get cashCode() {
    return this.fixGIForm.get('cashCode')!;
  }
  get hoCode() {
    return this.fixGIForm.get('hoCode')!;
  }
  get pigmyCommisionReceivedCode() {
    return this.fixGIForm.get('pigmyCommisionReceivedCode')!;
  }
  get pigmyCommisionReceivableCode() {
    return this.fixGIForm.get('pigmyCommisionReceivableCode')!;
  }
  get recurringPenalCode() {
    return this.fixGIForm.get('recurringPenalCode')!;
  }
  get incidentalChargesGL() {
    return this.fixGIForm.get('incidentalChargesGL')!;
  }
  get billsReceivableCode() {
    return this.fixGIForm.get('billsReceivableCode')!;
  }
  get billsSendForCollectionCode() {
    return this.fixGIForm.get('billsSendForCollectionCode')!;
  }
  get inwardBillsReceivableCode() {
    return this.fixGIForm.get('inwardBillsReceivableCode')!;
  }
  get inwardBillsSendCollectionCode() {
    return this.fixGIForm.get('inwardBillsSendCollectionCode')!;
  }
  get ibcOBCCommisionReceivedCode() {
    return this.fixGIForm.get('ibcOBCCommisionReceivedCode')!;
  }
  get ibcOBCCommisionPaidCode() {
    return this.fixGIForm.get('ibcOBCCommisionPaidCode')!;
  }
  get ddPayableWithAdvice() {
    return this.fixGIForm.get('ddPayableWithAdvice')!;
  }
  get ddPayableWithoutAdvice() {
    return this.fixGIForm.get('ddPayableWithoutAdvice')!;
  }
  get overdueInterestReserve() {
    return this.fixGIForm.get('overdueInterestReserve')!;
  }
  //#endregion "Fixed GI"

  //#region "Deposit"
  pigmyCalcTypeDeposit = SystemEntryDeclarations.pigmyCalcTypeDeposit;
  pigmyMonthlyBalanceDeposit = SystemEntryDeclarations.pigmyMonthlyBalanceDeposit;
  pigmyBalanceTypeDeposit = SystemEntryDeclarations.pigmyBalanceTypeDeposit;
  recurringMonthlyBalanceDeposit = SystemEntryDeclarations.recurringMonthlyBalanceDeposit;
  recurringBalanceTypeDeposit = SystemEntryDeclarations.recurringBalanceTypeDeposit;
  recurringCalcIntOnDemandDeposit = SystemEntryDeclarations.recurringCalcIntOnDemandDeposit;
  fdintCalcTypeDeposit = SystemEntryDeclarations.fdintCalcTypeDeposit;
  fdMonthlyDiscountRateDeposit = SystemEntryDeclarations.fdMonthlyDiscountRateDeposit;
  riIntCalcTypeDeposit = SystemEntryDeclarations.riIntCalcTypeDeposit;
  riPrematureIntCalcDeposit = SystemEntryDeclarations.riPrematureIntCalcDeposit;
  autoDRIntDeposit = SystemEntryDeclarations.autoDRIntDeposit;

  get savingMinBalanceStart() {
    return this.depositForm.get('savingMinBalanceStart')!;
  }
  get savingMinBalanceEnd() {
    return this.depositForm.get('savingMinBalanceEnd')!;
  }
  get maxAmount() {
    return this.depositForm.get('maxAmount')!;
  }
  get minInterest() {
    return this.depositForm.get('minInterest')!;
  }
  get pigmyCalculationType() {
    return this.depositForm.get('pigmyCalculationType')!;
  }
  get pigmyMinBalanceStart() {
    return this.depositForm.get('pigmyMinBalanceStart')!;
  }
  get pigmyMinBalanceEnd() {
    return this.depositForm.get('pigmyMinBalanceEnd')!;
  }

  get pigmyMontlyBalanceType() {
    return this.depositForm.get('pigmyMontlyBalanceType')!;
  }
  get pigmyBalanceType() {
    return this.depositForm.get('pigmyBalanceType')!;
  }
  get recurringMonthlyBalanceType() {
    return this.depositForm.get('recurringMonthlyBalanceType')!;
  }
  get recurringBalanceType() {
    return this.depositForm.get('recurringBalanceType')!;
  }
  get recurringCalcIntOnDemand() {
    return this.depositForm.get('recurringCalcIntOnDemand')!;
  }
  get fdIntCalcType() {
    return this.depositForm.get('fdIntCalcType')!;
  }
  get monthlyDicountRate() {
    return this.depositForm.get('monthlyDicountRate')!;
  }
  get reinvestmentIntCalcType() {
    return this.depositForm.get('reinvestmentIntCalcType')!;
  }
  get prematureIntCalc() {
    return this.depositForm.get('prematureIntCalc')!;
  }
  get drIntAutoTransfer() {
    return this.depositForm.get('drIntAutoTransfer')!;
  }

  //#endregion "Deposit"
}
