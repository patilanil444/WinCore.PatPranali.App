import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxDropdownConfig } from 'ngx-select-dropdown';
import { SystemEntryDeclarations } from 'src/app/common/system-entry-declarations';
import { GeneralLedgerService } from 'src/app/services/masters/general-ledger/general-ledger.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-bank-profile-master',
  templateUrl: './bank-profile-master.component.html',
  styleUrls: ['./bank-profile-master.component.css']
})
export class BankProfileMasterComponent implements OnInit {
 //FrmsysAdd
 profileForm!: FormGroup;
 dayOpenGeneral = SystemEntryDeclarations.dayOpenGeneral;
 standingInstructionGeneral = SystemEntryDeclarations.standingInstructionGeneral;
 actualProfitGeneral = SystemEntryDeclarations.actualProfitGeneral;
 photoSignatureGeneral = SystemEntryDeclarations.photoSignatureGeneral;
 photoExtentionsGeneral = SystemEntryDeclarations.photoExtentionsGeneral;
 clearingGeneral = SystemEntryDeclarations.clearingGeneral;
 clearingMemberGeneral = SystemEntryDeclarations.clearingMemberGeneral
 dailyAuthorisationGeneral = SystemEntryDeclarations.dailyAuthorisationGeneral;
 automaticTransferEntryLoan = SystemEntryDeclarations.automaticTransferEntryLoan;
 addReceivableInBalanceLoan = SystemEntryDeclarations.addReceivableInBalanceLoan;

 uiGeneralLedgers = [];

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

  constructor(private _generalLedgerService: GeneralLedgerService, private _sharedService: SharedService) { }

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
      stCastNo1: new FormControl("", []),
      stCastNo2: new FormControl("", []),
      depositSecurityNumber: new FormControl("", []),
      goldSecurityNumber: new FormControl("", []),
      actualProfit: new FormControl(this.actualProfitGeneral[0].code, []),
      photoSignatureSeperate: new FormControl(this.photoSignatureGeneral[0].code, []),
      photoExtension: new FormControl(this.photoSignatureGeneral[0].code, []),
      signatureExtension: new FormControl(this.photoExtentionsGeneral[0].code, []),
      clearing: new FormControl(this.clearingGeneral[0].code, []),
      clearingMember: new FormControl(this.clearingMemberGeneral[0].code, []),
      clearingHouseNumber: new FormControl("", []),
      dailyAuthorisation: new FormControl(this.dailyAuthorisationGeneral[0].code, []),
      bankAdvice: new FormControl("", [])
    });

    this.code.disable();
    this.today.disable();
    this.dayOpen.disable();
    this.standingInstructionExe.disable();
    this.startDate.disable();
    this.maxGIBalanceSheet.disable();
    this.maxScheduleBalanceSheet.disable();
    this.clearing.disable();
    this.clearingMember.disable();
    this.dailyAuthorisation.disable();

    this.getGeneralLedgers();
  }

  getGeneralLedgers() {
    this._generalLedgerService.getGeneralLedgers(this._sharedService.applicationUser.branchId).subscribe((data: any) => {
      console.log(data);
      if (data) {
        this.uiGeneralLedgers = data.data.data;
        if ( this.uiGeneralLedgers) {

          this.uiGeneralLedgers.map((gl: any, i: any) => {
            gl.name = gl.id + "-" + gl.name;
          });
        }
      }
    })
  }

  saveProfile()
  {

  }

  clear()
  {

  }


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
  get stCastNo1() {
    return this.profileForm.get('stCastNo1')!;
  }
  get stCastNo2() {
    return this.profileForm.get('stCastNo2')!;
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
}
