import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { NgxDropdownConfig } from 'ngx-select-dropdown';
import { ToastrService } from 'ngx-toastr';
import { AccountDeclarations } from 'src/app/common/account-declarations';
import { IGeneralDTO, UiEnumGeneralMaster, UiUserRole } from 'src/app/common/models/common-ui-models';
import { UserRoleHeper } from 'src/app/common/utils/user-role-helper';
import { CustomerService } from 'src/app/services/customers/customer/customer.service';
import { GeneralLedgerService } from 'src/app/services/masters/general-ledger/general-ledger.service';
import { PigmyAccountService } from 'src/app/services/pigmy/pigmy-account/pigmy-account.service';
import { PigmyMasterService } from 'src/app/services/pigmy/pigmy-master/pigmy-master.service';
import { SharedService } from 'src/app/services/shared.service';
import { UserService } from 'src/app/services/users/user.service';



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
  createdBy: number,
  modifiedBy: number,
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
  createdBy: number,
  status: string
}

export interface IPigmyAccountModel {
  PigmyAccountId: number;
  AccountsId: number;
  PigmyAgentId: number;
  BranchCode: number;
  CustomerId: number;
  Code1: number;
  Code2: number;
  AccountNo: string;
  AccountType: number;
  AccountStatus: number;
  ModeOfOperation: number;
  StaffCode: string;
  PassbookDate: Date;
  DebitInterestDate: Date;
  MinimumBalance: number;
  Inst_Amt: number;
  Inst_No: number;
  Inst_Type: string;
  Payb_Amt: number;
  Opn_Date: Date;
  Exp_Date: Date;
  Last_Int_Date: Date;
  Last_Trn_Date: Date;
  Close_Flag: number;
  Close_Date: Date;
  Int_Rate: number;
  ClearingAmount: number;
  TDS_YN: boolean;
  TDS_Reason_Code: number;
  PeriodInDays: number;
  Ac_Statement_Freq: number;
  Email_Day_Freq: number;
  Pass_Book_Charges: number;
  MinBal_Charges: boolean;
  Service_Charges: boolean;
  PrintCount: number;
  Active: number;
  CreatedBy: number;
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
  selector: 'app-pigmy-account-form',
  templateUrl: './pigmy-account-form.component.html',
  styleUrls: ['./pigmy-account-form.component.css'],
})
export class PigmyAccountFormComponent implements OnInit {

  customerDetailsForm!: FormGroup;
  summaryForm!: FormGroup;
  accountForm!: FormGroup;  
  nominiForm!: FormGroup;
  jointForm!: FormGroup;
  PigmyDetailsForm!: FormGroup;

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

  configAgent: NgxDropdownConfig = {
    displayKey: "name",
    height: "auto",
    search: true,
    placeholder: "Select Agent",
    searchPlaceholder: "Search by name...",
    limitTo: 0,
    customComparator: undefined,
    noResultsFound: "No results found",
    moreText: "more",
    clearOnSelection: false,
    inputDirection: "ltr",
    enableSelectAll: false,
  };

  uiAllGeneralLedgers: any[] = [];
  uiPigmyGeneralLedgers: any[] = [];
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

  uiPigmyAgents: any[] = [];

  //toggleSearchCustomers = false;
  // toggleSearchJointCustomers = false;
  isNotJointAccount = true;
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
  isAccountAuthorized = true;
  datepickerConfig: BsDatepickerConfig;

  constructor(private router: Router, private _sharedService: SharedService, private _toastrService: ToastrService,
    private _generalLedgerService: GeneralLedgerService, private _customerService: CustomerService,
    private _pigmyMasterService: PigmyMasterService, private _pigmyAccountService: PigmyAccountService,
    private _userService: UserService) { }

