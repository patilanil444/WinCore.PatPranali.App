import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxDropdownConfig, SelectDropDownService } from 'ngx-select-dropdown';
import { ToastrService } from 'ngx-toastr';
import { GlobleGLDeclarations } from 'src/app/common/general-ledger-declarations';
import { GeneralLedgerService } from 'src/app/services/masters/general-ledger/general-ledger.service';
import { SharedService } from 'src/app/services/shared.service';

interface IGLIntParameterServerModel {
  Id: number;
  InterestPosting: string;
  AddInterestToBalance: string;
  PayableGL: number;
  PaidGL: number;
  StaffRateYN: string;
  StaffRate: number;
  FemaleRateYN: string;
  FemaleRate: number;
  SeniorRateYN: string;
  SeniorRate: number;
  AfterMaturityInterestDeposit: string;
  AfterMaturityType: string;
  CalculationProvision: string;
  CalculationProvisionType: string;
  CalculatePayable: string;
  CalculatePayableAmount: number;
  InstallmentPenal: string;
  InstallmentPenalAfterNum: number;
  InstallmentPenalAfter: string;
  RICumulative: string;
  InterestCalculationType: string;
  AfterMaturityInterestLoan: string;
  AfterMaturityInterestNumLoan: number;
  InstallmentCalculation: string;
  ExtraInterestForCCAboveLimit: string;
  BranchId: number;
}


@Component({
  selector: 'app-gl-interest-parameter',
  templateUrl: './gl-interest-parameter.component.html',
  styleUrls: ['./gl-interest-parameter.component.css']
})
export class GLInterestParameterComponent implements OnInit {
  uiReceivableGLs: any[] = [];
  uiReceivedGLs: any[] = [];

  uiGeneralLedgers: any[] = [];
  generalLedgerId = 0;
  glForm!: FormGroup;

  isDepositEnabled = true;
  isLoanEnabled = true;

  addInterestToBal = GlobleGLDeclarations.addInterestToBal;
  interestPostings = GlobleGLDeclarations.interestPostings;
  rateForSpecials = GlobleGLDeclarations.rateForSpecials;
  calculateInterestAfter = GlobleGLDeclarations.calculateInterestAfter;
  maturityAtTheTimeOf = GlobleGLDeclarations.maturityAtTheTimeOf;
  calculateProvision01 = GlobleGLDeclarations.calculateProvision01;
  calculateProvision02 = GlobleGLDeclarations.calculateProvision02;
  calculatePayable = GlobleGLDeclarations.calculatePayable;
  installmentPenal = GlobleGLDeclarations.installmentPenal;
  riCumulative01 = GlobleGLDeclarations.riCumulative01;
  installmentPenalAfter = GlobleGLDeclarations.installmentPenalAfter;
  interestCalculationType = GlobleGLDeclarations.interestCalculationType;
  interestAfterMaturity = GlobleGLDeclarations.interestAfterMaturity;
  installmentCalculation = GlobleGLDeclarations.installmentCalculation;
  extraInterestForCC = GlobleGLDeclarations.extraInterestForCC;

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

  constructor(private router: Router, private _generalLedgerService: GeneralLedgerService,
    private _sharedService: SharedService, private _toastrService: ToastrService) { }

