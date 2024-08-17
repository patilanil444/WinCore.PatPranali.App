import { formatDate } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxDropdownConfig } from 'ngx-select-dropdown';
import { ToastrService } from 'ngx-toastr';
import { AccountDeclarations } from 'src/app/common/account-declarations';
import { IGeneralDTO, UiEnumGeneralMaster } from 'src/app/common/models/common-ui-models';
import { AccountsService } from 'src/app/services/accounts/accounts/accounts.service';
import { DepositAccountService } from 'src/app/services/accounts/deposit-accounts/deposit-account.service';
import { CustomerService } from 'src/app/services/customers/customer/customer.service';
import { GeneralLedgerService } from 'src/app/services/masters/general-ledger/general-ledger.service';
import { SharedService } from 'src/app/services/shared.service';

export interface UiNomini {
  id: number,
  customerId: number,
  srNo: number,
  nomineeName: string,
  nomineeAddress: string,
  birthDate: Date,
  relation: number,
  relationName: string,
  guardian: string,
  active: number,
  percentage: string,
  phone: string,
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

export interface IDepositAccountModel {
  AccountsId: number;
  BranchCode: number;
  CustomerId: number;
  Code1: number;
  Code2: number;
  AccountNo: string;
  AccountType: number;
  AccountStatus: number;
  FdDetailId: number;
  ReceiptNo: string;
  ModeOfOperation: number;
  StaffCode: string;
  PassbookDate: Date;
  DebitInterestDate: Date;
  // LedgerNumber: string;
  // AdditionalBalance: number;
  // Form60: string;
  // Form61: string;
  // MinimumBalance: number;
  RenewalOnDate: Date;
  TDays: number;
  TMonths: number;
  TYears: number;
  Reinv_Flag: boolean;
  Inst_Amt: number;
  Inst_No: number;
  Inst_Type: string;
  FD_Amt: number;
  Payb_Amt: number;
  Opn_Date: Date;
  Exp_Date: Date;
  Last_Int_Date: Date;
  Last_Trn_Date: Date;
  Close_Flag: number;
  Close_Date: Date;
  Int_Rate: number;
  RenewalYN: boolean;
  TDS_YN: boolean;
  TDS_Reason_Code: number;
  Ac_Statement_Freq: number;
  Email_Day_Freq: number;
  Pass_Book_Charges: number;
  MinBal_Charges: boolean;
  Service_Charges: boolean;
  PrintCount: number;
  Active: number;
  CreatedBy: string;
  CreatedDate: Date;
  BankAccountType: string;
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
  selector: 'app-deposit-accounts',
  templateUrl: './deposit-accounts.component.html',
  styleUrls: ['./deposit-accounts.component.css']
})
export class DepositAccountsComponent {
  customerDetailsForm!: FormGroup;
  summaryForm!: FormGroup;
  accountForm!: FormGroup;
  // parametersForm!: FormGroup;
  nominiForm!: FormGroup;
  jointForm!: FormGroup;
  fdDetailsForm!: FormGroup;
  rdDetailsForm!: FormGroup;

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
  uiDepositGeneralLedgers: any[] = [];
  uiAccountTypes: any[] = [];
  uiModeOfOperations: any[] = [];
  uiEmployyeTypes: any[] = [];
  uiRelations: any[] = [];
  uiOccupations: any[] = [];
  uiCustomerGroups: any[] = [];
  uiZones: any[] = [];
  uiTDSOptions: any[] = [];
  uiTDSReasons: any[] = [];
  uiForm60Options: any[] = [];
  uiForm61Options: any[] = [];
  uiInstallmentTypes: any[] = [];
  uiRenewalTypes: any[] = [];
  uiAccountStatuses:any[] = [];

  // toggleSearchCustomers = false;
  // toggleSearchJointCustomers = false;
  isNotJointAccount = true;
  isFDAccount = false;
  isRDAccount = false;

  selectedCustomerId = 0;

  uiCustomers: any[] = [];
  uiJointCustomers: any[] = [];
  uiNominis: any[] = [];

  uiSelectedJointCustomers: any[] = [];

  p_nomini: number = 1;
  total_nomini: number = 0;
  dto: IGeneralDTO = {} as IGeneralDTO;
  accountsId!: number;
  isAddMode = true;

