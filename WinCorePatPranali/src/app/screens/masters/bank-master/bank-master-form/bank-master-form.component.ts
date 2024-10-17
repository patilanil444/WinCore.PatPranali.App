import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { IGeneralDTO, UiValueType } from 'src/app/common/models/common-ui-models';
import { BankMasterService } from 'src/app/services/masters/bank-master/bank-master.service';
import { SharedService } from 'src/app/services/shared.service';

interface IBankServerModel {
  BankId: string;
  BankName: string;
  LocalName: string;
  Address: string;
  Createdby: string;
  UpdatedBy: string;
  // Description: string;
  // HasBranches: boolean;
  // GLId: number;
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
  // generalLeadgers = [new UiValueType(1, "General Leader1"), new UiValueType(2, "General Leader2")];
  // hBranchs = [new UiValueType(1, "Yes"), new UiValueType(2, "No")];

  constructor(private router: Router, private route: ActivatedRoute,
    private _bankMasterService: BankMasterService,
    private _sharedService: SharedService, private _toastrService: ToastrService) {

  }

  ngOnInit(): void {

    this.bankForm = new FormGroup({
      code: new FormControl("", []),
      bankName: new FormControl("", [Validators.required]),
      localName: new FormControl("", []),
      address: new FormControl("", [Validators.required]),
      // hasBranch: new FormControl(1, []),
      // generalLeadger: new FormControl(1, [])
    });

    this._bankMasterService.getDTO().subscribe(obj => this.dto = obj);
    if (this.dto.id >= 0) {
      this.id = this.dto.id;
      if (this.dto.id == 0) {
        this.isAddMode = true;
        this.maxId = this.dto.maxId;
        this.bankForm.patchValue({
          code: this.maxId + 1,
          //hasBranch: this.hBranchs[0].id,
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
                code: bnk.bankId,
                bankName: bnk.bankName,
                localName: bnk.localName,
                address: bnk.address,
                // hasBranch: this.hBranchs[0].id,
                // generalLeadger: bnk.glId
              });
            }
          }
        })
      }
    }
    else
    {
      this.configClick('banks');
    }
  }

  get code() {
    return this.bankForm.get('code')!;
  }

  get bankName() {
    return this.bankForm.get('bankName')!;
  }

  get localName() {
    return this.bankForm.get('localName')!;
  }

  get address() {
    return this.bankForm.get('address')!;
  }

  // get hasBranch() {
  //   return this.bankForm.get('hasBranch')!;
  // }

  // get generalLeadger() {
  //   return this.bankForm.get('generalLeadger')!;
  // }


  public saveBank(): void {
    if (this.validateForm()) {
      if (this.isBankExists()) {
        this._toastrService.error('Bank name already exists.', 'Error!');
        return;
      }

      let bankModel = {} as IBankServerModel;

      bankModel.BankName = this.bankName.value.toString();
      bankModel.LocalName = this.localName.value.toString();
      bankModel.Address = this.address.value.toString();
      bankModel.Createdby = "";
      bankModel.UpdatedBy = "";

      // bankModel.HasBranches = parseInt(this.hasBranch.value.toString()) == 1 ? true : false;
      // bankModel.GLId = parseInt(this.generalLeadger.value.toString());
      console.log(bankModel);

      if (this.isAddMode) {
        this._bankMasterService.createBank(bankModel).subscribe((data: any) => {
          console.log(data);
          if (data) {
            if (data.statusCode == 200 && data.data.data > 0) {
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
            if (data.statusCode == 200 && data.data.data > 0) {
              this._toastrService.success('Bank updated.', 'Success!');
              this.configClick("banks");
            }
          }
        })
      }

    }
  }

  public isBankExists(): boolean {
    let bankName = this.bankName.value;
    let bankIndex = this.dto.models.findIndex(b=>b.bankName.toLowerCase() == bankName.toLowerCase() && b.bankId != this.dto.id);
    if (bankIndex > -1) {
      return true;
    }
    return false;
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
      bankName: new FormControl("", [Validators.required]),
      address: new FormControl("", [Validators.required]),
      localName: new FormControl("", []),
      // hasBranch: new FormControl(1, []),
      // generalLeadger: new FormControl(1, [])
    });
  }

  configClick(routeValue: string) {
    sessionStorage.setItem("configMenu", routeValue);
    this.router.navigate(['/app/' + routeValue]);
  }
}