  ngOnInit(): void {
    this.getGeneralLedgers();

    this.glForm = new FormGroup({
      generalLedger: new FormControl("", []),
      code: new FormControl("", []),
      group: new FormControl("", []),
      typeOfAccount: new FormControl("", []),
      interestPosting: new FormControl(this.interestPostings[0].code, []),
      addIntToBalance: new FormControl(this.addInterestToBal[0].code, []),
      receivable: new FormControl("", []),
      received: new FormControl("", []),
      rateForStaffYN: new FormControl(this.rateForSpecials[0].code, []),
      rateForStaff: new FormControl({ value: "", disabled: true }, []),
      rateForFemaleYN: new FormControl(this.rateForSpecials[0].code, []),
      rateForFemale: new FormControl({ value: "", disabled: true }, []),
      rateForSeniorYN: new FormControl(this.rateForSpecials[0].code, []),
      rateForSenior: new FormControl({ value: "", disabled: true }, []),
      calculateIntAfterMaturity1: new FormControl(this.calculateInterestAfter[0].code, []),
      calculateIntAfterMaturity2: new FormControl(this.maturityAtTheTimeOf[0].code, []),
      calculateProvision1: new FormControl(this.calculateProvision01[0].code, []),
      calculateProvision2: new FormControl(this.calculateProvision02[0].code, []),
      calculatePayble: new FormControl(this.calculatePayable[0].code, []),
      calculatePaybleAmount: new FormControl("", []),
      installmantPenalDeposit: new FormControl(this.installmentPenal[0].code, []),
      riCumulative: new FormControl(this.riCumulative01[0].code, []),
      installmantPenalForLoan: new FormControl(this.installmentPenal[0].code, []),
      installmantPenalAftertext: new FormControl("", []),
      installmantPenalAfter: new FormControl(this.installmentPenalAfter[0].code, []),
      interestCalculationTypeForLoan: new FormControl(this.interestCalculationType[0].code, []),
      interestAfterMaturityForLoan: new FormControl(this.interestAfterMaturity[0].code, []),
      interestAfterMaturityForLoanText: new FormControl("", []),
      installmentCalculationForLoan: new FormControl(this.installmentCalculation[0].code, []),
      extraInterestForCCForLoan: new FormControl(this.extraInterestForCC[0].code, [])
    });

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

          //this.uiGeneralLedgers = ledgers.map((gl: any) => { id: gl.id; name: gl.id + "" + gl.name });

          this.uiReceivableGLs = this.uiGeneralLedgers.filter(gl => gl.typeOfAccount.toLowerCase().includes('payable')
            || gl.typeOfAccount.toLowerCase().includes('receivable'));

          this.uiReceivedGLs = this.uiGeneralLedgers.filter(gl => gl.typeOfAccount.toLowerCase().includes('paid')
            || gl.typeOfAccount.toLowerCase().includes('received'));
        }
      }
    })
  }

  showGLInfo() {
    this.isDepositEnabled = true;
    this.isLoanEnabled = true;

    if (this.glForm.controls['generalLedger'].value.id) {
      let selectedGL = this.uiGeneralLedgers.filter(gl => gl.id == this.glForm.controls['generalLedger'].value.id);
      if (selectedGL && selectedGL.length) {
        this.glForm.patchValue({
          code: selectedGL[0].id,
          group: selectedGL[0].glGroupName,
          typeOfAccount: selectedGL[0].typeOfAccount,
        });

        if (selectedGL[0].typeOfAccount.toLowerCase().includes('deposit')) {
          this.isDepositEnabled = false;
        }
        else if (selectedGL[0].typeOfAccount.toLowerCase().includes('loan')) {
          this.isLoanEnabled = false;
        }

        this._generalLedgerService.getGeneralLedgerInterestParams(selectedGL[0].id).subscribe((data: any) => {
          console.log(data);
          if (data) {

            let glwithParams = data.data.data;
            this.glForm.patchValue({
              interestPosting: this.bindCommonValue(glwithParams.interestPosting, this.interestPostings[0].code),
              addIntToBalance: this.bindCommonValue(glwithParams.addInterestToBalance, this.addInterestToBal[0].code),
              //receivable: glwithParams.payableGL,
              //received: glwithParams.paidGL,
              rateForStaffYN: this.bindCommonValue(glwithParams.staffRateYN, this.rateForSpecials[0].code),
              //rateForStaff: new FormControl({value: (glwithParams.staffRateYN == 'S' ? "" : glwithParams.staffRate), disabled: (glwithParams.staffRateYN == 'S'?  true :  false)  }, []),
              rateForFemaleYN: this.bindCommonValue(glwithParams.femaleRateYN, this.rateForSpecials[0].code),
              //rateForFemale : new FormControl({value: (glwithParams.femaleRateYN == 'S' ? "" : glwithParams.femaleRate), disabled: (glwithParams.femaleRateYN == 'S'?  true :  false)  }, []),
              rateForSeniorYN: this.bindCommonValue(glwithParams.seniorRateYN, this.rateForSpecials[0].code),
              //rateForSenior : new FormControl({value: (glwithParams.seniorRateYN == 'S' ? "" : glwithParams.seniorRate), disabled: (glwithParams.seniorRateYN == 'S'?  true :  false)  }, []),
              calculateIntAfterMaturity1: this.bindDepositValue(glwithParams.afterMaturityInterestDeposit, this.calculateInterestAfter[0].code),
              calculateIntAfterMaturity2: this.bindDepositValue(glwithParams.afterMaturityType, this.maturityAtTheTimeOf[0].code),
              calculateProvision1: this.bindDepositValue(glwithParams.calculationProvision, this.calculateProvision01[0].code),
              calculateProvision2: this.bindDepositValue(glwithParams.calculationProvisionType, this.calculateProvision02[0].code),
              calculatePayble: this.bindDepositValue(glwithParams.calculatePayable, this.calculatePayable[0].code),
              calculatePaybleAmount: glwithParams.calculatePayableAmount,
              installmantPenalDeposit: this.bindDepositValue(glwithParams.installmentPenal, this.installmentPenal[0].code),
              riCumulative: this.bindDepositValue(glwithParams.riCumulative, this.riCumulative01[0].code),

              installmantPenalForLoan: this.bindLoanValue(glwithParams.installmentPenal, this.installmentPenal[0].code),
              installmantPenalAftertext: this.bindLoanValue(glwithParams.installmentPenalAfterNum, ""),
              installmantPenalAfter: this.bindLoanValue(glwithParams.installmentPenalAfter, this.installmentPenalAfter[0].code),
              interestCalculationTypeForLoan: this.bindLoanValue(glwithParams.interestCalculationType, this.interestCalculationType[0].code),
              interestAfterMaturityForLoan: this.bindLoanValue(glwithParams.afterMaturityInterestLoan, this.interestAfterMaturity[0].code),
              interestAfterMaturityForLoanText: this.bindLoanValue(glwithParams.afterMaturityInterestNumLoan, ""),
              installmentCalculationForLoan: this.bindLoanValue(glwithParams.installmentCalculation, this.installmentCalculation[0].code),
              extraInterestForCCForLoan: this.bindLoanValue(glwithParams.extraInterestForCCAboveLimit, this.extraInterestForCC[0].code),
            });

            let gl = this.uiGeneralLedgers.filter(g=>g.id== glwithParams.payableGL);
            this.receivable.setValue(gl[0]);
            gl = this.uiGeneralLedgers.filter(g=>g.id== glwithParams.paidGL);
            this.received.setValue(gl[0]);

            this.rateForStaff.setValue(((glwithParams.staffRateYN == 'S' || glwithParams.staffRateYN == '') ? "" : glwithParams.staffRate));
            this.rateForFemale.setValue(((glwithParams.femaleRateYN == 'S' || glwithParams.femaleRateYN == '') ? "" : glwithParams.femaleRate));
            this.rateForSenior.setValue(((glwithParams.seniorRateYN == 'S' || glwithParams.seniorRateYN == '') ? "" : glwithParams.seniorRate));

            if (glwithParams.staffRateYN == 'S' || glwithParams.staffRateYN == '') {
              this.rateForStaff.disable();
            }
            else {
              this.rateForStaff.enable();
            }

            if (glwithParams.femaleRateYN == 'S' || glwithParams.femaleRateYN == '') {
              this.rateForFemale.disable();
            }
            else {
              this.rateForFemale.enable();
            }

            if (glwithParams.seniorRateYN == 'S' || glwithParams.seniorRateYN == '') {
              this.rateForSenior.disable();
            }
            else {
              this.rateForSenior.enable();
            }

          }
        })

      }
    }
  }

  bindCommonValue(value: any, defaultValue: any) {
    if (value) {
      return value;
    }
    else
      return defaultValue;
  }

  bindDepositValue(savedValue: any, defaultValue: any) {
    if (!this.isDepositEnabled) {
      if (savedValue)
        return savedValue;
      else
        return defaultValue;
    }
  }

  bindLoanValue(savedValue: any, defaultValue: any) {
    if (!this.isLoanEnabled) {
      if (savedValue)
        return savedValue;
      else
       return defaultValue;
    }
  }

  saveParameter() {
    if (this.validateForm()) {
      let glMasterModel = {} as IGLIntParameterServerModel;

      glMasterModel.Id = 0;
      glMasterModel.InterestPosting = this.interestPosting.value.toString();
      glMasterModel.AddInterestToBalance = this.addIntToBalance.value.toString();
      glMasterModel.PayableGL = this.receivable.value?.id > 0 ? this.receivable.value?.id : 0;
      glMasterModel.PaidGL = this.received.value?.id > 0 ? this.received.value?.id : 0;
      glMasterModel.StaffRateYN = this.rateForStaffYN.value.toString();
      glMasterModel.StaffRate = (this.rateForStaffYN.value == 'E') ? this.rateForStaff.value.toString() : 0;
      glMasterModel.FemaleRateYN = this.rateForFemaleYN.value.toString();
      glMasterModel.FemaleRate = (this.rateForFemaleYN.value == 'E') ? this.rateForFemale.value.toString() : 0;
      glMasterModel.SeniorRateYN = this.rateForSeniorYN.value.toString();
      glMasterModel.SeniorRate = (this.rateForSeniorYN.value == 'E') ? this.rateForSenior.value.toString() : 0;

      glMasterModel.AfterMaturityInterestDeposit = "";
      glMasterModel.AfterMaturityType = "";
      glMasterModel.CalculationProvision = "";
      glMasterModel.CalculationProvisionType = "";
      glMasterModel.CalculatePayable = "";
      glMasterModel.CalculatePayableAmount = 0;
      glMasterModel.InstallmentPenal = "";
      glMasterModel.RICumulative = "";

      glMasterModel.InstallmentPenal = "";
      glMasterModel.InstallmentPenalAfterNum = 0;
      glMasterModel.InstallmentPenalAfter = "";
      glMasterModel.InterestCalculationType = "";
      glMasterModel.AfterMaturityInterestLoan = "";
      glMasterModel.AfterMaturityInterestNumLoan = 0;
      glMasterModel.InstallmentCalculation = "";
      glMasterModel.ExtraInterestForCCAboveLimit = "";

      if (!this.isDepositEnabled) {
        glMasterModel.AfterMaturityInterestDeposit = this.calculateIntAfterMaturity1.value.toString();
        glMasterModel.AfterMaturityType = this.calculateIntAfterMaturity2.value.toString();
        glMasterModel.CalculationProvision = this.calculateProvision1.value.toString();
        glMasterModel.CalculationProvisionType = this.calculateProvision2.value.toString();
        glMasterModel.CalculatePayable = this.calculatePayble.value.toString();
        glMasterModel.CalculatePayableAmount = this.calculatePaybleAmount.value.toString();
        glMasterModel.InstallmentPenal = this.installmantPenalDeposit.value.toString();
        glMasterModel.RICumulative = this.riCumulative.value.toString();
      }
      else if (!this.isLoanEnabled) {
        glMasterModel.InstallmentPenal = this.installmantPenalForLoan.value.toString();
        glMasterModel.InstallmentPenalAfterNum = this.installmantPenalAftertext.value.toString();
        glMasterModel.InstallmentPenalAfter = this.installmantPenalAfter.value.toString();
        glMasterModel.InterestCalculationType = this.interestCalculationTypeForLoan.value.toString();
        glMasterModel.AfterMaturityInterestLoan = this.interestAfterMaturityForLoan.value.toString();
        glMasterModel.AfterMaturityInterestNumLoan = this.interestAfterMaturityForLoanText.value.toString();
        glMasterModel.InstallmentCalculation = this.installmentCalculationForLoan.value.toString();
        glMasterModel.ExtraInterestForCCAboveLimit = this.extraInterestForCCForLoan.value.toString();
      }

      glMasterModel.BranchId = this._sharedService.applicationUser.branchId;

      console.log(glMasterModel);

      this._generalLedgerService.updateGeneralLedgerInterestParams(this.code.value, glMasterModel).subscribe((data: any) => {
        console.log(data);
        if (data) {
          if (data.statusCode == 200 && data.data.data > 0) {
            this._toastrService.success('GL interest parameters updated.', 'Success!');
            //this.configClick("general-ledger-list");
          }
        }
      })

    }
  }

  public validateForm(): boolean {

    if (this.glForm.invalid) {
      for (const control of Object.keys(this.glForm.controls)) {
        this.glForm.controls[control].markAsTouched();
      }
      return false;
    }
    return true;
  }

  clear() {

    this.glForm = new FormGroup({
      //generalLedger: new FormControl("", []),
      code: new FormControl("", []),
      group: new FormControl("", []),
      typeOfAccount: new FormControl("", []),
      interestPosting: new FormControl(this.interestPostings[0].code, []),
      addIntToBalance: new FormControl(this.addInterestToBal[0].code, []),
      //receivable: new FormControl("", []),
      //received: new FormControl("", []),
      rateForStaffYN: new FormControl(this.rateForSpecials[0].code, []),
      rateForStaff: new FormControl({ value: "", disabled: true }, []),
      rateForFemaleYN: new FormControl(this.rateForSpecials[0].code, []),
      rateForFemale: new FormControl({ value: "", disabled: true }, []),
      rateForSeniorYN: new FormControl(this.rateForSpecials[0].code, []),
      rateForSenior: new FormControl({ value: "", disabled: true }, []),
      calculateIntAfterMaturity1: new FormControl(this.calculateInterestAfter[0].code, []),
      calculateIntAfterMaturity2: new FormControl(this.maturityAtTheTimeOf[0].code, []),
      calculateProvision1: new FormControl(this.calculateProvision01[0].code, []),
      calculateProvision2: new FormControl(this.calculateProvision02[0].code, []),
      calculatePayble: new FormControl(this.calculatePayable[0].code, []),
      calculatePaybleAmount: new FormControl("", []),
      installmantPenalDeposit: new FormControl(this.installmentPenal[0].code, []),
      riCumulative: new FormControl(this.riCumulative01[0].code, []),
      installmantPenalForLoan: new FormControl(this.installmentPenal[0].code, []),
      installmantPenalAftertext: new FormControl("", []),
      installmantPenalAfter: new FormControl(this.installmentPenalAfter[0].code, []),
      interestCalculationTypeForLoan: new FormControl(this.interestCalculationType[0].code, []),
      interestAfterMaturityForLoan: new FormControl(this.interestAfterMaturity[0].code, []),
      interestAfterMaturityForLoanText: new FormControl("", []),
      installmentCalculationForLoan: new FormControl(this.installmentCalculation[0].code, []),
      extraInterestForCCForLoan: new FormControl(this.extraInterestForCC[0].code, [])
    });
  }

  onStaffRateChange(event: any) {
    this.rateForStaff.setValue("");
    if (this.rateForStaffYN.value == "S") {
      this.rateForStaff.disable();
    }
    else {
      this.rateForStaff.enable();
    }
  }
  onFemaleRateChange(event: any) {
    this.rateForFemale.setValue("");
    if (this.rateForFemaleYN.value == "S") {
      this.rateForFemale.disable();
    }
    else {
      this.rateForFemale.enable();
    }
  }
  onSeniorRateChange(event: any) {
    this.rateForSenior.setValue("");
    if (this.rateForSeniorYN.value == "S") {
      this.rateForSenior.disable();
    }
    else {
      this.rateForSenior.enable();
    }
  }



  get generalLedger() {
    return this.glForm.get('generalLedger')!;
  }
  get code() {
    return this.glForm.get('code')!;
  }
  get group() {
    return this.glForm.get('group')!;
  }
  get typeOfAccount() {
    return this.glForm.get('typeOfAccount')!;
  }
  get interestPosting() {
    return this.glForm.get('interestPosting')!;
  }
  get addIntToBalance() {
    return this.glForm.get('addIntToBalance')!;
  }
  get receivable() {
    return this.glForm.get('receivable')!;
  }
  get received() {
    return this.glForm.get('received')!;
  }
  get rateForStaffYN() {
    return this.glForm.get('rateForStaffYN')!;
  }
  get rateForStaff() {
    return this.glForm.get('rateForStaff')!;
  }
  get rateForFemaleYN() {
    return this.glForm.get('rateForFemaleYN')!;
  }
  get rateForFemale() {
    return this.glForm.get('rateForFemale')!;
  }
  get rateForSeniorYN() {
    return this.glForm.get('rateForSeniorYN')!;
  }
  get rateForSenior() {
    return this.glForm.get('rateForSenior')!;
  }
  get calculateIntAfterMaturity1() {
    return this.glForm.get('calculateIntAfterMaturity1')!;
  }
  get calculateIntAfterMaturity2() {
    return this.glForm.get('calculateIntAfterMaturity2')!;
  }
  get calculateProvision1() {
    return this.glForm.get('calculateProvision1')!;
  }
  get calculateProvision2() {
    return this.glForm.get('calculateProvision2')!;
  }
  get calculatePayble() {
    return this.glForm.get('calculatePayble')!;
  }
  get calculatePaybleAmount() {
    return this.glForm.get('calculatePaybleAmount')!;
  }
  get installmantPenalDeposit() {
    return this.glForm.get('installmantPenalDeposit')!;
  }
  get riCumulative() {
    return this.glForm.get('riCumulative')!;
  }

  get installmantPenalForLoan() {
    return this.glForm.get('installmantPenalForLoan')!;
  }
  get installmantPenalAftertext() {
    return this.glForm.get('installmantPenalAftertext')!;
  }
  get installmantPenalAfter() {
    return this.glForm.get('installmantPenalAfter')!;
  }
  get interestCalculationTypeForLoan() {
    return this.glForm.get('interestCalculationTypeForLoan')!;
  }
  get interestAfterMaturityForLoan() {
    return this.glForm.get('interestAfterMaturityForLoan')!;
  }
  get interestAfterMaturityForLoanText() {
    return this.glForm.get('interestAfterMaturityForLoanText')!;
  }
  get installmentCalculationForLoan() {
    return this.glForm.get('installmentCalculationForLoan')!;
  }
  get extraInterestForCCForLoan() {
    return this.glForm.get('extraInterestForCCForLoan')!;
  }
}
