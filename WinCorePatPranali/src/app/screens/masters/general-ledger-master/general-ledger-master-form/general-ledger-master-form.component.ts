import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IGeneralLedgerDTO, UiEnumGeneralMaster, UiValueType } from 'src/app/common/models/common-ui-models';
import { GeneralLedgerService } from 'src/app/services/masters/general-ledger/general-ledger.service';
import { GeneralMasterService } from 'src/app/services/masters/general-master/general-master.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-general-ledger-master-form',
  templateUrl: './general-ledger-master-form.component.html',
  styleUrls: ['./general-ledger-master-form.component.css']
})
export class GeneralLedgerMasterFormComponent implements OnInit {

  glForm!: FormGroup;
  id!: number;
  maxId!: number;
  uiGLGroups:any = [];
  uiTypeOfAccounts:any = [];
  uiScheduleMasters:any = [];

  uiSubAccounts = [new UiValueType(1, "Yes"), new UiValueType(2, "No")];

  newCode!: string;
  isAddMode!: boolean;

  dto: IGeneralLedgerDTO = {} as IGeneralLedgerDTO;

  constructor(private router: Router, private _sharedService: SharedService,
    private _generalLedgerService: GeneralLedgerService, private _generalMasterService: GeneralMasterService, ) {
   }

   ngOnInit() {

    this.uiGLGroups = this._sharedService.uiGLGroups;
    this.uiTypeOfAccounts = this._sharedService.uiTypeOfAccounts;

    this.glForm = new FormGroup({
      code: new FormControl("", []),
      name: new FormControl("", [Validators.required]),
      group: new FormControl(this.uiGLGroups[0].id, [Validators.required]),
      subAccounts: new FormControl(1, [Validators.required]),
      interestRate: new FormControl("", [Validators.required]),
      openDate: new FormControl(formatDate(new Date(new Date()), 'yyyy-MM-dd', 'en'), [Validators.required]),
      balance: new FormControl("", [Validators.required]),
      openBalance: new FormControl("", [Validators.required]),
      accountType: new FormControl(this.uiTypeOfAccounts[0].id, [Validators.required]),
      regularSchedule: new FormControl(1, [Validators.required]),
      assetSchedule: new FormControl(1, [Validators.required]),
      liabilitySchedule: new FormControl(1, [Validators.required]),
    });
     
    this.getScheduleMaster();
    
  }

  loadForm()
  {
    this._generalLedgerService.getDTO().subscribe(obj => this.dto = obj);

    if (this.dto) {
      this.id = this.dto.id;

      if (this.dto.id == 0) {
        this.isAddMode = true;
        this.maxId = this.dto.maxId;
            this.glForm.patchValue({
              code: this.maxId + 1,
              regularSchedule: this.uiScheduleMasters[0].id,
              assetSchedule : this.uiScheduleMasters[0].id,
              liabilitySchedule : this.uiScheduleMasters[0].id,
           });
      }  
      else 
      {
        this.isAddMode = false;
         // edit a record
         this._generalLedgerService.getGeneralLedger(this.dto.id).subscribe((data: any) => {
          if (data) {
            if (data.statusCode == 200 && data.data.data) {
              var generalLedger = data.data.data;
              this.glForm = new FormGroup({
                code: new FormControl(generalLedger.id, []),
                name: new FormControl(generalLedger.name, [Validators.required]),
                group: new FormControl(generalLedger.group, [Validators.required]),
                subAccounts: new FormControl(generalLedger.HasSubAccounts? 1: 2 , [Validators.required]),
                interestRate: new FormControl(generalLedger.interestRate, [Validators.required]),
                openDate: new FormControl(formatDate(new Date(generalLedger.openDate), 'yyyy-MM-dd', 'en'), [Validators.required]),
                balance: new FormControl(generalLedger.balance, [Validators.required]),
                openBalance: new FormControl(generalLedger.openBalance, [Validators.required]),
                accountType: new FormControl(generalLedger.accountTypeId, [Validators.required]),
                regularSchedule: new FormControl(generalLedger.regularScheduleId, [Validators.required]),
                assetSchedule: new FormControl(generalLedger.assetScheduleId, [Validators.required]),
                liabilitySchedule: new FormControl(generalLedger.liabilityScheduleId, [Validators.required]),
              });
            }
          }
        })
      }
    }
  }

