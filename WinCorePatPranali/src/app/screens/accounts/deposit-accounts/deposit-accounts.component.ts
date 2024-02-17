import { formatDate } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NgxDropdownConfig } from 'ngx-select-dropdown';
import { ToastrService } from 'ngx-toastr';
import { UiEnumGeneralMaster } from 'src/app/common/models/common-ui-models';
import { GeneralLedgerService } from 'src/app/services/masters/general-ledger/general-ledger.service';
import { GeneralMasterService } from 'src/app/services/masters/general-master/general-master.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-deposit-accounts',
  templateUrl: './deposit-accounts.component.html',
  styleUrls: ['./deposit-accounts.component.css']
})
export class DepositAccountsComponent {
  summaryForm!: FormGroup;
  details1Form!: FormGroup;
  details2Form!: FormGroup;
  nominiForm!: FormGroup;
  jointForm!: FormGroup;
  fdDetailsForm!: FormGroup;
  rdDetailsForm!: FormGroup;
  todaysStatusForm!: FormGroup;

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

  uiAllGeneralLedgers: any[] = [];
  uiDepositGeneralLedgers: any[] = [];
  uiOccupations: any[] = [];
  uiZones: any[] = [];
  uiRelations: any[] = [];

  constructor(private _generalMasterService: GeneralMasterService, private _sharedService: SharedService,
    private _toastrService: ToastrService, private _generalLedgerService: GeneralLedgerService ) { }

  ngOnInit(): void {
    
    this.summaryForm = new FormGroup({
      generalLedger: new FormControl("", []),
      accountNumber: new FormControl("", []),
      partyNumber: new FormControl("", []),
      memberType: new FormControl("", []),
      name: new FormControl("", []),
      address: new FormControl("", []),
      phone: new FormControl("", []),
      sex: new FormControl("", []),
     
    });  

    this.details1Form = new FormGroup({
      occupation: new FormControl("", []),
      accountType: new FormControl("", []),
      modeOfOperation: new FormControl("", []),
      staffDirectorOther: new FormControl("", []),
      age: new FormControl("", []),
      birthDate: new FormControl(formatDate(new Date(Date.now()), 'yyyy-MM-dd', 'en'), []),
      accountOpeningDate: new FormControl(formatDate(new Date(Date.now()), 'yyyy-MM-dd', 'en'), []),
      lastTransactionDate: new FormControl(formatDate(new Date(Date.now()), 'yyyy-MM-dd', 'en'), []),
      passbookDate: new FormControl(formatDate(new Date(Date.now()), 'yyyy-MM-dd', 'en'), []),
      matureDate: new FormControl(formatDate(new Date(Date.now()), 'yyyy-MM-dd', 'en'), []),
      lastInterestDate: new FormControl(formatDate(new Date(Date.now()), 'yyyy-MM-dd', 'en'), []),
      drInterestDate: new FormControl(formatDate(new Date(Date.now()), 'yyyy-MM-dd', 'en'), []),
      guardian: new FormControl("", []),
      zone: new FormControl("", []),
    });

    this.details2Form = new FormGroup({
      interestRate: new FormControl("", []),
      ledgerNumber: new FormControl("", []),
      introducedByGI: new FormControl("", []),
      introducedByAccount: new FormControl("", []),
      additionalBalance: new FormControl("", []),
      additionalDocument: new FormControl("", []),
      form60: new FormControl("", []),
      form61: new FormControl("", []),
      panNo: new FormControl("", []),
      resolutionNo: new FormControl("", []),
      memorandum: new FormControl("", []),
    });

    this.nominiForm = new FormGroup({
      nominiName: new FormControl("", []),
      relation: new FormControl("", []),
      age: new FormControl("", []),
      guardian: new FormControl("", []),
      address: new FormControl("", []),
    });

    this.jointForm = new FormGroup({
      joinName: new FormControl("", []),
      operativeInstruction: new FormControl("", []),
    });
    
    this.fdDetailsForm = new FormGroup({
      slipNo: new FormControl("", []),
      renewFD: new FormControl("", []),
      openingDate: new FormControl(formatDate(new Date(Date.now()), 'yyyy-MM-dd', 'en'), []),
      renewalOnDate: new FormControl(formatDate(new Date(Date.now()), 'yyyy-MM-dd', 'en'), []),
      matureDate: new FormControl(formatDate(new Date(Date.now()), 'yyyy-MM-dd', 'en'), []),
      days: new FormControl("", []),
      months: new FormControl("", []),
      years: new FormControl("", []),
      fdAmount: new FormControl("", []),
      interestRate: new FormControl(formatDate(new Date(Date.now()), 'yyyy-MM-dd', 'en'), []),
      payableAmount: new FormControl("", []),
      fdPrintedFor: new FormControl("", []),
    });

    this.todaysStatusForm  = new FormGroup({
      balance: new FormControl("", []),
      interest: new FormControl("", []),
      authorisedBy: new FormControl("", []),
      accountCloseOn: new FormControl(formatDate(new Date(Date.now()), 'yyyy-MM-dd', 'en'), [])
    });

    this.getGeneralLedgers();
    this.bindMasters();
  }