  ngOnInit(): void {

    this.datepickerConfig = this._sharedService.getDatepickerConfig();

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
    this.uiCurrencies = this._sharedService.uiCurrencies;
    this.uiForm60Options = AccountDeclarations.form60YN;
    this.uiForm61Options = AccountDeclarations.form61YN;

    this.customerDetailsForm = new FormGroup({
      customerNumber: new FormControl("", []),
      name: new FormControl("", []),
      address: new FormControl("", []),
      mobile: new FormControl("", []),
      email: new FormControl("", []),
      pan: new FormControl("", []),
      dob: new FormControl(new Date(Date.now()), []),
      aadhar: new FormControl("", []),
      joiningDate: new FormControl(new Date(Date.now()), []),
      group: new FormControl("", []),
      occupation: new FormControl("", []),
      city: new FormControl("", []),
      zone: new FormControl("", [])
    });

    this.dob.disable();
    this.joiningDate.disable();

    this.summaryForm = new FormGroup({
      generalLedger: new FormControl("", [Validators.required]),
      pigmyAgent: new FormControl("", [Validators.required]),
      glAccountNumberStr: new FormControl("", [Validators.required]),
      glAccountNumber: new FormControl("", [Validators.required]),
      customerId: new FormControl("", [Validators.required]),
    });

    this.accountForm = new FormGroup({
      accountType: new FormControl(this.uiAccountTypes[0].constantNo, [Validators.required]),
      modeOfOperation: new FormControl(this.uiModeOfOperations[0].constantNo, [Validators.required]),
      //modeOfSignature: new FormControl(this.uiModeOfOperations[0].constantNo, [Validators.required]),
      staffDirectorOther: new FormControl(this.uiEmployyeTypes[0].code, [Validators.required]),
      accountStatus: new FormControl(this.uiAccountStatuses[0].constantNo, [Validators.required]),
      passbookDate: new FormControl(new Date(Date.now()), [Validators.required]),
      lastInterestDate: new FormControl(new Date(Date.now()), [Validators.required]),
      lastTransactionDate: new FormControl(new Date(Date.now()), [Validators.required]),
      drInterestDate: new FormControl(new Date(Date.now()), [Validators.required]),
      //printDate: new FormControl("", []),
      accountCloseDate: new FormControl("", []),
      close_Flag: new FormControl(false, [Validators.required])
    });

    this.accountStatus.disable();
    this.lastTransactionDate.disable();
    this.lastInterestDate.disable();
    this.drInterestDate.disable();

    this.isNotJointAccount = true;

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

    this.PigmyDetailsForm = new FormGroup({
      dailyInstallmentAmount: new FormControl("", [Validators.required]),
      accountOpeningDate: new FormControl(new Date(Date.now()), [Validators.required]),
      pigmyPeriod: new FormControl("", [Validators.required]),
      interestRateParam: new FormControl("", [Validators.required]),
      clearingAmount: new FormControl("0", [Validators.required]),
      minimumBalance: new FormControl("0", [Validators.required]),
      expiryDate: new FormControl(new Date(Date.now()), []),
      payableAmount: new FormControl("0", [Validators.required]),
    });

    this.expiryDate.disable();

    this.getGeneralLedgers().then(result => {
      if (result) {
        this.getPigmyAgents().then((userResult) => {
          if (userResult) {
            this.loadForm();
          }
        })
      }
    }).catch(error => {
      this._toastrService.error('Error loading general ledgers', 'Warning!');
    });;

    UserRoleHeper.initialiseUserRoles(this._sharedService.applicationUser);
  }

  isOperatorUser() {
    return UserRoleHeper.isOperatorUser();
  }

  isPassingOfficerUser() {
    return UserRoleHeper.isPassingOfficerUser();
  }