  get name() {
    return this.glForm.get('name')!;
  }
  get group() {
    return this.glForm.get('group')!;
  }
  get subAccounts() {
    return this.glForm.get('subAccounts')!;
  }
  get interestRate() {
    return this.glForm.get('interestRate')!;
  }
  get openDate() {
    return this.glForm.get('openDate')!;
  }
  get balance() {
    return this.glForm.get('balance')!;
  }
  get openBalance() {
    return this.glForm.get('openBalance')!;
  }
  get accountType() {
    return this.glForm.get('accountType')!;
  }
  get regularSchedule() {
    return this.glForm.get('regularSchedule')!;
  }
  get assetSchedule() {
    return this.glForm.get('assetSchedule')!;
  }
  get liabilitySchedule() {
    return this.glForm.get('liabilitySchedule')!;
  }

  getScheduleMaster()
  {
    let branchGeneralMasterModel = {
      GeneralMasterId: UiEnumGeneralMaster.ScheduleMaster,
      BranchId: this._sharedService.applicationUser.branchId
    }
    this._generalMasterService.getAllGeneralMasters(branchGeneralMasterModel).subscribe((data: any) => {
      if (data) {
        this.uiScheduleMasters = data.data.data;

        this.loadForm();
      }
    })
  }

  public saveGeneralMaster(): void {
    if (this.validateForm()) {
      // let generalMasterModel = {} as IGeneralMasterServerModel;

      // generalMasterModel.BranchMasterName = this.name.value.toString();
      // generalMasterModel.GeneralMasterId = this.dto.masterId;
      // generalMasterModel.BranchId = this._sharedService.applicationUser.branchId;
      // console.log(generalMasterModel);

      // if (this.isAddMode) {
      //   this._generalLedgerService.createGeneralLedger(generalMasterModel).subscribe((data: any) => {
      //     console.log(data);
      //     if (data) {
      //       if (data.statusCode == 200 && data.data.data == 1) {
      //         this.configClick("master-list");
      //       }
      //     }
      //   })
      // }
      // else  
      // {
      //   this._generalLedgerService.createGeneralLedger(this.id, generalMasterModel).subscribe((data: any) => {
      //     console.log(data);
      //     if (data) {
      //       if (data.statusCode == 200 && data.data.data == 1) {
      //         this.configClick("master-list");
      //       }
      //     }
      //   })
      // }

    }
  }

  public validateForm(): boolean {

    if (this.glForm.invalid) {
      for (const control of Object.keys(this.glForm.controls)) {
        this.glForm.controls[control].markAsTouched();
      }
      return false;
    }
    return true;
  }

  public clear(): void {
    this.glForm = new FormGroup({
      name: new FormControl("", [Validators.required]),
      group: new FormControl(this.uiGLGroups[0].id, [Validators.required]),
      subAccounts: new FormControl(1, [Validators.required]),
      interestRate: new FormControl("", [Validators.required]),
      openDate: new FormControl(formatDate(new Date(new Date()), 'yyyy-MM-dd', 'en'), [Validators.required]),
      balance: new FormControl("", [Validators.required]),
      openBalance: new FormControl("", [Validators.required]),
      accountType: new FormControl(this.uiTypeOfAccounts[0].id, [Validators.required]),
      regularSchedule: new FormControl(1, [Validators.required]),
      assetSchedule: new FormControl(1, [Validators.required]),
      liabilitySchedule: new FormControl(1, [Validators.required]),
    });
  }

  configClick(routeValue: string) {
    sessionStorage.setItem("configMenu", routeValue);
    this.router.navigate(['/app/'+ routeValue]);
  }

}