  constructor(private router: Router, private _sharedService: SharedService, private _toastrService: ToastrService,
    private _generalLedgerService: GeneralLedgerService, private _customerService: CustomerService,
    private _depositAccountService: DepositAccountService, private _accountsService: AccountsService ) { }

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
    this.uiForm60Options = AccountDeclarations.form60YN;
    this.uiForm61Options = AccountDeclarations.form61YN;
    this.uiInstallmentTypes = AccountDeclarations.installmentTypes;
    this.uiRenewalTypes = AccountDeclarations.renewalTypes
    this.uiAccountStatuses =  this.retrieveMasters(UiEnumGeneralMaster.ACSTATUS);

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
      staffDirectorOther: new FormControl(this.uiEmployyeTypes[0].code, [Validators.required]),
      //accountOpeningDate: new FormControl(formatDate(new Date(Date.now()), 'yyyy-MM-dd', 'en'), [Validators.required]),
      lastTransactionDate: new FormControl(formatDate(new Date(Date.now()), 'yyyy-MM-dd', 'en'), [Validators.required]),
      accountStatus: new FormControl(this.uiAccountStatuses[0].constantNo, [Validators.required]),
      passbookDate: new FormControl(formatDate(new Date(Date.now()), 'yyyy-MM-dd', 'en'), [Validators.required]),
      // matureDate: new FormControl(formatDate(new Date(Date.now()), 'yyyy-MM-dd', 'en'), [Validators.required]),
      lastInterestDate: new FormControl(formatDate(new Date(Date.now()), 'yyyy-MM-dd', 'en'), [Validators.required]),
      drInterestDate: new FormControl(formatDate(new Date(Date.now()), 'yyyy-MM-dd', 'en'), [Validators.required]),
    });

    // this.parametersForm = new FormGroup({
    //   interestRateParam: new FormControl("", [Validators.required]),
    //   ledgerNumber: new FormControl("", []),
    //   //introducedByGI: new FormControl("", []),
    //   minimumBalance: new FormControl("", [Validators.required]),
    //   additionalBalance: new FormControl("", [Validators.required]),
    //   form60: new FormControl(this.uiForm60Options[0].code, [Validators.required]),
    //   form61: new FormControl(this.uiForm61Options[0].code, [Validators.required]),
    //   tds: new FormControl(this.uiTDSOptions[0].code, [Validators.required]),
    //   tdsReason: new FormControl(this.uiTDSReasons[0].constantNo, [Validators.required]),
    // });

    this.nominiForm = new FormGroup({
      nominiName: new FormControl("", []),
      relation: new FormControl(this.uiRelations[0].constantNo, []),
      percentage: new FormControl("", []),
      guardian: new FormControl("", []),
      nomineeAddress: new FormControl("", []),
    });

    this.jointForm = new FormGroup({
      jointCustomers: new FormControl("", []),
      operativeInstruction: new FormControl("", []),
    });

    this.fdDetailsForm = new FormGroup({
      slipNo: new FormControl("", [Validators.required]),
      renewFD: new FormControl(this.uiRenewalTypes[0].code, [Validators.required]),
      fdOpeningDate: new FormControl(formatDate(new Date(Date.now()), 'yyyy-MM-dd', 'en'), [Validators.required]),
      renewalOnDate: new FormControl(formatDate(new Date(Date.now()), 'yyyy-MM-dd', 'en'), [Validators.required]),
      fdMatureDate: new FormControl(formatDate(new Date(Date.now()), 'yyyy-MM-dd', 'en'), [Validators.required]),
      days: new FormControl("", [Validators.required]),
      months: new FormControl("", [Validators.required]),
      years: new FormControl("", [Validators.required]),
      fdAmount: new FormControl("", [Validators.required]),
      interestRateFD: new FormControl("", [Validators.required]),
      fdPayableAmount: new FormControl("", [Validators.required]),
      fdPrintedFor: new FormControl("", [Validators.required]),
    });

    this.rdDetailsForm = new FormGroup({
      installmentType: new FormControl(this.uiInstallmentTypes[0].code, [Validators.required]),
      installmentAmount: new FormControl("", [Validators.required]),
      rdOpeningDate: new FormControl(formatDate(new Date(Date.now()), 'yyyy-MM-dd', 'en'), [Validators.required]),
      noOfInstallments: new FormControl("", [Validators.required]),
      interestRateRD: new FormControl("", [Validators.required]),
      rdMatureDate: new FormControl(formatDate(new Date(Date.now()), 'yyyy-MM-dd', 'en'), [Validators.required]),
      rdPaybleAmount: new FormControl("", [Validators.required])
    });

    this.getGeneralLedgers().then(result => {
      if (result) {
        this.loadForm();
      }
    }).catch(error => {
      this._toastrService.error('Error loading general ledgers', 'Warning!');
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

            this.uiDepositGeneralLedgers = this.uiAllGeneralLedgers.filter(gl => gl.glGroup == 'D' && gl.glType != 'S');
            resolve(true);
          }
        }
        else {
          resolve(false);
        }
      })
    })
  }

  loadForm() {
    this._depositAccountService.getDTO().subscribe(obj => this.dto = obj);
    if (this.dto) {
      this.accountsId = this.dto.id;
      if (this.accountsId == 0 || this.accountsId == undefined) {
        this.isAddMode = true;

      }
      else {
        this.isAddMode = false;
        this._depositAccountService.getDepositAccount(this.accountsId).subscribe((data: any) => {
          console.log(data);
          if (data) {
            if (data.statusCode == 200 && data.data.data) {
              var depositAccount = data.data.data;

              this.selectCustomer(depositAccount.customerId);

              // bind general ledger
              let gl = this.uiAllGeneralLedgers.filter(g => g.code == depositAccount.code1);

              this.summaryForm.patchValue({
                generalLedger: gl && gl.length ? gl[0] : null,
                glAccountNumberStr: depositAccount.accountNo,
                glAccountNumber: depositAccount.code2,
                customerId: depositAccount.customerId,
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
                accountType: depositAccount.accountType,
                modeOfOperation: depositAccount.modeOfOperation,
                staffDirectorOther: depositAccount.staffCode,
                //accountOpeningDate: formatDate(new Date(depositAccount.opn_Date), 'yyyy-MM-dd', 'en'),
                lastTransactionDate: formatDate(new Date(depositAccount.last_Trn_Date), 'yyyy-MM-dd', 'en'),
                accountStatus: depositAccount.accountStatus,
                passbookDate: formatDate(new Date(depositAccount.passbookDate), 'yyyy-MM-dd', 'en'),
                // matureDate: formatDate(new Date(depositAccount.exp_Date), 'yyyy-MM-dd', 'en'),
                lastInterestDate: formatDate(new Date(depositAccount.last_Int_Date), 'yyyy-MM-dd', 'en'),
                drInterestDate: formatDate(new Date(depositAccount.debitInterestDate), 'yyyy-MM-dd', 'en')
              })

              // this.parametersForm.patchValue({
              //   interestRateParam: depositAccount.int_Rate,
              //   ledgerNumber: depositAccount.ledgerNumber,
              //   minimumBalance: depositAccount.minimumBalance,
              //   additionalBalance: depositAccount.additionalBalance,
              //   form60: depositAccount.form60,
              //   form61: depositAccount.form61,
              //   tds: depositAccount.tdS_YN ? 'Y' : 'N',
              //   tdsReason: depositAccount.tdS_Reason_Code,
              // })

              // depositAccount.nomineeList
              if (depositAccount.nomineeList && depositAccount.nomineeList.length) {
                let relationName = "";
                depositAccount.nomineeList.forEach((nominee: any) => {
                  let uiNominee: any = {};
                  let uiRelation = this.uiRelations.filter(r => r.constantNo == parseInt(nominee.relation));
                  if (uiRelation) {
                    relationName = (uiRelation && uiRelation.length > 0) ? uiRelation[0].constantname : "";
                  }

                  uiNominee.id = nominee.id;
                  uiNominee.accountId = nominee.accountsId;
                  uiNominee.customerId = depositAccount.customerId;
                  uiNominee.nomineeName = nominee.nomineeName;
                  uiNominee.nomineeAddress = nominee.nomineeAddress;
                  uiNominee.relation = nominee.relation;
                  uiNominee.relationName = relationName;
                  uiNominee.guardian = nominee.guardian;
                  uiNominee.percentage = nominee.percentage;
                  uiNominee.createdBy = nominee.createdBy;
                  uiNominee.status = '';
                  this.uiNominis.push(uiNominee);
                });
              }

              //depositAccount.jointList
              if (depositAccount.jointList && depositAccount.jointList.length) {

                depositAccount.jointList.forEach((joint: any) => {
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

              this.isFDAccount = depositAccount.glGroup == 'D' && depositAccount.glType == 'F';
              this.isRDAccount = depositAccount.glGroup == 'D' && depositAccount.glType == 'R';
              this.isNotJointAccount = !(depositAccount.accountType == 2); // TODO: Need to make it configurable

              if (this.isFDAccount) {
                this.fdDetailsForm.patchValue({
                  slipNo: depositAccount.receiptNo,
                  renewFD: depositAccount.renewalYN ? 'Y' : 'N',
                  fdOpeningDate: formatDate(new Date(depositAccount.opn_Date), 'yyyy-MM-dd', 'en'),
                  renewalOnDate: formatDate(new Date(depositAccount.renewalOnDate), 'yyyy-MM-dd', 'en'),
                  fdMatureDate: formatDate(new Date(depositAccount.exp_Date), 'yyyy-MM-dd', 'en'),
                  days: depositAccount.tDays,
                  months: depositAccount.tMonths,
                  years: depositAccount.tYears,
                  fdAmount: depositAccount.fD_Amt,
                  interestRateFD: depositAccount.int_Rate,
                  fdPayableAmount: depositAccount.payb_Amt,
                  fdPrintedFor: depositAccount.printCount,
                })
              }

              if (this.isRDAccount) {
                this.rdDetailsForm.patchValue({
                  installmentType: depositAccount.inst_Type,
                  installmentAmount: depositAccount.inst_Amt,
                  rdOpeningDate: formatDate(new Date(depositAccount.opn_Date), 'yyyy-MM-dd', 'en'),
                  noOfInstallments: depositAccount.inst_No,
                  interestRateRD: depositAccount.int_Rate,
                  rdMatureDate: formatDate(new Date(depositAccount.exp_Date), 'yyyy-MM-dd', 'en'),
                  rdPaybleAmount: depositAccount.payb_Amt,
                })
              }



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
    
    if (custData && custData.status == 'Active') {
      this.selectCustomer(custData.id);
    }

    //this.toggleSearchCustomers = true;
  }

  getCustomersForJoint(custData: any) {
    if (custData && custData.status == 'Active') {
      this.selectJointCustomer(custData);
    }
    // this.toggleSearchJointCustomers = true;
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
        uiJointCust.status = 'A';
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

  deleteJoinCustomer(customer: any) {
    if (customer) {
      this._depositAccountService.jointCustomerToDelete = customer.customerId;
    }
  }

  onJointDelete() {
    let customerIdToDelete = this._depositAccountService.jointCustomerToDelete;
    if (customerIdToDelete > 0) {

      let customers = this.uiSelectedJointCustomers.filter(c => c.customerId == customerIdToDelete);
      if (customers && customers.length) {
        customers[0].status = "D";
      }
    }
  }

  cancelJointDelete() {
    this._depositAccountService.jointCustomerToDelete = -1;
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


  validNominiForm() {
    if (this.nominiForm.invalid) {
      for (const control of Object.keys(this.nominiForm.controls)) {
        this.nominiForm.controls[control].markAsTouched();
      }
      return false;
    }
    return true;
  }

  addNomini() {
    if (this.validNominiForm()) {

      // Check existing nomini with name and relation
      let nominiIndex = this.uiNominis.findIndex(nomini =>
        nomini.nomineeName.toLowerCase() == this.nominiName.value.toLowerCase());

      let totalPercentage = this.uiNominis.reduce((sum, nomini) => sum + parseInt(nomini.percentage), 0);
      if (nominiIndex > -1) {
        totalPercentage = totalPercentage - this.uiNominis[nominiIndex].percentage;
      }
      if (totalPercentage >= 100) {
        this._toastrService.warning('Total percentage for nomini exceeded.', 'Warning!');
        return;
      }
      if (parseFloat(this.percentage.value) + totalPercentage > 100) {
        this._toastrService.warning('Total percentage for nomini exceeded.', 'Warning!');
        return;
      }

      let relationName = "";
      let uiRelation = this.uiRelations.filter(r => r.constantNo == parseInt(this.relation.value.toString()));
      if (uiRelation) {
        relationName = (uiRelation && uiRelation.length > 0) ? uiRelation[0].constantname : "";
      }

      if (nominiIndex > -1) {
        let uiNomini = this.uiNominis[nominiIndex];

        //uiNomini.id = 0;
        uiNomini.customerId = this.selectedCustomerId;
        uiNomini.nomineeName = this.nominiName.value.toString();
        uiNomini.nomineeAddress = this.nomineeAddress.value.toString();
        uiNomini.relation = this.relation.value.toString();
        uiNomini.relationName = relationName;
        uiNomini.guardian = this.guardian.value.toString();
        uiNomini.percentage = this.percentage.value.toString();
        uiNomini.createdBy = this._sharedService.applicationUser.userName;
        uiNomini.modifiedBy = this._sharedService.applicationUser.userName;
        uiNomini.status = 'M';
      }
      else {
        let uiNomini = {} as UiNomini;
        uiNomini.id = 0;
        uiNomini.srNo = this.uiNominis.length + 1;
        uiNomini.nomineeName = this.nominiName.value.toString();
        uiNomini.nomineeAddress = this.nomineeAddress.value.toString();
        uiNomini.relation = this.relation.value.toString();
        uiNomini.relationName = relationName;
        uiNomini.guardian = this.guardian.value.toString();
        uiNomini.percentage = this.percentage.value.toString();
        uiNomini.createdBy = this._sharedService.applicationUser.userName;
        uiNomini.modifiedBy = this._sharedService.applicationUser.userName;
        uiNomini.status = 'A';
        this.uiNominis.push(uiNomini);
      }
    }
  }

  editNomini(uiNomini: any, index: number) {
    this.nominiForm.patchValue({
      nominiName: uiNomini.nomineeName,
      nomineeAddress: uiNomini.nomineeAddress,
      relation: parseInt(uiNomini.relation),
      guardian: uiNomini.guardian,
      percentage: uiNomini.percentage
    });
  }

  deleteNomini(uiNomini: any, index: number) {
    uiNomini.status = 'D';
  }

  clearNomini() {
    this.nominiForm.patchValue({
      nominiName: "",
      nominiAddress: "",
      nominiRelation: this.uiRelations[0].constantNo,
      nominiGuardian: "",
      nominiPercentage: "100",
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

  // validParameters() {
  //   if (this.parametersForm.invalid) {
  //     for (const control of Object.keys(this.parametersForm.controls)) {
  //       this.parametersForm.controls[control].markAsTouched();
  //     }
  //     return false;
  //   }
  //   return true;
  // }

  validNominiDetails() {
    return (this.uiNominis && this.uiNominis.length > 0);
  }

  validJointDetails() {
    if (!this.isNotJointAccount) {
      return (this.uiSelectedJointCustomers && this.uiSelectedJointCustomers.length > 0);
    }
    return true;
  }

  validFDDetails() {
    if (this.fdDetailsForm.invalid) {
      for (const control of Object.keys(this.fdDetailsForm.controls)) {
        this.fdDetailsForm.controls[control].markAsTouched();
      }
      return false;
    }
    return true;
  }

  validRDDetails() {
    if (this.rdDetailsForm.invalid) {
      for (const control of Object.keys(this.rdDetailsForm.controls)) {
        this.rdDetailsForm.controls[control].markAsTouched();
      }
      return false;
    }
    return true;
  }

  saveDepositAccount() {
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
    if (!this.validNominiDetails()) {
      this._toastrService.error('Please enter nominee details.', 'Error!');
      return;
    }
    if (!this.validJointDetails()) {
      this._toastrService.error('Please enter joint customer details.', 'Error!');
      return;
    }
    if (!this.validFDDetails() && !this.validRDDetails()) {
      this._toastrService.error('Please enter either FD or RD details.', 'Error!');
      return;
    }

    // add values into model
    let accountModel = {} as IDepositAccountModel;
    accountModel.AccountsId = this.dto.id;
    accountModel.BranchCode = this._sharedService.applicationUser.branchId;
    accountModel.CustomerId = parseInt(this.customerId.value.toString());
    accountModel.Code1 = parseInt(this.generalLedger.value.code.toString());
    accountModel.Code2 = parseInt(this.glAccountNumber.value.toString());
    accountModel.AccountNo = this.glAccountNumberStr.value.toString()
    accountModel.AccountType = parseInt(this.accountType.value.toString());
    accountModel.AccountStatus= parseInt(this.accountStatus.value.toString());
    accountModel.FdDetailId = 0;
    accountModel.ModeOfOperation = parseInt(this.modeOfOperation.value.toString());
    accountModel.StaffCode = this.staffDirectorOther.value.toString();
    accountModel.PassbookDate = this.passbookDate.value.toString();
    accountModel.DebitInterestDate = this.drInterestDate.value.toString();
    // accountModel.LedgerNumber = this.ledgerNumber.value.toString();
    // accountModel.AdditionalBalance = parseFloat(this.additionalBalance.value.toString());
    // accountModel.Form60 = this.form60.value.toString();
    // accountModel.Form61 = this.form61.value.toString();
    // accountModel.MinimumBalance = parseFloat(this.minimumBalance.value.toString());
    //accountModel.Reinv_Flag = this.renewFD.value.toString();

    if (this.isFDAccount) { // If FD account
      accountModel.Payb_Amt = parseFloat(this.fdPayableAmount.value.toString()); // Or RD 
      accountModel.Opn_Date = this.fdOpeningDate.value.toString();  // Or RD 
      accountModel.Exp_Date = this.fdMatureDate.value.toString();// Or RD 
      accountModel.ReceiptNo = this.slipNo.value.toString();
      accountModel.RenewalYN = this.renewFD.value.toString() == 'Y' ? true : false;
      accountModel.RenewalOnDate = this.renewalOnDate.value.toString();
      accountModel.TDays = parseInt(this.days.value.toString());
      accountModel.TMonths = parseInt(this.months.value.toString());
      accountModel.TYears = parseInt(this.years.value.toString());
      accountModel.FD_Amt = parseFloat(this.fdAmount.value.toString());
      accountModel.Int_Rate = parseFloat(this.interestRateFD.value.toString()); // Or RD 
      accountModel.PrintCount = parseInt(this.fdPrintedFor.value.toString());
      accountModel.Close_Date = this.fdMatureDate.value.toString();
      accountModel.BankAccountType = 'FD';
    }
    else if (this.isRDAccount) // If RD account
    {
      accountModel.Payb_Amt = parseFloat(this.rdPaybleAmount.value.toString());
      accountModel.Opn_Date = this.rdOpeningDate.value.toString();
      accountModel.Exp_Date = this.rdMatureDate.value.toString();
      accountModel.Int_Rate = parseFloat(this.interestRateRD.value.toString());
      accountModel.Inst_Amt = parseFloat(this.installmentAmount.value.toString());
      accountModel.Inst_No = parseInt(this.noOfInstallments.value.toString());
      accountModel.Inst_Type = this.installmentType.value.toString();
      accountModel.Close_Date = this.rdMatureDate.value.toString();
      accountModel.BankAccountType = 'RD';
    }

    accountModel.Last_Int_Date = this.lastInterestDate.value.toString();
    accountModel.Last_Trn_Date = this.lastTransactionDate.value.toString();
    // accountModel.Close_Flag = this.clo.value.toString();
    // accountModel.TDS_YN = this.tds.value.toString() == 'Y' ? true : false;
    // accountModel.TDS_Reason_Code = parseInt(this.tdsReason.value.toString());
    accountModel.CreatedBy = this._sharedService.applicationUser.userName;

    accountModel.NomineeList = [];

    let nominiModel = {} as INominiModel;
    this.uiNominis.forEach(nom => {
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
        //jointModel.SrNo = jointCust.srNo;
        jointModel.CustomerId = jointCust.customerId;
        jointModel.OperativeInstruction = jointCust.operativeInstruction;
        jointModel.Status = jointCust.status;
        jointModel.CreatedBy = jointCust.createdBy;
        accountModel.JointList.push(jointModel);
      });
    }
    // Call API to save account

    this._depositAccountService.saveDepositAccount(accountModel).subscribe((data: any) => {
      console.log(data);
      if (data) {
        if (data.data.data && data.data.data.retId > 0) {
          if (data.data.data.status == "SUCCESS") {
            this._toastrService.success(data.data.data.message, 'Success!');
            this.clear();
            this.configClick("account-search");
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

  calculateMatureDate()
  {
    if (this.years.value || this.months.value || this.days.value) {
      let totalDays = 0;
      if (!isNaN(parseInt(this.years.value))) {
        let today = new Date(this.fdOpeningDate.value);
        let targetDate = new Date(this.fdOpeningDate.value);
        targetDate.setFullYear(today.getFullYear() + parseInt(this.years.value));
        let differenceInTime = Math.abs(targetDate.getTime() - today.getTime());
        let differenceInDays = Math.round(differenceInTime / (1000 * 3600 * 24));
        totalDays = totalDays + differenceInDays;
      }
      if (!isNaN(parseInt(this.months.value))) {
        let today = new Date(this.fdOpeningDate.value);
        let targetDate = new Date(this.fdOpeningDate.value);
        targetDate.setMonth(today.getMonth() + parseInt(this.months.value));
        let differenceInTime = Math.abs(targetDate.getTime() - today.getTime());
        let differenceInDays = Math.round(differenceInTime / (1000 * 3600 * 24));
        totalDays = totalDays + differenceInDays;
      }
      if (!isNaN(parseInt(this.days.value))) {
        let today = new Date(this.fdMatureDate.value);
        let targetDate  = new Date(this.fdMatureDate.value);
        targetDate.setDate(today.getDate() + parseInt(this.days.value));
        let differenceInTime = Math.abs(targetDate.getTime() - today.getTime());
        let differenceInDays = Math.round(differenceInTime / (1000 * 3600 * 24));
        totalDays = totalDays + differenceInDays;
      }

      let maturityDate = new Date(this.fdOpeningDate.value).setDate(totalDays);

      this.fdDetailsForm.patchValue({
        fdMatureDate: formatDate(maturityDate, 'yyyy-MM-dd', 'en'),
        renewalOnDate: formatDate(maturityDate, 'yyyy-MM-dd', 'en'),
      })
    }
  }

  configClick(routeValue: string) {
    sessionStorage.setItem("configMenu", routeValue);
    this.router.navigate(['/app/' + routeValue]);
  }

  clear() {
    this.clearSummaryDetails();
    this.clearCustomerDetails();
    this.clearAccountsDetails();
    //this.clearParametersDetails();
    this.clearNomineeDetails();
    this.clearJointDetails();
    this.clearFDDetails();
    this.clearRDDetails();
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
      dob: formatDate(new Date(Date.now()), 'yyyy-MM-dd', 'en'),
      aadhar: "",
      joiningDate: formatDate(new Date(Date.now()), 'yyyy-MM-dd', 'en'),
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
      staffDirectorOther: this.uiEmployyeTypes[0].code,
      //accountOpeningDate: new FormControl(formatDate(new Date(Date.now()), 'yyyy-MM-dd', 'en'), [Validators.required]),
      lastTransactionDate: formatDate(new Date(Date.now()), 'yyyy-MM-dd', 'en'),
      accountStatus: this.uiAccountStatuses[0].constantNo,
      passbookDate: formatDate(new Date(Date.now()), 'yyyy-MM-dd', 'en'),
      // matureDate: formatDate(new Date(Date.now()), 'yyyy-MM-dd', 'en'),
      lastInterestDate: formatDate(new Date(Date.now()), 'yyyy-MM-dd', 'en'),
      drInterestDate: formatDate(new Date(Date.now()), 'yyyy-MM-dd', 'en'),
    })
  }
  // clearParametersDetails() {
  //   this.parametersForm.patchValue({
  //     interestRateParam: "",
  //     ledgerNumber: "",
  //     minimumBalance: "",
  //     additionalBalance: "",
  //     form60: this.uiForm60Options[0].code,
  //     form61: this.uiForm61Options[0].code,
  //     tds: this.uiTDSOptions[0].code,
  //     tdsReason: this.uiTDSReasons[0].constantNo,
  //   })
  // }
  clearNomineeDetails() {
    this.nominiForm.patchValue({
      nominiName: "",
      relation: this.uiRelations[0].constantNo,
      percentage: "",
      guardian: "",
      nomineeAddress: "",
    })
  }
  clearJointDetails() {
    this.jointForm.patchValue({
      jointCustomers: [],
      operativeInstruction: "",
    })
  }
  clearFDDetails() {
    this.fdDetailsForm.patchValue({
      slipNo: "",
      renewFD: this.uiRenewalTypes[0].code,
      fdOpeningDate: formatDate(new Date(Date.now()), 'yyyy-MM-dd', 'en'),
      renewalOnDate: formatDate(new Date(Date.now()), 'yyyy-MM-dd', 'en'),
      fdMatureDate: formatDate(new Date(Date.now()), 'yyyy-MM-dd', 'en'),
      days: "",
      months: "",
      years: "",
      fdAmount: "",
      interestRateFD: "",
      fdPayableAmount: "",
      fdPrintedFor: "",
    })
  }
  clearRDDetails() {
    this.rdDetailsForm.patchValue({
      installmentType: this.uiInstallmentTypes[0].code,
      installmentAmount: "",
      rdOpeningDate: new FormControl(formatDate(new Date(Date.now()), 'yyyy-MM-dd', 'en'), [Validators.required]),
      noOfInstallments: "",
      interestRateRD: "",
      rdMatureDate: new FormControl(formatDate(new Date(Date.now()), 'yyyy-MM-dd', 'en'), [Validators.required]),
      rdPaybleAmount: "",
    })
  }

  // openSearchedCustomers() {
  //   this.toggleSearchCustomers = !this.toggleSearchCustomers;
  // }

  // openSearchedJointCustomers() {
  //   this.toggleSearchJointCustomers = !this.toggleSearchJointCustomers;
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
  get staffDirectorOther() {
    return this.accountForm.get('staffDirectorOther')!;
  }
  // get accountOpeningDate() {
  //   return this.accountForm.get('accountOpeningDate')!;
  // }
  get lastTransactionDate() {
    return this.accountForm.get('lastTransactionDate')!;
  }
  get accountStatus() {
    return this.accountForm.get('accountStatus')!;
  }
  get passbookDate() {
    return this.accountForm.get('passbookDate')!;
  }
  // get matureDate() {
  //   return this.accountForm.get('matureDate')!;
  // }
  get lastInterestDate() {
    return this.accountForm.get('lastInterestDate')!;
  }
  get drInterestDate() {
    return this.accountForm.get('drInterestDate')!;
  }



  //

  // get interestRateParam() {
  //   return this.parametersForm.get('interestRateParam')!;
  // }
  // get ledgerNumber() {
  //   return this.parametersForm.get('ledgerNumber')!;
  // }
  // get minimumBalance() {
  //   return this.parametersForm.get('minimumBalance')!;
  // }
  // get additionalBalance() {
  //   return this.parametersForm.get('additionalBalance')!;
  // }
  // get form60() {
  //   return this.parametersForm.get('form60')!;
  // }
  // get form61() {
  //   return this.parametersForm.get('form61')!;
  // }
  // get tds() {
  //   return this.parametersForm.get('tds')!;
  // }
  // get tdsReason() {
  //   return this.parametersForm.get('tdsReason')!;
  // }

  //

  get nominiName() {
    return this.nominiForm.get('nominiName')!;
  }
  get relation() {
    return this.nominiForm.get('relation')!;
  }
  get percentage() {
    return this.nominiForm.get('percentage')!;
  }
  get guardian() {
    return this.nominiForm.get('guardian')!;
  }
  get nomineeAddress() {
    return this.nominiForm.get('nomineeAddress')!;
  }
  //

  get jointCustomers() {
    return this.jointForm.get('jointCustomers')!;
  }

  get operativeInstruction() {
    return this.jointForm.get('operativeInstruction')!;
  }

  //

  get slipNo() {
    return this.fdDetailsForm.get('slipNo')!;
  }
  get renewFD() {
    return this.fdDetailsForm.get('renewFD')!;
  }
  get fdOpeningDate() {
    return this.fdDetailsForm.get('fdOpeningDate')!;
  }
  get renewalOnDate() {
    return this.fdDetailsForm.get('renewalOnDate')!;
  }
  get fdMatureDate() {
    return this.fdDetailsForm.get('fdMatureDate')!;
  }
  get days() {
    return this.fdDetailsForm.get('days')!;
  }
  get months() {
    return this.fdDetailsForm.get('months')!;
  }
  get years() {
    return this.fdDetailsForm.get('years')!;
  }
  get fdAmount() {
    return this.fdDetailsForm.get('fdAmount')!;
  }
  get interestRateFD() {
    return this.fdDetailsForm.get('interestRateFD')!;
  }
  get fdPayableAmount() {
    return this.fdDetailsForm.get('fdPayableAmount')!;
  }
  get fdPrintedFor() {
    return this.fdDetailsForm.get('fdPrintedFor')!;
  }

  //
  get installmentType() {
    return this.rdDetailsForm.get('installmentType')!;
  }
  get installmentAmount() {
    return this.rdDetailsForm.get('installmentAmount')!;
  }
  get rdOpeningDate() {
    return this.rdDetailsForm.get('rdOpeningDate')!;
  }
  get noOfInstallments() {
    return this.rdDetailsForm.get('noOfInstallments')!;
  }
  get interestRateRD() {
    return this.rdDetailsForm.get('interestRateRD')!;
  }
  get rdMatureDate() {
    return this.rdDetailsForm.get('rdMatureDate')!;
  }
  get rdPaybleAmount() {
    return this.rdDetailsForm.get('rdPaybleAmount')!;
  }
}
