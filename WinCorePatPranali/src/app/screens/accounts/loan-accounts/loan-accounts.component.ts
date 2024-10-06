import { formatDate } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxDropdownConfig } from 'ngx-select-dropdown';
import { ToastrService } from 'ngx-toastr';
import { AccountDeclarations } from 'src/app/common/account-declarations';
import { IGeneralDTO, UiEnumAccountStatus, UiEnumGeneralMaster } from 'src/app/common/models/common-ui-models';
import { AccountsService } from 'src/app/services/accounts/accounts/accounts.service';
import { LoanAccountsService } from 'src/app/services/accounts/loan-accounts/loan-accounts.service';
import { CustomerService } from 'src/app/services/customers/customer/customer.service';
import { GeneralLedgerService } from 'src/app/services/masters/general-ledger/general-ledger.service';
import { SharedService } from 'src/app/services/shared.service';


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

export interface UiGuarantor {
  id: number,
  accountId: number,
  srNo: number,
  customerId: string,
  customerNumber: string,
  customerName: string,
  active: number,
  createdBy: string,
  status: string
}

export interface ILoanAccountModel {
  AccountsId: number;
  BranchCode: number;
  CustomerId: number;
  Code1: number;
  Code2: number;
  AccountNo: string;
  AccountType: number;
  AccountStatus: number;
  LoanAccountId: number;
  ModeOfOperation: number;
  ModeOfSignature: number;
  StaffCode: string;
  ContactPerson: string;
  OpenDate: Date;
  LastInterestDate: Date;
  LastTransactionDate: Date;
  CloseFlag: number;
  CloseDate: Date;
  CasteId: number;
  PurposeId: number;
  PriorityId: number;
  Ref_Dir: string;
  HealthId: number;
  CategoryId: number;
  InsuranceDate: Date;
  SanctionAmount: number;
  SanctionDate: Date;
  FirstInstallmentDate: Date;
  InstallmentType: string;
  LoanTenure: number;
  PeriodExt: number;
  PeriodDays: number;
  DocNo: string;
  DocDate: Date;
  AdvanceAmount: number;
  ExtInst: number;
  Other: string;
  SanctionBy: string;
  InstWithInt: string;
  RateApplicable: string;
  IntroBy: string;
  Active: number;
  CreatedBy: string;
  CreatedDate: Date;
  GuarantorList: IGuatantorModel[];
  JointList: IJointModel[];
}

export interface IGuatantorModel {
  Id: number;
  AccountId: number;
  SrNo: number;
  CustomerId: number;
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
  // parametersForm!: FormGroup;
  jointForm!: FormGroup;
  guarantorForm!: FormGroup;

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


  uiChangesInInterestRateYN: any[] = [];
  uiInstallmentWithInterestYN: any[] = [];
  uiInstallmentTypes: any[] = [];

  selectedLoanType = 2;
  selectedCustomerId = 0;

  isJointAccount = false;
  isLoanAccountSelected = true;
  isInstallmenTypeLoan = false;
  isGoadLoan = false;
  isDepositLoan = false;
  isFDInstallmenLoan = false;

  uiCustomers: any[] = [];
  uiJointCustomers: any[] = [];
  uiGuarantorCustomers: any[] = [];
  uiSecurityTypes: any[] = [];
  uiDirectors: any[] = [];

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

