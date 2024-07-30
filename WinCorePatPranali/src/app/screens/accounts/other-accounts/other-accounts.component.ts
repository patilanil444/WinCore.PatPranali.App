import { formatDate } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxDropdownConfig } from 'ngx-select-dropdown';
import { ToastrService } from 'ngx-toastr';
import { AccountDeclarations } from 'src/app/common/account-declarations';
import { IGeneralDTO, UiEnumGeneralMaster } from 'src/app/common/models/common-ui-models';
import { AccountsService } from 'src/app/services/accounts/accounts/accounts.service';
import { OtherAccountsService } from 'src/app/services/accounts/other-accounts/other-accounts.service';
import { SavingAccountService } from 'src/app/services/accounts/saving-accounts/saving-account.service';
import { CustomerService } from 'src/app/services/customers/customer/customer.service';
import { GeneralLedgerService } from 'src/app/services/masters/general-ledger/general-ledger.service';
import { SharedService } from 'src/app/services/shared.service';

export interface IOtherAccountModel {
  AccountsId: number;
  BranchCode: number;
  CustomerId: number;
  Code1: number;
  Code2: number;
  AccountNo: string;
  AccountType: number;
  AccountStatus: number;
  Int_Rate: number;
  OtherAccountId: number;
  Opn_Date: Date;
  Last_Int_Date: Date;
  Last_Trn_Date: Date;
  Mature_Date: Date;
  Close_Flag: number;
  Close_Date: Date;
  Auth_by: string;
  Active: number;
  CreatedBy: string;
  CreatedDate: Date;
}

@Component({
  selector: 'app-other-accounts',
  templateUrl: './other-accounts.component.html',
  styleUrls: ['./other-accounts.component.css']
})
export class OtherAccountsComponent {
  customerDetailsForm!: FormGroup;
  summaryForm!: FormGroup;
  accountForm!: FormGroup;

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
  uiOtherGeneralLedgers: any[] = [];
  uiAccountTypes: any[] = [];
  uiModeOfOperations: any[] = [];
  uiEmployyeTypes: any[] = [];
  uiRelations: any[] = [];
  uiOccupations: any[] = [];
  uiCustomerGroups: any[] = [];
  uiCurrencies: any[] = [];
  uiZones: any[] = [];
  uiAccountStatuses: any[] = [];

  toggleSearchCustomers = false;
  toggleSearchJointCustomers = false;

  selectedCustomerId = 0;

  uiCustomers: any[] = [];

  p_nomini: number = 1;
  total_nomini: number = 0;
  dto: IGeneralDTO = {} as IGeneralDTO;
  accountsId!: number;
  isAddMode = true;

  constructor(private router: Router, private _sharedService: SharedService, private _toastrService: ToastrService,
    private _generalLedgerService: GeneralLedgerService, private _customerService: CustomerService,
    private _savingAccountService: SavingAccountService, private _otherAccountsService: OtherAccountsService,
    private _accountsService: AccountsService) { }

