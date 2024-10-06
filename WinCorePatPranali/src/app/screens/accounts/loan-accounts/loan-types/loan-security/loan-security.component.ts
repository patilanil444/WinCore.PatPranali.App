import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AccountsService } from 'src/app/services/accounts/accounts/accounts.service';
import { SharedService } from 'src/app/services/shared.service';

export interface UiSecurity {
  id: number,
  customerId: number,
  srNo: number,
  securityType: string,
  securityTypeText: string,
  security: string,
  securityValue: number,
  securityValueWithPercentage: number,
  securityDescription: number,
  percentage: number,
  createdBy: string,
  modifiedBy: string,
  status: string,
  mstCustomer: {}
}


@Component({
  selector: 'app-loan-security',
  templateUrl: './loan-security.component.html',
  styleUrls: ['./loan-security.component.css']
})
export class LoanSecurityComponent implements OnInit {

  securityForm!: FormGroup;
  securityValueForm!: FormGroup;

  @Output() loanSecurityDetails = new EventEmitter<any>();

  p_security: number = 1;
  total_securities: number = 0;
  uiSecurities: any[] = [];

  uiSecurityTypes : any[] = [];

  constructor(private _toastrService: ToastrService,private _sharedService: SharedService,
    private _accountsService: AccountsService) { }

  ngOnInit(): void {
    this.securityForm = new FormGroup({
      securityType: new FormControl(0, [Validators.required]),
      security: new FormControl("", [Validators.required]),
      securityValue: new FormControl("", [Validators.required]),
      securityDescription: new FormControl("", [Validators.required]),
      percentage: new FormControl("", [Validators.required]),
    });

    this.securityValueForm = new FormGroup({
      totalValue: new FormControl(0, []),
    });

    this.getSecurities().then((sResult: any) => {
      
    }).catch(error => {
      this._toastrService.error('Error loading security types', 'Error!');
    });
  }

  getSecurities() {
    return new Promise((resolve, reject) => {
      this._accountsService.getSecurities().subscribe((data: any) => {
        console.log(data);
        if (data) {
          this.uiSecurityTypes = data.data.data;
          if (this.uiSecurityTypes && this.uiSecurityTypes.length) {
            this.securityForm.patchValue({
              securityType: this.uiSecurityTypes[0].id
            })
          }
          resolve(true);
        }
        else {
          resolve(false);
        }
      })
    })
  }

  validSecurityForm() {
    if (this.securityForm.invalid) {
      for (const control of Object.keys(this.securityForm.controls)) {
        this.securityForm.controls[control].markAsTouched();
      }
      return false;
    }
    return true;
  }


  addSecurity() {
    if (this.validSecurityForm()) {

      // Check existing nomini with name and relation
      let securityIndex = this.uiSecurities.findIndex(security =>
        security.security.toLowerCase() == this.security.value.toLowerCase());

      let securityTypeText = "";
      if (this.securityType.value) {
        let securityType = this.uiSecurityTypes.filter(s=>s.id == parseInt(this.securityType.value));
        securityTypeText = securityType?.length ? securityType[0].name: "";
      }

      if (securityIndex > -1) {
        let uiSecurity = this.uiSecurities[securityIndex];

        //uiSecurity.customerId = this.selectedCustomerId;
        uiSecurity.securityType = this.securityType.value.toString();
        uiSecurity.securityTypeText = securityTypeText;
        uiSecurity.security = this.security.value.toString();
        uiSecurity.securityValue == this.securityValue.value.toString();
        uiSecurity.securityDescription = this.securityDescription.value.toString();
        uiSecurity.percentage = this.percentage.value.toString();
        uiSecurity.securityValueWithPercentage = parseFloat(uiSecurity.securityValue) * parseFloat(uiSecurity.percentage)/100;
        uiSecurity.createdBy = this._sharedService.applicationUser.userName;
        uiSecurity.modifiedBy = this._sharedService.applicationUser.userName;
        uiSecurity.status = 'M';
      }
      else {
        let uiSecurity = {} as UiSecurity;
        uiSecurity.id = 0;
        uiSecurity.srNo = this.uiSecurities.length + 1;
        uiSecurity.securityType = this.securityType.value.toString();
        uiSecurity.securityTypeText = securityTypeText;
        uiSecurity.security = this.security.value.toString();
        uiSecurity.securityValue = this.securityValue.value.toString();
        uiSecurity.securityDescription = this.securityDescription.value.toString();
        uiSecurity.percentage = this.percentage.value.toString();
        uiSecurity.securityValueWithPercentage = uiSecurity.securityValue * uiSecurity.percentage/100;
        uiSecurity.createdBy = this._sharedService.applicationUser.userName;
        uiSecurity.modifiedBy = this._sharedService.applicationUser.userName;
        uiSecurity.status = 'A';
        this.uiSecurities.push(uiSecurity);
      }

      this.calculateTotalValue();

      this.loanSecurityDetails.emit(this.uiSecurities);

      this.clearSecurity();
    }
  }

  calculateTotalValue() {
    let totalValue = 0;
    this.uiSecurities.forEach(item => {
      if (item.status != 'D') {
        totalValue = totalValue + parseFloat(item.securityValueWithPercentage);
      }
    });

    this.securityValueForm.patchValue({
      totalValue: totalValue
    })
  }

  editSecurity(uiSecurity: any, index: number) {
    this.securityForm.patchValue({
      securityType: parseInt(uiSecurity.securityType),
      security: uiSecurity.security,
      securityValue: uiSecurity.securityValue,
      securityDescription: uiSecurity.securityDescription,
      percentage: uiSecurity.percentage
    });
  }

  deleteSecurity(uiSecurity: any, index: number) {
    uiSecurity.status = 'D';
    this.calculateTotalValue();
  }

  clearSecurity() {
    this.securityForm.patchValue({
      securityType: this.uiSecurityTypes[0].id,
      security: "",
      securityValue: "",
      securityDescription: "",
      percentage: "",
    });
  }

  cancelDelete()
  {

  }

  onDelete()
  {

  }

  get securityType() {
    return this.securityForm.get('securityType')!;
  }
  get security() {
    return this.securityForm.get('security')!;
  }
  get securityValue() {
    return this.securityForm.get('securityValue')!;
  }
  get securityDescription() {
    return this.securityForm.get('securityDescription')!;
  }
  get percentage() {
    return this.securityForm.get('percentage')!;
  }

  get totalValue() {
    return this.securityValueForm.get('totalValue')!;
  }
  
}
