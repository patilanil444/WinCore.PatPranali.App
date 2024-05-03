import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { ToastrService } from 'ngx-toastr';
import { IGeneralLedgerDTO, UiEnumGeneralMaster, UiValueType } from 'src/app/common/models/common-ui-models';
import { GeneralLedgerService } from 'src/app/services/masters/general-ledger/general-ledger.service';
import { GeneralMasterService } from 'src/app/services/masters/general-master/general-master.service';
import { SharedService } from 'src/app/services/shared.service';

interface IGLMasterServerModel {
  Code: number;
  GlName: string;
  LocalName: string;
  ShortDesc: string;
  Opn_Bal : number;
  Balance : number;
  GLType : string;
  GLGroup: string;
  OpBlDt: Date;
  Int_Rate : number;
  Schedule: number;
  AssetSche : number;
  LiabSche : number;
  Createdby : string;
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
  uiAllGLTypes: any = [];
  uiGLTypes: any = [];
  uiScheduleMasters: any = [];
  datepickerConfig!:Partial<BsDatepickerConfig>;
  todate=new Date();
  //uiSubAccounts = [new UiValueType(1, "Yes"), new UiValueType(2, "No")];

  newCode!: string;
  isAddMode!: boolean;

  dto: IGeneralLedgerDTO = {} as IGeneralLedgerDTO;

  constructor(private router: Router, private _sharedService: SharedService,
    private _generalLedgerService: GeneralLedgerService, private _generalMasterService: GeneralMasterService,
    private _toastrService: ToastrService) {

      this.datepickerConfig=Object.assign({},{containerClass:'theme-green',showWeekNumbers:false,showTodayButton:true},
      {dateInputFormat:'DD/MM/YYYY'},
      {minDate:new Date(2000,1,1)},
      {maxDate:new Date(2050,12,31)}
      );
  }

  ngOnInit() {

    let glTypesAndGroups = this._sharedService.uiGLTypesAndGroups;
    if (glTypesAndGroups && glTypesAndGroups.length > 0) {
      this.uiAllGLTypes = glTypesAndGroups;
      this.uiGLGroups = this.getUniqueGLGroups("groupCode", glTypesAndGroups);

      if (this.uiGLGroups && this.uiGLGroups.length) {
        let gltypes = this.uiAllGLTypes.filter((t: any) => t.groupCode == this.uiGLGroups[0].groupCode);
        if (gltypes && gltypes.length) {
          this.uiGLTypes = gltypes;
        }
      }
    }

    // this.uiGLGroups = this.retrieveMasters(UiEnumGeneralMaster.GLGROUP); //this._sharedService.uiGLGroups;
    // this.uiGLTypes = this.retrieveMasters(UiEnumGeneralMaster.GLTYPE); // this._sharedService.uiGLTypes;
    this.uiScheduleMasters = this.retrieveMasters(UiEnumGeneralMaster.SCHEDULE); // this._sharedService.uiGLTypes;

    this.glForm = new FormGroup({
      name: new FormControl("", [Validators.required]),
      localName: new FormControl("", []),
      shortName: new FormControl("", [Validators.required]),
      group: new FormControl("", [Validators.required]),
      type: new FormControl("", [Validators.required]),
      interestRate: new FormControl("", [Validators.required]),
      openDate: new FormControl(formatDate(new Date(), 'yyyy-MM-dd', 'en'), [Validators.required]),
      balance: new FormControl(0, []),
      openBalance: new FormControl(0, []),
      regularSchedule: new FormControl(1, [Validators.required]),
      assetSchedule: new FormControl(1, [Validators.required]),
      liabilitySchedule: new FormControl(1, [Validators.required]),
    });

    this.loadForm();
  }

  getUniqueGLGroups(prop: string, list: any) 
   {
    const objUniq = list.reduce((res:any, item:any) => ({ ...res, [item[prop]]: item }), {})
    return Object.keys(objUniq).map(item => objUniq[item])
   }

  retrieveMasters(uiEnumGeneralMaster: UiEnumGeneralMaster) {
    let mastersData = this._sharedService.uiAllMasters.filter((m: any) => m.identifier == uiEnumGeneralMaster);
    if (mastersData && mastersData.length) {
      let masters = mastersData.filter((m: any) => m.identifier == uiEnumGeneralMaster);
      return masters[0].codeTables;
    }
    return [];
  }

