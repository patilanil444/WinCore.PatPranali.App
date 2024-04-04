import { formatDate } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BranchDeclarations } from 'src/app/common/branch-declarations';
import { IGeneralDTO } from 'src/app/common/models/common-ui-models';
import { BranchMasterService } from 'src/app/services/masters/branch-master/branch-master.service';
import { SharedService } from 'src/app/services/shared.service';

interface IBranchServerModel {
  BranchCode: string;
  BranchName: string;
  LocalName: string;
  Address: string;
  ZipCode: string;
  Phone: string;
  Email: string;
  Start_Date: string;
  Ho: number;
  Clg: number;
  RegionalLang: string;
  DailyAuthorisation: string;
  Software_Type: string;
  ClearingMember: string;
  Cashyn: string;
  OfficerManager: string;
  CashierClerk: string;
  MICRCODE: string;
  ContactPerson: string;
  DistrictId: number;
  TalukaId: number;
  CurrencyId: number;
  CreateBy:string;
  UpdateBy: string;
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

  uiAllDistricts: any[]= [];
  uiAllTahshils: any[]= [];

  uiStates: any[] = [];
  uiDistricts: any[] = [];
  uiTahshils: any[] = [];
  uiCurrencies:any[] = [];

  uiHOYN = BranchDeclarations.hoYN;
  uiClearingYN = BranchDeclarations.clearingYN;
  uiRegionalLang = BranchDeclarations.regionalLang;
  uiDailyAuthYN = BranchDeclarations.dailyAuthYN;
  uiSoftwareType = BranchDeclarations.softwareType;
  uiClearingMemberYN = BranchDeclarations.clearingMemberYN;
  uiCashierTransactionsYN = BranchDeclarations.cashierTransactionsYN;

  constructor(private router: Router, private route: ActivatedRoute,
    private _branchMasterService: BranchMasterService, private _sharedService: SharedService,
    private _toastrService: ToastrService) {
  }

