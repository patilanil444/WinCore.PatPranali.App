import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxDropdownConfig } from 'ngx-select-dropdown';
import { ToastrService } from 'ngx-toastr';
import { AccountDeclarations } from 'src/app/common/account-declarations';
import { IGeneralDTO } from 'src/app/common/models/common-ui-models';
import { AccountsService } from 'src/app/services/accounts/accounts/accounts.service';
import { LoanAccountsService } from 'src/app/services/accounts/loan-accounts/loan-accounts.service';
import { CustomerService } from 'src/app/services/customers/customer/customer.service';
import { GeneralLedgerService } from 'src/app/services/masters/general-ledger/general-ledger.service';
import { SharedService } from 'src/app/services/shared.service';

export interface ILoanAccountModel {
  AccountsId: number;
  BranchCode: number;
  SanctionAmount: number;
  SanctionDate: Date;
  SanctionBy: number;
  LoanTenure: number;
  ActualLoanAmount: number;
  InterestRate: number;
  AdvanceAmount: number;
  RateApplicable: string;
  MaturityDate: Date;
  ResolutionNo: string;
  ResolutionDate: Date;
  PaidOn: Date;
  InstallmentType: string;
  InstallmentNo: number;
  FirstInstallmentDate: Date;
  InstWithInt: string;
  CreatedBy: string;
  LoanDepoDetails: ILoanDepoDetail[];
  GoldLoanDetails: IGoldLoanDetail[];
  LoanEMIDetails: ILoanEMIDetail[];
  LoanSecuDetails: ILoanSecuDetail[];
  VehiLoanDetails: IVehiLoanDetail[];
}

export interface ILoanDepoDetail {
  Id: number;
  AccountId: number;
  SrNo: number;
  DepoBranchCode: number;
  DepoCode1: number;
  DepoCode2: number;
  FD_Amt: number;
  DepoOpnDate: Date;
  DepoExpDate: Date;
  MarkBy: string;
  MarkDate: Date;
  ReleaseBy: string;
  ReleaseDate: Date;
  Active: number;
}

export interface IGoldLoanDetail {
  Id: number;
  AccountId: number;
  SrNo: number;
  Code: number;
  GoldDesc: string;
  Weight: number;
  GWeight: number;
  Rate: number;
  Custody: string;
  PaidDate: Date;
  Active: number;
}

export interface ILoanEMIDetail {
  Id: number;
  AccounstId: number;
  Srno: number;
  LoanAmt: number;
  PayDate: Date;
  EMIAmt: number;
  Principle_DB: number;
  Interest_DB: number;
  Principle_CR: number;
  Interest_CR: number;
  CurBalance: number;
  Flag: boolean;
  Active: number;
}

export interface ILoanSecuDetail {
  Id: number;
  AccountId: number;
  SrNo: number;
  Code: number;
  Main: string;
  Description1: string;
  Description2: string;
  SValue: number;
  Percentage: number;
  Active: number;
}

export interface IVehiLoanDetail {
  Id: number;
  AccountId: number;
  SrNo: number;
  Code: number;
  RegisterNo: string;
  Model: string;
  Engine: string;
  Chasis: string;
  Invoice: string;
  Manufacture: string;
  Dealer: string;
  Active: number;
}


@Component({
  selector: 'app-loan-details',
  templateUrl: './loan-details.component.html',
  styleUrls: ['./loan-details.component.css']
})
export class LoanDetailsComponent implements OnInit {

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

  summaryForm!: FormGroup;
  parametersForm!: FormGroup;
  installmentsForm!: FormGroup;

  loanDetailsForm!: FormGroup;

  uiSecurityTypes: any[] = [];
  uiDirectors: any[] = [];
  uiAllGeneralLedgers: any[] = [];
  uiLoanGeneralLedgers: any[] = [];

  uiChangesInInterestRateYN: any[] = [];
  uiInstallmentWithInterestYN: any[] = [];
  uiInstallmentTypes: any[] = [];
  uiAllInstallments: any[] = [];

  uiGoldLoanData: any[] = [];
  uiDepositLoanData: any[] = [];
  uiLoanSecurityData: any[] = [];
  uiVehicleData: any[] = [];

  dto: IGeneralDTO = {} as IGeneralDTO;
  accountsId!: number;

  p_installments: number = 1;
  total_installments: number = 0;

  isGoldLoan = false;
  isLeinFD = false;
  isCashCredit = false;
  isVehicleLoan = false;
  isMortgageLoan = false;

  constructor(private router: Router, private _sharedService: SharedService,
    private _toastrService: ToastrService, private _generalLedgerService: GeneralLedgerService,
    private _customerService: CustomerService, private _loanAccountsService: LoanAccountsService,
    private _accountsService: AccountsService) { }

