import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { IGeneralDTO } from 'src/app/common/models/common-ui-models';
import { SharedService } from 'src/app/services/shared.service';
import { UserService } from 'src/app/services/users/user.service';

interface IUserModel {
  Id: number;
  BranchCode: number;
  Transfer_Limit: number;
  TodayAccess: number;
  Today_Transfer_Limit: number;
  Today_Cash_Rect: number;
  Today_Cash_Payt: number;
  Today_Pass_Rect: number;
  Today_Pass_Payt: number;
  CreatedBy: string;
}

@Component({
  selector: 'app-user-daily-role',
  templateUrl: './user-daily-role.component.html',
  styleUrls: ['./user-daily-role.component.css']
})
export class UserDailyRoleComponent implements OnInit {

  userForm!: FormGroup;
  id!: number;
  maxId!: number;
  dto: IGeneralDTO = {} as IGeneralDTO;
  isAddMode!: boolean;
  uiUserRoles: any[] = [];
  lastUpdatedOn : string = "";
  
  constructor(private router: Router, private route: ActivatedRoute, private _sharedService: SharedService,
    private _userService: UserService, private _toastrService: ToastrService) { }

  ngOnInit(): void {
    this.userForm = new FormGroup({
      userId: new FormControl("", []),
      name: new FormControl("", []),
      role: new FormControl(0, [Validators.required]),
      todaysRole: new FormControl(0, [Validators.required]),
      todaysCashReceiptLimit: new FormControl(0, [Validators.required]),
      todaysCashPaymentLimit: new FormControl(0, [Validators.required]),
      todaysTransferLimit: new FormControl(0, [Validators.required]),
      todaysPassingReceiptLimit: new FormControl(0, [Validators.required]),
      todaysPassingPaymentLimit: new FormControl(0, [Validators.required]),
      //lastUpdatedOn: new FormControl("", [Validators.required])
    });

    this.getUserRoles().then(() => {
      this._userService.getDTO().subscribe(obj => this.dto = obj);
      if (this.dto) {
        this.id = this.dto.id;
        this._userService.getUser(this._sharedService.applicationUser.branchId, this.dto.id).subscribe((data: any) => {
          if (data) {
            if (data.statusCode == 200 && data.data.data) {
              var user = data.data.data;
              this.userForm.patchValue({
                userId: user.id,
                name: user.name,
                role: user.access,
                todaysRole: user.todayAccess,
                todaysCashReceiptLimit: user.today_Cash_Rect,
                todaysCashPaymentLimit: user.today_Cash_Payt,
                todaysTransferLimit: user.transfer_Limit,
                todaysPassingReceiptLimit: user.today_Pass_Rect,
                todaysPassingPaymentLimit: user.today_Pass_Payt,
                //lastUpdatedOn: formatDate(new Date( user.lastModifiedDate), 'yyyy-MM-dd', 'en')
              });
              this.lastUpdatedOn = formatDate(new Date( user.lastModifiedDate), 'yyyy-MM-dd', 'en')
              this.role.disable();
            }
          }
        })
      }
    })
  }

  getUserRoles() {
    return new Promise((resolve, reject) => {
      this._userService.getUserRoles().subscribe((data: any) => {
        if (data) {
          if (data.statusCode == 200 && data.data.data) {
            var roles = data.data.data;
            this.uiUserRoles = roles;

            this.userForm.patchValue({
              role:  this.uiUserRoles[0].id,
            });

            resolve(true);
          }
        }
      })
    })
  }


  public validateForm(): boolean {

    if (this.userForm.invalid) {
      for (const control of Object.keys(this.userForm.controls)) {
        this.userForm.controls[control].markAsTouched();
      }
      return false;
    }
    return true;
  }

  public clear(): void {
    this.userForm.patchValue({
      userId: 0,
      name: "",
      role: 0,
      todaysRole: 0,
      todaysCashReceiptLimit:  0,
      todaysCashPaymentLimit: 0,
      todaysTransferLimit:  0,
      todaysPassingReceiptLimit:  0,
      todaysPassingPaymentLimit: 0,
      lastUpdatedOn: ""
    });
  }

  saveTodaysRole()
  {
    if (this.validateForm()) {
      let userModel = {} as IUserModel;
      
      userModel.Id = this.dto.id;
      userModel.BranchCode = this._sharedService.applicationUser.branchId;
      userModel.TodayAccess = parseInt(this.role.value.toString());
      userModel.Today_Transfer_Limit = parseFloat(this.todaysTransferLimit.value.toString());
      userModel.Today_Cash_Rect =  parseFloat(this.todaysCashReceiptLimit.value.toString());
      userModel.Today_Cash_Payt =  parseFloat(this.todaysCashPaymentLimit.value.toString());
      userModel.Today_Pass_Rect =  parseFloat(this.todaysPassingReceiptLimit.value.toString());
      userModel.Today_Pass_Payt =  parseFloat(this.todaysPassingPaymentLimit.value.toString());
      userModel.CreatedBy = this._sharedService.applicationUser.userName;

      console.log(userModel);

      this._userService.saveUsersTodaysRole(userModel).subscribe((data: any) => {
        console.log(data);
        if (data) {
          if (data.statusCode == 200 && data.data.data && data.data.data.retId > 0) {
            if (data.data.data.status == "SUCCESS") {
              this._toastrService.success(data.data.data.message, 'Success!');
              this.clear();
              this.configClick("user-search");
            }
            else {
              this._toastrService.success("Error saving user!", 'Error!');
            }
          }
        }
      })

    }

  }

  configClick(routeValue: string) {
    sessionStorage.setItem("configMenu", routeValue);
    this.router.navigate(['/app/' + routeValue]);
  }


  get userId() {
    return this.userForm.get('userId')!;
  }

  get name() {
    return this.userForm.get('name')!;
  }

  get role() {
    return this.userForm.get('role')!;
  }

  get todaysRole() {
    return this.userForm.get('todaysRole')!;
  }

  get todaysCashReceiptLimit() {
    return this.userForm.get('todaysCashReceiptLimit')!;
  }

  get todaysCashPaymentLimit() {
    return this.userForm.get('todaysCashPaymentLimit')!;
  }
  
  get todaysTransferLimit() {
    return this.userForm.get('todaysTransferLimit')!;
  }

  get todaysPassingReceiptLimit() {
    return this.userForm.get('todaysPassingReceiptLimit')!;
  }

  get todaysPassingPaymentLimit() {
    return this.userForm.get('todaysPassingPaymentLimit')!;
  }

}