  ngOnInit(): void {

    this.branchForm = new FormGroup({
      code: new FormControl("", []),
      name: new FormControl("", [Validators.required]),
      localName: new FormControl("", []),
      address: new FormControl("", [Validators.required]),
      zipCode: new FormControl("", [Validators.required]),
      phone: new FormControl("", [Validators.required]),
      email: new FormControl("", [Validators.required, Validators.email]),
      openingDate: new FormControl(formatDate(new Date(Date.now()), 'yyyy-MM-dd', 'en'), [Validators.required]),
      ho: new FormControl(this.uiHOYN[0].code, []),
      clearing: new FormControl(this.uiClearingYN[0].code, []),
      regionalLanguage: new FormControl(this.uiRegionalLang[0].code, []),
      dailyAuthorisation: new FormControl(this.uiDailyAuthYN[0].code, []),
      softwareType: new FormControl(this.uiSoftwareType[0].code, []),
      clearingMember: new FormControl(this.uiClearingMemberYN[0].code, []),
      cashyn: new FormControl(this.uiCashierTransactionsYN[0].code, []),
      officerManagerName: new FormControl("", [Validators.required]),
      cashierClerkName: new FormControl("", [Validators.required]),
      micrCode: new FormControl("", [Validators.required]),
      contactPerson: new FormControl("", [Validators.required]),
      currency: new FormControl(this.uiCurrencies.length ? this.uiCurrencies[0].code : 0, [Validators.required]),
      stateId: new FormControl(1, []),
      districtId: new FormControl(1, [Validators.required]),
      tahshilId: new FormControl(1, [Validators.required])
    });

    this._branchMasterService.getDTO().subscribe(obj => this.dto = obj);

    this.uiStates = this._sharedService.uiAllStates;
    this.uiAllDistricts = this._sharedService.uiAllDistricts;
    this.uiAllTahshils = this._sharedService.uiAllTalukas;
    this.uiCurrencies = this._sharedService.uiCurrencies;

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
      else {
        this.isAddMode = false;
        this._branchMasterService.getBranch(this.dto.id).subscribe((data: any) => {
          console.log(data);
          if (data) {
            if (data.statusCode == 200 && data.data.data) {
              var brnch = data.data.data;
              let stateId = 0;
              let districts = this.uiAllDistricts.filter((d: any) => d.id == brnch.districtId);
              if (districts && districts.length) {
                stateId = districts[0].stateId;

                let allDistricts = this.uiAllDistricts.filter((d: any) => d.stateId == stateId);
                if (allDistricts && allDistricts.length > 0) {
                  this.uiDistricts = allDistricts;
                }
              }

              let tahshils = this.uiAllTahshils.filter((d: any) => d.districtId == brnch.districtId);
              if (tahshils) {
                this.uiTahshils = tahshils;
              }

              this.branchForm.patchValue({
                code: brnch.branchCode,
                name: brnch.branchName,
                localName: brnch.localName,
                address: brnch.address,
                zipCode: brnch.zipCode,
                phone: brnch.phone,
                email: brnch.email,
                openingDate: formatDate(new Date(brnch.start_Date), 'yyyy-MM-dd', 'en'),
                ho: brnch.ho == 1? 'Y' : 'N',
                clearing: brnch.clg == 1? 'Y' : 'N',
                regionalLanguage: brnch.regionalLang,
                dailyAuthorisation: brnch.dailyAuthorisation,
                softwareType: brnch.software_Type,
                clearingMember: brnch.clearingMember,
                cashyn: brnch.cashyn,
                officerManagerName: brnch.officerManager,
                cashierClerkName: brnch.cashierClerk,
                micrCode: brnch.micrcode,
                contactPerson: brnch.contactPerson,
                currency: brnch.currencyId,
                stateId: stateId,
                districtId: brnch.districtId,
                tahshilId: brnch.talukaId,
              });
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

  onDistrictChange(event: any) {
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

      branchModel.BranchName = this.name.value.toString();
      branchModel.LocalName = this.localName.value.toString();
      branchModel.Address = this.address.value.toString();
      branchModel.ZipCode = this.zipCode.value.toString();
      branchModel.Phone = this.phone.value.toString();
      branchModel.Email = this.email.value.toString();
      branchModel.Start_Date = this.openingDate.value.toString();
      branchModel.Ho = this.ho.value.toString() == "Y" ? 1: 0;
      branchModel.Clg = this.clearing.value.toString() == "Y" ? 1: 0;
      branchModel.RegionalLang = this.regionalLanguage.value.toString();
      branchModel.DailyAuthorisation = this.dailyAuthorisation.value.toString();
      branchModel.Software_Type = this.softwareType.value.toString();
      branchModel.ClearingMember = this.clearingMember.value.toString();
      branchModel.Cashyn = this.cashyn.value.toString();
      branchModel.OfficerManager = this.officerManagerName.value.toString();
      branchModel.CashierClerk = this.cashierClerkName.value.toString();
      branchModel.MICRCODE = this.micrCode.value.toString();
      branchModel.ContactPerson = this.contactPerson.value.toString();
      branchModel.DistrictId = this.districtId.value.toString();
      branchModel.TalukaId = this.tahshilId.value.toString();
      branchModel.CurrencyId = this.currency.value.toString();
      branchModel.CreateBy = this._sharedService.applicationUser.userName;
      branchModel.UpdateBy = this._sharedService.applicationUser.userName;
      console.log(branchModel);

      if (this.isAddMode) {
        this._branchMasterService.createBranch(branchModel).subscribe((data: any) => {
          console.log(data);
          if (data) {
            if (data.statusCode == 200 && data.data.data > 1) {
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
            if (data.statusCode == 200 && data.data.data > 1) {
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
    this.branchForm.patchValue({
      code: 0,
      name: "",
      localName: "",
      address: "",
      zipCode: "",
      phone: "",
      email: "",
      openingDate: formatDate(new Date(), 'yyyy-MM-dd', 'en'),
      ho: this.uiHOYN[0].code,
      clearing: this.uiClearingYN[0].code,
      regionalLanguage: this.uiRegionalLang[0].code,
      dailyAuthorisation: this.uiDailyAuthYN[0].code,
      softwareType: this.uiSoftwareType[0].code,
      clearingMember: this.uiClearingMemberYN[0].code,
      cashyn: this.uiCashierTransactionsYN[0].code,
      officerManagerName: "",
      cashierClerkName: "",
      micrCode: "",
      contactPerson: "",
      currency: this.uiCurrencies.length ? this.uiCurrencies[0].code : 0,
      stateId: 1,
      districtId: 1,
      tahshilId: 1
    });
  }

  get code() {
    return this.branchForm.get('code')!;
  }

  get name() {
    return this.branchForm.get('name')!;
  }

  get localName() {
    return this.branchForm.get('localName')!;
  }

  get address() {
    return this.branchForm.get('address')!;
  }

  get zipCode() {
    return this.branchForm.get('zipCode')!;
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

  get ho() {
    return this.branchForm.get('ho')!;
  }

  get clearing() {
    return this.branchForm.get('clearing')!;
  }

  get regionalLanguage() {
    return this.branchForm.get('regionalLanguage')!;
  }

  get dailyAuthorisation() {
    return this.branchForm.get('dailyAuthorisation')!;
  }

  get softwareType() {
    return this.branchForm.get('softwareType')!;
  }

  get clearingMember() {
    return this.branchForm.get('clearingMember')!;
  }

  get cashyn() {
    return this.branchForm.get('cashyn')!;
  }

  get officerManagerName() {
    return this.branchForm.get('officerManagerName')!;
  }

  get cashierClerkName() {
    return this.branchForm.get('cashierClerkName')!;
  }

  get micrCode() {
    return this.branchForm.get('micrCode')!;
  }

  get contactPerson() {
    return this.branchForm.get('contactPerson')!;
  }

  get currency() {
    return this.branchForm.get('currency')!;
  }

  get stateId() {
    return this.branchForm.get('stateId')!;
  }

  get tahshilId() {
    return this.branchForm.get('tahshilId')!;
  }

  get districtId() {
    return this.branchForm.get('districtId')!;
  }

  configClick(routeValue: string) {
    sessionStorage.setItem("configMenu", routeValue);
    this.router.navigate(['/app/' + routeValue]);
  }
}
