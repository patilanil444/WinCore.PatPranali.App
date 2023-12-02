import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UiEnumGeneralMaster } from 'src/app/common/models/common-ui-models';
import { GeneralLedgerService } from 'src/app/services/masters/general-ledger/general-ledger.service';
import { GeneralMasterService } from 'src/app/services/masters/general-master/general-master.service';
import { SharedService } from 'src/app/services/shared.service';

interface IUiInterestStructureModel {
  index: number;
  fromAmount: number;
  toAmount: number;
  rate: number;
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
  structureArray: IUiInterestStructureModel[] = [];

  
  constructor(private router: Router, private _generalLedgerService: GeneralLedgerService,
    private _sharedService: SharedService, private _generalMasterService: GeneralMasterService) { }

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
     for (let index = 0; index < 8; index++) {
      let row = {} as IUiInterestStructureModel;
      row.index = index;
      row.fromAmount = 1;
      row.toAmount = 999999;
      row.rate = 0;
      this.structureArray.push(row);
      
     }
  }

  showSctructure()
  {


  }

  saveStructure()
  {
    
  }

}