  isAdministratorUser() {
    return UserRoleHeper.isAdministratorUser();
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

            this.uiPigmyGeneralLedgers = this.uiAllGeneralLedgers.filter(gl => gl.glGroup == 'D' && gl.glType == 'P');
            resolve(true);
          }
        }
        else {
          resolve(false);
        }
      })
    })
  }

  getPigmyAgents() {
    return new Promise((resolve, reject) => {
      this.uiPigmyAgents = [];
      this._pigmyMasterService.getBranchAgents(this._sharedService.applicationUser.branchId).subscribe((data: any) => {
        if (data) {
          if (data.statusCode == 200 && data.data.data) {
            var agents = data.data.data;
            if (agents && agents.length) {
              this.uiPigmyAgents = agents;

              this.uiPigmyAgents.map((pa: any, i: any) => {
                pa.name = pa.agentNumber + "-" + pa.name;
              });
              // this.summaryForm.patchValue({
              //   pigmyAgent: this.uiPigmyAgents[0],
              // });
            }
            resolve(true);
          }
        }
      })
    })
  }

  loadForm() {
    this._pigmyAccountService.getDTO().subscribe(obj => this.dto = obj);
    if (this.dto) {
      if (this.dto.id >= 0) {
        this.accountsId = this.dto.id;
        if (this.accountsId == 0 || this.accountsId == undefined) {
          this.isAddMode = true;
        }
        else {
          this.isAddMode = false;
          this._pigmyAccountService.getPigmyAccount(this.accountsId).subscribe((data: any) => {

            if (data) {
              if (data.statusCode == 200 && data.data.data) {
                var pigmyAccount = data.data.data;

                this.selectCustomer(pigmyAccount.customerId);

                // bind general ledger
                let gl = this.uiAllGeneralLedgers.filter(g => g.code == pigmyAccount.code1);

                let agents = this.uiPigmyAgents.filter(g => g.id == pigmyAccount.pigmyAgentId);

                this.summaryForm.patchValue({
                  generalLedger: gl && gl.length ? gl[0] : null,
                  pigmyAgent: agents && agents.length ? agents[0] : null,
                  glAccountNumberStr: pigmyAccount.accountNo,
                  glAccountNumber: pigmyAccount.code2,
                  customerId: pigmyAccount.customerId,
                })

                this.customerDetailsForm.patchValue({
                  customerNumber: "",
                  name: "",
                  address: "",
                  mobile: "",
                  email: "",
                  pan: "",
                  dob: new Date(Date.now()),
                  aadhar: "",
                  joiningDate: new Date(Date.now()),
                  group: "",
                  occupation: "",
                  city: "",
                  zone: "",
                })


                this.accountForm.patchValue({
                  accountType: pigmyAccount.accountType,
                  modeOfOperation: pigmyAccount.modeOfOperation,
                  //modeOfSignature: pigmyAccount.mode_Sgn,
                  staffDirectorOther: pigmyAccount.staffCode,
                  accountStatus: pigmyAccount.accountStatus,
                  passbookDate: new Date(pigmyAccount.passbookDate),
                  //matureDate: formatDate(new Date(pigmyAccount.exp_Date), 'yyyy-MM-dd', 'en'),
                  lastInterestDate: new Date(pigmyAccount.last_Int_Date),
                  lastTransactionDate: new Date(pigmyAccount.last_Trn_Date),
                  //printDate: (pigmyAccount.print_Date == null) ? "" : formatDate(new Date(pigmyAccount.print_Date), 'yyyy-MM-dd', 'en'),
                  accountCloseDate: (pigmyAccount.close_Date == null) ? "" : new Date(pigmyAccount.close_Date),
                  drInterestDate: new Date(pigmyAccount.debitInterestDate),
                  close_Flag: (pigmyAccount.close_Flag == 1) ? 'Y' : 'N',
                })

                this.accountStatus.enable();

                // depositAccount.nomineeList
                if (pigmyAccount.nomineeList && pigmyAccount.nomineeList.length) {
                  let relationName = "";
                  pigmyAccount.nomineeList.forEach((nominee: any) => {
                    let uiNominee: any = {};
                    let uiRelation = this.uiRelations.filter(r => r.constantNo == parseInt(nominee.relation));
                    if (uiRelation) {
                      relationName = (uiRelation && uiRelation.length > 0) ? uiRelation[0].constantname : "";
                    }

                    uiNominee.id = nominee.id;
                    uiNominee.accountId = nominee.accountsId;
                    uiNominee.customerId = pigmyAccount.customerId;
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
                if (pigmyAccount.jointList && pigmyAccount.jointList.length) {

                  pigmyAccount.jointList.forEach((joint: any) => {
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

                this.PigmyDetailsForm.patchValue({
                  dailyInstallmentAmount: pigmyAccount.inst_Amt,
                  accountOpeningDate: new Date(pigmyAccount.opn_Date),
                  pigmyPeriod: pigmyAccount.periodInDays,
                  interestRateParam: pigmyAccount.int_Rate,
                  clearingAmount: pigmyAccount.clearingAmount,
                  minimumBalance: pigmyAccount.minimumBalance,
                  expiryDate: (pigmyAccount.exp_Date == null) ? "" : new Date(pigmyAccount.exp_Date),
                  payableAmount: pigmyAccount.payb_Amt,
                })

                this.isAccountAuthorized = pigmyAccount.authBy > 0;
                this.isNotJointAccount = !(pigmyAccount.accountType == 2); // TODO: Need to make it configurable
              }
            }
          })
        }
      }
      else {
        this.configClick("pigmy-account-serach");
      }
    }
  }

  calculatePayableAmount() {
    const dailyAmount = isNaN(parseFloat(this.dailyInstallmentAmount.value)) ? 0 : parseFloat(this.dailyInstallmentAmount.value);
    const interestRate = isNaN(parseFloat(this.interestRateParam.value)) ? 0 : parseFloat(this.interestRateParam.value);
    const days = isNaN(parseFloat(this.pigmyPeriod.value)) ? 0 : parseFloat(this.pigmyPeriod.value);

    let payableAmt = this.calculateSimpleInterestPayableAmount(dailyAmount, interestRate, days);
    if (payableAmt > 0) {
      this.PigmyDetailsForm.patchValue({
        payableAmount: payableAmt.toFixed(2),
      })
    }
  }

  calculateCompoundInterestPayableAmount(dailyAmount: number, interestRate: number, days: number): number {
    const dailyInterestRate = interestRate / 365;
    const totalAmount = dailyAmount * Math.pow(1 + dailyInterestRate, days);
    return totalAmount;
  }

  calculateSimpleInterestPayableAmount(dailyAmount: number, interestRate: number, days: number): number {
    const dailyInterestRate = interestRate / 365;  // Convert annual interest rate to daily rate
    const totalAmount = dailyAmount * days;
    const totalInterest = totalAmount * dailyInterestRate;
    return totalAmount + totalInterest;
  }

  calculateExpiryDate()
  {
    let periodInDays = isNaN(parseInt(this.pigmyPeriod.value))? 0: parseInt(this.pigmyPeriod.value);

    let maturityDate = new Date().setDate(periodInDays);
    this.PigmyDetailsForm.patchValue({
      expiryDate: new Date(maturityDate),
    })

    this.calculatePayableAmount();
  }


  changeGeneralLedger(event: any) {
    let glValue = event.value;
    if (glValue) {
      this.PigmyDetailsForm.patchValue({
        interestRateParam: glValue.int_Rate,
      })
      this.getMaxAccountNumber();
    }
  }

  changePigmyAgent(event: any) {
    let agentValue = event.value;
    if (agentValue) {
      this.summaryForm.patchValue({
        pigmyAgent: agentValue,
      })
      this.getMaxAccountNumber();
    }
  }

  getMaxAccountNumber() {
    let gl = this.generalLedger.value;
    let agent = this.pigmyAgent.value;
    if (gl.code > 0 && agent.id > 0) {
      this._pigmyAccountService.getMaxAccountNumber(this._sharedService.applicationUser.branchId, gl.code, agent.id).subscribe((data: any) => {
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

  }

  getCustomers(custData: any) {
    // this.uiCustomers = custData;
    if (custData && custData.status == 'Active') {
      this.selectCustomer(custData.id);
    }

    //this.toggleSearchCustomers = true;
  }

  getCustomersForJoint(custData: any) {
    if (custData && custData.status == 'Active') {
      // this.uiJointCustomers = custData.filter((c: any) => c.status == 'Active'); // display only active customers
      this.selectJointCustomer(custData);
    }
    //this.toggleSearchJointCustomers = true;
  }

  selectCustomer(customerId: number) {
    if (customerId && customerId > 0) {
      this.selectedCustomerId = customerId;
      this.getCustomer(customerId);
    }
  }

  getCustomer(customerId: number) {
    this._customerService.getCustomer(this._sharedService.applicationUser.branchId, customerId).subscribe((data: any) => {

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
          dob: new Date(customer.birthDate),
          aadhar: customer.aadharno,
          joiningDate: new Date(customer.custOpenDate),
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
        uiJointCust.createdBy = this._sharedService.applicationUser.id;
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
      this._pigmyAccountService.jointCustomerToDelete = customer.customerId;
    }
  }

  onJointDelete() {
    let customerIdToDelete = this._pigmyAccountService.jointCustomerToDelete;
    if (customerIdToDelete > 0) {

      let customers = this.uiSelectedJointCustomers.filter(c => c.customerId == customerIdToDelete);
      if (customers && customers.length) {
        customers[0].status = "D";
      }
    }
  }

  cancelJointDelete() {
    this._pigmyAccountService.jointCustomerToDelete = -1;
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

  selectAccountStatus(event: any) {
    if (event) {
      if (event.target.value) {
        let targetValue = event.target.value;
        let accountType = targetValue.split(":");
        this.isNotJointAccount = true;
        if (parseInt(accountType[1]) == 4) { //TODO: Need to make it configurable
          this.accountForm.patchValue({
            close_Flag: true,
            accountCloseDate: new Date(Date.now())
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
        uiNomini.createdBy = this._sharedService.applicationUser.id;
        uiNomini.modifiedBy = this._sharedService.applicationUser.id;
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
        uiNomini.createdBy = this._sharedService.applicationUser.id;
        uiNomini.modifiedBy = this._sharedService.applicationUser.id;
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
      nomineeAddress: "",
      relation: this.uiRelations[0].constantNo,
      guardian: "",
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


  validNominiDetails() {
    return (this.uiNominis && this.uiNominis.length > 0);
  }

  validJointDetails() {
    if (!this.isNotJointAccount) {
      return (this.uiSelectedJointCustomers && this.uiSelectedJointCustomers.length > 0);
    }
    return true;
  }

  validPigmyDetails() {
    if (this.PigmyDetailsForm.invalid) {
      for (const control of Object.keys(this.PigmyDetailsForm.controls)) {
        this.PigmyDetailsForm.controls[control].markAsTouched();
      }
      return false;
    }
    return true;
  }

  savePigmyAccount() {
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
    if (!this.validNominiDetails()) {
      this._toastrService.error('Please enter nominee details.', 'Error!');
      return;
    }
    if (!this.validJointDetails()) {
      this._toastrService.error('Please enter joint customer details.', 'Error!');
      return;
    }
    if (!this.validPigmyDetails()) {
      this._toastrService.error('Please enter pigmy details.', 'Error!');
      return;
    }

    // add values into model
    let accountModel = {} as IPigmyAccountModel;
    accountModel.AccountsId = this.dto.id;
    accountModel.BranchCode = this._sharedService.applicationUser.branchId;
    accountModel.PigmyAgentId =parseInt(this.pigmyAgent.value.id.toString());
    accountModel.CustomerId = parseInt(this.customerId.value.toString());
    accountModel.Code1 = parseInt(this.generalLedger.value.code.toString());
    accountModel.Code2 = parseInt(this.glAccountNumber.value.toString());
    accountModel.AccountNo = this.glAccountNumberStr.value.toString()
    accountModel.AccountType = parseInt(this.accountType.value.toString());
    accountModel.AccountStatus = parseInt(this.accountStatus.value.toString());
    accountModel.ModeOfOperation = parseInt(this.modeOfOperation.value.toString());
    accountModel.StaffCode = this.staffDirectorOther.value.toString();
    accountModel.ClearingAmount = parseFloat(this.clearingAmount.value.toString());
    accountModel.MinimumBalance = parseFloat(this.minimumBalance.value.toString());
    accountModel.Last_Int_Date = new Date(this.lastInterestDate.value.toString());
    accountModel.Last_Trn_Date = new Date(this.lastTransactionDate.value.toString());
    accountModel.Int_Rate = parseFloat(this.interestRateParam.value.toString());
    accountModel.Opn_Date = new Date(this.accountOpeningDate.value.toString());
    accountModel.PassbookDate = new Date(this.passbookDate.value.toString());
    accountModel.Inst_Amt = parseFloat(this.dailyInstallmentAmount.value.toString());
    accountModel.Inst_No = 0;
    accountModel.Inst_Type = "D";
    accountModel.Payb_Amt = parseFloat(this.payableAmount.value.toString());
    accountModel.Exp_Date = new Date(this.expiryDate.value.toString());
    accountModel.PeriodInDays = parseFloat(this.pigmyPeriod.value.toString());
    accountModel.Close_Flag = this.close_Flag.value.toString() == 'true' ? 1 : 0;
    if (accountModel.Close_Flag == 1) {
      accountModel.Close_Date = new Date(this.accountCloseDate.value.toString());
      accountModel.Exp_Date = new Date(this.accountCloseDate.value.toString());
    }

    accountModel.CreatedBy = this._sharedService.applicationUser.id;
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
        jointModel.CustomerId = jointCust.customerId;
        jointModel.OperativeInstruction = jointCust.operativeInstruction;
        jointModel.Status = jointCust.status;
        jointModel.CreatedBy = jointCust.createdBy;
        accountModel.JointList.push(jointModel);
      });
    }
    // Call API to save account

    this._pigmyAccountService.savePigmyAccount(accountModel).subscribe((data: any) => {

      if (data) {
        if (data.data.data && data.data.data.retId > 0) {
          if (data.data.data.status == "SUCCESS") {
            this._toastrService.success(data.data.data.message, 'Success!');
            this.clear();
            //this.configClick("account-search");
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
    // if (this._sharedService.applicationUser.id > 0 &&
    //   this.dto.id > 0 && this._sharedService.applicationUser.branchId > 0) {
    //   let authAccountRequest = {
    //     AccountsId: this.dto.id,
    //     BranchCode: this._sharedService.applicationUser.branchId,
    //     AuthByUserId: this._sharedService.applicationUser.id
    //   };

    //   this._accountsService.authoriseAccount(authAccountRequest).subscribe((data: any) => {

    //     if (data) {
    //       if (data.data.data && data.data.data.retId > 0) {
    //         this._toastrService.success("Account authorised successfully!", 'Success!');
    //       }
    //       else {
    //         this._toastrService.success("Error while authorising account!", 'Error!');
    //       }
    //     }
    //   })
    // }
  }

  configClick(routeValue: string) {
    sessionStorage.setItem("configMenu", routeValue);
    this.router.navigate(['/app/' + routeValue]);
  }

  clear() {
    this.clearSummaryDetails();
    this.clearCustomerDetails();
    this.clearAccountsDetails();
    this.clearNomineeDetails();
    this.clearJointDetails();
    this.clearPigmyDetails();
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
      dob: new Date(Date.now()),
      aadhar: "",
      joiningDate: new Date(Date.now()),
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
      //modeOfSignature: this.uiModeOfOperations[0].constantNo,
      staffDirectorOther: this.uiEmployyeTypes[0].code,
      accountStatus: this.uiAccountStatuses[0].constantNo,
      passbookDate: new Date(Date.now()),
      lastInterestDate: new Date(Date.now()),
      lastTransactionDate: new Date(Date.now()),
      //printDate: formatDate(new Date(Date.now()), 'yyyy-MM-dd', 'en'),
      accountCloseDate: "",
      drInterestDate: new Date(Date.now()),
      close_Flag: false
    })
  }

  clearNomineeDetails() {
    this.uiNominis = [];
    this.nominiForm.patchValue({
      nominiName: "",
      relation: this.uiRelations[0].constantNo,
      percentage: "",
      guardian: "",
      nomineeAddress: "",
    })
  }
  clearJointDetails() {
    this.uiSelectedJointCustomers = [];
    this.jointForm.patchValue({
      jointCustomers: [],
      operativeInstruction: "",
    })
  }


  clearPigmyDetails() {
    this.PigmyDetailsForm.patchValue({
      dailyInstallmentAmount: "",
      accountOpeningDate: new Date(Date.now()),
      pigmyPeriod: "",
      interestRateParam: "",
      clearingAmount: "",
      minimumBalance: "",
      expiryDate: new Date(Date.now()),
      payableAmount: "",
    })
  }

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
  get pigmyAgent() {
    return this.summaryForm.get('pigmyAgent')!;
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
  // get modeOfSignature() {
  //   return this.accountForm.get('modeOfSignature')!;
  // }
  get staffDirectorOther() {
    return this.accountForm.get('staffDirectorOther')!;
  }
  get accountStatus() {
    return this.accountForm.get('accountStatus')!;
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
  get drInterestDate() {
    return this.accountForm.get('drInterestDate')!;
  }
  // get printDate() {
  //   return this.accountForm.get('printDate')!;
  // }
  get close_Flag() {
    return this.accountForm.get('close_Flag')!;
  }

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

  get dailyInstallmentAmount() {
    return this.PigmyDetailsForm.get('dailyInstallmentAmount')!;
  }
  get accountOpeningDate() {
    return this.PigmyDetailsForm.get('accountOpeningDate')!;
  }
  get pigmyPeriod() {
    return this.PigmyDetailsForm.get('pigmyPeriod')!;
  }
  get interestRateParam() {
    return this.PigmyDetailsForm.get('interestRateParam')!;
  }
  get clearingAmount() {
    return this.PigmyDetailsForm.get('clearingAmount')!;
  }
  get minimumBalance() {
    return this.PigmyDetailsForm.get('minimumBalance')!;
  }
  get expiryDate() {
    return this.PigmyDetailsForm.get('expiryDate')!;
  }
  get payableAmount() {
    return this.PigmyDetailsForm.get('payableAmount')!;
  }
}