  ngOnInit(): void {

    this.uiChangesInInterestRateYN = AccountDeclarations.changesInInterestRateYN;
    this.uiInstallmentWithInterestYN = AccountDeclarations.InstallmentWithInterestYN;
    this.uiInstallmentTypes = AccountDeclarations.loanInstallmentTypes;

    this.summaryForm = new FormGroup({
      generalLedger: new FormControl("", [Validators.required]),
      glAccountNumberStr: new FormControl("", [Validators.required]),
      glAccountNumber: new FormControl("", [Validators.required]),
      customerCode: new FormControl("", [Validators.required]),
      customerName: new FormControl("", [Validators.required])
    });

    this.parametersForm = new FormGroup({
      sanctionAmount: new FormControl(0, [Validators.required]),
      sanctionAmountFormatted: new FormControl(new Intl.NumberFormat('en-IN', { style: 'decimal' }).format(0), [Validators.required]),
      sanctionDate: new FormControl(formatDate(new Date(Date.now()), 'yyyy-MM-dd', 'en'), [Validators.required]),
      sanctionBy: new FormControl(0, [Validators.required]),
      loanTenureInMonths: new FormControl("", [Validators.required]),
      actualLoanAmount: new FormControl(0, [Validators.required]),
      actualLoanAmountFormatted: new FormControl(new Intl.NumberFormat('en-IN', { style: 'decimal' }).format(0), [Validators.required]),
      interestRate: new FormControl(0, [Validators.required]),
      amountAdvances: new FormControl(0, [Validators.required]),
      changesInInterestApplicable: new FormControl(this.uiChangesInInterestRateYN[0].code, [Validators.required]),
      maturityDate: new FormControl(formatDate(new Date(Date.now()), 'yyyy-MM-dd', 'en', 'dd/MM/yyyy'), []),
      resolutionNo: new FormControl("", []),
      resolutionDate: new FormControl(formatDate(new Date(Date.now()), 'yyyy-MM-dd', 'en', 'dd/MM/yyyy'), []),
      paidDate: new FormControl(formatDate(new Date(Date.now()), 'yyyy-MM-dd', 'en'), []),
    });

    this.installmentsForm = new FormGroup({
      instInstallmentType: new FormControl(this.uiInstallmentTypes[4].code, []),
      instNumberOfInstallments: new FormControl(1, [Validators.required]),
      instFirstInstallmentDate: new FormControl(formatDate(new Date().setDate(new Date().getDate() + 30), 'yyyy-MM-dd', 'en'), []),
      instInstallWithInterest: new FormControl(this.uiInstallmentWithInterestYN[0].code, []),
      instAmountToBeReceived: new FormControl(0, []),
    });


    this.maturityDate.disable();
    this.instNumberOfInstallments.disable();

    this.getGeneralLedgers().then(result => {
      if (result) {

        this.getDirectors().then(dResult => {
          if (dResult) {
            this.loadForm();
          }
        }).catch(error => {
          this._toastrService.error('Error loading general ledgers', 'Error!');
        });
      }
    }).catch(error => {
      this._toastrService.error('Error loading general ledgers', 'Error!');
    });
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

            this.uiLoanGeneralLedgers = this.uiAllGeneralLedgers.filter(gl => gl.glGroup == 'L');

            resolve(true);
          }
        }
        else {
          resolve(false);
        }
      })
    })
  }

  getDirectors() {
    return new Promise((resolve, reject) => {
      this._accountsService.getDirectors().subscribe((data: any) => {
        console.log(data);
        if (data) {
          this.uiDirectors = data.data.data;
          if (this.uiDirectors && this.uiDirectors.length) {
            this.parametersForm.patchValue({
              sanctionBy: this.uiDirectors[0].id
            })
          }
          resolve(true);
        }
        else {
          resolve(false);
        }
      })
    })
  }

  pageChangeEvent(event: number) {
    this.p_installments = event;
  }

  loadForm() {
    this._loanAccountsService.getDTO().subscribe(obj => this.dto = obj);
    if (this.dto) {
      this.accountsId = this.dto.id;
      if (!this.accountsId) {
        this._toastrService.error('Please select an account to enter loan details.', 'Error!');
        this.configClick("account-search");
        return;
      }

      this._loanAccountsService.getLoanAccount(this.accountsId).subscribe((data: any) => {
        console.log(data);
        if (data) {
          if (data.statusCode == 200 && data.data.data) {
            var loanAccount = data.data.data;

            // bind general ledger
            let gl = this.uiAllGeneralLedgers.filter(g => g.code == loanAccount.code1);

            this.summaryForm.patchValue({
              generalLedger: gl && gl.length ? gl[0] : null,
              glAccountNumberStr: loanAccount.accountNo,
              customerCode: this._loanAccountsService.customerCodeStr,
              customerName: this._loanAccountsService.customerName,
            })

            this.enableTabsAsPerGL(gl && gl.length ? gl[0] : null);

            // Call API to fetch loan account details here

            this._loanAccountsService.getLoanAccountDetails(this.accountsId).subscribe((data: any) => {
              if (data) {
                if (data.statusCode == 200 && data.data.data) {
                  var loanAccountDetails = data.data.data;
                  if (loanAccountDetails.loanTenure > 0) {

                    this.parametersForm.patchValue({
                      sanctionAmount: parseFloat(loanAccountDetails.sanctionAmount),
                      sanctionAmountFormatted: new Intl.NumberFormat('en-IN', { style: 'decimal' }).format(parseFloat(loanAccountDetails.sanctionAmount)),
                      sanctionDate: formatDate(new Date(loanAccountDetails.sanctionDate), 'yyyy-MM-dd', 'en'),
                      sanctionBy: loanAccountDetails.sanctionBy,
                      loanTenureInMonths: loanAccountDetails.loanTenure,
                      actualLoanAmount: loanAccountDetails.actualLoanAmount,
                      actualLoanAmountFormatted: new Intl.NumberFormat('en-IN', { style: 'decimal' }).format(loanAccountDetails.actualLoanAmount),
                      interestRate: loanAccountDetails.interestRate,
                      amountAdvances: loanAccountDetails.advanceAmount,
                      changesInInterestApplicable: loanAccountDetails.rateApplicable,
                      maturityDate: formatDate(new Date(loanAccountDetails.maturityDate), 'yyyy-MM-dd', 'en', 'dd/MM/yyyy'),
                      resolutionNo: loanAccountDetails.resolutionNo,
                      resolutionDate: formatDate(new Date(loanAccountDetails.resolutionDate), 'yyyy-MM-dd', 'en', 'dd/MM/yyyy'),
                      paidDate: formatDate(new Date(loanAccountDetails.paidOn), 'yyyy-MM-dd', 'en'),
                    })

                    if (loanAccountDetails.vehiLoanDetails && loanAccountDetails.vehiLoanDetails.length) {
                      loanAccountDetails.vehiLoanDetails.forEach((item: any) => {
                        let uiVehicle = {
                          id: item.id,
                          registerNumber: item.registerNo,
                          manufacturer: item.manufacture,
                          model: item.model,
                          engineNumber: item.engine,
                          chasisNumber: item.chasis,
                          invoiceAmount: item.invoice,
                          dealer: item.dealer,
                          status: 'A'
                        };
                        this.uiVehicleData.push(uiVehicle);
                      });

                      this._loanAccountsService.updateVehicleData(this.uiVehicleData);
                    }

                    if (loanAccountDetails.loanSecuDetails && loanAccountDetails.loanSecuDetails.length) {
                      loanAccountDetails.loanSecuDetails.forEach((item: any) => {
                        let uiSecurity = {
                          id: item.id,
                          srNo: item.srNo,
                          securityType: item.code,
                          securityTypeText: item.manufacture,
                          security: item.description1,
                          securityValue: item.sValue,
                          securityDescription: item.description2,
                          percentage: item.percentage,
                          securityValueWithPercentage:  item.sValue * item.percentage/100,
                          status: 'A'
                        };
                        this.uiLoanSecurityData.push(uiSecurity);
                      });

                      this._loanAccountsService.updateSecurityData(this.uiLoanSecurityData);
                    }

                    if (loanAccountDetails.goldLoanDetails && loanAccountDetails.goldLoanDetails.length) {
                      loanAccountDetails.goldLoanDetails.forEach((item: any) => {
                        let uiGold = {
                          receiptNo: item.goldDesc,
                          goldType: item.code,
                          goldTypeText: "",
                          grossWeight: item.gWeight,
                          netWeight: item.weight,
                          ratePerGram: item.rate,
                          amount: (parseFloat(item.rate) * parseFloat(item.weight)).toFixed(2),
                        };
                        this.uiGoldLoanData.push(uiGold);
                      });

                      this._loanAccountsService.updateGoldData(this.uiGoldLoanData);
                    }

                    if (loanAccountDetails.loanDepoDetails && loanAccountDetails.loanDepoDetails.length) {
                      loanAccountDetails.loanDepoDetails.forEach((item: any) => {
                        let uiVehicle = {
                          id: item.id,
                          registerNumber: item.registerNo,
                          manufacturer: item.manufacture,
                          model: item.model,
                          engineNumber: item.engine,
                          chasisNumber: item.chasis,
                          invoiceAmount: item.invoice,
                          dealer: item.dealer,
                          status: 'A'
                        };
                        this.uiDepositLoanData.push(uiVehicle);
                      });

                      this._loanAccountsService.updateDepositData(this.uiDepositLoanData);
                    }

                    if (loanAccountDetails.loanEMIDetails && loanAccountDetails.loanEMIDetails.length) {
                      this.uiAllInstallments = [];
                      let allInstallments: any[] = [];
                      let sum = 0;
                      loanAccountDetails.loanEMIDetails.forEach((el:any) => sum += el.emiAmt);

                      this.installmentsForm.patchValue({
                        instInstallmentType: loanAccountDetails.installmentType,
                        instNumberOfInstallments: loanAccountDetails.installmentNo,
                        instFirstInstallmentDate: formatDate(loanAccountDetails.firstInstallmentDate, 'yyyy-MM-dd', 'en'),
                        instInstallWithInterest: loanAccountDetails.instWithInt,
                        instAmountToBeReceived: sum,
                      })

                      loanAccountDetails.loanEMIDetails.forEach((item: any) => {
                        let installment = {
                          id: item.id,
                          actualLoanAmount: loanAccountDetails.actualLoanAmount,
                          installmentDate: formatDate(new Date(item.payDate), 'yyyy-MM-dd', 'en'),
                          interestRate: loanAccountDetails.interestRate,
                          installmentAmount: item.emiAmt,
                          interestAmount: item.interest_DB,
                          principleAmount: item.principle_DB,
                          outstandingAmount: item.curBalance,
                        };
                        allInstallments.push(installment);
                      });

                      this.uiAllInstallments = allInstallments;
                      //this._loanAccountsService.updateEMIData(this.uiAllInstallments);
                    }
                  }
                }
              }
            });
          }
        }
      })

    }
  }

  enableTabsAsPerGL(gl: any) {
    this.isGoldLoan = false;
    this.isLeinFD = false;
    this.isCashCredit = false;
    this.isVehicleLoan = false;
    this.isMortgageLoan = false;

    if (gl != null) {
      if (gl.glGroup == 'L' && (gl.glType == 'G' || gl.glType == 'H')) {
        // Enable tab Gold Loan
        this.isGoldLoan = true;
      }
      if (gl.glGroup == 'L' && (gl.glType == '4' || gl.glType == '5')) {
        // Enable tab Lein FD
        this.isLeinFD = true;
      }
      if (gl.glGroup == 'L' && gl.glType == 'D') {
        // Enable tab Credit Cash
        this.isCashCredit = true;
      }
      if (gl.glGroup == 'L' && gl.glType == '6') {
        // Enable tab Vehicle
        this.isVehicleLoan = true;
      }
      if (gl.glGroup == 'L' && gl.glType == '7') {
        // Enable tab Mortgage
        this.isMortgageLoan = true;
      }
    }
  }

  setIntallmentSactionAmount() {
    if (this.sanctionAmount.value > 0) {
      // this.installmentsForm.patchValue({
      //   instSactionAmount: new Intl.NumberFormat('en-IN',{ style: 'decimal' }).format(parseFloat(this.sactionAmountFormatted.value))
      // })
      this.parametersForm.patchValue({
        sanctionAmount: parseFloat(this.sanctionAmount.value),
        sanctionAmountFormatted: new Intl.NumberFormat('en-IN', { style: 'decimal' }).format(parseFloat(this.sanctionAmount.value)),
        actualLoanAmount: parseFloat(this.sanctionAmount.value),
        actualLoanAmountFormatted: new Intl.NumberFormat('en-IN', { style: 'decimal' }).format(parseFloat(this.sanctionAmount.value))
      })
    }
  }

  setIntallmentActualAmount() {
    if (this.actualLoanAmount.value > 0) {
      this.parametersForm.patchValue({
        actualLoanAmount: parseFloat(this.actualLoanAmount.value),
        actualLoanAmountFormatted: new Intl.NumberFormat('en-IN', { style: 'decimal' }).format(parseFloat(this.actualLoanAmount.value))
      })
    }
  }

  calculateFirstInstallmentDate() {
    if (this.sanctionDate.value) {
      let firstInstallDate = new Date().setDate(new Date(this.sanctionDate.value).getDate() + 30)
      if (firstInstallDate) {
        this.parametersForm.patchValue({
          firstInstallmentDate: formatDate(firstInstallDate, 'yyyy-MM-dd', 'en')
        })
      }
    }
  }

  calculateMatureDate() {
    if (this.loanTenureInMonths.value && !isNaN(this.loanTenureInMonths.value)) {
      let matureDate = new Date().setMonth(new Date().getMonth() + parseInt(this.loanTenureInMonths.value))
      if (matureDate) {
        this.parametersForm.patchValue({
          maturityDate: formatDate(matureDate, 'yyyy-MM-dd', 'en')
        })
      }
    }
  }


  validateFirstInstallmentDate() {
    if (this.instFirstInstallmentDate.value) {
      let tempFirstInstallmentDate = formatDate(new Date(this.instFirstInstallmentDate.value), 'yyyy-MM-dd', 'en');
      let tempSactionDate = formatDate(new Date(this.sanctionDate.value), 'yyyy-MM-dd', 'en');
      if (tempFirstInstallmentDate < tempSactionDate) {
        this.parametersForm.patchValue({
          firstInstallmentDate: formatDate(new Date().setDate(new Date(this.sanctionDate.value).getDate() + 30), 'yyyy-MM-dd', 'en')
        })

        this._toastrService.error('First installment can not be less than sanction date', 'Error!');
      }

      // this.installmentsForm.patchValue({
      //   instFirstInstallmentDate: formatDate(this.firstInstallmentDate.value, 'yyyy-MM-dd', 'en')
      // })
    }
  }

  modifyMaturityDate() {
    if (this.paidDate.value && this.loanTenureInMonths.value) {
      if (!isNaN(parseInt(this.loanTenureInMonths.value)) && parseInt(this.loanTenureInMonths.value) > 0) {
        let paidDate = new Date(this.paidDate.value);
        paidDate.setMonth(paidDate.getMonth() + parseInt(this.loanTenureInMonths.value));

        this.parametersForm.patchValue({
          maturityDate: formatDate(paidDate, 'yyyy-MM-dd', 'en'),
        })
      }
      else {
        this._toastrService.warning('Invalid period or paid date!.', 'Warning!');
      }
    }
  }


  hasValidParameters() {
    let isParametersValid = true;

    if (this.parametersForm.invalid) {
      for (const control of Object.keys(this.parametersForm.controls)) {
        this.parametersForm.controls[control].markAsTouched();
      }
      isParametersValid = false;
    }

    if (this.sanctionAmount.value && this.loanTenureInMonths.value) {
      if (this.sanctionAmount.value <= 0 && this.loanTenureInMonths.value <= 0) {
        this._toastrService.warning('Invalid sanction amount or loan tenure.', 'Error!');
        isParametersValid = false;
      }
    }

    if (this.actualLoanAmount.value) {
      if (this.actualLoanAmount.value <= 0) {
        this._toastrService.warning('Invalid actual loan amount.', 'Error!');
        isParametersValid = false;
      }
    }

    if (this.interestRate.value && this.interestRate.value <= 0) {
      this._toastrService.warning('Invalid interest rate.', 'Error!');
      isParametersValid = false;
    }

    return isParametersValid;
  }

  changeInstallmentType() {
    if (this.loanTenureInMonths.value > 0) {
      let loanTenureInMonths = parseFloat(this.loanTenureInMonths.value);
      let noOfInstallments = 1;

      if (this.instInstallmentType.value == "Y") {
        noOfInstallments = loanTenureInMonths / 12;
      }
      else if (this.instInstallmentType.value == "H") {
        noOfInstallments = loanTenureInMonths / 6;
      }
      else if (this.instInstallmentType.value == "Q") {
        noOfInstallments = loanTenureInMonths / 3;
      }
      else if (this.instInstallmentType.value == "M") {
        noOfInstallments = loanTenureInMonths;
      }

      this.installmentsForm.patchValue({
        instNumberOfInstallments: noOfInstallments,
      })
    }
  }

  showInstallments() {
    if (this.hasValidParameters()) {
      let actualLoanAmount = parseFloat(this.actualLoanAmount.value);
      let loanTenureInMonths = parseFloat(this.loanTenureInMonths.value);
      let interestRate = parseFloat(this.interestRate.value);
      let allInstallments = [];
      let actulaOutstandingAmount = actualLoanAmount; //+ (actualLoanAmount* interestRate/100);


      if (this.instInstallmentType.value == "S") {
        // Single Installment

        let installmentAmount = actulaOutstandingAmount + (actulaOutstandingAmount * interestRate / 100);

        let installment: any = {};
        installment.actualLoanAmount = actulaOutstandingAmount;
        installment.installmentDate = formatDate(new Date(this.maturityDate.value), 'yyyy-MM-dd', 'en');
        installment.interestRate = interestRate;
        installment.installmentAmount = installmentAmount;
        installment.outstandingAmount = 0;
        installment.interestAmount = Math.round(actulaOutstandingAmount * interestRate / 100);
        installment.principleAmount = Math.round(actulaOutstandingAmount);

        if (installment.installmentAmount > 0) {
          allInstallments.push(installment);
        }
      }
      else if (this.instInstallmentType.value == "Y") {
        // Yearly
        let noOfInstallments = loanTenureInMonths / 12;
        let firstInstallmentDate = new Date(this.instFirstInstallmentDate.value);
        let totalOutstanding = actulaOutstandingAmount;
        let installmentAmount = Math.round((totalOutstanding * interestRate / 100 * Math.pow(1 + interestRate / 100, loanTenureInMonths) /
          (Math.pow(1 + interestRate / 100, loanTenureInMonths - 1))));

        for (let index = 0; index < noOfInstallments; index++) {
          if (totalOutstanding > 0) {
            let installment: any = {};
            installment.actualLoanAmount = actulaOutstandingAmount;
            installment.installmentDate = formatDate(firstInstallmentDate.setFullYear(firstInstallmentDate.getFullYear() + 1), 'yyyy-MM-dd', 'en');
            installment.interestRate = interestRate;
            installment.installmentAmount = installmentAmount;

            let interestAmount = totalOutstanding * (interestRate / 100);
            let principleAmount = installment.installmentAmount - interestAmount;
            totalOutstanding = totalOutstanding - principleAmount;

            installment.interestAmount = Math.round(interestAmount);
            installment.principleAmount = Math.round(principleAmount);
            installment.outstandingAmount = Math.round(totalOutstanding);


            // if (installment.outstandingAmount < installment.installmentAmount) {
            //   //installment.installmentAmount = installment.outstandingAmount;
            //   //installment.outstandingAmount = 0;
            //   totalOutstanding = 0;
            // }

            //if (installment.installmentAmount > 0) {
            allInstallments.push(installment);
            //}


          }
        }
      }
      else if (this.instInstallmentType.value == "H") {
        // Half Yearly

        let noOfInstallments = loanTenureInMonths / 12 * 2;
        let firstInstallmentDate = new Date(this.instFirstInstallmentDate.value);
        let totalOutstanding = actulaOutstandingAmount;

        let installmentAmount = Math.round((totalOutstanding * interestRate / 100 / 2 * Math.pow(1 + interestRate / 100 / 2, noOfInstallments) /
          (Math.pow(1 + interestRate / 100 / 2, noOfInstallments) - 1)));

        for (let index = 0; index < noOfInstallments; index++) {
          if (totalOutstanding > 0) {
            let installment: any = {};
            installment.actualLoanAmount = actulaOutstandingAmount;
            if (index == 0) {
              installment.installmentDate = formatDate(firstInstallmentDate, 'yyyy-MM-dd', 'en'); //formatDate(firstInstallmentDate, 'dd-MM-yyyy', 'en', 'dd/MM/yyyy');
            }  
            else
            {
              installment.installmentDate = formatDate(firstInstallmentDate.setMonth(firstInstallmentDate.getMonth() + 6), 'yyyy-MM-dd', 'en');
            }
            installment.interestRate = interestRate;
            installment.installmentAmount = Math.round(installmentAmount);

            let interestAmount = totalOutstanding * (interestRate / 100) / 2;
            let principleAmount = installment.installmentAmount - interestAmount;
            totalOutstanding = totalOutstanding - principleAmount;

            installment.interestAmount = Math.round(interestAmount);
            installment.principleAmount = Math.round(principleAmount);

            installment.outstandingAmount = Math.round(totalOutstanding);
            if (installment.outstandingAmount < installment.installmentAmount) {
              installment.installmentAmount = installment.outstandingAmount;
              installment.outstandingAmount = 0;
              totalOutstanding = 0;
            }
            //if (installment.installmentAmount > 0) {
            allInstallments.push(installment);
            //}
          }
        }
      }
      else if (this.instInstallmentType.value == "Q") {
        // Quarterly
        let noOfInstallments = loanTenureInMonths / 12 * 4;
        let firstInstallmentDate = new Date(this.instFirstInstallmentDate.value);
        let totalOutstanding = actulaOutstandingAmount;

        let installmentAmount = Math.round((totalOutstanding * interestRate / 100 / 4 * Math.pow(1 + interestRate / 100 / 4, noOfInstallments) /
          (Math.pow(1 + interestRate / 100 / 4, noOfInstallments) - 1)));

        for (let index = 0; index < noOfInstallments; index++) {
          if (totalOutstanding > 0) {
            let installment: any = {};
            installment.actualLoanAmount = actulaOutstandingAmount;
            if (index == 0) {
              installment.installmentDate = formatDate(firstInstallmentDate, 'yyyy-MM-dd', 'en');
            }
            else
            {
              installment.installmentDate = formatDate(firstInstallmentDate.setMonth(firstInstallmentDate.getMonth() + 3), 'yyyy-MM-dd', 'en');
            }
            installment.interestRate = interestRate;
            installment.installmentAmount = Math.round(installmentAmount);

            let interestAmount = totalOutstanding * (interestRate / 100) / 4;
            let principleAmount = installment.installmentAmount - interestAmount;
            totalOutstanding = totalOutstanding - principleAmount;

            installment.interestAmount = Math.round(interestAmount);
            installment.principleAmount = Math.round(principleAmount);

            installment.outstandingAmount = Math.round(totalOutstanding);
            if (installment.outstandingAmount < installment.installmentAmount) {
              installment.installmentAmount = installment.outstandingAmount;
              installment.outstandingAmount = 0;
              totalOutstanding = 0;
            }
            allInstallments.push(installment);
          }
        }
      }
      else if (this.instInstallmentType.value == "M") {
        // Monthly
        let noOfInstallments = loanTenureInMonths;
        let firstInstallmentDate = new Date(this.instFirstInstallmentDate.value);
        let totalOutstanding = actulaOutstandingAmount;

        let installmentAmount = Math.round((totalOutstanding * interestRate / 12 / 100 * Math.pow(1 + interestRate / 12 / 100, loanTenureInMonths) /
          (Math.pow(1 + interestRate / 12 / 100, loanTenureInMonths) - 1)));

        for (let index = 0; index < noOfInstallments; index++) {
          if (totalOutstanding > 0) {
            let installment: any = {};
            installment.actualLoanAmount = actulaOutstandingAmount;
            if (index==0) {
              installment.installmentDate = formatDate(firstInstallmentDate, 'yyyy-MM-dd', 'en');
            }
            else
            {
              installment.installmentDate = formatDate(firstInstallmentDate.setMonth(firstInstallmentDate.getMonth() + 1), 'yyyy-MM-dd', 'en');
            }
            installment.interestRate = interestRate;
            installment.installmentAmount = Math.round(installmentAmount);

            let interestAmount = totalOutstanding * interestRate / 12 / 100;
            let principleAmount = installment.installmentAmount - interestAmount;
            totalOutstanding = totalOutstanding - principleAmount;

            installment.interestAmount = Math.round(interestAmount);
            installment.principleAmount = Math.round(principleAmount);
            installment.outstandingAmount = Math.round(totalOutstanding);
            if (installment.outstandingAmount < installment.installmentAmount) {
              installment.installmentAmount = installment.outstandingAmount;
              installment.outstandingAmount = 0;
              totalOutstanding = 0;
            }
            //if (installment.installmentAmount > 0) {
            allInstallments.push(installment);
            //}
          }
        }
      }

      this.uiAllInstallments = [];
      this.uiAllInstallments = allInstallments;

      let sum = 0;
      allInstallments.forEach((el) => sum += el.installmentAmount);

      this.installmentsForm.patchValue({
        instAmountToBeReceived: sum,
      })
    }
  }

  getGoldLoanDetails(goldLoanData: any) {
    this.uiGoldLoanData = goldLoanData;
  }

  getDepositLoanDetails(depositLoanData: any) {
    this.uiDepositLoanData = depositLoanData;
  }

  getLoanSecurityDetails(loanSecurityData: any) {
    this.uiLoanSecurityData = loanSecurityData;
  }

  getVehicleDetails(vehicleData: any) {
    this.uiVehicleData = vehicleData;
  }

  saveLoanDetails() {
    if (!this.hasValidParameters()) {
      this._toastrService.error('Please enter mandatory parameters.', 'Error!');
      return;
    }

    let accountModel = {} as ILoanAccountModel;
    accountModel.AccountsId = this.dto.id;;
    accountModel.BranchCode = this._sharedService.applicationUser.branchId;
    accountModel.SanctionAmount = parseFloat(this.sanctionAmount.value);
    accountModel.SanctionDate = this.sanctionDate.value.toString();
    accountModel.SanctionBy = this.sanctionBy.value;
    accountModel.LoanTenure = parseInt(this.loanTenureInMonths.value);
    accountModel.ActualLoanAmount = parseFloat(this.actualLoanAmount.value);
    accountModel.InterestRate = parseFloat(this.interestRate.value);
    accountModel.AdvanceAmount = parseFloat(this.amountAdvances.value);
    accountModel.RateApplicable = this.changesInInterestApplicable.value;
    accountModel.MaturityDate = this.maturityDate.value.toString();
    accountModel.ResolutionNo = this.resolutionNo.value.toString();
    accountModel.ResolutionDate = this.resolutionDate.value.toString();
    accountModel.PaidOn = this.paidDate.value.toString();
    accountModel.InstallmentType = this.instInstallmentType.value;
    accountModel.InstallmentNo = this.uiAllInstallments && this.uiAllInstallments.length ? this.uiAllInstallments.length : 0;
    accountModel.FirstInstallmentDate = this.instFirstInstallmentDate.value.toString();
    accountModel.InstWithInt = this.instInstallWithInterest.value;
    accountModel.CreatedBy = this._sharedService.applicationUser.userName;

    accountModel.GoldLoanDetails = [];
    if (this.isGoldLoan) {
      if (this.uiGoldLoanData) {
        this.uiGoldLoanData.forEach((d: any) => {
          let goldLoanItem = {} as IGoldLoanDetail;
          goldLoanItem.Id = d.id;
          goldLoanItem.AccountId = this.accountsId;
          goldLoanItem.SrNo = 0;
          goldLoanItem.Code = d.goldType;
          goldLoanItem.GoldDesc = d.receiptNo;
          goldLoanItem.Weight = d.netWeight;
          goldLoanItem.GWeight = d.grossWeight;
          goldLoanItem.Rate = d.ratePerGram;
          goldLoanItem.Custody = "";
          goldLoanItem.PaidDate = this.paidDate.value;
          goldLoanItem.Active = 1;
          accountModel.GoldLoanDetails.push(goldLoanItem);
        });
      }
    }

    accountModel.LoanDepoDetails = [];
    if (this.isLeinFD) {
      if (this.uiDepositLoanData) {
        this.uiDepositLoanData.forEach((d: any) => {
          let depositLoanItem = {} as ILoanDepoDetail;
          depositLoanItem.Id = d.id;
          depositLoanItem.AccountId = this.accountsId;
          depositLoanItem.DepoBranchCode = d.branch;
          depositLoanItem.DepoCode1 = d.gl;
          depositLoanItem.DepoCode2 = d.accountNumber;
          depositLoanItem.FD_Amt = d.fdAmount;
          depositLoanItem.DepoOpnDate = d.opening;
          depositLoanItem.DepoExpDate = d.maturity;;
          depositLoanItem.MarkBy = d.markBy;
          depositLoanItem.MarkDate = d.markOn;
          depositLoanItem.ReleaseBy = d.releaseBy;
          depositLoanItem.ReleaseDate = d.releaseOn;
          depositLoanItem.Active = 1;
          accountModel.LoanDepoDetails.push(depositLoanItem);
        });
      }
    }

    if (this.isCashCredit) {
      if (this.uiLoanSecurityData) {
        this.uiLoanSecurityData.forEach((d: any) => {
          let loanSecuDetail = {} as ILoanSecuDetail;
          loanSecuDetail.Id = 0;
          loanSecuDetail.AccountId = this.accountsId;
          loanSecuDetail.Code = d.securityType;
          loanSecuDetail.Main = d.actualLoanAmount;
          loanSecuDetail.Description1 = d.security;
          loanSecuDetail.Description2 = d.securityDescription;
          loanSecuDetail.SValue = d.securityValue;
          loanSecuDetail.Percentage = d.percentage;
          loanSecuDetail.Active = 1;
          accountModel.LoanSecuDetails.push(loanSecuDetail);
        });
      }
    }

    accountModel.LoanSecuDetails = [];
    if (this.isMortgageLoan) {
      if (this.uiLoanSecurityData) {
        this.uiLoanSecurityData.forEach((d: any) => {
          let loanSecuDetail = {} as ILoanSecuDetail;
          loanSecuDetail.Id = d.id;
          loanSecuDetail.AccountId = this.accountsId;
          loanSecuDetail.Code = d.securityType;
          loanSecuDetail.Main = d.actualLoanAmount;
          loanSecuDetail.Description1 = d.security;
          loanSecuDetail.Description2 = d.securityDescription;
          loanSecuDetail.SValue = d.securityValue;
          loanSecuDetail.Percentage = d.percentage;
          loanSecuDetail.Active = 1;
          accountModel.LoanSecuDetails.push(loanSecuDetail);
        });
      }
    }

    accountModel.VehiLoanDetails = [];
    if (this.isVehicleLoan) {
      if (this.uiVehicleData) {
        this.uiVehicleData.forEach((d: any) => {
          let vehiLoanDetail = {} as IVehiLoanDetail;
          vehiLoanDetail.Id = 0;
          vehiLoanDetail.AccountId = this.accountsId;
          vehiLoanDetail.Code = parseInt(this.generalLedger.value.code);
          vehiLoanDetail.RegisterNo = d.registerNumber;
          vehiLoanDetail.Model = d.model;
          vehiLoanDetail.Engine = d.engineNumber;
          vehiLoanDetail.Chasis = d.chasisNumber;
          vehiLoanDetail.Invoice = d.invoiceAmount;
          vehiLoanDetail.Manufacture = d.manufacturer;
          vehiLoanDetail.Dealer = d.dealer;
          vehiLoanDetail.Active = 1;
          accountModel.VehiLoanDetails.push(vehiLoanDetail);
        });
      }
    }

    accountModel.LoanEMIDetails = [];
    if (this.uiAllInstallments) {
      this.uiAllInstallments.forEach((d: any) => {
        let loanEMIDetail = {} as ILoanEMIDetail;
        loanEMIDetail.Id = d.id;
        loanEMIDetail.AccounstId = this.accountsId;
        loanEMIDetail.LoanAmt = d.actualLoanAmount;
        loanEMIDetail.PayDate = new Date(formatDate(d.installmentDate, 'yyyy-MM-dd', 'en')); // new Date(d.installmentDate);
        loanEMIDetail.EMIAmt = d.installmentAmount;
        loanEMIDetail.Principle_DB = d.principleAmount;
        loanEMIDetail.Interest_DB = d.interestAmount;
        loanEMIDetail.Principle_CR = 0;
        loanEMIDetail.Interest_CR = 0;
        loanEMIDetail.CurBalance = d.outstandingAmount;
        // loanEMIDetail.Flag = d.fdAmount;
        loanEMIDetail.Active = 1;
        accountModel.LoanEMIDetails.push(loanEMIDetail);
      });
    }

    // Validate model before save


    if (this.uiVehicleData.length > 0 || this.uiLoanSecurityData.length > 0 ||
      this.uiGoldLoanData.length > 0 || this.uiDepositLoanData.length > 0) {
      // Call API to save loan account details
      this._loanAccountsService.saveLoanDetails(accountModel).subscribe((data: any) => {
        console.log(data);
        if (data) {
          if (data.data.data && data.data.data.retId > 0) {
            if (data.data.data.status == "SUCCESS") {
              this._toastrService.success(data.data.data.message, 'Success!');
              this.clear();
            }
            else {
              this._toastrService.success("Error saving account!", 'Error!');
            }
            // this.loadForm();
          }
        }
      })
    }

  }

  clear() {

  }

  authoriseAccount() {


  }

  accountDetails() {
    this.configClick("loan-accounts");
  }

  /// Summary
  get generalLedger() {
    return this.summaryForm.get('generalLedger')!;
  }

  get glAccountNumberStr() {
    return this.summaryForm.get('glAccountNumberStr')!;
  }

  get customerCode() {
    return this.summaryForm.get('customerCode')!;
  }

  get customerName() {
    return this.summaryForm.get('customerName')!;
  }

  //// Parameters

  get sanctionAmount() {
    return this.parametersForm.get('sanctionAmount')!;
  }
  get sanctionAmountFormatted() {
    return this.parametersForm.get('sanctionAmountFormatted')!;
  }
  get actualLoanAmount() {
    return this.parametersForm.get('actualLoanAmount')!;
  }
  get actualLoanAmountFormatted() {
    return this.parametersForm.get('actualLoanAmountFormatted')!;
  }
  get sanctionDate() {
    return this.parametersForm.get('sanctionDate')!;
  }
  get sanctionBy() {
    return this.parametersForm.get('sanctionBy')!;
  }
  get loanTenureInMonths() {
    return this.parametersForm.get('loanTenureInMonths')!;
  }
  get interestRate() {
    return this.parametersForm.get('interestRate')!;
  }
  get amountAdvances() {
    return this.parametersForm.get('amountAdvances')!;
  }
  get changesInInterestApplicable() {
    return this.parametersForm.get('changesInInterestApplicable')!;
  }
  get maturityDate() {
    return this.parametersForm.get('maturityDate')!;
  }
  get resolutionNo() {
    return this.parametersForm.get('resolutionNo')!;
  }
  get resolutionDate() {
    return this.parametersForm.get('resolutionDate')!;
  }

  // get firstInstallmentDate() {
  //   return this.parametersForm.get('firstInstallmentDate')!;
  // }
  // get installmentType() {
  //   return this.parametersForm.get('installmentType')!;
  // }
  get paidDate() {
    return this.parametersForm.get('paidDate')!;
  }
  ///// Installments

  get instInstallmentType() {
    return this.installmentsForm.get('instInstallmentType')!;
  }
  get instNumberOfInstallments() {
    return this.installmentsForm.get('instNumberOfInstallments')!;
  }
  get instFirstInstallmentDate() {
    return this.installmentsForm.get('instFirstInstallmentDate')!;
  }
  get instInstallWithInterest() {
    return this.installmentsForm.get('instInstallWithInterest')!;
  }
  get instAmountToBeReceived() {
    return this.installmentsForm.get('instAmountToBeReceived')!;
  }

  configClick(routeValue: string) {
    sessionStorage.setItem("configMenu", routeValue);
    this.router.navigate(['/app/' + routeValue]);
  }
}
