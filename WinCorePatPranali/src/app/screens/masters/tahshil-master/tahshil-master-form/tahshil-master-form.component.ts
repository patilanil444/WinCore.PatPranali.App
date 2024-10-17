import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { IGeneralDTO } from 'src/app/common/models/common-ui-models';
import { TahshilMasterService } from 'src/app/services/masters/tahshil-master/tahshil-master.service';
import { SharedService } from 'src/app/services/shared.service';
import { environment } from 'src/environments/environment';

interface ITahsilServerModel
{
  TalukaName: string;
  StateId: number;
  DistrictId: number;
  CreatedBy: string;
  UpdatedBy: string;
}

@Component({
  selector: 'app-tahshil-master-form',
  templateUrl: './tahshil-master-form.component.html',
  styleUrls: ['./tahshil-master-form.component.css']
})
export class TahshilMasterFormComponent implements OnInit {

  
  tahsilForm!: FormGroup;
  id!: number;
  maxId!: number;
  dto: IGeneralDTO = {} as IGeneralDTO;

  newCode!: string;
  isAddMode!: boolean;

  uiStates: any[] = [];
  uiAllDistricts: any[] = [];
  uiDistricts: any[] = [];


  constructor(private router: Router, private route: ActivatedRoute,
    private _tahsilMasterService: TahshilMasterService,
    private _sharedService: SharedService, private toastrService: ToastrService) {

  }

  ngOnInit(): void {

    let defaultStateId = environment.defaultStateId;

    this.uiStates = this._sharedService.uiAllStates;
    this.uiAllDistricts  = this._sharedService.uiAllDistricts;
    this.uiDistricts = [];
    let districtId = 0;

    let districts = this.uiAllDistricts.filter((d: any) => d.stateId == defaultStateId);
    if (districts && districts.length) {
      this.uiDistricts = districts;
      districtId = this.uiDistricts[0].id;
    }

    this.tahsilForm = new FormGroup({
      code: new FormControl("", []),
      name: new FormControl("", [Validators.required]),
      stateId: new FormControl(defaultStateId, [Validators.required]),
      districtId: new FormControl(districtId, [Validators.required])
    });

    this._tahsilMasterService.getDTO().subscribe(obj => this.dto = obj);
    if (this.dto.id >= 0) {
      this.id = this.dto.id;
      if (this.dto.id == 0) {
        this.isAddMode = true;
        this.maxId = this.dto.maxId;
        this.tahsilForm.patchValue({
          code: this.maxId + 1,
        });
      }
      else  
      {
        this.isAddMode = false;
        this._tahsilMasterService.getTahsil(this.dto.id).subscribe((data: any) => {
          console.log(data);
          if (data) {
            if (data.statusCode == 200 && data.data.data) {
              var tahsil = data.data.data;
              if (tahsil) {
                let stateId = tahsil.stateId;
                let districts = this.uiAllDistricts.filter((d: any) => d.stateId == stateId);
                if (districts && districts.length) {
                  this.uiDistricts = districts;
                }
              }
              this.tahsilForm.patchValue({
                code: tahsil.id,
                name: tahsil.talukaName,
                stateId: tahsil.stateId,
                districtId: tahsil.districtId
              });
            }
          }
        })
      }
    }
    else
    {
      this.configClick('tahsils');
    }
  }

  onStateChange(event: any) {
    let targetValue = event.target.value;
    let stateId = targetValue.split(":");
    if (stateId) {
      this.uiDistricts = [];
      let districts = this.uiAllDistricts.filter((d: any) => d.stateId == parseInt(stateId[1]));
      if (districts && districts.length) {
        this.uiDistricts = districts;
        this.tahsilForm.patchValue({
          districtId: this.uiDistricts[0].id
        });
      }
    }

  }

  get name() {
    return this.tahsilForm.get('name')!;
  }

  get districtId() {
    return this.tahsilForm.get('districtId')!;
  }

  get stateId() {
    return this.tahsilForm.get('stateId')!;
  }

  public saveTahsil(): void {
    if (this.validateForm()) {
      if (this.isTahshilExists()) {
        this.toastrService.error('Tahshil already exists in same district.', 'Error!');
        return;
      }
      let tahsilModel = {} as ITahsilServerModel;

      tahsilModel.TalukaName = this.name.value.toString();
      tahsilModel.StateId = this.stateId.value.toString();
      tahsilModel.DistrictId = this.districtId.value.toString();
      tahsilModel.CreatedBy = "";
      tahsilModel.UpdatedBy = "";

      console.log(tahsilModel);

      if (this.isAddMode) {
        this._tahsilMasterService.createTahsil(tahsilModel).subscribe((data: any) => {
          console.log(data);
          if (data) {
            if (data.statusCode == 200 && data.data.data > 1) {
              this.toastrService.success('Tahsil added.', 'Success!');
              this.configClick("tahsils");
            }
          }
        })
      }
      else  
      {
        this._tahsilMasterService.updateTahsil(this.dto.id, tahsilModel).subscribe((data: any) => {
          console.log(data);
          if (data) {
            if (data.statusCode == 200 && data.data.data > 1) {
              this.toastrService.success('Tahsil updated.', 'Success!');
              this.configClick("tahsils");
            }
          }
        })
      }
    }
  }

  public isTahshilExists(): boolean {
    let name = this.name.value;
    let districtId = parseInt(this.districtId.value);
    let modelIndex = this.dto.models.findIndex(b=>b.talukaName.toLowerCase() == name.toLowerCase() &&
    b.districtId == districtId && b.id != this.dto.id);
    if (modelIndex > -1) {
      return true;
    }
    return false;
  }

  public validateForm(): boolean {

    if (this.tahsilForm.invalid) {
      for (const control of Object.keys(this.tahsilForm.controls)) {
        this.tahsilForm.controls[control].markAsTouched();
      }
      return false;
    }
    return true;
  }

  public clear(): void {
    this.tahsilForm = new FormGroup({
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
