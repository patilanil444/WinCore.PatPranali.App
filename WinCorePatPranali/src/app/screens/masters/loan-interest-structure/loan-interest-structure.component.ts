import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UiEnumGeneralMaster } from 'src/app/common/models/common-ui-models';
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

interface ILoanInterestRate{
  Id : number,
  GeneralLedgerId: number,
  InterestSetDate: Date,
  FromPurposeId: number,
  ToPurposeId: number,
  BranchId: number,
  Schedules: ILoanInterestRateScheduleModel[]
}

interface ILoanInterestRateScheduleModel
{
  Id: number,
  RowIndex: number,
  FromAmount: string,
  ToAmount: string,
  InterestRate: number,
  LoanInterestRateId: number
}

@Component({
  selector: 'app-loan-interest-structure',
  templateUrl: './loan-interest-structure.component.html',
  styleUrls: ['./loan-interest-structure.component.css']
})
export class LoanInterestStructureComponent implements OnInit {

  uiGeneralLedgers: any[] = [];
  uiPurposeMasters: any[] = [];
  interestStructureDate = formatDate(new Date(Date.now()), 'yyyy-MM-dd', 'en');
  generalLedgerId = 0;
  purposeFromId = 0;
  purposeToId = 0;
  uiLoanInterestRate :any;
  isAddMode = true;
  structureArray: IUiInterestStructureModel[] = [];

  
  constructor(private router: Router, private _generalLedgerService: GeneralLedgerService,
    private _sharedService: SharedService, private _generalMasterService: GeneralMasterService,
    private _loanInterestRateService: LoanInterestRateService, private _toastrService: ToastrService) { }

  ngOnInit(): void {
    this.getGeneralLedgers();
    this.getPurposeMaster();
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

  getPurposeMaster()
  {
    let branchGeneralMasterModel = {
      GeneralMasterId: UiEnumGeneralMaster.PurposeMaster,
      BranchId: this._sharedService.applicationUser.branchId
    }
    this._generalMasterService.getAllGeneralMasters(branchGeneralMasterModel).subscribe((data: any) => {
      if (data) {
        this.uiPurposeMasters = data.data.data;
        if (this.uiPurposeMasters) {
          this.purposeFromId = this.uiPurposeMasters[0].id;
          this.purposeToId = this.uiPurposeMasters[0].id;
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
      row.toAmount = 999999999;
      row.interestRate = 0;
      this.structureArray.push(row);
     }
  }

  showSctructure()
  {
    this.prepareTable();
    this.uiLoanInterestRate = {};
    this.getLoanInterestRates();

  }

  getLoanInterestRates(){
    this._loanInterestRateService.getLoanRatesByGL(this.generalLedgerId).subscribe((data: any) => {
      console.log(data);
      if (data) {
        let response = data.data.data;
        if (response) {
          this.uiLoanInterestRate = response;
          if (this.uiLoanInterestRate.id > 0 && this.uiLoanInterestRate.schedules) {

            this.interestStructureDate = formatDate(new Date(this.uiLoanInterestRate.interestSetDate), 'yyyy-MM-dd', 'en');
            this.purposeFromId = this.uiLoanInterestRate.fromPurposeId;
            this.purposeToId = this.uiLoanInterestRate.toPurposeId;

            this.uiLoanInterestRate.schedules.forEach((schedule: any) => {
              this.structureArray[schedule.rowIndex].id = schedule.id;
              this.structureArray[schedule.rowIndex].fromAmount = schedule.fromAmount;
              this.structureArray[schedule.rowIndex].toAmount = schedule.toAmount;
              this.structureArray[schedule.rowIndex].interestRate = schedule.interestRate;
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
    this.uiLoanInterestRate = {};
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
      let loanInterestRateModel = {} as ILoanInterestRate;

      loanInterestRateModel.BranchId = this._sharedService.applicationUser.branchId;
      loanInterestRateModel.GeneralLedgerId = this.generalLedgerId;
      loanInterestRateModel.FromPurposeId = this.purposeFromId;
      loanInterestRateModel.ToPurposeId = this.purposeToId;
      loanInterestRateModel.InterestSetDate = new Date(this.interestStructureDate);
      loanInterestRateModel.Schedules = [];
      loanInterestRateModel.Id = 0;
      console.log(loanInterestRateModel);

      for (let index = 0; index < this.structureArray.length; index++) {
        let model = {} as ILoanInterestRateScheduleModel;
        model.Id = this.structureArray[index].id;
        model.RowIndex = this.structureArray[index].index;
        model.FromAmount = this.structureArray[index].fromAmount.toString();
        model.ToAmount = this.structureArray[index].toAmount.toString();
        model.InterestRate = this.structureArray[index].interestRate;
        model.LoanInterestRateId = this.structureArray[index].loanInterestRateId;
        loanInterestRateModel.Schedules.push(model);
      }

      if (this.isAddMode) {
        this._loanInterestRateService.createLoanRateStructure(loanInterestRateModel).subscribe((data: any) => {
          console.log(data);
          if (data) {
            if (data.statusCode == 200 && data.data.data > 0) {
              this._toastrService.success('Loan interest structure added.', 'Success!');
              //this.configClick("banks");
              this.getLoanInterestRates();
            }
          }
        })
      }
      else  
      {
        this._loanInterestRateService.updateLoanRateStructure(parseInt(this.uiLoanInterestRate.id), loanInterestRateModel).subscribe((data: any) => {
          console.log(data);
          if (data) {
            if (data.statusCode == 200 && data.data.data > 0) {
              this._toastrService.success('Loan interest structure updated.', 'Success!');
              //this.configClick("banks");
            }
          }
        })
      }

    }
  }

}
