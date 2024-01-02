import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { IGeneralDTO } from 'src/app/common/models/common-ui-models';
import { TahshilMasterService } from 'src/app/services/masters/tahshil-master/tahshil-master.service';
import { SharedService } from 'src/app/services/shared.service';

interface ITahsilServerModel
{
  Name: string;
  StateId: number;
  DistrictId: number;
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
  uiDistricts: any[] = [];

  constructor(private router: Router, private route: ActivatedRoute,
    private _tahsilMasterService: TahshilMasterService,
    private _sharedService: SharedService, private toastrService: ToastrService) {

  }

  ngOnInit(): void {

    this.uiStates = this._sharedService.uiAllStates;
    this.uiDistricts = this._sharedService.uiAllDistricts;

    this.tahsilForm = new FormGroup({
      code: new FormControl("", []),
      name: new FormControl("", [Validators.required]),
      stateId: new FormControl(this.uiStates[0].id, [Validators.required]),
      districtId: new FormControl(this.uiDistricts[0].id, [Validators.required])
    });

    this._tahsilMasterService.getDTO().subscribe(obj => this.dto = obj);
    if (this.dto) {
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
              this.tahsilForm.patchValue({
                code: tahsil.id,
                name: tahsil.name,
                stateId: tahsil.stateId,
                districtId: tahsil.districtId
              });
            }
          }
        })
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
      let tahsilModel = {} as ITahsilServerModel;

      tahsilModel.Name = this.name.value.toString();
      tahsilModel.StateId = this.stateId.value.toString();
      tahsilModel.DistrictId = this.districtId.value.toString();
      console.log(tahsilModel);

      if (this.isAddMode) {
        this._tahsilMasterService.createTahsil(tahsilModel).subscribe((data: any) => {
          console.log(data);
          if (data) {
            if (data.statusCode == 200 && data.data.data == 1) {
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
            if (data.statusCode == 200 && data.data.data == 1) {
              this.toastrService.success('Tahsil updated.', 'Success!');
              this.configClick("tahsils");
            }
          }
        })
      }

    }
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
