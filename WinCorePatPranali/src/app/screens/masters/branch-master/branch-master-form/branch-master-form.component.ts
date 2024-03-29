import { formatDate } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { IGeneralDTO } from 'src/app/common/models/common-ui-models';
import { BranchMasterService } from 'src/app/services/masters/branch-master/branch-master.service';
import { SharedService } from 'src/app/services/shared.service';

interface IBranchServerModel {
  Id: string;
  Name: string;
  Address: string;
  Phone:string;
  EmailId: string;
  OpeningDate: string;
  HeadOfficeDistance: string;
  BankId: number;
  Town: string;
  TahshilId: number;
  SZone: string;
  DistrictId: number;
}

@Component({
  selector: 'app-branch-master-form',
  templateUrl: './branch-master-form.component.html',
  styleUrls: ['./branch-master-form.component.css']
})
export class BranchMasterFormComponent {

  branchForm!: FormGroup;
  id!: number;
  maxId!: number;
  dto: IGeneralDTO = {} as IGeneralDTO;

  newCode!: string;
  isAddMode!: boolean;

  uiAllDistricts = [];
  uiAllTahshils = [];

  uiStates: any[] = [];
  uiDistricts: any[] = [];
  uiTahshils:any[] = [];

  constructor(private router: Router, private route: ActivatedRoute,
    private _branchMasterService: BranchMasterService, private _sharedService:SharedService,
    private _toastrService: ToastrService) {
  }

  ngOnInit(): void {

    this.branchForm = new FormGroup({
      code: new FormControl("", []),
      name: new FormControl("", [Validators.required]),
      address: new FormControl("", [Validators.required]),
      phone: new FormControl("", [Validators.required]),
      email: new FormControl("", [Validators.required, Validators.email]),
      openingDate : new FormControl(formatDate(new Date(Date.now()), 'yyyy-MM-dd', 'en'), [Validators.required]),
      distance: new FormControl("", []),
      town: new FormControl("", [Validators.required]),
      zone: new FormControl("", []),
      stateId: new FormControl(1, []),
      tahshilId: new FormControl(1, [Validators.required]),
      districtId: new FormControl(1, [Validators.required])
    });

    this._branchMasterService.getDTO().subscribe(obj => this.dto = obj);
   
    this.uiStates = this._sharedService.uiAllStates;
    this.uiAllDistricts = this._sharedService.uiAllDistricts;
    this.uiAllTahshils = this._sharedService.uiAllTahshils;
    let districts = this.uiAllDistricts.filter((d: any) => d.stateId == this.uiStates[0].id);
    if (districts) {
      this.uiDistricts = districts;
    }
  
    if (this.dto) {
      this.id = this.dto.id;
      if (this.dto.id == 0) {
        this.isAddMode = true;
        this.maxId = this.dto.maxId;
        this.branchForm.patchValue({
          code: this.maxId + 1,
        });
      }
      else
      {
        this.isAddMode = false;
        this._branchMasterService.getBranch(this.dto.id).subscribe((data: any) => {
          console.log(data);
          if (data) {
            if (data.statusCode == 200 && data.data.data) {
              var brnch = data.data.data;
  
              let tahshils = this.uiAllTahshils.filter((d: any) => d.districtId == brnch.districtId);
              if (tahshils) {
                this.uiTahshils = tahshils;
              }
  
              this.branchForm.patchValue({
                code:brnch.id,
                name: brnch.name,
                address: brnch.address,
                phone: brnch.phone,
                email: brnch.emailId,
                openingDate: formatDate(new Date(brnch.openingDate), 'yyyy-MM-dd', 'en'),
                distance: brnch.headOfficeDistance,
                town: brnch.town,
                zone: brnch.sZone,
                stateId: 1,
                tahshilId: brnch.tahshilId,
                districtId: brnch.districtId
              });

              // this.branchForm = new FormGroup({
              //   code: new FormControl(brnch.id, []),
              //   name: new FormControl(brnch.name, [Validators.required]),
              //   address: new FormControl(brnch.address, [Validators.required]),
              //   phone: new FormControl(brnch.phone, [Validators.required]),
              //   email: new FormControl(brnch.emailId, [Validators.required, Validators.email]),
              //   openingDate : new FormControl(formatDate(new Date(brnch.openingDate), 'yyyy-MM-dd', 'en'), [Validators.required]),
              //   distance: new FormControl(brnch.headOfficeDistance, []),
              //   town: new FormControl(brnch.town, [Validators.required]),
              //   zone: new FormControl(brnch.sZone, []),
              //   stateId: new FormControl(1, []),
              //   tahshilId: new FormControl(brnch.tahshilId, [Validators.required]),
              //   districtId: new FormControl(brnch.districtId, [Validators.required])
              // });
            }
          }
        })
      }
    }
  }

