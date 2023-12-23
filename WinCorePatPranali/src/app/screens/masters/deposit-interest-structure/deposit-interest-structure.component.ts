import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
  GeneralLedgerId: number,
  InterestSetDate: Date,
  BranchId: number,
  Schedules: IDepositInterestRateScheduleModel[]
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
  DepositInterestRateId: number
}

@Component({
  selector: 'app-deposit-interest-structure',
  templateUrl: './deposit-interest-structure.component.html',
  styleUrls: ['./deposit-interest-structure.component.css']
})
export class DepositInterestStructureComponent implements OnInit {

  uiGeneralLedgers: any[] = [];
  interestStructureDate = formatDate(new Date(Date.now()), 'yyyy-MM-dd', 'en');
  generalLedgerId = 0;
  structureArray: IUiInterestStructureModel[] = [];
  uiPeriods = [new UiValueType(1, "Days"), new UiValueType(2, "Months")];
  uiDepositInterestRate :any;
  isAddMode = true;
  
  constructor(private router: Router, private _generalLedgerService: GeneralLedgerService,
    private _sharedService: SharedService, private _depositInterestRateService: DepositInterestRateService , 
    private _toastrService: ToastrService) { }

  ngOnInit(): void {
    this.getGeneralLedgers();
    this.prepareTable();
  }

  getGeneralLedgers(){
    this._generalLedgerService.getGeneralLedgers(this._sharedService.applicationUser.branchId).subscribe((data: any) => {
      console.log(data);
      if (data) {
        this.uiGeneralLedgers = data.data.data;
        if (this.uiGeneralLedgers) {
          this.generalLedgerId = this.uiGeneralLedgers[0].id;
        }
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
    this._depositInterestRateService.getDepositRatesByGL(this.generalLedgerId).subscribe((data: any) => {
      console.log(data);
      if (data) {
        let response = data.data.data;
        if (response) {
          this.uiDepositInterestRate = response;
          if (this.uiDepositInterestRate.id > 0 && this.uiDepositInterestRate.schedules) {

            this.interestStructureDate = formatDate(new Date(this.uiDepositInterestRate.interestSetDate), 'yyyy-MM-dd', 'en');

            this.uiDepositInterestRate.schedules.forEach((schedule: any) => {
              this.structureArray[schedule.rowIndex].id = schedule.id;
              this.structureArray[schedule.rowIndex].fromAmount = schedule.fromAmount;
              this.structureArray[schedule.rowIndex].toAmount = schedule.toAmount;
              this.structureArray[schedule.rowIndex].period = (schedule.periodFlag == "D") ? 1 : 2;
              this.structureArray[schedule.rowIndex].fromPeriod = schedule.fromPeriod;
              this.structureArray[schedule.rowIndex].toPeriod = schedule.toPeriod;
              this.structureArray[schedule.rowIndex].preMatureRate = schedule.preMatureRate;
              this.structureArray[schedule.rowIndex].regularInterestRate = schedule.regularRate;
              this.structureArray[schedule.rowIndex].afterExpiryRate = schedule.afterExpiryRate;
              this.structureArray[schedule.rowIndex].depositInterestRateId = schedule.depositInterestRateId;
            });
            this.isAddMode = false;
          }
          else
          {
            this.isAddMode = true;
            this.interestStructureDate = formatDate(new Date(Date.now()), 'yyyy-MM-dd', 'en');
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

      depositInterestRateModel.BranchId = this._sharedService.applicationUser.branchId;
      depositInterestRateModel.GeneralLedgerId = this.generalLedgerId;
      depositInterestRateModel.InterestSetDate = new Date(this.interestStructureDate);
      depositInterestRateModel.Schedules = [];
      depositInterestRateModel.Id = 0;
      console.log(depositInterestRateModel);

      for (let index = 0; index < this.structureArray.length; index++) {
        let model = {} as IDepositInterestRateScheduleModel;
        model.Id = this.structureArray[index].id;
        model.RowIndex = this.structureArray[index].index;
        model.FromAmount = this.structureArray[index].fromAmount.toString();
        model.ToAmount = this.structureArray[index].toAmount.toString();
        model.PeriodFlag = (this.structureArray[index].period ==1) ? "D": "M";
        model.FromPeriod = this.structureArray[index].fromPeriod;
        model.ToPeriod = this.structureArray[index].toPeriod;
        model.PreMatureRate = this.structureArray[index].preMatureRate;
        model.RegularRate = this.structureArray[index].regularInterestRate;
        model.AfterExpiryRate = this.structureArray[index].afterExpiryRate;
        model.DepositInterestRateId = this.structureArray[index].depositInterestRateId
        depositInterestRateModel.Schedules.push(model);
      }

      if (this.isAddMode) {
        this._depositInterestRateService.createDepositRateStructure(depositInterestRateModel).subscribe((data: any) => {
          console.log(data);
          if (data) {
            if (data.statusCode == 200 && data.data.data > 0) {
              this._toastrService.success('Deposit interest structure added.', 'Success!');
              this.getDepositInterestRates();
            }
          }
        })
      }
      else  
      {
        this._depositInterestRateService.updateDepositRateStructure(parseInt(this.uiDepositInterestRate.id), depositInterestRateModel).subscribe((data: any) => {
          console.log(data);
          if (data) {
            if (data.statusCode == 200 && data.data.data > 0) {
              this._toastrService.success('Deposit interest structure updated.', 'Success!');
            }
          }
        })
      }

    }
  }

}
