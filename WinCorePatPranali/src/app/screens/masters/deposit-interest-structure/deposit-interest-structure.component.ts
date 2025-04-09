import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { NgxDropdownConfig } from 'ngx-select-dropdown';
import { ToastrService } from 'ngx-toastr';
import { UiValueType } from 'src/app/common/models/common-ui-models';
import { DepositInterestRateService } from 'src/app/services/masters/deposit-interest-rate/deposit-interest-rate.service';
import { GeneralLedgerService } from 'src/app/services/masters/general-ledger/general-ledger.service';
import { SharedService } from 'src/app/services/shared.service';

interface IUiInterestStructureModel {
  id: number;
  index: number;
  fromAmount: number;
  toAmount: number;
  period: number;
  fromPeriod: number;
  toPeriod: number;
  preMatureRate: number;
  regularInterestRate: number;
  afterExpiryRate: number;
  depositInterestRateId: number
}

interface IDepositInterestRate{
  Id : number,
  GLId: number,
  IntSetDate: string,
  Type: string,
  BranchCode: number,
  Active: number,
  CreatedBy : number,
  mstDepositIntRateStruct: IDepositInterestRateScheduleModel[]
}

interface IDepositInterestRateScheduleModel
{
  Id: number,
  RowIndex: number,
  FromAmount: string,
  ToAmount: string,
  PeriodFlag: string,
  FromPeriod:  number,
  ToPeriod: number,
  PreMatureRate: number,
  RegularRate: number,
  AfterExpiryRate: number,
  IntRateStructureId: number,
  CreatedBy: number
}

@Component({
  selector: 'app-deposit-interest-structure',
  templateUrl: './deposit-interest-structure.component.html',
  styleUrls: ['./deposit-interest-structure.component.css']
})
export class DepositInterestStructureComponent implements OnInit {

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

  uiGeneralLedgers: any[] = [];
  interestStructureDate = new Date(Date.now());
  generalLedger: any;
  structureArray: IUiInterestStructureModel[] = [];
  uiPeriods = [new UiValueType(1, "Days"), new UiValueType(2, "Months")];
  uiDepositInterestRate :any;
  isAddMode = true;
  datepickerConfig: BsDatepickerConfig;
  
  constructor(private router: Router, private _generalLedgerService: GeneralLedgerService,
    private _sharedService: SharedService, private _depositInterestRateService: DepositInterestRateService , 
    private _toastrService: ToastrService) { }

  ngOnInit(): void {
    this.datepickerConfig = this._sharedService.getDatepickerConfig();
    this.datepickerConfig.maxDate = new Date(Date.now());

    this.getGeneralLedgers();
    this.prepareTable();
  }

