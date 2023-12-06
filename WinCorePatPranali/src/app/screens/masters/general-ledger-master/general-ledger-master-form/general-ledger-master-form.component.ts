import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { IGeneralLedgerDTO, UiEnumGeneralMaster, UiValueType } from 'src/app/common/models/common-ui-models';
import { GeneralLedgerService } from 'src/app/services/masters/general-ledger/general-ledger.service';
import { GeneralMasterService } from 'src/app/services/masters/general-master/general-master.service';
import { SharedService } from 'src/app/services/shared.service';

interface IGLMasterServerModel {
  Id: number;
  Name: string;
  GLGroupId: string;
  HasSubAccounts: boolean;
  InterestRate: number;
  OpenDate: Date;
  OpenBalance: number;
  AccountTypeId: number;
  RegularScheduleId: number;
  AssetScheduleId: number;
  LiabilityScheduleId: number;
  BranchId: number;
}


@Component({
  selector: 'app-general-ledger-master-form',
  templateUrl: './general-ledger-master-form.component.html',
  styleUrls: ['./general-ledger-master-form.component.css']
})
export class GeneralLedgerMasterFormComponent implements OnInit {

  glForm!: FormGroup;
  id!: number;
  maxId!: number;
  uiGLGroups: any = [];
  uiTypeOfAccounts: any = [];
  uiScheduleMasters: any = [];
  datepickerConfig!:Partial<BsDatepickerConfig>;
  todate=new Date();
  uiSubAccounts = [new UiValueType(1, "Yes"), new UiValueType(2, "No")];

  newCode!: string;
  isAddMode!: boolean;

  dto: IGeneralLedgerDTO = {} as IGeneralLedgerDTO;

  constructor(private router: Router, private _sharedService: SharedService,
    private _generalLedgerService: GeneralLedgerService, private _generalMasterService: GeneralMasterService,) {

      this.datepickerConfig=Object.assign({},{containerClass:'theme-green',showWeekNumbers:false,showTodayButton:true},
      {dateInputFormat:'DD/MM/YYYY'},
      {minDate:new Date(2000,1,1)},
      {maxDate:new Date(2050,12,31)}
      );
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
      openDate: new FormControl(formatDate(new Date(Date.now()), 'yyyy-MM-dd', 'en'), [Validators.required]),
      balance: new FormControl("", []),
      openBalance: new FormControl("", [Validators.required]),
      accountType: new FormControl(this.uiTypeOfAccounts[0].id, [Validators.required]),
      regularSchedule: new FormControl(1, [Validators.required]),
      assetSchedule: new FormControl(1, [Validators.required]),
      liabilitySchedule: new FormControl(1, [Validators.required]),
    });

    this.getScheduleMaster();

  }

  fromJsonDate(jDate:any): string {
    const bDate: Date = new Date(jDate);
    return bDate.toISOString().substring(0, 10);  //Ignore time
  }

  getScheduleMaster() {
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

  loadForm() {
    this._generalLedgerService.getDTO().subscribe(obj => this.dto = obj);

    if (this.dto) {
      this.id = this.dto.id;

      if (this.dto.id == 0) {
        this.isAddMode = true;
        this.maxId = this.dto.maxId;
        this.glForm.patchValue({
          code: this.maxId + 1,
          regularSchedule: this.uiScheduleMasters[0].id,
          assetSchedule: this.uiScheduleMasters[0].id,
          liabilitySchedule: this.uiScheduleMasters[0].id,
        });
      }
      else {
        this.isAddMode = false;
        // edit a record
        this._generalLedgerService.getGeneralLedger(this.dto.id).subscribe((data: any) => {
          if (data) {
            if (data.statusCode == 200 && data.data.data) {
              var generalLedger = data.data.data;
              this.glForm.patchValue({
                code: generalLedger.id,
                name: generalLedger.name,
                group: generalLedger.glGroupId,
                subAccounts: generalLedger.hasSubAccounts ? 1 : 2,
                interestRate: generalLedger.interestRate,
                openDate: formatDate(new Date(generalLedger.openDate), 'yyyy-MM-dd', 'en'),
                balance: generalLedger.balance,
                openBalance: generalLedger.openBalance,
                accountType: generalLedger.accountTypeId,
                regularSchedule: generalLedger.regularScheduleId,
                assetSchedule: generalLedger.assetScheduleId,
                liabilitySchedule: generalLedger.liabilityScheduleId,
              });

              this.glForm.controls['openDate'].disable()
              this.glForm.controls['openBalance'].disable()
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

  public saveGLMaster(): void {
    if (this.validateForm()) {
      let glMasterModel = {} as IGLMasterServerModel;

      glMasterModel.Id = 0;
      glMasterModel.Name = this.name.value.toString();
      glMasterModel.GLGroupId = this.group.value.toString();
      glMasterModel.HasSubAccounts = (this.subAccounts.value.toString() == "1" ? true : false);
      glMasterModel.InterestRate = this.interestRate.value.toString();
      glMasterModel.OpenDate = this.openDate.value.toString();
      glMasterModel.OpenBalance = this.openBalance.value.toString();
      glMasterModel.AccountTypeId = this.accountType.value.toString();
      glMasterModel.RegularScheduleId = this.regularSchedule.value.toString();
      glMasterModel.AssetScheduleId = this.assetSchedule.value.toString();
      glMasterModel.LiabilityScheduleId = this.liabilitySchedule.value.toString();
      glMasterModel.BranchId = this._sharedService.applicationUser.branchId;

      console.log(glMasterModel);

      if (this.isAddMode) {
        this._generalLedgerService.createGeneralLedger(glMasterModel).subscribe((data: any) => {
          console.log(data);
          if (data) {
            if (data.statusCode == 200 && data.data.data == 1) {
              this.configClick("general-ledger-list");
            }
          }
        })
      }
      else {
        this._generalLedgerService.updateGeneralLedger(this.id, glMasterModel).subscribe((data: any) => {
          console.log(data);
          if (data) {
            if (data.statusCode == 200 && data.data.data == 1) {
              this.configClick("general-ledger-list");
            }
          }
        })
      }

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
      balance: new FormControl("", []),
      openBalance: new FormControl("", [Validators.required]),
      accountType: new FormControl(this.uiTypeOfAccounts[0].id, [Validators.required]),
      regularSchedule: new FormControl(1, [Validators.required]),
      assetSchedule: new FormControl(1, [Validators.required]),
      liabilitySchedule: new FormControl(1, [Validators.required]),
    });
  }

  configClick(routeValue: string) {
    sessionStorage.setItem("configMenu", routeValue);
    this.router.navigate(['/app/' + routeValue]);
  }

}