  bindMasters()
  {
    // General Ledgers
   

    // Occupations
    let occupationsMasterModel = {
      GeneralMasterId: UiEnumGeneralMaster.OccupationMaster,
      BranchId: this._sharedService.applicationUser.branchId
    }
    this._generalMasterService.getAllGeneralMasters(occupationsMasterModel).subscribe((data: any) => {
      if (data) {
        this.uiOccupations = data.data.data;
      }
    })

    // Zones
    let zoneGeneralMasterModel = {
      GeneralMasterId: UiEnumGeneralMaster.ZoneMaster,
      BranchId: this._sharedService.applicationUser.branchId
    }
    this._generalMasterService.getAllGeneralMasters(zoneGeneralMasterModel).subscribe((data: any) => {
      if (data) {
        this.uiZones = data.data.data;
      }
    })

    // Relations
    let relationsGeneralMasterModel = {
      GeneralMasterId: UiEnumGeneralMaster.RelationMaster,
      BranchId: this._sharedService.applicationUser.branchId
    }
    this._generalMasterService.getAllGeneralMasters(relationsGeneralMasterModel).subscribe((data: any) => {
      if (data) {
        this.uiRelations = data.data.data;
      }
    })
  }

  getGeneralLedgers() {
    this._generalLedgerService.getGeneralLedgers(this._sharedService.applicationUser.branchId).subscribe((data: any) => {
      console.log(data);
      if (data) {
        this.uiAllGeneralLedgers = data.data.data;
        if ( this.uiAllGeneralLedgers) {

          this.uiAllGeneralLedgers.map((gl: any, i: any) => {
            gl.name = gl.id + "-" + gl.name;
          });

          this.uiDepositGeneralLedgers = this.uiAllGeneralLedgers.filter(gl => gl.typeOfAccount.toLowerCase().includes('deposit'));
        }
      }
    })
  }


  showAccountInfo()
  {

  }

  saveAccount()
  {


  }

  clear()
  {

  }

  //
  get generalLedger() {
    return this.summaryForm.get('generalLedger')!;
  }
  get accountNumber() {
    return this.summaryForm.get('accountNumber')!;
  }
  get partyNumber() {
    return this.summaryForm.get('partyNumber')!;
  }
  get memberType() {
    return this.summaryForm.get('memberType')!;
  }
  get name() {
    return this.summaryForm.get('name')!;
  }
  get address() {
    return this.summaryForm.get('address')!;
  }
  get phone() {
    return this.summaryForm.get('phone')!;
  }
  get sex() {
    return this.summaryForm.get('sex')!;
  }
  get balance() {
    return this.summaryForm.get('balance')!;
  }
  get interest() {
    return this.summaryForm.get('balance')!;
  }
  get authorisedBy() {
    return this.summaryForm.get('balance')!;
  }
  get accountCloseOn() {
    return this.summaryForm.get('accountCloseOn')!;
  }
 //

  //
  get occupation() {
    return this.details1Form.get('occupation')!;
  }
  get accountType() {
    return this.details1Form.get('accountType')!;
  }
  get modeOfOperation() {
    return this.details1Form.get('modeOfOperation')!;
  }
  get staffDirectorOther() {
    return this.details1Form.get('staffDirectorOther')!;
  }
  get age() {
    return this.details1Form.get('age')!;
  }
  get birthDate() {
    return this.details1Form.get('birthDate')!;
  }
  get accountOpeningDate() {
    return this.details1Form.get('accountOpeningDate')!;
  }
  get lastTransactionDate() {
    return this.details1Form.get('lastTransactionDate')!;
  }
  get passbookDate() {
    return this.details1Form.get('passbookDate')!;
  }
  get matureDate() {
    return this.details1Form.get('matureDate')!;
  }
  get lastInterestDate() {
    return this.details1Form.get('lastInterestDate')!;
  }
  get drInterestDate() {
    return this.details1Form.get('drInterestDate')!;
  }
  get guardian() {
    return this.details1Form.get('guardian')!;
  }
  get zone() {
    return this.details1Form.get('zone')!;
  }
  ////
}