  ngOnInit(): void {

    this.uiAccountTypes = this.retrieveMasters(UiEnumGeneralMaster.ACTYPE);
    this.uiModeOfOperations = this.retrieveMasters(UiEnumGeneralMaster.OPRMODE);
    this.uiEmployyeTypes = AccountDeclarations.employeeTypes;
    this.uiRelations = this.retrieveMasters(UiEnumGeneralMaster.RELATION);
    this.uiZones = this.retrieveMasters(UiEnumGeneralMaster.ZONE);
    this.uiOccupations = this.retrieveMasters(UiEnumGeneralMaster.OCCUPTION);
    this.uiCustomerGroups = this.retrieveMasters(UiEnumGeneralMaster.CUSTOMERGROUP);
    this.uiAccountStatuses = this.retrieveMasters(UiEnumGeneralMaster.ACSTATUS);
    this.uiCurrencies = this._sharedService.uiCurrencies;

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
      accountOpeningDate: new FormControl(formatDate(new Date(Date.now()), 'yyyy-MM-dd', 'en'), [Validators.required]),
      accountStatus: new FormControl(this.uiAccountStatuses[0].constantNo, [Validators.required]),
      interestRate: new FormControl("", [Validators.required]),
      lastInterestDate: new FormControl(formatDate(new Date(Date.now()), 'yyyy-MM-dd', 'en'), [Validators.required]),
      lastTransactionDate: new FormControl(formatDate(new Date(Date.now()), 'yyyy-MM-dd', 'en'), [Validators.required]),
      matureDate: new FormControl(formatDate(new Date(Date.now()), 'yyyy-MM-dd', 'en'), [Validators.required]),
      accountCloseDate: new FormControl("", []),
      close_Flag: new FormControl(false, [Validators.required])
    });

    this.accountStatus.disable();

    this.getGeneralLedgers().then(result => {
      if (result) {
        this.loadForm();
      }
    }).catch(error => {
      this._toastrService.error('Error loading general ledgers', 'Warning!');
    });;
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

            this.uiOtherGeneralLedgers = this.uiAllGeneralLedgers.filter(gl => gl.glGroup == 'B' || gl.glGroup == 'G');
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
    this._otherAccountsService.getDTO().subscribe(obj => this.dto = obj);
    if (this.dto) {
      this.accountsId = this.dto.id;
      if (this.accountsId == 0 || this.accountsId == undefined) {
        this.isAddMode = true;

      }
      else {
        this.isAddMode = false;
        this._otherAccountsService.getOtherAccount(this.accountsId).subscribe((data: any) => {
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
                dob: formatDate(new Date(Date.now()), 'yyyy-MM-dd', 'en'),
                aadhar: "",
                joiningDate: formatDate(new Date(Date.now()), 'yyyy-MM-dd', 'en'),
                group: "",
                occupation: "",
                city: "",
                zone: "",
              })

              this.accountForm.patchValue({
                accountOpeningDate: formatDate(new Date(savingAccount.opn_Date), 'yyyy-MM-dd', 'en'),
                accountStatus: savingAccount.accountStatus,
                interestRate: savingAccount.int_Rate,
                lastInterestDate: formatDate(new Date(savingAccount.last_Int_Date), 'yyyy-MM-dd', 'en'),
                lastTransactionDate: formatDate(new Date(savingAccount.last_Trn_Date), 'yyyy-MM-dd', 'en'),
                matureDate: (savingAccount.mature_Date == null) ? "" :  formatDate(new Date(savingAccount.mature_Date), 'yyyy-MM-dd', 'en'),
                accountCloseDate: (savingAccount.close_Date == null) ? "" : formatDate(new Date(savingAccount.close_Date), 'yyyy-MM-dd', 'en'),
                close_Flag: (savingAccount.close_Flag == 1) ? 'Y' : 'N',
              })

              this.accountStatus.enable();
             
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
    this.uiCustomers = custData;
    this.toggleSearchCustomers = true;
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
       
      }
    }
  }

  selectAccountStatus(event: any) {
    if (event) {
      if (event.target.value) {
        let targetValue = event.target.value;
        let accountType = targetValue.split(":");
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

    // add values into model
    let accountModel = {} as IOtherAccountModel;
    accountModel.AccountsId = this.dto.id;
    accountModel.BranchCode = this._sharedService.applicationUser.branchId;
    accountModel.CustomerId = parseInt(this.customerId.value.toString());
    accountModel.Code1 = parseInt(this.generalLedger.value.code.toString());
    accountModel.Code2 = parseInt(this.glAccountNumber.value.toString());
    accountModel.AccountNo = this.glAccountNumberStr.value.toString()
    // accountModel.AccountType = parseInt(this.accountType.value.toString());
    accountModel.AccountStatus = parseInt(this.accountStatus.value.toString());
    accountModel.OtherAccountId = 0;
    accountModel.Last_Int_Date = this.lastInterestDate.value.toString();
    accountModel.Last_Trn_Date = this.lastTransactionDate.value.toString();
    accountModel.Int_Rate = parseFloat(this.interestRate.value.toString());
    accountModel.Opn_Date = this.accountOpeningDate.value.toString();
    accountModel.Mature_Date = this.matureDate.value.toString();
    accountModel.Close_Flag = this.close_Flag.value.toString() == 'true' ? 1 : 0;
    if (accountModel.Close_Flag == 1) {
      accountModel.Close_Date = this.accountCloseDate.value.toString();
    }
    accountModel.CreatedBy = this._sharedService.applicationUser.userName;
    
    //Call API to save account

    this._otherAccountsService.saveOtherAccount(accountModel).subscribe((data: any) => {
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

  configClick(routeValue: string) {
    sessionStorage.setItem("configMenu", routeValue);
    this.router.navigate(['/app/' + routeValue]);
  }

  clear() {
    this.clearSummaryDetails();
    this.clearCustomerDetails();
    this.clearAccountsDetails();
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
      modeOfSignature: this.uiModeOfOperations[0].constantNo,
      staffDirectorOther: this.uiEmployyeTypes[0].code,
      accountStatus: this.uiAccountStatuses[0].constantNo,
      accountOpeningDate: formatDate(new Date(Date.now()), 'yyyy-MM-dd', 'en'),
      passbookDate: formatDate(new Date(Date.now()), 'yyyy-MM-dd', 'en'),
      lastInterestDate: formatDate(new Date(Date.now()), 'yyyy-MM-dd', 'en'),
      lastTransactionDate: formatDate(new Date(Date.now()), 'yyyy-MM-dd', 'en'),
      printDate: formatDate(new Date(Date.now()), 'yyyy-MM-dd', 'en'),
      accountCloseDate: "",
      close_Flag: false
    })
  }
  
  openSearchedCustomers() {
    this.toggleSearchCustomers = !this.toggleSearchCustomers;
  }

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

  get accountOpeningDate() {
    return this.accountForm.get('accountOpeningDate')!;
  }

  get accountStatus() {
    return this.accountForm.get('accountStatus')!;
  }

  get interestRate() {
    return this.accountForm.get('interestRate')!;
  }

  get lastInterestDate() {
    return this.accountForm.get('lastInterestDate')!;
  }

  get lastTransactionDate() {
    return this.accountForm.get('lastTransactionDate')!;
  }

  get matureDate() {
    return this.accountForm.get('matureDate')!;
  }

  get accountCloseDate() {
    return this.accountForm.get('accountCloseDate')!;
  }
 
  get close_Flag() {
    return this.accountForm.get('close_Flag')!;
  }
}
