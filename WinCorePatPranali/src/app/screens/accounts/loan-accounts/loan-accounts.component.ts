import { formatDate } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxDropdownConfig } from 'ngx-select-dropdown';
import { ToastrService } from 'ngx-toastr';
import { AccountDeclarations } from 'src/app/common/account-declarations';
import { IGeneralDTO, UiEnumAccountStatus, UiEnumGeneralMaster } from 'src/app/common/models/common-ui-models';
import { AccountsService } from 'src/app/services/accounts/accounts/accounts.service';
import { DepositAccountService } from 'src/app/services/accounts/deposit-accounts/deposit-account.service';
import { LoanAccountsService } from 'src/app/services/accounts/loan-accounts/loan-accounts.service';
import { SavingAccountService } from 'src/app/services/accounts/saving-accounts/saving-account.service';
import { CustomerService } from 'src/app/services/customers/customer/customer.service';
import { BranchMasterService } from 'src/app/services/masters/branch-master/branch-master.service';
import { GeneralLedgerService } from 'src/app/services/masters/general-ledger/general-ledger.service';
import { SharedService } from 'src/app/services/shared.service';

export interface UiSecurity {
  id: number,
  customerId: number,
  srNo: number,
  securityType: string,
  security: string,
  securityValue: Date,
  securityDescription: number,
  percentage: string,
  createdBy: string,
  modifiedBy: string,
  status: string,
  mstCustomer: {}
}

export interface UiJoint {
  id: number,
  accountId: number,
  srNo: number,
  customerId: string,
  customerNumber: string,
  customerName: string,
  operativeInstruction: string,
  active: number,
  createdBy: string,
  status: string
}

export interface ISavingAccountModel {
  AccountsId: number;
  BranchCode: number;
  CustomerId: number;
  Code1: number;
  Code2: number;
  AccountNo: string;
  AccountType: number;
  AccountStatus: number;
  Int_Rate: number;
  SavingsAccountId: number;
  Mode_Opr: number;
  Mode_Sgn: number;
  Opn_Date: Date;
  Exp_Date: Date;
  Last_Int_Date: Date;
  Last_Trn_Date: Date;
  Passbook_Date: Date;
  Penal_Date: Date;
  Close_Flag: number;
  Close_Date: Date;
  Min_Bal: number;
  Print_Date: Date;
  Currency: number;
  Other_Branch_Trf: number;
  LedgerFolioNo: string;
  StaffCode: string;
  Active: number;
  CreatedBy: string;
  CreatedDate: Date;
  NomineeList: INominiModel[];
  JointList: IJointModel[];
}

export interface INominiModel {
  Id: number;
  AccountId: number;
  SrNo: number;
  NomineeName: string;
  NomineeAddress: string;
  Percentage: number;
  Relation: number;
  Guardian: string;
  Active: number;
  Status: string;
  CreatedBy: string;
  CreatedDate: Date;
}

export interface IJointModel {
  Id: number;
  AccountId: number;
  SrNo: number;
  CustomerId: number;
  OperativeInstruction: string;
  Active: number;
  Status: number;
  CreatedBy: string;
  CreatedDate: Date;
}

@Component({
  selector: 'app-loan-accounts',
  templateUrl: './loan-accounts.component.html',
  styleUrls: ['./loan-accounts.component.css']
})
export class LoanAccountsComponent {

  customerDetailsForm!: FormGroup;
  summaryForm!: FormGroup;
  accountForm!: FormGroup;
  parametersForm!: FormGroup;
  jointForm!: FormGroup;
  guarantorForm!: FormGroup;
  securityForm!: FormGroup;
  loanDetailsForm!: FormGroup;
  installmentsForm!: FormGroup;


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

  uiAllGeneralLedgers: any[] = [];
  uiLoanGeneralLedgers: any[] = [];
  uiDepositGeneralLedgers: any[] = [];
  uiAccountTypes: any[] = [];
  uiModeOfOperations: any[] = [];
  uiEmployyeTypes: any[] = [];
  uiRelations: any[] = [];
  uiOccupations: any[] = [];
  uiCustomerGroups: any[] = [];
  uiCurrencies: any[] = [];
  uiZones: any[] = [];
  uiTDSOptions: any[] = [];
  uiTDSReasons: any[] = [];
  uiForm60Options: any[] = [];
  uiForm61Options: any[] = [];
  uiAccountStatuses: any[] = [];
  uiLoanTypes: any[] = [];
  uiSecurityTypes: any[] = [];
  uiDirectors: any[] = [];

  uiChangesInInterestRateYN: any[] = [];
  uiInstallmentWithInterestYN: any[] = [];
  uiInstallmentTypes: any[] = [];

  // toggleSearchCustomers = false;
  // toggleSearchJointCustomers = false;
  // toggleSearchGuarantorCustomers = false;
  isNotJointAccount = true;
  isLoanAccountSelected = true;
  isFDAccount = false;
  isRDAccount = false;

  selectedCustomerId = 0;
  selectedLoanType = 1;

  uiCustomers: any[] = [];
  uiJointCustomers: any[] = [];
  uiGuarantorCustomers: any[] = [];
  uiSecurities: any[] = [];

  uiSelectedJointCustomers: any[] = [];
  uiSelectedGuarantorCustomers: any[] = [];

  p_security: number = 1;
  total_securities: number = 0;
  dto: IGeneralDTO = {} as IGeneralDTO;
  accountsId!: number;
  isAddMode = true;

  // formatter = new Intl.NumberFormat('en-IN', {
  //   style: 'currency',
  //   currency: 'INR',
  //   minimumFractionDigits: 2,
  // });