  constructor(private router: Router, private _sharedService: SharedService, private _toastrService: ToastrService,
    private _generalLedgerService: GeneralLedgerService, private _customerService: CustomerService,
    private _loanAccountsService: LoanAccountsService,
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
      //loanType: new FormControl(this.uiLoanTypes[0].constantNo, [Validators.required]),
      insuranceDate: new FormControl(formatDate(new Date(Date.now()), 'yyyy-MM-dd', 'en'), [Validators.required]),
      contactPerson: new FormControl("", [Validators.required]),
      lastInterestDate: new FormControl(formatDate(new Date(Date.now()), 'yyyy-MM-dd', 'en'), [Validators.required]),
      lastTransactionDate: new FormControl(formatDate(new Date(Date.now()), 'yyyy-MM-dd', 'en'), [Validators.required]),
      // lastPenalDate: new FormControl(formatDate(new Date(Date.now()), 'yyyy-MM-dd', 'en'), [Validators.required]),
      accountCloseDate: new FormControl("", []),
      close_Flag: new FormControl(false, [])
    });

    // this.parametersForm = new FormGroup({
    //   sactionAmount: new FormControl(0 , [Validators.required]),
    //   sactionAmountFormatted: new FormControl(new Intl.NumberFormat('en-IN',{ style: 'decimal' }).format(0), [Validators.required]),
    //   sactionDate: new FormControl(formatDate(new Date(Date.now()), 'yyyy-MM-dd', 'en'), [Validators.required]),
    //   sanctionBy: new FormControl(0, [Validators.required]),
    //   loanTenureInMonths: new FormControl("", [Validators.required]),
    //   interestRate: new FormControl("", [Validators.required]),
    //   amountAdvances: new FormControl("", [Validators.required]),
    //   changesInInterestApplicable: new FormControl(this.uiChangesInInterestRateYN[0].code, [Validators.required]),
    //   maturityDate: new FormControl(formatDate(new Date(Date.now()), 'yyyy-MM-dd', 'en'), [Validators.required]),
    //   resolutionNo: new FormControl("", [Validators.required]),
    //   resolutionDate: new FormControl(formatDate(new Date(Date.now()), 'yyyy-MM-dd', 'en'), [Validators.required]),
    //   firstInstallmentDate: new FormControl(formatDate(new Date().setDate(new Date().getDate() + 30), 'yyyy-MM-dd', 'en'), [Validators.required]),
    //   installmentType: new FormControl("", [Validators.required]),
    // });

    this.jointForm = new FormGroup({
      jointCustomers: new FormControl("", []),
      operativeInstruction: new FormControl("", []),
    });

    this.guarantorForm = new FormGroup({
      guarantorCustomers: new FormControl("", []),
    });

    this.getGeneralLedgers().then(result => {
      if (result) {

        this.loadForm();

        // this.getSecurities().then(sResult => {
        //   if (sResult) {
          // this.getDirectors().then(dResult => {
          //   if (dResult) {
          //     this.loadForm();
          //   }
          // }).catch(error => {
          //   this._toastrService.error('Error loading general ledgers', 'Error!');
          // });
        //   }
        // }).catch(error => {
        //   this._toastrService.error('Error loading security types', 'Error!');
        // });
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

  // getSecurities() {
  //   return new Promise((resolve, reject) => {
  //     this._accountsService.getSecurities().subscribe((data: any) => {
  //       console.log(data);
  //       if (data) {
  //         this.uiSecurityTypes = data.data.data;
  //         // if (this.uiSecurityTypes && this.uiSecurityTypes.length) {
  //         //   this.securityForm.patchValue({
  //         //     securityType: this.uiSecurityTypes[0].id
  //         //   })
  //         // }
  //         resolve(true);
  //       }
  //       else {
  //         resolve(false);
  //       }
  //     })
  //   })
  // }

  // getDirectors() {
  //   return new Promise((resolve, reject) => {
  //     this._accountsService.getDirectors().subscribe((data: any) => {
  //       console.log(data);
  //       if (data) {
  //         this.uiDirectors = data.data.data;
  //         // if (this.uiDirectors && this.uiDirectors.length) {
  //         //   this.parametersForm.patchValue({
  //         //     sanctionBy: this.uiDirectors[0].id
  //         //   })
  //         // }
  //         resolve(true);
  //       }
  //       else {
  //         resolve(false);
  //       }
  //     })
  //   })
  // }


  loadForm() {
    this._loanAccountsService.getDTO().subscribe(obj => this.dto = obj);
    if (this.dto) {
      this.accountsId = this.dto.id;
      if (this.accountsId == 0 || this.accountsId == undefined) {
        this.isAddMode = true;
      }
      else {
        this.isAddMode = false;
        this._loanAccountsService.getLoanAccount(this.accountsId).subscribe((data: any) => {
          console.log(data);
          if (data) {
            if (data.statusCode == 200 && data.data.data) {
              var loanAccount = data.data.data;

              this.selectCustomer(loanAccount.customerId);

              // bind general ledger
              let gl = this.uiAllGeneralLedgers.filter(g => g.code == loanAccount.code1);

              this.summaryForm.patchValue({
                generalLedger: gl && gl.length ? gl[0] : null,
                glAccountNumberStr: loanAccount.accountNo,
                glAccountNumber: loanAccount.code2,
                customerId: loanAccount.customerId,
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
                accountType: loanAccount.accountType,
                modeOfOperation: loanAccount.modeOfOperation,
                modeOfSignature: loanAccount.modeOfSignature,
                staffDirectorOther: loanAccount.staffCode,
                accountStatus: loanAccount.accountStatus,
                contactPerson: loanAccount.contactPerson,
                accountOpeningDate : loanAccount.openDate? formatDate(new Date(loanAccount.openDate), 'yyyy-MM-dd', 'en'): formatDate(new Date(Date.now()), 'yyyy-MM-dd', 'en'),
                insuranceDate : loanAccount.insuranceDate? formatDate(new Date(loanAccount.insuranceDate), 'yyyy-MM-dd', 'en'): formatDate(new Date(Date.now()), 'yyyy-MM-dd', 'en'),
                lastTransactionDate: loanAccount.last_Trn_Date? formatDate(new Date(loanAccount.last_Trn_Date), 'yyyy-MM-dd', 'en'): formatDate(new Date(Date.now()), 'yyyy-MM-dd', 'en'),
                matureDate: loanAccount.last_Trn_Date? formatDate(new Date(loanAccount.exp_Date), 'yyyy-MM-dd', 'en'): formatDate(new Date(Date.now()), 'yyyy-MM-dd', 'en'),
                lastInterestDate:loanAccount.last_Int_Date? formatDate(new Date(loanAccount.last_Int_Date), 'yyyy-MM-dd', 'en'): formatDate(new Date(Date.now()), 'yyyy-MM-dd', 'en'),
                // lastPenalDate:loanAccount.lastPenalDate? formatDate(new Date(loanAccount.last_Int_Date), 'yyyy-MM-dd', 'en'): formatDate(new Date(Date.now()), 'yyyy-MM-dd', 'en'),
                accountCloseDate: loanAccount.closeDate? formatDate(new Date(loanAccount.closeDate), 'yyyy-MM-dd', 'en'): "",
                close_Flag: loanAccount.closeDate ? true: false
              })


              // accountType: new FormControl(this.uiAccountTypes[0].constantNo, [Validators.required]),
              // modeOfOperation: new FormControl(this.uiModeOfOperations[0].constantNo, [Validators.required]),
              // modeOfSignature: new FormControl(this.uiModeOfOperations[0].constantNo, [Validators.required]),
              // staffDirectorOther: new FormControl(this.uiEmployyeTypes[0].code, [Validators.required]),
              // accountStatus: new FormControl(this.uiAccountStatuses[0].constantNo, [Validators.required]),
              // accountOpeningDate: new FormControl(formatDate(new Date(Date.now()), 'yyyy-MM-dd', 'en'), [Validators.required]),
              // //loanType: new FormControl(this.uiLoanTypes[0].constantNo, [Validators.required]),
              // insuranceDate: new FormControl(formatDate(new Date(Date.now()), 'yyyy-MM-dd', 'en'), [Validators.required]),
              // contactPerson: new FormControl("", [Validators.required]),
              // lastInterestDate: new FormControl(formatDate(new Date(Date.now()), 'yyyy-MM-dd', 'en'), [Validators.required]),
              // lastTransactionDate: new FormControl(formatDate(new Date(Date.now()), 'yyyy-MM-dd', 'en'), [Validators.required]),
              // lastPenalDate: new FormControl(formatDate(new Date(Date.now()), 'yyyy-MM-dd', 'en'), [Validators.required]),
              // accountCloseDate: new FormControl("", []),
              // close_Flag: new FormControl(false, [])

              

              // this.parametersForm.patchValue({
              //   interestRateParam: loanAccount.int_Rate,
              //   ledgerNumber: loanAccount.ledgerNumber,
              //   minimumBalance: loanAccount.minimumBalance,
              //   additionalBalance: loanAccount.additionalBalance,
              //   form60: loanAccount.form60,
              //   form61: loanAccount.form61,
              //   tds: loanAccount.tdS_YN ? 'Y' : 'N',
              //   tdsReason: loanAccount.tdS_Reason_Code,
              // })

              if (loanAccount.guarantorList && loanAccount.guarantorList.length) {
                loanAccount.guarantorList.forEach((guarantor: any) => {

                  let uiGuatantorCust = {} as UiGuarantor;
                  uiGuatantorCust.accountId = guarantor.accountId;
                  uiGuatantorCust.id = guarantor.id;
                  uiGuatantorCust.customerId = guarantor.customerId;
                  uiGuatantorCust.customerNumber = guarantor.customerCodeStr;
                  uiGuatantorCust.customerName = guarantor.custName;
                  //uiJointCust.status = "A";
                  uiGuatantorCust.srNo = this.uiSelectedGuarantorCustomers.length;
                  this.uiSelectedGuarantorCustomers.push(uiGuatantorCust);
                });
              }

              //depositAccount.jointList
              if (loanAccount.jointList && loanAccount.jointList.length) {

                loanAccount.jointList.forEach((joint: any) => {
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

              this.isJointAccount = (loanAccount.accountType == 2); // TODO: Need to make it configurable
            }
          }
        })
      }
    }
  }

  changeGeneralLedger(event: any) {
    let glValue = event.value;
    if (glValue) {
      this.getMaxAccountNumber(glValue.code);
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

        this._loanAccountsService.customerName = customer.custName;
        this._loanAccountsService.customerCodeStr = customer.customerCodeStr;
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
        uiJointCust.status = "A";
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

              let uiGuarantorCust = {} as UiGuarantor;
              uiGuarantorCust.accountId = 0;
              uiGuarantorCust.id = 0;
              uiGuarantorCust.customerId = customer.id;
              uiGuarantorCust.customerNumber = customer.customerCodeStr;
              uiGuarantorCust.customerName = customer.custName;
              uiGuarantorCust.status = "A";
              uiGuarantorCust.createdBy = this._sharedService.applicationUser.userName;
              uiGuarantorCust.srNo = this.uiSelectedGuarantorCustomers.length;
              this.uiSelectedGuarantorCustomers.push(uiGuarantorCust);

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
      this._loanAccountsService.jointCustomerToDelete = customer.customerId;
    }
  }

  deleteGuarantorCustomer(customer: any) {
    if (customer) {
      this._loanAccountsService.guarantorCustomerToDelete = customer.customerId;
    }
  }

  onJointDelete() {
    let customerIdToDelete = this._loanAccountsService.jointCustomerToDelete;
    if (customerIdToDelete > 0) {

      let customers = this.uiSelectedJointCustomers.filter(c => c.customerId == customerIdToDelete);
      if (customers && customers.length) {
        customers[0].status = "D";
      }
    }
  }

  onGuarantorDelete() {
    let customerIdToDelete = this._loanAccountsService.guarantorCustomerToDelete;
    if (customerIdToDelete > 0) {

      let customers = this.uiSelectedGuarantorCustomers.filter(c => c.customerId == customerIdToDelete);
      if (customers && customers.length) {
        customers[0].status = "D";
      }
    }
  }

  cancelJointDelete() {
    this._loanAccountsService.jointCustomerToDelete = -1;
  }

  cancelGuarantorDelete() {
    this._loanAccountsService.guarantorCustomerToDelete = -1;
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
        this.isJointAccount = false;
        if (parseInt(accountType[1]) == 2) { //TODO: Need to make it configurable
          this.isJointAccount = true;
        }
      }
    }
  }

  // selectLoanType(event: any) {
  //   if (event) {
  //     if (event.target.value) {
  //       let targetValue = event.target.value;
  //       let loanType = targetValue.split(":");
  //       this.isJointAccount = true;
  //       this.selectedLoanType = parseInt(loanType[1]);
  //     }
  //   }
  // }

  selectAccountStatus(event: any) {
    if (event) {
      if (event.target.value) {
        let targetValue = event.target.value;
        let accountType = targetValue.split(":");
        //this.isJointAccount = true;
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
    // if (this.securityForm.invalid) {
    //   for (const control of Object.keys(this.securityForm.controls)) {
    //     this.securityForm.controls[control].markAsTouched();
    //   }
    //   return false;
    // }
    return true;
  }


  addSecurity() {
    // if (this.validSecurityForm()) {

    //   // Check existing nomini with name and relation
    //   let securityIndex = this.uiSecurities.findIndex(security =>
    //     security.security.toLowerCase() == this.security.value.toLowerCase());

    //   let totalPercentage = this.uiSecurities.reduce((sum, security) => sum + parseInt(security.percentage), 0);
    //   if (securityIndex > -1) {
    //     totalPercentage = totalPercentage - this.uiSecurities[securityIndex].percentage;
    //   }
    //   if (totalPercentage >= 100) {
    //     this._toastrService.warning('Total percentage for security exceeded.', 'Warning!');
    //     return;
    //   }
    //   if (parseFloat(this.percentage.value) + totalPercentage > 100) {
    //     this._toastrService.warning('Total percentage for security exceeded.', 'Warning!');
    //     return;
    //   }

    //   if (securityIndex > -1) {
    //     let uiSecurity = this.uiSecurities[securityIndex];

    //     uiSecurity.customerId = this.selectedCustomerId;
    //     uiSecurity.securityType = this.securityType.value.toString();
    //     uiSecurity.security = this.security.value.toString();
    //     uiSecurity.securityValue == this.securityValue.value.toString();
    //     uiSecurity.securityDescription = this.securityDescription.value.toString();
    //     uiSecurity.percentage = this.percentage.value.toString();
    //     uiSecurity.createdBy = this._sharedService.applicationUser.userName;
    //     uiSecurity.modifiedBy = this._sharedService.applicationUser.userName;
    //     uiSecurity.status = 'M';
    //   }
    //   else {
    //     let uiSecurity = {} as UiSecurity;
    //     uiSecurity.id = 0;
    //     uiSecurity.srNo = this.uiSecurities.length + 1;
    //     uiSecurity.securityType = this.securityType.value.toString();
    //     uiSecurity.security = this.security.value.toString();
    //     uiSecurity.securityValue == this.securityValue.value.toString();
    //     uiSecurity.securityDescription = this.securityDescription.value.toString();
    //     uiSecurity.percentage = this.percentage.value.toString();
    //     uiSecurity.percentage = this.percentage.value.toString();
    //     uiSecurity.createdBy = this._sharedService.applicationUser.userName;
    //     uiSecurity.modifiedBy = this._sharedService.applicationUser.userName;
    //     uiSecurity.status = 'A';
    //     this.uiSecurities.push(uiSecurity);
    //   }
    // }
  }

  editSecurity(uiSecurity: any, index: number) {
    // this.securityForm.patchValue({
    //   securityType: uiSecurity.securityType,
    //   security: uiSecurity.security,
    //   securityValue: uiSecurity.securityValue,
    //   securityDescription: uiSecurity.securityDescription,
    //   percentage: uiSecurity.percentage
    // });
  }

  deleteSecurity(uiSecurity: any, index: number) {
    uiSecurity.status = 'D';
  }

  clearSecurity() {
    // this.securityForm.patchValue({
    //   securityType: "",
    //   security: "",
    //   securityValue: "",
    //   securityDescription: "",
    //   percentage: "",
    // });
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
    // if (this.parametersForm.invalid) {
    //   for (const control of Object.keys(this.parametersForm.controls)) {
    //     this.parametersForm.controls[control].markAsTouched();
    //   }
    //   return false;
    // }
    return true;
  }

  validGuarantorDetails() {
    return this.uiSelectedGuarantorCustomers && this.uiSelectedGuarantorCustomers.length > 0;
  }

  validJointDetails() {
    if (this.isJointAccount) {
      return (this.uiSelectedJointCustomers && this.uiSelectedJointCustomers.length > 0);
    }
    return true;
  }

  saveLoanAccount() {
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
    // if (!this.validParameters()) {
    //   this._toastrService.error('Please enter paramater details.', 'Error!');
    //   return;
    // }
    if (!this.validGuarantorDetails()) {
      this._toastrService.error('Please enter nominee details.', 'Error!');
      return;
    }
    if (!this.validJointDetails()) {
      this._toastrService.error('Please enter joint customer details.', 'Error!');
      return;
    }

    // add values into model
    let accountModel = {} as ILoanAccountModel;
    accountModel.AccountsId = this.dto.id;;
    accountModel.BranchCode = this._sharedService.applicationUser.branchId;
    accountModel.CustomerId = parseInt(this.customerId.value.toString());
    accountModel.Code1 = parseInt(this.generalLedger.value.code.toString());
    accountModel.Code2 = parseInt(this.glAccountNumber.value.toString());
    accountModel.AccountNo = this.glAccountNumberStr.value.toString()
    accountModel.AccountType = parseInt(this.accountType.value.toString());
    accountModel.AccountStatus= parseInt(this.accountStatus.value.toString());
    accountModel.LoanAccountId = 0;
    accountModel.ModeOfOperation = parseInt(this.modeOfOperation.value.toString());
    accountModel.ModeOfSignature = parseInt(this.modeOfSignature.value.toString());
    accountModel.StaffCode = this.staffDirectorOther.value.toString();
    accountModel.ContactPerson = this.contactPerson.value.toString();
    accountModel.OpenDate = this.accountOpeningDate.value.toString();
    accountModel.LastInterestDate = this.lastInterestDate.value.toString();
    accountModel.LastTransactionDate = this.lastTransactionDate.value.toString();
    //accountModel.CloseFlag: number;
    if (this.close_Flag.value) {
      accountModel.CloseDate = this.accountCloseDate.value.toString();
    }  
    
    //accountModel.CasteId: number;
    // accountModel.PurposeId: number;
    // accountModel.PriorityId: number;
    // accountModel.Ref_Dir: string;
    // accountModel.HealthId: number;
    // accountModel.CategoryId: number;
    accountModel.InsuranceDate = this.insuranceDate.value.toString();
    // accountModel.SanctionAmount: number;
    // accountModel.SanctionDate: Date;
    // accountModel.FirstInstallmentDate: Date;
    // accountModel.InstallmentType: string;
    // accountModel.LoanTenure: number;
    // accountModel.PeriodExt: number;
    // accountModel.PeriodDays: number;
    // accountModel.DocNo: string;
    // accountModel.DocDate: Date;
    // accountModel.AdvanceAmount: number;
    // accountModel.ExtInst: number;
    // accountModel.Other: string;
    // accountModel.SanctionBy: string;
    // accountModel.InstWithInt: string;
    // accountModel.RateApplicable: string;
    // accountModel.IntroBy: string;
    // accountModel.Active: number;
    accountModel.CreatedBy = this._sharedService.applicationUser.userName;
    accountModel.GuarantorList = [];
    accountModel.JointList = [];

    let guatantorModel = {} as IGuatantorModel;
    this.uiSelectedGuarantorCustomers.forEach(gurantor => {
      guatantorModel = {} as IGuatantorModel;

      // guatantorModel.Id = gurantor.id;
      guatantorModel.AccountId = this.dto.id;
      guatantorModel.CustomerId = gurantor.customerId;
      guatantorModel.Status = gurantor.status;
      guatantorModel.CreatedBy = gurantor.createdBy;
      accountModel.GuarantorList.push(guatantorModel);
    });

    if (this.isJointAccount) { // If Joint Account
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
    this._loanAccountsService.saveLoanAccount(accountModel).subscribe((data: any) => {
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
      //passbookDate: new FormControl(formatDate(new Date(Date.now()), 'yyyy-MM-dd', 'en'), [Validators.required]),
      lastInterestDate: new FormControl(formatDate(new Date(Date.now()), 'yyyy-MM-dd', 'en'), [Validators.required]),
      lastTransactionDate: new FormControl(formatDate(new Date(Date.now()), 'yyyy-MM-dd', 'en'), [Validators.required]),
      printDate: new FormControl(formatDate(new Date(Date.now()), 'yyyy-MM-dd', 'en'), [Validators.required]),
      accountCloseDate: "",
      close_Flag: false
    })
  }
  clearParametersDetails() {
    // this.parametersForm.patchValue({
    //   interestRateParam: "",
    //   ledgerNumber: "",
    //   minimumBalance: "",
    //   currency: this.uiCurrencies[0].currencyId,
    //   otherBranchTransfer: this.uiTDSOptions[0].code,
    // })
  }

  clearJointDetails() {
    this.jointForm.patchValue({
      jointCustomers: [],
      operativeInstruction: "",
    })
  }

  accountDetails()
  {
     this.configClick("loan-details");
  }

  // Customers

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

  // Summary

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

  // Account

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
  // get loanType() {
  //   return this.accountForm.get('loanType')!;
  // }

  get insuranceDate() {
    return this.accountForm.get('insuranceDate')!;
  }
  get contactPerson() {
    return this.accountForm.get('contactPerson')!;
  }
  // get passbookDate() {
  //   return this.accountForm.get('passbookDate')!;
  // }
  get accountCloseDate() {
    return this.accountForm.get('accountCloseDate')!;
  }
  get lastInterestDate() {
    return this.accountForm.get('lastInterestDate')!;
  }
  get lastTransactionDate() {
    return this.accountForm.get('lastTransactionDate')!;
  }
  // get lastPenalDate() {
  //   return this.accountForm.get('lastPenalDate')!;
  // }
  get close_Flag() {
    return this.accountForm.get('close_Flag')!;
  }

  // Parameters

  // get sactionAmount() {
  //   return this.parametersForm.get('sactionAmount')!;
  // }
  // get sactionAmountFormatted() {
  //   return this.parametersForm.get('sactionAmountFormatted')!;
  // }
  // get sactionDate() {
  //   return this.parametersForm.get('sactionDate')!;
  // }
  // get sanctionBy() {
  //   return this.parametersForm.get('sanctionBy')!;
  // }
  // get loanTenureInMonths() {
  //   return this.parametersForm.get('loanTenureInMonths')!;
  // }
  // get interestRate() {
  //   return this.parametersForm.get('interestRate')!;
  // }
  // get amountAdvances() {
  //   return this.parametersForm.get('amountAdvances')!;
  // }
  // get changesInInterestApplicable() {
  //   return this.parametersForm.get('changesInInterestApplicable')!;
  // }
  // get maturityDate() {
  //   return this.parametersForm.get('maturityDate')!;
  // }
  // get resolutionNo() {
  //   return this.parametersForm.get('resolutionNo')!;
  // }
  // get resolutionDate() {
  //   return this.parametersForm.get('resolutionDate')!;
  // }
  // get firstInstallmentDate() {
  //   return this.parametersForm.get('firstInstallmentDate')!;
  // }
  // get installmentType() {
  //   return this.parametersForm.get('installmentType')!;
  // }

  // Joint

  get jointCustomers() {
    return this.jointForm.get('jointCustomers')!;
  }

  get operativeInstruction() {
    return this.jointForm.get('operativeInstruction')!;
  }

  // Guarantor

  get guarantorCustomers() {
    return this.guarantorForm.get('guarantorCustomers')!;
  }

  // 
  configClick(routeValue: string) {
    sessionStorage.setItem("configMenu", routeValue);
    this.router.navigate(['/app/' + routeValue]);
  }
}