  changeTypes(event:any)
  {
    let targetValue = event.target.value;
    let groupCode = targetValue.split(":");
    if (groupCode && groupCode.length) {
      let code = groupCode[1].toString().trim();
      this.uiGLTypes = [];
      let gltypes = this.uiAllGLTypes.filter((d: any) => d.groupCode == code);
      if (gltypes && gltypes.length) {
        this.uiGLTypes = gltypes;
       
        this.glForm.patchValue({
          type: (this.uiGLTypes && this.uiGLTypes.length) ? this.uiGLTypes[0].glType: "",
        });
      }
      else {
        this.uiGLTypes = [];
      }
    } 
  }

  fromJsonDate(jDate:any): string {
    const bDate: Date = new Date(jDate);
    return bDate.toISOString().substring(0, 10);  //Ignore time
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
          group: (this.uiGLGroups && this.uiGLGroups.length) ? this.uiGLGroups[0].groupCode: "",
          type: (this.uiGLTypes && this.uiGLTypes.length) ? this.uiGLTypes[0].glType: "",
          regularSchedule: (this.uiScheduleMasters && this.uiScheduleMasters.length) ? this.uiScheduleMasters[0].id : 0,
          assetSchedule: (this.uiScheduleMasters && this.uiScheduleMasters.length) ? this.uiScheduleMasters[0].id : 0,
          liabilitySchedule: (this.uiScheduleMasters && this.uiScheduleMasters.length) ? this.uiScheduleMasters[0].id : 0,
        });
      }
      else {
        this.isAddMode = false;
        // edit a record
        this._generalLedgerService.getGeneralLedger(this.dto.id).subscribe((data: any) => {
          if (data) {
            if (data.statusCode == 200 && data.data.data) {
              var generalLedger = data.data.data;

              let gltypes = this.uiAllGLTypes.filter((d: any) => d.groupCode == generalLedger.glGroup);
              if (gltypes && gltypes.length) {
                this.uiGLTypes = gltypes;
              }
              else {
                this.uiGLTypes = [];
              }

              this.glForm.patchValue({
                name: generalLedger.glName,
                localName : generalLedger.localName,
                shortName : generalLedger.shortDesc,
                group: generalLedger.glGroup,
                type: generalLedger.glType,
                interestRate: generalLedger.int_Rate,
                openDate: formatDate(new Date(generalLedger.opBlDt), 'yyyy-MM-dd', 'en'),
                balance: generalLedger.balance,
                openBalance: generalLedger.opn_Bal,
                regularSchedule: generalLedger.schedule,
                assetSchedule: generalLedger.assetSche,
                liabilitySchedule: generalLedger.liabSche,
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

  get localName() {
    return this.glForm.get('localName')!;
  }

  get shortName() {
    return this.glForm.get('shortName')!;
  }

  get group() {
    return this.glForm.get('group')!;
  }

  get type() {
    return this.glForm.get('type')!;
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

      glMasterModel.Code = this.dto.id;
      glMasterModel.GlName = this.name.value.toString();
      glMasterModel.LocalName = this.localName.value.toString();
      glMasterModel.ShortDesc = this.shortName.value.toString();
      glMasterModel.Opn_Bal = this.openBalance.value ? this.openBalance.value.toString() : 0;
      glMasterModel.Balance = this.balance.value ? this.balance.value.toString() : 0;
      glMasterModel.GLType = this.type.value.toString();
      glMasterModel.GLGroup = this.group.value.toString();
      glMasterModel.OpBlDt = this.openDate.value.toString();
      glMasterModel.Int_Rate = this.interestRate.value.toString();
      glMasterModel.Schedule = this.regularSchedule.value.toString();
      glMasterModel.AssetSche = this.assetSchedule.value.toString();
      glMasterModel.LiabSche = this.liabilitySchedule.value.toString();
      glMasterModel.Createdby = this._sharedService.applicationUser.userName;
      
      console.log(glMasterModel);

      this._generalLedgerService.saveGeneralLedger(glMasterModel).subscribe((data: any) => {
        console.log(data);
        if (data) {
          if (data.statusCode == 200 && data.data.data.retId > 0) {
            this._toastrService.success('General ledger saved.', 'Success!');
            this.configClick("general-ledger-list");
          }
        }
      })
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
      accountType: new FormControl(this.uiGLTypes[0].id, [Validators.required]),
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