  getGeneralLedgers(){
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

  prepareTable()
  {
    this.structureArray = [];
     for (let index = 0; index < 8; index++) {
      let row = {} as IUiInterestStructureModel;
      row.id = 0;
      row.index = index;
      row.fromAmount = 1;
      row.toAmount = 9999999999;
      row.period = 1;
      row.fromPeriod = 0;
      row.toPeriod = 0;
      row.preMatureRate = 0;
      row.regularInterestRate = 0;
      row.afterExpiryRate = 0;

      this.structureArray.push(row);
      
     }
  }

  showSctructure()
  {
    this.prepareTable();
    this.uiDepositInterestRate = {};
    this.getDepositInterestRates();
  }

  getDepositInterestRates(){
    this._depositInterestRateService.getDepositRatesByGL(this.generalLedger.code, 
      formatDate(new Date(this.interestStructureDate), 'yyyy-MM-dd', 'en')).subscribe((data: any) => {
     
      if (data) {
        let response = data.data.data;
        if (response) {
          this.uiDepositInterestRate = response;
          if (this.uiDepositInterestRate.id > 0 && this.uiDepositInterestRate.mstDepositIntRateStruct) {

            this.interestStructureDate = new Date(this.uiDepositInterestRate.intSetDate);

            this.uiDepositInterestRate.mstDepositIntRateStruct.forEach((schedule: any) => {
              this.structureArray[schedule.rowIndex].id = schedule.id;
              this.structureArray[schedule.rowIndex].fromAmount = schedule.fromAmount;
              this.structureArray[schedule.rowIndex].toAmount = schedule.toAmount;
              this.structureArray[schedule.rowIndex].period = (schedule.periodFlag == "D") ? 1 : 2;
              this.structureArray[schedule.rowIndex].fromPeriod = schedule.fromPeriod;
              this.structureArray[schedule.rowIndex].toPeriod = schedule.toPeriod;
              this.structureArray[schedule.rowIndex].preMatureRate = schedule.preMatureRate;
              this.structureArray[schedule.rowIndex].regularInterestRate = schedule.regularRate;
              this.structureArray[schedule.rowIndex].afterExpiryRate = schedule.afterExpiryRate;
              this.structureArray[schedule.rowIndex].depositInterestRateId = schedule.IntRateStructureId;
            });
            this.isAddMode = false;
          }
          else
          {
            this.isAddMode = true;
            this.interestStructureDate = new Date(Date.now());
            this.uiDepositInterestRate = {};
          }
        }
      }
    })
  }

  clear()
  {
    this.uiDepositInterestRate = {};
    this.isAddMode = true;
    this.prepareTable();
  }

  validateForm()
  {
    return true;
  }

  saveStructure()
  {
    if (this.validateForm()) {
      let depositInterestRateModel = {} as IDepositInterestRate;

      let originalDate = this.uiDepositInterestRate ? formatDate(new Date(this.uiDepositInterestRate.intSetDate), 'yyyy-MM-dd', 'en'):"";
      let changedDate = formatDate(new Date(this.interestStructureDate), 'yyyy-MM-dd', 'en');

      depositInterestRateModel.BranchCode = this._sharedService.applicationUser.branchId;
      depositInterestRateModel.GLId = this.generalLedger.code;
      depositInterestRateModel.IntSetDate = formatDate(new Date(this.interestStructureDate), 'yyyy-MM-dd', 'en');
      depositInterestRateModel.Type = 'D';
      depositInterestRateModel.CreatedBy = this._sharedService.applicationUser.id;
      depositInterestRateModel.mstDepositIntRateStruct = [];
      depositInterestRateModel.Id = 0;

      if (originalDate == changedDate) {
        depositInterestRateModel.Id = (this.uiDepositInterestRate && this.uiDepositInterestRate.id) ? this.uiDepositInterestRate.id : 0;
      }
     
      console.log(depositInterestRateModel);

      for (let index = 0; index < this.structureArray.length; index++) {
        let model = {} as IDepositInterestRateScheduleModel;
        model.Id = 0;
        model.IntRateStructureId = 0;
        if (originalDate == changedDate) {
          model.Id = this.structureArray[index].id;
          model.IntRateStructureId = (this.uiDepositInterestRate && this.uiDepositInterestRate.id) ? this.uiDepositInterestRate.id : 0;
        }
        
        model.RowIndex = this.structureArray[index].index;
        model.FromAmount = this.structureArray[index].fromAmount.toString();
        model.ToAmount = this.structureArray[index].toAmount.toString();
        model.PeriodFlag = (this.structureArray[index].period ==1) ? "D": "M";
        model.FromPeriod = this.structureArray[index].fromPeriod;
        model.ToPeriod = this.structureArray[index].toPeriod;
        model.PreMatureRate = this.structureArray[index].preMatureRate;
        model.RegularRate = this.structureArray[index].regularInterestRate;
        model.AfterExpiryRate = this.structureArray[index].afterExpiryRate;
        depositInterestRateModel.mstDepositIntRateStruct.push(model);
      }

      this._depositInterestRateService.saveDepositRateStructure(depositInterestRateModel).subscribe((data: any) => {
       
        if (data) {
          if (data.statusCode == 200 && data.data.data.retId > 0) {
            this._toastrService.success('Deposit interest structure saved.', 'Success!');
            this.getDepositInterestRates();
          }
        }
      })
    }
  }
}
