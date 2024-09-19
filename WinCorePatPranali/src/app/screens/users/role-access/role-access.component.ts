import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { IGeneralDTO } from 'src/app/common/models/common-ui-models';
import { SharedService } from 'src/app/services/shared.service';
import { UserService } from 'src/app/services/users/user.service';

export interface UiModule {
  id: number,
  name: string,
  value: boolean
}

@Component({
  selector: 'app-role-access',
  templateUrl: './role-access.component.html',
  styleUrls: ['./role-access.component.css']
})
export class RoleAccessComponent implements OnInit {
  roleForm!: FormGroup;
  id!: number;
  uiUserRoles: any[] = [];
  uiModules: any[] = [];
  dto: IGeneralDTO = {} as IGeneralDTO;

  constructor(private router: Router, private route: ActivatedRoute, private _sharedService: SharedService,
    private _userService: UserService, private _toastrService: ToastrService) { }

  ngOnInit(): void {

    this.roleForm = new FormGroup({
      role: new FormControl(0, [Validators.required]),
      access: new FormControl([], [Validators.required])
    });

    let module: UiModule = {
      id: 0,
      name: "All",
      value: false,
    }
    this.uiModules.push(module);
    this.getUserRoles().then(() => {
      this._userService.getDTO().subscribe(obj => this.dto = obj);
      if (this.dto) {
        this.id = this.dto.id;

        this._userService.getModules().subscribe((data: any) => {
          if (data) {
            if (data.statusCode == 200 && data.data.data) {
              var modules = data.data.data;
              if (modules && modules.length>0) {
                modules.forEach((mod:any)=>{
                  module = {
                    id: mod.id,
                    name: mod.moduleName,
                    value: false,
                  }

                  this.uiModules.push(module);
                })
              }
             
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

            this.roleForm.patchValue({
              role:  this.uiUserRoles[0].id,
            });

            resolve(true);
          }
        }
      })
    })
  }

  changeModuleAccess(uiModule: any)
  {
    if (uiModule) {
      if (uiModule.id == 0) {
        
        let allValue = uiModule.value;
        this.uiModules.forEach((mod) => {
          mod.value = !allValue;
        });
        uiModule.value = !uiModule.value
        let xx = this.uiModules;
      }
      else
      {
        uiModule.value = !uiModule.value;
        this.uiModules.forEach((mod) => {
          if (!uiModule.value && mod.id == 0) {
            mod.value = false;
          }
        });
      }
    }
  }

  saveRoleAccess()
  {

  }

  get role() {
    return this.roleForm.get('role')!;
  }

}
