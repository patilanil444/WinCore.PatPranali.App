import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { NgxDropdownConfig } from 'ngx-select-dropdown';
import { ToastrService } from 'ngx-toastr';
import { GeneralLedgerService } from 'src/app/services/masters/general-ledger/general-ledger.service';
import { GeneralMasterService } from 'src/app/services/masters/general-master/general-master.service';
import { LoanInterestRateService } from 'src/app/services/masters/loan-interest-rate/loan-interest-rate.service';
import { SharedService } from 'src/app/services/shared.service';

interface IUiInterestStructureModel {
  id: number;
  index: number;
  fromAmount: number;
  toAmount: number;
  interestRate: number;
  loanInterestRateId: number
}

interface ILoanInterestRate {
  Id: number,
  GLId: number,
  IntSetDate: string,
  // FromPurposeId: number,
  // ToPurposeId: number,
  Type: string,
  BranchCode: number,
  Active: number,
  CreatedBy: number,
  mstLoanIntRateStruct: ILoanInterestRateScheduleModel[]
}

interface ILoanInterestRateScheduleModel {
  Id: number,
  IntRateStructureId: number,
  FromAmount: string,
  ToAmount: string,
  RowIndex: number,
  InterestRate: number,
  Active: number,
  CreatedBy: number,
}

@Component({
  selector: 'app-loan-interest-structure',
  templateUrl: './loan-interest-structure.component.html',
  styleUrls: ['./loan-interest-structure.component.css']
})
export class LoanInterestStructureComponent implements OnInit {

  uiGeneralLedgers: any[] = [];
  uiPurposeMasters: any[] = [];
  interestStructureDate = new Date(Date.now());
  generalLedger: any = {};
  purposeFromId = 0;
  purposeToId = 0;
  uiLoanInterestRate: any;
  isAddMode = true;
  structureArray: IUiInterestStructureModel[] = [];

  datepickerConfig: BsDatepickerConfig;

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

  constructor(private router: Router, private _generalLedgerService: GeneralLedgerService,
    private _sharedService: SharedService, private _generalMasterService: GeneralMasterService,
    private _loanInterestRateService: LoanInterestRateService, private _toastrService: ToastrService) { }

  ngOnInit(): void {

    this.datepickerConfig = this._sharedService.getDatepickerConfig();
    this.datepickerConfig.maxDate = new Date(Date.now());

    this.getGeneralLedgers();
    //this.getPurposeMaster();
    this.prepareTable();
  }

  getGeneralLedgers() {
    this._generalLedgerService.getGeneralLedgers(this._sharedService.applicationUser.branchId).subscribe((data: any) => {

      if (data) {
        this.uiGeneralLedgers = data.data.data;
        if (this.uiGeneralLedgers) {
          this.generalLedger = this.uiGeneralLedgers[0];
        }
        this.uiGeneralLedgers.map((gl: any, i: any) => {
          gl.glName = gl.code + "-" + gl.glName;
        });
      }
    })
  }


  prepareTable() {
    this.structureArray = [];
    for (let index = 0; index < 8; index++) {
      let row = {} as IUiInterestStructureModel;
      row.id = 0;
      row.index = index;
      row.fromAmount = 1;
      row.toAmount = 999999999;
      row.interestRate = 0;
      this.structureArray.push(row);
    }
  }

  showSctructure() {
    this.prepareTable();
    this.uiLoanInterestRate = {};
    this.getLoanInterestRates();

  }

  getLoanInterestRates() {
    if (this.generalLedger.code) {

      this._loanInterestRateService.getLoanRatesByGL(this.generalLedger.code,
        formatDate(new Date(this.interestStructureDate), 'yyyy-MM-dd', 'en')).subscribe((data: any) => {

          if (data) {
            let response = data.data.data;
            if (response) {
              this.uiLoanInterestRate = response;
              if (this.uiLoanInterestRate.id > 0 && this.uiLoanInterestRate.mstLoanIntRateStruct) {

                this.interestStructureDate = new Date(this.uiLoanInterestRate.intSetDate);

                this.uiLoanInterestRate.mstLoanIntRateStruct.forEach((schedule: any) => {
                  this.structureArray[schedule.rowIndex].id = schedule.id;
                  this.structureArray[schedule.rowIndex].fromAmount = schedule.fromAmount;
                  this.structureArray[schedule.rowIndex].toAmount = schedule.toAmount;
                  this.structureArray[schedule.rowIndex].interestRate = schedule.interestRate;
                });
                this.isAddMode = false;
              }
              else {
                this.uiLoanInterestRate = {};
                this.isAddMode = true;
                this.interestStructureDate = new Date(Date.now());
              }
            }
          }
        })
    }
  }

  clear() {
    this.uiLoanInterestRate = {};
    this.isAddMode = true;
    this.prepareTable();
  }

  validateForm() {
    return true;
  }

  saveStructure() {
    if (this.validateForm()) {
      let loanInterestRateModel = {} as ILoanInterestRate;

      let originalDate = this.uiLoanInterestRate? formatDate(new Date(this.uiLoanInterestRate.intSetDate), 'yyyy-MM-dd', 'en') : "";
      let changedDate = formatDate(new Date(this.interestStructureDate), 'yyyy-MM-dd', 'en');

      loanInterestRateModel.Id = 0;
      if (originalDate == changedDate) {
        loanInterestRateModel.Id = (this.uiLoanInterestRate && this.uiLoanInterestRate.id) ? this.uiLoanInterestRate.id : 0;
      }

      loanInterestRateModel.BranchCode = this._sharedService.applicationUser.branchId;
      loanInterestRateModel.GLId = this.generalLedger.code;
      loanInterestRateModel.Type = "L";
      loanInterestRateModel.CreatedBy = this._sharedService.applicationUser.id;
      loanInterestRateModel.IntSetDate = formatDate(new Date(this.interestStructureDate), 'yyyy-MM-dd', 'en');
      loanInterestRateModel.mstLoanIntRateStruct = [];
      console.log(loanInterestRateModel);

      for (let index = 0; index < this.structureArray.length; index++) {
        let model = {} as ILoanInterestRateScheduleModel;

        model.Id = 0;
        model.IntRateStructureId = 0;

        if (originalDate == changedDate) {
          model.Id = this.structureArray[index].id;
          model.IntRateStructureId = (this.uiLoanInterestRate && this.uiLoanInterestRate.id) ? this.uiLoanInterestRate.id : 0;
        }
        model.RowIndex = this.structureArray[index].index;
        model.FromAmount = this.structureArray[index].fromAmount.toString();
        model.ToAmount = this.structureArray[index].toAmount.toString();
        model.InterestRate = this.structureArray[index].interestRate;
        model.CreatedBy = this._sharedService.applicationUser.id;
        loanInterestRateModel.mstLoanIntRateStruct.push(model);
      }
      console.log(loanInterestRateModel);

      this._loanInterestRateService.saveLoanRateStructure(loanInterestRateModel).subscribe((data: any) => {

        if (data) {
          if (data.statusCode == 200 && data.data.data.retId > 0) {
            this._toastrService.success('Loan interest structure saved.', 'Success!');
            //this.configClick("banks");
            this.getLoanInterestRates();
          }
        }
      })
    }
  }

}
