import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { IGeneralMasterDTO } from 'src/app/common/models/common-ui-models';
import { GeneralMasterService } from 'src/app/services/masters/general-master/general-master.service';
import { SharedService } from 'src/app/services/shared.service';

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

  generalMasterForm!: FormGroup;
  id!: number;
  maxId!: number;

  newCode!: string;
  isAddMode!: boolean;

  dto: IGeneralMasterDTO = {} as IGeneralMasterDTO;

  constructor(private router: Router, private _sharedService: SharedService,
    private _generalMasterService: GeneralMasterService, 
    private _toastrService: ToastrService) {
   }

   ngOnInit() {

    this.generalMasterForm = new FormGroup({
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
            this.generalMasterForm.patchValue({
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

              this.generalMasterForm.patchValue({
                masterType: this.dto.masterType,
                code: generalMaster.id,
                name: generalMaster.branchMasterName
             });
            }
          }
        })
      }
    }
  }

  get name() {
    return this.generalMasterForm.get('name')!;
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
              this._toastrService.success('General master updated.', 'Success!');
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
              this._toastrService.success('General master added.', 'Success!');
              this.configClick("master-list");
            }
          }
        })
      }

    }
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
    this.generalMasterForm = new FormGroup({
      name: new FormControl("", [Validators.required]),
    });
  }

  configClick(routeValue: string) {
    sessionStorage.setItem("configMenu", routeValue);
    this.router.navigate(['/app/'+ routeValue]);
  }
}