  constructor(private _sharedService: SharedService, private _toastrService: ToastrService,
    private _generalLedgerService: GeneralLedgerService, private _customerService: CustomerService,
    private _savingAccountService: SavingAccountService, private _loanAccountsService: LoanAccountsService,
    private _accountsService: AccountsService) { }

  ngOnInit(): void {

    this.uiAccountTypes = this.retrieveMasters(UiEnumGeneralMaster.ACTYPE);
    this.uiModeOfOperations = this.retrieveMasters(UiEnumGeneralMaster.OPRMODE);
    this.uiEmployyeTypes = AccountDeclarations.employeeTypes;
    this.uiRelations = this.retrieveMasters(UiEnumGeneralMaster.RELATION);
    this.uiZones = this.retrieveMasters(UiEnumGeneralMaster.ZONE);
    this.uiOccupations = this.retrieveMasters(UiEnumGeneralMaster.OCCUPTION);
    this.uiCustomerGroups = this.retrieveMasters(UiEnumGeneralMaster.CUSTOMERGROUP);
    this.uiTDSOptions = AccountDeclarations.tdsYN;
    this.uiTDSReasons = this.retrieveMasters(UiEnumGeneralMaster.TDSREASON);
    this.uiAccountStatuses = this.retrieveMasters(UiEnumGeneralMaster.ACSTATUS);
    this.uiLoanTypes = this.retrieveMasters(UiEnumGeneralMaster.LOANTYPE);
    this.uiCurrencies = this._sharedService.uiCurrencies;
    this.uiForm60Options = AccountDeclarations.form60YN;
    this.uiForm61Options = AccountDeclarations.form61YN;
    this.uiChangesInInterestRateYN = AccountDeclarations.changesInInterestRateYN;
    this.uiInstallmentWithInterestYN = AccountDeclarations.InstallmentWithInterestYN;
    this.uiInstallmentTypes = AccountDeclarations.loanInstallmentTypes;

    this.customerDetailsForm = new FormGroup({
      customerNumber: new FormControl("", []),
      name: new FormControl("", []),
      address: new FormControl("", []),
      mobile: new FormControl("", []),
      email: new FormControl("", []),
      pan: new FormControl("", []),
      dob: new FormControl(formatDate(new Date(Date.now()), 'yyyy-MM-dd', 'en'), []),
      aadhar: new FormControl("", []),
      joiningDate: new FormControl(formatDate(new Date(Date.now()), 'yyyy-MM-dd', 'en'), []),
      group: new FormControl("", []),
      occupation: new FormControl("", []),
      city: new FormControl("", []),
      zone: new FormControl("", [])
    });

    this.summaryForm = new FormGroup({
      generalLedger: new FormControl("", [Validators.required]),
      glAccountNumberStr: new FormControl("", [Validators.required]),
      glAccountNumber: new FormControl("", [Validators.required]),
      customerId: new FormControl("", [Validators.required]),
    });

    this.accountForm = new FormGroup({
      accountType: new FormControl(this.uiAccountTypes[0].constantNo, [Validators.required]),
      modeOfOperation: new FormControl(this.uiModeOfOperations[0].constantNo, [Validators.required]),
      modeOfSignature: new FormControl(this.uiModeOfOperations[0].constantNo, [Validators.required]),
      staffDirectorOther: new FormControl(this.uiEmployyeTypes[0].code, [Validators.required]),
      accountStatus: new FormControl(this.uiAccountStatuses[0].constantNo, [Validators.required]),
      accountOpeningDate: new FormControl(formatDate(new Date(Date.now()), 'yyyy-MM-dd', 'en'), [Validators.required]),
      loanType: new FormControl(this.uiLoanTypes[0].constantNo, [Validators.required]),

      insuranceDate: new FormControl(formatDate(new Date(Date.now()), 'yyyy-MM-dd', 'en'), [Validators.required]),
      contactPerson: new FormControl("", [Validators.required]),
      passbookDate: new FormControl(formatDate(new Date(Date.now()), 'yyyy-MM-dd', 'en'), [Validators.required]),
      lastInterestDate: new FormControl(formatDate(new Date(Date.now()), 'yyyy-MM-dd', 'en'), [Validators.required]),
      lastTransactionDate: new FormControl(formatDate(new Date(Date.now()), 'yyyy-MM-dd', 'en'), [Validators.required]),
      lastPenalDate: new FormControl(formatDate(new Date(Date.now()), 'yyyy-MM-dd', 'en'), [Validators.required]),
      accountCloseDate: new FormControl("", [Validators.required]),
      close_Flag: new FormControl(false, [Validators.required])
    });

    this.parametersForm = new FormGroup({
      sactionAmount: new FormControl(0 , [Validators.required]),
      sactionAmountFormatted: new FormControl(new Intl.NumberFormat('en-IN',{ style: 'decimal' }).format(0), [Validators.required]),
      sactionDate: new FormControl(formatDate(new Date(Date.now()), 'yyyy-MM-dd', 'en'), [Validators.required]),
      sanctionBy: new FormControl(0, [Validators.required]),
      loanTenureInMonths: new FormControl("", [Validators.required]),
      interestRate: new FormControl("", [Validators.required]),
      amountAdvances: new FormControl("", [Validators.required]),
      changesInInterestApplicable: new FormControl(this.uiChangesInInterestRateYN[0].code, [Validators.required]),
      maturityDate: new FormControl(formatDate(new Date(Date.now()), 'yyyy-MM-dd', 'en'), [Validators.required]),
      resolutionNo: new FormControl("", [Validators.required]),
      resolutionDate: new FormControl(formatDate(new Date(Date.now()), 'yyyy-MM-dd', 'en'), [Validators.required]),
      firstInstallmentDate: new FormControl(formatDate(new Date().setDate(new Date().getDate() + 30), 'yyyy-MM-dd', 'en'), [Validators.required]),
      installmentType: new FormControl("", [Validators.required]),
    });

    this.jointForm = new FormGroup({
      jointCustomers: new FormControl("", []),
      operativeInstruction: new FormControl("", []),
    });

    this.guarantorForm = new FormGroup({
      guarantorCustomers: new FormControl("", []),
    });

    this.securityForm = new FormGroup({
      securityType: new FormControl(0, []),
      security: new FormControl("", []),
      securityValue: new FormControl("", []),
      securityDescription: new FormControl("", []),
      percentage: new FormControl("", []),
    });

    this.installmentsForm = new FormGroup({
      instInstallWithInterest: new FormControl(this.uiInstallmentWithInterestYN[0].code, []),
      instInstallmentType: new FormControl(this.uiInstallmentTypes[0].code, []),
      instFirstInstallmentDate: new FormControl(formatDate(this.firstInstallmentDate.value, 'yyyy-MM-dd', 'en'), []),
      instExpiryDate: new FormControl(formatDate(new Date().setDate(new Date().getDate() + 30), 'yyyy-MM-dd', 'en'), []),
      instTenureYear: new FormControl("", []),
      instTenureMonths: new FormControl("", []),
      instTenureDays: new FormControl("", []),
      instNumberOfInstallments: new FormControl("", [Validators.required]),
      instSactionAmount: new FormControl(this.sactionAmount.value, []),
      instAmountToBeReceived: new FormControl(0, []),
      instTotalAmountAfterInstallments: new FormControl(0, []),
    });

    this.getGeneralLedgers().then(result => {
      if (result) {
        this.getSecurities().then(sResult => {
          if (sResult) {
            this.getDirectors().then(dResult => {
              if (dResult) {
                this.loadForm();
              }
            }).catch(error => {
              this._toastrService.error('Error loading general ledgers', 'Error!');
            });
          }
        }).catch(error => {
          this._toastrService.error('Error loading security types', 'Error!');
        });
      }
    }).catch(error => {
      this._toastrService.error('Error loading general ledgers', 'Error!');
    });
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

  getSecurities() {
    return new Promise((resolve, reject) => {
      this._accountsService.getSecurities().subscribe((data: any) => {
        console.log(data);
        if (data) {
          this.uiSecurityTypes = data.data.data;
          if (this.uiSecurityTypes && this.uiSecurityTypes.length) {
            this.securityForm.patchValue({
              securityType: this.uiSecurityTypes[0].id
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




  loadForm() {
    this._savingAccountService.getDTO().subscribe(obj => this.dto = obj);
    if (this.dto) {
      this.accountsId = this.dto.id;
      if (this.accountsId == 0 || this.accountsId == undefined) {
        this.isAddMode = true;

      }
      else {
        this.isAddMode = false;
        this._savingAccountService.getSavingAccount(this.accountsId).subscribe((data: any) => {
          console.log(data);
          if (data) {
            if (data.statusCode == 200 && data.data.data) {
              var savingAccount = data.data.data;

              this.selectCustomer(savingAccount.customerId);

              // bind general ledger
              let gl = this.uiAllGeneralLedgers.filter(g => g.code == savingAccount.code1);

              this.summaryForm.patchValue({
                generalLedger: gl && gl.length ? gl[0] : null,
                glAccountNumberStr: savingAccount.accountNo,
                glAccountNumber: savingAccount.code2,
                customerId: savingAccount.customerId,
              })

              this.customerDetailsForm.patchValue({
                customerNumber: "",
                name: "",
                address: "",
                mobile: "",
                email: "",
                pan: "",
                dob: new FormControl(formatDate(new Date(Date.now()), 'yyyy-MM-dd', 'en'), []),
                aadhar: "",
                joiningDate: new FormControl(formatDate(new Date(Date.now()), 'yyyy-MM-dd', 'en'), []),
                group: "",
                occupation: "",
                city: "",
                zone: "",
              })

              this.accountForm.patchValue({
                accountType: savingAccount.accountType,
                modeOfOperation: savingAccount.modeOfOperation,
                staffDirectorOther: savingAccount.staffCode,
                accountStatus: savingAccount.accountStatus,
                //accountOpeningDate: formatDate(new Date(depositAccount.opn_Date), 'yyyy-MM-dd', 'en'),
                lastTransactionDate: formatDate(new Date(savingAccount.last_Trn_Date), 'yyyy-MM-dd', 'en'),
                passbookDate: formatDate(new Date(savingAccount.passbookDate), 'yyyy-MM-dd', 'en'),
                matureDate: formatDate(new Date(savingAccount.exp_Date), 'yyyy-MM-dd', 'en'),
                lastInterestDate: formatDate(new Date(savingAccount.last_Int_Date), 'yyyy-MM-dd', 'en'),
                //drInterestDate: formatDate(new Date(savingAccount.debitInterestDate), 'yyyy-MM-dd', 'en')
              })

              this.parametersForm.patchValue({
                interestRateParam: savingAccount.int_Rate,
                ledgerNumber: savingAccount.ledgerNumber,
                minimumBalance: savingAccount.minimumBalance,
                additionalBalance: savingAccount.additionalBalance,
                form60: savingAccount.form60,
                form61: savingAccount.form61,
                tds: savingAccount.tdS_YN ? 'Y' : 'N',
                tdsReason: savingAccount.tdS_Reason_Code,
              })

              // depositAccount.nomineeList
              if (savingAccount.nomineeList && savingAccount.nomineeList.length) {
                let relationName = "";
                savingAccount.nomineeList.forEach((nominee: any) => {
                  let uiNominee: any = {};
                  let uiRelation = this.uiRelations.filter(r => r.constantNo == parseInt(nominee.relation));
                  if (uiRelation) {
                    relationName = (uiRelation && uiRelation.length > 0) ? uiRelation[0].constantname : "";
                  }

                  uiNominee.id = nominee.id;
                  uiNominee.accountId = nominee.accountsId;
                  uiNominee.customerId = savingAccount.customerId;
                  uiNominee.nomineeName = nominee.nomineeName;
                  uiNominee.nomineeAddress = nominee.nomineeAddress;
                  uiNominee.relation = nominee.relation;
                  uiNominee.relationName = relationName;
                  uiNominee.guardian = nominee.guardian;
                  uiNominee.percentage = nominee.percentage;
                  uiNominee.createdBy = nominee.createdBy;
                  uiNominee.status = '';
                  this.uiSecurities.push(uiNominee);
                });
              }

              //depositAccount.jointList
              if (savingAccount.jointList && savingAccount.jointList.length) {

                savingAccount.jointList.forEach((joint: any) => {
                  let uiJointCust = {} as UiJoint;
                  uiJointCust.accountId = joint.accountsId;
                  uiJointCust.id = joint.id;
                  uiJointCust.customerId = joint.customerId;
                  uiJointCust.customerName = joint.custName;
                  uiJointCust.customerNumber = joint.customerCodeStr;
                  uiJointCust.operativeInstruction = joint.operativeInstruction;
                  uiJointCust.status = '';
                  uiJointCust.createdBy = joint.createdBy;
                  this.uiSelectedJointCustomers.push(uiJointCust);
                });
              }

              this.isNotJointAccount = !(savingAccount.accountType == 2); // TODO: Need to make it configurable
            }
          }
        })
      }
    }
  }

  changeGeneralLedger(event: any) {
    let glValue = event.value;
    if (glValue) {
      this.isFDAccount = false;
      this.isRDAccount = false;
      if (glValue.glGroup == 'D' && glValue.glType == 'F') {
        this.isFDAccount = true;
      }
      if (glValue.glGroup == 'D' && glValue.glType == 'R') {
        this.isRDAccount = true;
      }
      this.getMaxAccountNumber(glValue.code);
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

  calculateFirstInstallmentDate() {
    if (this.sactionDate.value) {
      let firstInstallDate = new Date().setDate(new Date(this.sactionDate.value).getDate() + 30)
      if (firstInstallDate) {
        this.parametersForm.patchValue({
          firstInstallmentDate: formatDate(firstInstallDate, 'yyyy-MM-dd', 'en')
        })
      }
    }
  }

  validateFirstInstallmentDate() {
    if (this.firstInstallmentDate.value) {
      let tempFirstInstallmentDate = formatDate(new Date(this.firstInstallmentDate.value), 'yyyy-MM-dd', 'en');
      let tempSactionDate = formatDate(new Date(this.sactionDate.value), 'yyyy-MM-dd', 'en');
      if (tempFirstInstallmentDate < tempSactionDate) {
        this.parametersForm.patchValue({
          firstInstallmentDate: formatDate(new Date().setDate(new Date(this.sactionDate.value).getDate() + 30), 'yyyy-MM-dd', 'en')
        })

        this._toastrService.error('First installment can not be less than sanction date', 'Error!');
      }

      this.installmentsForm.patchValue({
        instFirstInstallmentDate: formatDate(this.firstInstallmentDate.value, 'yyyy-MM-dd', 'en')
      })
    }
  }

  setIntallmentSactionAmount()
  {
    if (this.sactionAmountFormatted.value.length > 0) {
      this.installmentsForm.patchValue({
        instSactionAmount: new Intl.NumberFormat('en-IN',{ style: 'decimal' }).format(parseFloat(this.sactionAmountFormatted.value))
      })
      this.parametersForm.patchValue({
        sactionAmount: parseFloat(this.sactionAmountFormatted.value),
        sactionAmountFormatted: new Intl.NumberFormat('en-IN',{ style: 'decimal' }).format(parseFloat(this.sactionAmountFormatted.value))
      })
    }
  }

  getMaxAccountNumber(glId: number) {
    this._accountsService.getMaxAccountNumber(this._sharedService.applicationUser.branchId, glId).subscribe((data: any) => {
      console.log(data);
      if (data) {
        let maxAccountModel = data.data.data;
        if (maxAccountModel) {
          this.summaryForm.patchValue({
            glAccountNumberStr: maxAccountModel.accountNo,
            glAccountNumber: maxAccountModel.maxAccountNo,
          })
        }
      }
    })
  }

  getCustomers(custData: any) {
    if(custData && custData.status == 'Active') {
      this.selectCustomer(custData.id);
    }
    // this.toggleSearchCustomers = true;
  }

  getCustomersForJoint(custData: any) {
    if (custData && custData.status == 'Active') {
      // this.uiJointCustomers = custData.filter((c: any) => c.status == 'Active'); // display only active customers
      this.selectJointCustomer(custData);
    }
  }

  getCustomersForGuarantor(custData: any) {

    if (custData && custData.status == 'Active') {
      // this.uiJointCustomers = custData.filter((c: any) => c.status == 'Active'); // display only active customers
      this.selectGuarantorCustomer(custData);
    }
  }

  selectCustomer(customerId: number) {
    if (customerId && customerId > 0) {
      this.selectedCustomerId = customerId;
      this.getCustomer(customerId);
    }
  }

  getCustomer(customerId: number) {
    this._customerService.getCustomer(this._sharedService.applicationUser.branchId, customerId).subscribe((data: any) => {
      console.log(data);
      if (data) {
        var customer = data.data.data;
        let zones = this.uiZones.filter(z => z.constantNo == customer.custZone);
        let occupations = this.uiOccupations.filter(z => z.constantNo == customer.occupation);
        let groups = this.uiCustomerGroups.filter(z => z.constantNo == customer.custGroup);
        let custZone = "";
        let custOccupation = "";
        let custGroup = "";
        let custAddress = "";
        let custCity = "";
        if (zones && zones.length) {
          custZone = zones[0].constantname;
        }
        if (occupations && occupations.length) {
          custOccupation = occupations[0].constantname;
        }
        if (groups && groups.length) {
          custGroup = groups[0].constantname;
        }

        if (customer.customerAddresses && customer.customerAddresses.length) {
          custAddress = customer.customerAddresses[0].address;
          custCity = customer.customerAddresses[0].city;
        }

        this.customerDetailsForm.patchValue({
          customerNumber: customer.customerCodeStr,
          name: customer.custName,
          mobile: customer.mobileno,
          email: customer.emailid,
          pan: customer.panNo,
          dob: formatDate(new Date(customer.birthDate), 'yyyy-MM-dd', 'en'),
          aadhar: customer.aadharno,
          joiningDate: formatDate(new Date(customer.custOpenDate), 'yyyy-MM-dd', 'en'),
          group: custGroup,
          occupation: custOccupation,
          city: custCity,
          zone: custZone,
          address: custAddress,
        });

        this.summaryForm.patchValue({
          customerId: customerId,
        })
      }
    })
  }

  selectJointCustomer(customer: any) {
    if (customer) {
      let index = this.uiSelectedJointCustomers.findIndex(c => c.customerId == customer.id);
      if (index > -1) {
        let newIndex = this.uiSelectedJointCustomers.findIndex(c => c.customerId == customer.id
          && c.status === "D");
        if (newIndex > -1) {
          this.uiSelectedJointCustomers.splice(newIndex, 1);
          index = -1;
        }
      }
      if (index == -1) {
        let uiJointCust = {} as UiJoint;
        uiJointCust.accountId = 0;
        uiJointCust.id = 0;
        uiJointCust.customerId = customer.id;
        uiJointCust.customerNumber = customer.customerCodeStr;
        uiJointCust.customerName = customer.custName;
        uiJointCust.operativeInstruction = this.operativeInstruction.value.toString();
        uiJointCust.status = customer.status;
        uiJointCust.createdBy = this._sharedService.applicationUser.userName;
        uiJointCust.srNo = this.uiSelectedJointCustomers.length;
        this.uiSelectedJointCustomers.push(uiJointCust);

        //this.toggleSearchJointCustomers = false;
      }
      else {
        this._toastrService.error('Customer already added', 'Error!');
      }
    }
  }

  selectGuarantorCustomer(customer: any) {
    if (customer) {
      let index = this.uiSelectedGuarantorCustomers.findIndex(c => c.customerId == customer.id);
      if (index > -1) {
        let newIndex = this.uiSelectedGuarantorCustomers.findIndex(c => c.customerId == customer.id
          && c.status === "D");
        if (newIndex > -1) {
          this.uiSelectedGuarantorCustomers.splice(newIndex, 1);
          index = -1;
        }
      }
      if (index == -1) {

        this._accountsService.isCustomerValidGuarantor(customer.id).subscribe((data: any) => {
          console.log(data);
          if (data) {
            let model = data.data.data;
            if (model) {

              let uiJointCust = {} as UiJoint;
              uiJointCust.accountId = 0;
              uiJointCust.id = 0;
              uiJointCust.customerId = customer.id;
              uiJointCust.customerNumber = customer.customerCodeStr;
              uiJointCust.customerName = customer.custName;
              uiJointCust.status = customer.status;
              uiJointCust.createdBy = this._sharedService.applicationUser.userName;
              uiJointCust.srNo = this.uiSelectedGuarantorCustomers.length;
              this.uiSelectedGuarantorCustomers.push(uiJointCust);

              //this.toggleSearchGuarantorCustomers = false;

            }
            else {
              this._toastrService.error('Guarantor limit exceeded for selected customor.', 'Error!');
            }
          }
        })
      }
      else {
        this._toastrService.error('Customer already added', 'Error!');
      }
    }
  }

  deleteJoinCustomer(customer: any) {
    if (customer) {
      this._savingAccountService.jointCustomerToDelete = customer.customerId;
    }
  }

  deleteGuarantorCustomer(customer: any) {
    if (customer) {
      this._savingAccountService.guarantorCustomerToDelete = customer.customerId;
    }
  }

  onJointDelete() {
    let customerIdToDelete = this._savingAccountService.jointCustomerToDelete;
    if (customerIdToDelete > 0) {

      let customers = this.uiSelectedJointCustomers.filter(c => c.customerId == customerIdToDelete);
      if (customers && customers.length) {
        customers[0].status = "D";
      }
    }
  }

  onGuarantorDelete() {
    let customerIdToDelete = this._savingAccountService.guarantorCustomerToDelete;
    if (customerIdToDelete > 0) {

      let customers = this.uiSelectedGuarantorCustomers.filter(c => c.customerId == customerIdToDelete);
      if (customers && customers.length) {
        customers[0].status = "D";
      }
    }
  }

  cancelJointDelete() {
    this._savingAccountService.jointCustomerToDelete = -1;
  }

  cancelGuarantorDelete() {
    this._savingAccountService.guarantorCustomerToDelete = -1;
  }

  getCustomerStatus(status: number) {
    if (status == 1) {
      return "Active";
    }
    else {
      return "In-Active";
    }
  }

  selectAccountType(event: any) {
    if (event) {
      if (event.target.value) {
        let targetValue = event.target.value;
        let accountType = targetValue.split(":");
        this.isNotJointAccount = true;
        if (parseInt(accountType[1]) == 2) { //TODO: Need to make it configurable
          this.isNotJointAccount = false;
        }
      }
    }
  }

  selectLoanType(event: any) {
    if (event) {
      if (event.target.value) {
        let targetValue = event.target.value;
        let loanType = targetValue.split(":");
        this.isNotJointAccount = true;
        this.selectedLoanType = parseInt(loanType[1]);
      }
    }
  }

  selectAccountStatus(event: any) {
    if (event) {
      if (event.target.value) {
        let targetValue = event.target.value;
        let accountType = targetValue.split(":");
        this.isNotJointAccount = true;
        if (parseInt(accountType[1]) == 4) { //TODO: Need to make it configurable
          this.accountForm.patchValue({
            close_Flag: true,
            accountCloseDate: formatDate(new Date(Date.now()), 'MM/dd/yyyy', 'en')
          })
        }
        else {
          this.accountForm.patchValue({
            close_Flag: false,
            accountCloseDate: ""
          })
        }
      }
    }
  }

  validSecurityForm() {
    if (this.securityForm.invalid) {
      for (const control of Object.keys(this.securityForm.controls)) {
        this.securityForm.controls[control].markAsTouched();
      }
      return false;
    }
    return true;
  }


  addSecurity() {
    if (this.validSecurityForm()) {

      // Check existing nomini with name and relation
      let securityIndex = this.uiSecurities.findIndex(security =>
        security.security.toLowerCase() == this.security.value.toLowerCase());

      let totalPercentage = this.uiSecurities.reduce((sum, security) => sum + parseInt(security.percentage), 0);
      if (securityIndex > -1) {
        totalPercentage = totalPercentage - this.uiSecurities[securityIndex].percentage;
      }
      if (totalPercentage >= 100) {
        this._toastrService.warning('Total percentage for security exceeded.', 'Warning!');
        return;
      }
      if (parseFloat(this.percentage.value) + totalPercentage > 100) {
        this._toastrService.warning('Total percentage for security exceeded.', 'Warning!');
        return;
      }

      if (securityIndex > -1) {
        let uiSecurity = this.uiSecurities[securityIndex];

        uiSecurity.customerId = this.selectedCustomerId;
        uiSecurity.securityType = this.securityType.value.toString();
        uiSecurity.security = this.security.value.toString();
        uiSecurity.securityValue == this.securityValue.value.toString();
        uiSecurity.securityDescription = this.securityDescription.value.toString();
        uiSecurity.percentage = this.percentage.value.toString();
        uiSecurity.createdBy = this._sharedService.applicationUser.userName;
        uiSecurity.modifiedBy = this._sharedService.applicationUser.userName;
        uiSecurity.status = 'M';
      }
      else {
        let uiSecurity = {} as UiSecurity;
        uiSecurity.id = 0;
        uiSecurity.srNo = this.uiSecurities.length + 1;
        uiSecurity.securityType = this.securityType.value.toString();
        uiSecurity.security = this.security.value.toString();
        uiSecurity.securityValue == this.securityValue.value.toString();
        uiSecurity.securityDescription = this.securityDescription.value.toString();
        uiSecurity.percentage = this.percentage.value.toString();
        uiSecurity.percentage = this.percentage.value.toString();
        uiSecurity.createdBy = this._sharedService.applicationUser.userName;
        uiSecurity.modifiedBy = this._sharedService.applicationUser.userName;
        uiSecurity.status = 'A';
        this.uiSecurities.push(uiSecurity);
      }
    }
  }

  editSecurity(uiSecurity: any, index: number) {
    this.securityForm.patchValue({
      securityType: uiSecurity.securityType,
      security: uiSecurity.security,
      securityValue: uiSecurity.securityValue,
      securityDescription: uiSecurity.securityDescription,
      percentage: uiSecurity.percentage
    });
  }

  deleteSecurity(uiSecurity: any, index: number) {
    uiSecurity.status = 'D';
  }

  clearSecurity() {
    this.securityForm.patchValue({
      securityType: "",
      security: "",
      securityValue: "",
      securityDescription: "",
      percentage: "",
    });
  }

  validCustomer() {
    return this.selectedCustomerId > 0;
  }

  validSummaryDetails() {
    if (this.summaryForm.invalid) {
      for (const control of Object.keys(this.summaryForm.controls)) {
        this.summaryForm.controls[control].markAsTouched();
      }
      return false;
    }
    return true;
  }

  validAccountDetails() {
    if (this.accountForm.invalid) {
      for (const control of Object.keys(this.accountForm.controls)) {
        this.accountForm.controls[control].markAsTouched();
      }
      return false;
    }
    return true;
  }

  validParameters() {
    if (this.parametersForm.invalid) {
      for (const control of Object.keys(this.parametersForm.controls)) {
        this.parametersForm.controls[control].markAsTouched();
      }
      return false;
    }
    return true;
  }

  validNominiDetails() {
    return (this.uiSecurities && this.uiSecurities.length > 0);
  }

  validJointDetails() {
    if (!this.isNotJointAccount) {
      return (this.uiSelectedJointCustomers && this.uiSelectedJointCustomers.length > 0);
    }
    return true;
  }

  saveSavingAccount() {
    // validate all tabs
    if (!this.validCustomer()) {
      this._toastrService.error('Please link customer with account.', 'Error!');
      return;
    }
    if (!this.validSummaryDetails()) {
      this._toastrService.error('Please select general ledger.', 'Error!');
      return;
    }
    if (!this.validAccountDetails()) {
      this._toastrService.error('Please enter account details.', 'Error!');
      return;
    }
    if (!this.validParameters()) {
      this._toastrService.error('Please enter paramater details.', 'Error!');
      return;
    }
    if (!this.validNominiDetails()) {
      this._toastrService.error('Please enter nominee details.', 'Error!');
      return;
    }
    if (!this.validJointDetails()) {
      this._toastrService.error('Please enter joint customer details.', 'Error!');
      return;
    }

    // add values into model
    let accountModel = {} as ISavingAccountModel;
    // accountModel.AccountsId = this.dto.id;
    // accountModel.BranchCode = this._sharedService.applicationUser.branchId;
    // accountModel.CustomerId = parseInt(this.customerId.value.toString());
    // accountModel.Code1 = parseInt(this.generalLedger.value.code.toString());
    // accountModel.Code2 = parseInt(this.glAccountNumber.value.toString());
    // accountModel.AccountNo = this.glAccountNumberStr.value.toString()
    // accountModel.AccountType = parseInt(this.accountType.value.toString());
    // accountModel.AccountStatus = parseInt(this.accountStatus.value.toString());
    // accountModel.SavingsAccountId = 0;
    // accountModel.Mode_Opr = parseInt(this.modeOfOperation.value.toString());
    // accountModel.Mode_Sgn = parseInt(this.modeOfSignature.value.toString());
    // accountModel.StaffCode = this.staffDirectorOther.value.toString();
    // accountModel.LedgerFolioNo = this.ledgerNumber.value.toString();
    // accountModel.Min_Bal = parseFloat(this.minimumBalance.value.toString());
    // accountModel.Last_Int_Date = this.lastInterestDate.value.toString();
    // accountModel.Last_Trn_Date = this.lastTransactionDate.value.toString();
    // accountModel.Int_Rate = parseFloat(this.interestRateParam.value.toString());
    // accountModel.Opn_Date = this.accountOpeningDate.value.toString();
    // accountModel.Exp_Date = this.accountCloseDate.value.toString();
    // accountModel.Print_Date = this.lastPenalDate.value.toString();
    // accountModel.Passbook_Date = this.passbookDate.value.toString();
    // accountModel.Close_Flag = this.close_Flag.value.toString()=='true'? 1: 0;
    // accountModel.Close_Date = this.accountCloseDate.value.toString();
    // accountModel.Currency = this.currency.value.toString();
    // accountModel.Other_Branch_Trf = this.otherBranchTransfer.value.toString()=='Y'? 1: 0;
    // accountModel.CreatedBy = this._sharedService.applicationUser.userName;
    // accountModel.NomineeList = [];

    let nominiModel = {} as INominiModel;
    this.uiSecurities.forEach(nom => {
      nominiModel = {} as INominiModel;
      nominiModel.Id = nom.id;
      nominiModel.AccountId = this.dto.id;
      nominiModel.NomineeName = nom.nomineeName;
      nominiModel.NomineeAddress = nom.nomineeAddress;
      nominiModel.Percentage = parseFloat(nom.percentage);
      nominiModel.Relation = parseInt(nom.relation);
      nominiModel.Guardian = nom.guardian;
      nominiModel.Status = nom.status;
      nominiModel.CreatedBy = nom.createdBy;
      accountModel.NomineeList.push(nominiModel);
    });

    if (!this.isNotJointAccount) { // If Joint Account
      accountModel.JointList = [];
      let jointModel = {} as IJointModel;
      this.uiSelectedJointCustomers.forEach(jointCust => {
        jointModel = {} as IJointModel;
        jointModel.Id = jointCust.id;
        jointModel.AccountId = this.dto.id;
        jointModel.CustomerId = jointCust.customerId;
        jointModel.OperativeInstruction = jointCust.operativeInstruction;
        jointModel.Status = jointCust.status;
        jointModel.CreatedBy = jointCust.createdBy;
        accountModel.JointList.push(jointModel);
      });
    }
    // Call API to save account

    this._savingAccountService.saveSavingAccount(accountModel).subscribe((data: any) => {
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

  authoriseAccount() {


  }

  clear() {
    this.clearSummaryDetails();
    this.clearCustomerDetails();
    this.clearAccountsDetails();
    this.clearParametersDetails();
    this.clearJointDetails();
    this.isAddMode = false;
  }

  clearSummaryDetails() {
    this.summaryForm.patchValue({
      generalLedger: "",
      glAccountNumberStr: "",
      glAccountNumber: "",
      customerId: "",
    })
  }

  clearCustomerDetails() {
    this.customerDetailsForm.patchValue({
      customerNumber: "",
      name: "",
      address: "",
      mobile: "",
      email: "",
      pan: "",
      dob: new FormControl(formatDate(new Date(Date.now()), 'yyyy-MM-dd', 'en'), []),
      aadhar: "",
      joiningDate: new FormControl(formatDate(new Date(Date.now()), 'yyyy-MM-dd', 'en'), []),
      group: "",
      occupation: "",
      city: "",
      zone: "",
    })
  }
  clearAccountsDetails() {
    this.accountForm.patchValue({
      accountType: this.uiAccountTypes[0].constantNo,
      modeOfOperation: this.uiModeOfOperations[0].constantNo,
      modeOfSignature: this.uiModeOfOperations[0].constantNo,
      staffDirectorOther: this.uiEmployyeTypes[0].code,
      accountStatus: this.uiAccountStatuses[0].constantNo,
      accountOpeningDate: formatDate(new Date(Date.now()), 'yyyy-MM-dd', 'en'),
      passbookDate: new FormControl(formatDate(new Date(Date.now()), 'yyyy-MM-dd', 'en'), [Validators.required]),
      lastInterestDate: new FormControl(formatDate(new Date(Date.now()), 'yyyy-MM-dd', 'en'), [Validators.required]),
      lastTransactionDate: new FormControl(formatDate(new Date(Date.now()), 'yyyy-MM-dd', 'en'), [Validators.required]),
      printDate: new FormControl(formatDate(new Date(Date.now()), 'yyyy-MM-dd', 'en'), [Validators.required]),
      accountCloseDate: "",
      close_Flag: false
    })
  }
  clearParametersDetails() {
    this.parametersForm.patchValue({
      interestRateParam: "",
      ledgerNumber: "",
      minimumBalance: "",
      currency: this.uiCurrencies[0].currencyId,
      otherBranchTransfer: this.uiTDSOptions[0].code,
    })
  }

  clearJointDetails() {
    this.jointForm.patchValue({
      jointCustomers: [],
      operativeInstruction: "",
    })
  }

  // openSearchedCustomers() {
  //   this.toggleSearchCustomers = !this.toggleSearchCustomers;
  // }

  // openSearchedJointCustomers() {
  //   this.toggleSearchJointCustomers = !this.toggleSearchJointCustomers;
  // }

  // openSearchedGuarantorCustomers() {
  //   this.toggleSearchGuarantorCustomers = !this.toggleSearchGuarantorCustomers;
  // }

  //

  get customerNumber() {
    return this.customerDetailsForm.get('customerNumber')!;
  }
  get name() {
    return this.customerDetailsForm.get('name')!;
  }
  get address() {
    return this.customerDetailsForm.get('address')!;
  }
  get mobile() {
    return this.customerDetailsForm.get('mobile')!;
  }
  get email() {
    return this.customerDetailsForm.get('email')!;
  }
  get pan() {
    return this.customerDetailsForm.get('pan')!;
  }
  get dob() {
    return this.customerDetailsForm.get('dob')!;
  }
  get aadhar() {
    return this.customerDetailsForm.get('aadhar')!;
  }
  get joiningDate() {
    return this.customerDetailsForm.get('joiningDate')!;
  }
  get group() {
    return this.customerDetailsForm.get('group')!;
  }
  get occupation() {
    return this.customerDetailsForm.get('occupation')!;
  }
  get city() {
    return this.customerDetailsForm.get('city')!;
  }
  get zone() {
    return this.customerDetailsForm.get('zone')!;
  }

  //

  get generalLedger() {
    return this.summaryForm.get('generalLedger')!;
  }
  get glAccountNumberStr() {
    return this.summaryForm.get('glAccountNumberStr')!;
  }
  get glAccountNumber() {
    return this.summaryForm.get('glAccountNumber')!;
  }
  get customerId() {
    return this.summaryForm.get('customerId')!;
  }

  //

  get accountType() {
    return this.accountForm.get('accountType')!;
  }
  get modeOfOperation() {
    return this.accountForm.get('modeOfOperation')!;
  }
  get modeOfSignature() {
    return this.accountForm.get('modeOfSignature')!;
  }
  get staffDirectorOther() {
    return this.accountForm.get('staffDirectorOther')!;
  }
  get accountStatus() {
    return this.accountForm.get('accountStatus')!;
  }
  get accountOpeningDate() {
    return this.accountForm.get('accountOpeningDate')!;
  }
  get loanType() {
    return this.accountForm.get('loanType')!;
  }

  get insuranceDate() {
    return this.accountForm.get('insuranceDate')!;
  }
  get contactPerson() {
    return this.accountForm.get('contactPerson')!;
  }
  get passbookDate() {
    return this.accountForm.get('passbookDate')!;
  }
  get accountCloseDate() {
    return this.accountForm.get('accountCloseDate')!;
  }
  get lastInterestDate() {
    return this.accountForm.get('lastInterestDate')!;
  }
  get lastTransactionDate() {
    return this.accountForm.get('lastTransactionDate')!;
  }
  get lastPenalDate() {
    return this.accountForm.get('lastPenalDate')!;
  }
  get close_Flag() {
    return this.accountForm.get('close_Flag')!;
  }

  //

  get sactionAmount() {
    return this.parametersForm.get('sactionAmount')!;
  }
  get sactionAmountFormatted() {
    return this.parametersForm.get('sactionAmountFormatted')!;
  }
  get sactionDate() {
    return this.parametersForm.get('sactionDate')!;
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
  get firstInstallmentDate() {
    return this.parametersForm.get('firstInstallmentDate')!;
  }
  get installmentType() {
    return this.parametersForm.get('installmentType')!;
  }

  //

  get jointCustomers() {
    return this.jointForm.get('jointCustomers')!;
  }

  get operativeInstruction() {
    return this.jointForm.get('operativeInstruction')!;
  }

  //

  get guarantorCustomers() {
    return this.guarantorForm.get('guarantorCustomers')!;
  }

  //

  get securityType() {
    return this.securityForm.get('securityType')!;
  }
  get security() {
    return this.securityForm.get('security')!;
  }
  get securityValue() {
    return this.securityForm.get('securityValue')!;
  }
  get securityDescription() {
    return this.securityForm.get('securityDescription')!;
  }
  get percentage() {
    return this.securityForm.get('percentage')!;
  }

  // 

  get instInstallWithInterest() {
    return this.installmentsForm.get('instInstallWithInterest')!;
  }
  get instInstallmentType() {
    return this.installmentsForm.get('instInstallmentType')!;
  }
  get instFirstInstallmentDate() {
    return this.installmentsForm.get('instFirstInstallmentDate')!;
  }
  get instExpiryDate() {
    return this.installmentsForm.get('instExpiryDate')!;
  }
  get instTenureYear() {
    return this.installmentsForm.get('instTenureYear')!;
  }
  get instTenureMonths() {
    return this.installmentsForm.get('instInstallWithInterest')!;
  }
  get instTenureDays() {
    return this.installmentsForm.get('instTenureDays')!;
  }
  get instNumberOfInstallments() {
    return this.installmentsForm.get('instNumberOfInstallments')!;
  }
  get instSactionAmount() {
    return this.installmentsForm.get('instSactionAmount')!;
  }
  get instAmountToBeReceived() {
    return this.installmentsForm.get('instAmountToBeReceived')!;
  }
  get instTotalAmountAfterInstallments() {
    return this.installmentsForm.get('instTotalAmountAfterInstallments')!;
  }

}
