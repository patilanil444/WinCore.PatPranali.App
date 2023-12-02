import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UiValueType } from 'src/app/common/models/common-ui-models';
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
  id!: string;
  maxId!: string;

  newCode!: string;
  isAddMode!: boolean;
  generalLeadgers = [new UiValueType(1, "General Leader1"), new UiValueType(2, "General Leader2")];
  hBranchs = [new UiValueType(1, "Yes"), new UiValueType(2, "No")];

  constructor(private router: Router, private route: ActivatedRoute,
    private _bankMasterService: BankMasterService,
    private _sharedService: SharedService) {

  }

  ngOnInit(): void {

    this.id = this.route.snapshot.params['id'];
    this.maxId = this.route.snapshot.params['maxId'];
    this.isAddMode = !this.id;

    this.bankForm = new FormGroup({
      code: new FormControl("", []),
      name: new FormControl("", [Validators.required]),
      address: new FormControl("", [Validators.required]),
      description: new FormControl("", [Validators.required]),
      hasBranch: new FormControl(1, [Validators.required]),
      generalLeadger: new FormControl(1, [Validators.required])
    });

    if (!this.isAddMode) {
      this._bankMasterService.getBank(parseInt(this.id)).subscribe((data: any) => {
        console.log(data);
        if (data) {
          if (data.statusCode == 200 && data.data.data) {
            var bnk = data.data.data;
            this.bankForm = new FormGroup({
              code: new FormControl(bnk.id, []),
              name: new FormControl(bnk.name, [Validators.required]),
              address: new FormControl(bnk.address, [Validators.required]),
              description: new FormControl(bnk.description, [Validators.required]),
              hasBranch: new FormControl(bnk.hasBranches ? 1 : 2, [Validators.required]),
              generalLeadger: new FormControl(bnk.glId, [Validators.required])
            });
          }
        }
      })
    }
    else
    {
      this.bankForm.patchValue({
        code: parseInt(this.maxId) + 1
     });
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
              this.configClick("banks");
            }
          }
        })
      }
      else  
      {
        this._bankMasterService.updateBank(parseInt(this.id), bankModel).subscribe((data: any) => {
          console.log(data);
          if (data) {
            if (data.statusCode == 200 && data.data.data == 1) {
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