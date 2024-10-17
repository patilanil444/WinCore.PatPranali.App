import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { IGeneralDTO } from 'src/app/common/models/common-ui-models';
import { DistrictMasterService } from 'src/app/services/masters/district-master/district-master.service';
import { SharedService } from 'src/app/services/shared.service';

interface IDistrictServerModel
{
  DistrictName: string;
  StateId: string;
  CreatedBy: string;
  UpdatedBy: string;
}

@Component({
  selector: 'app-district-master-form',
  templateUrl: './district-master-form.component.html',
  styleUrls: ['./district-master-form.component.css']
})
export class DistrictMasterFormComponent implements OnInit {

  districtForm!: FormGroup;
  id!: number;
  maxId!: number;
  dto: IGeneralDTO = {} as IGeneralDTO;

  newCode!: string;
  isAddMode!: boolean;

  uiStates: any[] = [];

  constructor(private router: Router, private route: ActivatedRoute,
    private _districtMasterService: DistrictMasterService,
    private _sharedService: SharedService, private toastrService: ToastrService) {

  }

  ngOnInit(): void {

    this.uiStates = this._sharedService.uiAllStates;

    this.districtForm = new FormGroup({
      code: new FormControl("", []),
      name: new FormControl("", [Validators.required]),
      stateId: new FormControl(this.uiStates[0].id, [Validators.required])
    });

    this._districtMasterService.getDTO().subscribe(obj => this.dto = obj);
    if (this.dto.id >= 0) {
      this.id = this.dto.id;
      if (this.dto.id == 0) {
        this.isAddMode = true;
        this.maxId = this.dto.maxId;
        this.districtForm.patchValue({
          code: this.maxId + 1,
        });
      }
      else  
      {
        this.isAddMode = false;
        this._districtMasterService.getDistrict(this.dto.id).subscribe((data: any) => {
          console.log(data);
          if (data) {
            if (data.statusCode == 200 && data.data.data) {
              var district = data.data.data;
              this.districtForm.patchValue({
                code: district.id,
                name: district.districtName,
                stateId: district.stateId
              });
            }
          }
        })
      }
    }
    else
    {
      this.configClick('districts');
    }
  }

  get name() {
    return this.districtForm.get('name')!;
  }

  get stateId() {
    return this.districtForm.get('stateId')!;
  }

  public saveDistrict(): void {
    if (this.validateForm()) {

      if (this.isDistrictExists()) {
        this.toastrService.error('District already exists in same state.', 'Error!');
        return;
      }

      let districtModel = {} as IDistrictServerModel;

      districtModel.DistrictName = this.name.value.toString();
      districtModel.StateId = this.stateId.value.toString();
      districtModel.CreatedBy = "";
      districtModel.UpdatedBy = "";
      
      console.log(districtModel);

      if (this.isAddMode) {
        this._districtMasterService.createDistrict(districtModel).subscribe((data: any) => {
          console.log(data);
          if (data) {
            if (data.statusCode == 200 && data.data.data > 1) {
              this.toastrService.success('District added.', 'Success!');
              this.configClick("districts");
            }
          }
        })
      }
      else  
      {
        this._districtMasterService.updateDistrict(this.dto.id, districtModel).subscribe((data: any) => {
          console.log(data);
          if (data) {
            if (data.statusCode == 200 && data.data.data > 1) {
              this.toastrService.success('District updated.', 'Success!');
              this.configClick("districts");
            }
          }
        })
      }

    }
  }

  public isDistrictExists(): boolean {
    let name = this.name.value;
    let stateId = parseInt(this.stateId.value);
    let modelIndex = this.dto.models.findIndex(b=>b.districtName.toLowerCase() == name.toLowerCase() &&
    b.stateId == stateId && b.id != this.dto.id);
    if (modelIndex > -1) {
      return true;
    }
    return false;
  }

  public validateForm(): boolean {

    if (this.districtForm.invalid) {
      for (const control of Object.keys(this.districtForm.controls)) {
        this.districtForm.controls[control].markAsTouched();
      }
      return false;
    }
    return true;
  }

  public clear(): void {
    this.districtForm = new FormGroup({
      // code: new FormControl("", []),
      name: new FormControl("", [Validators.required]),
      fromAmount: new FormControl("", [Validators.required]),
      toAmount: new FormControl("", [Validators.required])
    });
  }

  configClick(routeValue: string) {
    sessionStorage.setItem("configMenu", routeValue);
    this.router.navigate(['/app/' + routeValue]);
  }

}
