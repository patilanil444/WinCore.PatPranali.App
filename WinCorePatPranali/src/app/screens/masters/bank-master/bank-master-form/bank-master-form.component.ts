import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { IGeneralDTO, UiValueType } from 'src/app/common/models/common-ui-models';
import { BankMasterService } from 'src/app/services/masters/bank-master/bank-master.service';
import { SharedService } from 'src/app/services/shared.service';

interface IBankServerModel {
  Id: string;
  Name: string;
  Address: string;
  Description: string;
  HasBranches: boolean;
  GLId: number;
}

@Component({
  selector: 'app-bank-master-form',
  templateUrl: './bank-master-form.component.html',
  styleUrls: ['./bank-master-form.component.css']
})
export class BankMasterFormComponent {

  bankForm!: FormGroup;
  id!: number;
  maxId!: number;
  dto: IGeneralDTO = {} as IGeneralDTO;

  newCode!: string;
  isAddMode!: boolean;
  generalLeadgers = [new UiValueType(1, "General Leader1"), new UiValueType(2, "General Leader2")];
  hBranchs = [new UiValueType(1, "Yes"), new UiValueType(2, "No")];

  constructor(private router: Router, private route: ActivatedRoute,
    private _bankMasterService: BankMasterService,
    private _sharedService: SharedService, private _toastrService: ToastrService) {

  }

  ngOnInit(): void {

    this.bankForm = new FormGroup({
      code: new FormControl("", []),
      name: new FormControl("", [Validators.required]),
      address: new FormControl("", [Validators.required]),
      description: new FormControl("", [Validators.required]),
      hasBranch: new FormControl(1, [Validators.required]),
      generalLeadger: new FormControl(1, [Validators.required])
    });

    this._bankMasterService.getDTO().subscribe(obj => this.dto = obj);
    if (this.dto) {
      this.id = this.dto.id;
      if (this.dto.id == 0) {
        this.isAddMode = true;
        this.maxId = this.dto.maxId;
        this.bankForm.patchValue({
          code: this.maxId + 1,
          hasBranch: this.hBranchs[0].id,
          //generalLeadger : this.uiScheduleMasters[0].id,
        });
      }
      else {
        this.isAddMode = false;
        // edit a record
        this._bankMasterService.getBank(this.dto.id).subscribe((data: any) => {
          if (data) {
            if (data.statusCode == 200 && data.data.data) {
              var bnk = data.data.data;
              this.bankForm.patchValue({
                code: bnk.id,
                name: bnk.name,
                address: bnk.address,
                description: bnk.description,
                hasBranch: this.hBranchs[0].id,
                generalLeadger: bnk.glId
              });
            }
          }
        })
      }
    }
  }

  get name() {
    return this.bankForm.get('name')!;
  }

  get description() {
    return this.bankForm.get('description')!;
  }

  get address() {
    return this.bankForm.get('address')!;
  }

  get hasBranch() {
    return this.bankForm.get('hasBranch')!;
  }

  get generalLeadger() {
    return this.bankForm.get('generalLeadger')!;
  }


  public saveBank(): void {
    if (this.validateForm()) {
      let bankModel = {} as IBankServerModel;

      bankModel.Name = this.name.value.toString();
      bankModel.Address = this.address.value.toString();
      bankModel.Description = this.description.value.toString();
      bankModel.HasBranches = parseInt(this.hasBranch.value.toString()) == 1 ? true : false;
      bankModel.GLId = parseInt(this.generalLeadger.value.toString());
      console.log(bankModel);

      if (this.isAddMode) {
        this._bankMasterService.createBank(bankModel).subscribe((data: any) => {
          console.log(data);
          if (data) {
            if (data.statusCode == 200 && data.data.data == 1) {
              this._toastrService.success('Bank added.', 'Success!');
              this.configClick("banks");
            }
          }
        })
      }
      else {
        this._bankMasterService.updateBank(this.dto.id, bankModel).subscribe((data: any) => {
          console.log(data);
          if (data) {
            if (data.statusCode == 200 && data.data.data == 1) {
              this._toastrService.success('Bank updated.', 'Success!');
              this.configClick("banks");
            }
          }
        })
      }

    }
  }

  public validateForm(): boolean {

    if (this.bankForm.invalid) {
      for (const control of Object.keys(this.bankForm.controls)) {
        this.bankForm.controls[control].markAsTouched();
      }
      return false;
    }
    return true;
  }

  public clear(): void {
    this.bankForm = new FormGroup({
      // code: new FormControl("", []),
      name: new FormControl("", [Validators.required]),
      address: new FormControl("", [Validators.required]),
      description: new FormControl("", [Validators.required]),
      hasBranch: new FormControl(1, [Validators.required]),
      generalLeadger: new FormControl(1, [Validators.required])
    });
  }

  configClick(routeValue: string) {
    sessionStorage.setItem("configMenu", routeValue);
    this.router.navigate(['/app/' + routeValue]);
  }
}