  onStateChange(event: any) {
    let stateId = this.stateId.value;
    this.uiDistricts = [];
    let districts = this.uiAllDistricts.filter((d: any) => d.stateId == stateId);
    if (districts) {
      this.uiDistricts = districts;
      this.branchForm.patchValue({
        districtId: this.uiDistricts[0].id
     });
    }
  }

  onDistrictChange(event:any)
  {
    let districtId = this.districtId.value;
    this.uiTahshils = [];
    let tahshils = this.uiAllTahshils.filter((d: any) => d.districtId == districtId);
    if (tahshils) {
      this.uiTahshils = tahshils;
      this.branchForm.patchValue({
        tahshilId: this.uiTahshils[0].id
     });
    }
  }

  public saveBranch(): void {
    if (this.validateForm()) {
      let branchModel = {} as IBranchServerModel;

      branchModel.Name = this.name.value.toString();
      branchModel.Address = this.address.value.toString();
      branchModel.Phone = this.phone.value.toString();
      branchModel.EmailId = this.email.value.toString();
      branchModel.OpeningDate = this.openingDate.value.toString();
      branchModel.HeadOfficeDistance = this.distance.value.toString();
      branchModel.Town = this.town.value.toString();
      branchModel.TahshilId = this.tahshilId.value.toString();
      branchModel.BankId = 1;
      branchModel.SZone = this.zone.value.toString();
      branchModel.DistrictId = this.districtId.value.toString();
      console.log(branchModel);

      if (this.isAddMode) {
        this._branchMasterService.createBranch(branchModel).subscribe((data: any) => {
          console.log(data);
          if (data) {
            if (data.statusCode == 200 && data.data.data == 1) {
              this._toastrService.success('Branch added.', 'Success!');
              this.configClick("branches");
            }
          }
        })
      }
      else  
      {
        this._branchMasterService.updateBranch(this.dto.id, branchModel).subscribe((data: any) => {
          console.log(data);
          if (data) {
            if (data.statusCode == 200 && data.data.data == 1) {
              this._toastrService.success('Branch updated.', 'Success!');
              this.configClick("branches");
            }
          }
        })
      }

    }
  }

  public validateForm(): boolean {

    if (this.branchForm.invalid) {
      for (const control of Object.keys(this.branchForm.controls)) {
        this.branchForm.controls[control].markAsTouched();
      }
      return false;
    }
    return true;
  }

  public clear(): void {
    this.branchForm = new FormGroup({
      //code: new FormControl("", []),
      name: new FormControl("", [Validators.required]),
      address: new FormControl("", [Validators.required]),
      phone: new FormControl("", [Validators.required]),
      email: new FormControl("", [Validators.required, Validators.email]),
      openingDate : new FormControl(new Date(), [Validators.required]),
      distance: new FormControl("", []),
      town: new FormControl("", [Validators.required]),
      zone: new FormControl("", []),
      stateId: new FormControl(1, []),
      tahshilId: new FormControl(1, [Validators.required]),
      districtId: new FormControl(1, [Validators.required])
    });
  }
  
  get name() {
    return this.branchForm.get('name')!;
  }

  get address() {
    return this.branchForm.get('address')!;
  }

  get phone() {
    return this.branchForm.get('phone')!;
  }

  get email() {
    return this.branchForm.get('email')!;
  }

  get openingDate() {
    return this.branchForm.get('openingDate')!;
  }

  get distance() {
    return this.branchForm.get('distance')!;
  }

  get town() {
    return this.branchForm.get('town')!;
  }

  get zone() {
    return this.branchForm.get('zone')!;
  }

  get stateId() {
    return this.branchForm.get('stateId')!;
  }

  get districtId() {
    return this.branchForm.get('districtId')!;
  }

  get tahshilId() {
    return this.branchForm.get('tahshilId')!;
  }

  configClick(routeValue: string) {
    sessionStorage.setItem("configMenu", routeValue);
    this.router.navigate(['/app/'+ routeValue]);
  }
}
