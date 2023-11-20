import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IGeneralMasterDTO } from 'src/app/common/models/common-ui-models';
import { SharedService } from 'src/app/services/common/shared.service';
import { GeneralMasterService } from 'src/app/services/general-master/general-master.service';

interface IGeneralMasterServerModel {
  Id: number;
  GeneralMasterId: number;
  BranchMasterName: string;
  BranchId:number
}

@Component({
  selector: 'app-general-master-form',
  templateUrl: './general-master-form.component.html',
  styleUrls: ['./general-master-form.component.css']
})
export class GeneralMasterFormComponent {

  priorityForm!: FormGroup;
  id!: number;
  maxId!: number;

  newCode!: string;
  isAddMode!: boolean;

  dto: IGeneralMasterDTO = {} as IGeneralMasterDTO;

  constructor(private router: Router, private _sharedService: SharedService,
    private _generalMasterService: GeneralMasterService) {
   }

   ngOnInit() {

    this.priorityForm = new FormGroup({
      masterType: new FormControl("", []),
      code: new FormControl("", []),
      name: new FormControl("", [Validators.required]),
    });

    this._sharedService.getDTO().subscribe(obj => this.dto = obj);

    if (this.dto) {
      this.id = this.dto.id;

      if (this.dto.id == 0) {
        this.isAddMode = true;
        // call a service to get max id for masterId
        this._generalMasterService.getMaxGeneralMasterId().subscribe((data: any) => {
          if (data) {
            this.maxId = data.data.data;
            this.priorityForm.patchValue({
              masterType: this.dto.masterType,
              code: this.maxId + 1
           });
          }
        })
      }  
      else 
      {
        this.isAddMode = false;
         // edit a record
         this._generalMasterService.getGeneralMaster(this.dto.id).subscribe((data: any) => {
          if (data) {
            if (data.statusCode == 200 && data.data.data) {
              var generalMaster = data.data.data;
              this.priorityForm = new FormGroup({
                masterType: new FormControl(this.dto.masterType, []),
                code: new FormControl(generalMaster.id, []),
                name: new FormControl(generalMaster.branchMasterName, [Validators.required]),
              });
            }
          }
        })
      }
    }
  }

  get name() {
    return this.priorityForm.get('name')!;
  }

  public saveGeneralMaster(): void {
    if (this.validateForm()) {
      let generalMasterModel = {} as IGeneralMasterServerModel;

      generalMasterModel.BranchMasterName = this.name.value.toString();
      generalMasterModel.GeneralMasterId = this.dto.masterId;
      generalMasterModel.BranchId = this._sharedService.applicationUser.branchId;
      console.log(generalMasterModel);

      if (this.isAddMode) {
        this._generalMasterService.createGeneralMaster(generalMasterModel).subscribe((data: any) => {
          console.log(data);
          if (data) {
            if (data.statusCode == 200 && data.data.data == 1) {
              this.configClick("master-list");
            }
          }
        })
      }
      else  
      {
        this._generalMasterService.updateGeneralMaster(this.id, generalMasterModel).subscribe((data: any) => {
          console.log(data);
          if (data) {
            if (data.statusCode == 200 && data.data.data == 1) {
              this.configClick("master-list");
            }
          }
        })
      }

    }
  }

  public validateForm(): boolean {

    if (this.priorityForm.invalid) {
      for (const control of Object.keys(this.priorityForm.controls)) {
        this.priorityForm.controls[control].markAsTouched();
      }
      return false;
    }
    return true;
  }

  public clear(): void {
    this.priorityForm = new FormGroup({
      name: new FormControl("", [Validators.required]),
    });
  }

  configClick(routeValue: string) {
    sessionStorage.setItem("configMenu", routeValue);
    this.router.navigate(['/app/'+ routeValue]);
  }
}
