import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { parseDate } from 'ngx-bootstrap/chronos';
import { ToastrService } from 'ngx-toastr';
import { IGeneralDTO } from 'src/app/common/models/common-ui-models';
import { SharedService } from 'src/app/services/shared.service';
import { UserService } from 'src/app/services/users/user.service';

interface IUserModel {
  Id: number;
  BranchCode: number;
  UserName: string;
  Password: string;
  Name: string;
  EmailId: string;
  MobileNo: string;
  PasswordExpiryDate: Date;
  Authority: string;
  Access: number;
  Mnode_Name: string;
  Transfer_Limit: number;
  Cash_Rect: number;
  Cash_Payt: number;
  Pass_Rect: number;
  Pass_Payt: number;
  TodayAccess: number;
  Today_Transfer_Limit: number;
  Today_Cash_Rect: number;
  Today_Cash_Payt: number;
  Today_Pass_Rect: number;
  Today_Pass_Payt: number;
  AllowAdd: boolean;
  AllowChange: boolean;
  AllowDelete: boolean;
  AllowList: boolean;
  IsActive: boolean;
  CreatedBy: string;
}

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  userForm!: FormGroup;
  id!: number;
  maxId!: number;
  showPassword : boolean = false;
  dto: IGeneralDTO = {} as IGeneralDTO;
  isAddMode!: boolean;
  uiUserRoles: any[] = [];

  constructor(private router: Router, private route: ActivatedRoute, private _sharedService: SharedService,
    private _userService: UserService, private _toastrService: ToastrService) { }

  ngOnInit(): void {

    this.userForm = new FormGroup({
      userId: new FormControl("", []),
      name: new FormControl("", [Validators.required]),
      mobile: new FormControl("", [Validators.required]),
      email: new FormControl("", [Validators.pattern("[a-zA-Z0-9.-_]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,}")]),
      role: new FormControl(0, [Validators.required]),
      username: new FormControl("", [Validators.required]),
      password: new FormControl("", [Validators.required]),
      passwordExpiryDate: new FormControl(formatDate(new Date().setDate(new Date().getDate() + 90), 'yyyy-MM-dd', 'en'), [Validators.required]),
      transfer_Limit:new FormControl("0", [Validators.required]),
      cash_receipt: new FormControl("0", [Validators.required]),
      cash_payment: new FormControl("0", [Validators.required]),
      passing_receipt: new FormControl("0", [Validators.required]),
      passing_payment: new FormControl("0", [Validators.required]),
      allow_add: new FormControl(true, []),
      allow_change: new FormControl(true, []),
      allow_delete: new FormControl(true, []),
      allow_list: new FormControl(true, []),
      isAuthority: new FormControl(false, [])
    });

    this.getUserRoles().then(() => {
      this._userService.getDTO().subscribe(obj => this.dto = obj);
      if (this.dto) {
        this.id = this.dto.id;
        if (this.dto.id == 0) {
          this.isAddMode = true;
          this.maxId = this.dto.maxId;
          this.userForm.patchValue({
            code: this.maxId + 1,
            //hasBranch: this.hBranchs[0].id,
            //generalLeadger : this.uiScheduleMasters[0].id,
          });
        }
        else {
          this.isAddMode = false;
          // edit a record
          this._userService.getUser(this._sharedService.applicationUser.branchId, this.dto.id).subscribe((data: any) => {
            if (data) {
              if (data.statusCode == 200 && data.data.data) {
                var user = data.data.data;
                this.userForm.patchValue({
                  userId: user.id,
                  name: user.name,
                  mobile: user.mobileNo,
                  email: user.emailId,
                  role: user.access,
                  username: user.userName,
                  password: user.password,
                  passwordExpiryDate: formatDate(new Date(user.passwordExpiryDate).setDate(new Date().getDate() + 90), 'yyyy-MM-dd', 'en'),
                  transfer_Limit: user.transfer_Limit,
                  cash_receipt: user.cash_Rect,
                  cash_payment: user.cash_Payt,
                  passing_receipt: user.pass_Rect,
                  passing_payment: user.pass_Payt,
                  allow_add: user.allowAdd,
                  allow_change: user.allowChange,
                  allow_delete: user.allowDelete,
                  allow_list: user.allowList,
                  isAuthority: user.authority == 'Y' ? true : false
                });
              }
            }
          })
        }
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
      mobile: "",
      email: "",
      role: this.uiUserRoles[0].id,
      username: "",
      password: "",
      passwordExpiryDate: formatDate(new Date().setDate(new Date().getDate() + 90), 'yyyy-MM-dd', 'en'),
      transfer_Limit: "0",
      cash_receipt: "0",
      cash_payment: "0",
      passing_receipt: "0",
      passing_payment: "0",
      allow_add: true,
      allow_change: true,
      allow_delete: true,
      allow_list: true,
      isAuthority: false
    });
  }

  saveUser()
  {
    if (this.validateForm()) {
      let userModel = {} as IUserModel;
      
      userModel.Id = this.dto.id;
      userModel.BranchCode = this._sharedService.applicationUser.branchId;
      userModel.UserName = this.username.value.toString();
      userModel.Password = this.password.value.toString();
      userModel.Name = this.name.value.toString();
      userModel.EmailId = this.email.value.toString();
      userModel.MobileNo = this.mobile.value.toString();
      userModel.Authority = this.isAuthority.value == true ? "Y" : "N";
      userModel.Access = parseInt(this.role.value.toString());
      //userModel.Mnode_Name = this.username.value.toString();
      userModel.Transfer_Limit = parseFloat(this.transfer_Limit.value.toString());
      userModel.Cash_Rect = parseFloat(this.cash_receipt.value.toString());
      userModel.Cash_Payt =  parseFloat(this.cash_payment.value.toString());
      userModel.Pass_Rect =  parseFloat(this.passing_receipt.value.toString());
      userModel.Pass_Payt =  parseFloat(this.passing_payment.value.toString());
      userModel.TodayAccess = parseInt(this.role.value.toString());
      userModel.Today_Transfer_Limit = parseFloat(this.transfer_Limit.value.toString());
      userModel.Today_Cash_Rect =  parseFloat(this.cash_receipt.value.toString());
      userModel.Today_Cash_Payt =  parseFloat(this.cash_payment.value.toString());
      userModel.Today_Pass_Rect =  parseFloat(this.passing_receipt.value.toString());
      userModel.Today_Pass_Payt =  parseFloat(this.passing_payment.value.toString());
      userModel.AllowAdd = this.allow_add.value;
      userModel.AllowChange = this.allow_change.value;
      userModel.AllowDelete = this.allow_delete.value;
      userModel.AllowList = this.allow_list.value;
      userModel.PasswordExpiryDate = this.passwordExpiryDate.value.toString();
      userModel.CreatedBy = this._sharedService.applicationUser.userName;

      console.log(userModel);

      this._userService.saveUser(userModel).subscribe((data: any) => {
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

  togglePasswordShow()
  {
      this.showPassword = !this.showPassword;
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

  get mobile() {
    return this.userForm.get('mobile')!;
  }

  get email() {
    return this.userForm.get('email')!;
  }

  get role() {
    return this.userForm.get('role')!;
  }

  get username() {
    return this.userForm.get('username')!;
  }
  
  get password() {
    return this.userForm.get('password')!;
  }

  get passwordExpiryDate() {
    return this.userForm.get('passwordExpiryDate')!;
  }

  get transfer_Limit() {
    return this.userForm.get('transfer_Limit')!;
  }

  get cash_receipt() {
    return this.userForm.get('cash_receipt')!;
  }

  get cash_payment() {
    return this.userForm.get('cash_payment')!;
  }

  get passing_receipt() {
    return this.userForm.get('passing_receipt')!;
  }

  get passing_payment() {
    return this.userForm.get('passing_payment')!;
  }

  get allow_add() {
    return this.userForm.get('allow_add')!;
  }

  get allow_change() {
    return this.userForm.get('allow_change')!;
  }

  get allow_delete() {
    return this.userForm.get('allow_delete')!;
  }

  get allow_list() {
    return this.userForm.get('allow_list')!;
  }

  get isAuthority() {
    return this.userForm.get('isAuthority')!;
  }
}
