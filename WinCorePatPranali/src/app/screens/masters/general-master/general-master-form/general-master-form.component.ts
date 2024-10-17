import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { IGeneralMasterDTO, UiEnumGeneralMaster } from 'src/app/common/models/common-ui-models';
import { GeneralMasterService } from 'src/app/services/masters/general-master/general-master.service';
import { SharedService } from 'src/app/services/shared.service';

interface IGeneralMasterServerModel {
  ConstId: number;
  Identifier: number;
  ConstantNo: number;
  ShortName: string;
  Constantname: string
}

@Component({
  selector: 'app-general-master-form',
  templateUrl: './general-master-form.component.html',
  styleUrls: ['./general-master-form.component.css']
})
export class GeneralMasterFormComponent {

  generalMasterForm!: FormGroup;
  id!: number;
  maxId!: number;

  newCode!: string;
  isAddMode!: boolean;

  dto: IGeneralMasterDTO = {} as IGeneralMasterDTO;
  uiGeneralMasters: any[] = [];

  constructor(private router: Router, private _sharedService: SharedService,
    private _generalMasterService: GeneralMasterService,
    private _toastrService: ToastrService) {
  }

  ngOnInit() {

    this.generalMasterForm = new FormGroup({
      constId: new FormControl(0, []),
      masterType: new FormControl("", []),
      fullName: new FormControl("", [Validators.required]),
      shortName: new FormControl("", [Validators.required]),
    });

    this._sharedService.getDTO().subscribe(obj => this.dto = obj);

    this.getBranchGeneralMasters(this.dto.masterId).then(result => {
      if (result) {
        this.loadForm();
      }
    }).catch(error => {
      this._toastrService.error('Error loading general ledgers', 'Warning!');
    });
  }

  loadForm() {
    if (this.dto.id >= 0) {
      this.id = this.dto.id;

      if (this.dto.id == 0) {
        this.isAddMode = true;
        this.generalMasterForm.patchValue({
          constId: 0,
          masterType: this.dto.masterType,
        });
      }
      else {
        this.isAddMode = false;
        // edit a record
        this.generalMasterForm.patchValue({
          constId: this.dto.id,
          masterType: this.dto.masterType,
          shortName: this.dto.shortName,
          fullName: this.dto.fullName,
        });
      }
    }
    else {
      this.configClick('master-list');
    }
  }

  getBranchGeneralMasters(masterId: number) {
    return new Promise((resolve, reject) => {
      this._generalMasterService.getAllGeneralMasters(masterId).subscribe((data: any) => {
        if (data) {
          this.uiGeneralMasters = data.data.data;
          resolve(true);
        }
        else {
          resolve(false);
        }
      })
    })
  }

  public saveGeneralMaster(): void {
    if (this.validateForm()) {

      if (this.isGeneralMasterExists()) {
        this._toastrService.error(this.dto.masterType + ' already exists.', 'Error!');
        return;
      }
      let generalMasterModel = {} as IGeneralMasterServerModel;

      generalMasterModel.ConstId = this.constId.value.toString();
      generalMasterModel.Identifier = this.dto.masterId;
      generalMasterModel.ConstantNo = this.dto.constantNo;
      generalMasterModel.ShortName = this.shortName.value.toString();
      generalMasterModel.Constantname = this.fullName.value.toString();

      console.log(generalMasterModel);

      this._generalMasterService.saveGeneralMaster(generalMasterModel).subscribe((data: any) => {
        console.log(data);
        if (data) {
          if (data.statusCode == 200 && data.data.data.retId > 0) {

            let masterName = UiEnumGeneralMaster[this.dto.masterId];

            this._toastrService.success(masterName + ' general master saved.', 'Success!');
            this.configClick("master-list");
          }
          else {
            this._toastrService.error(data.data.data.message, 'Error!');
          }
        }
      })

    }
  }

  public isGeneralMasterExists(): boolean {
    let name = this.fullName.value;
    let constId = parseInt(this.constId.value);
    let modelIndex = this.uiGeneralMasters.findIndex(b=>b.constantname.toLowerCase() == name.toLowerCase() &&
    b.identifier == this.dto.masterId && b.id != constId);
    if (modelIndex > -1) {
      return true;
    }
    return false;
  }

  public validateForm(): boolean {

    if (this.generalMasterForm.invalid) {
      for (const control of Object.keys(this.generalMasterForm.controls)) {
        this.generalMasterForm.controls[control].markAsTouched();
      }
      return false;
    }
    return true;
  }

  public clear(): void {
    this.generalMasterForm.patchValue({
      constId: 0,
      masterType: "",
      shortName: "",
      fullName: "",
    });
  }

  configClick(routeValue: string) {
    sessionStorage.setItem("configMenu", routeValue);
    this.router.navigate(['/app/' + routeValue]);
  }

  get constId() {
    return this.generalMasterForm.get('constId')!;
  }

  get masterType() {
    return this.generalMasterForm.get('masterType')!;
  }

  get shortName() {
    return this.generalMasterForm.get('shortName')!;
  }

  get fullName() {
    return this.generalMasterForm.get('fullName')!;
  }
}
