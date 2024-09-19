import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { IGeneralDTO } from 'src/app/common/models/common-ui-models';
import { SharedService } from 'src/app/services/shared.service';
import { UserService } from 'src/app/services/users/user.service';

@Component({
  selector: 'app-user-search',
  templateUrl: './user-search.component.html',
  styleUrls: ['./user-search.component.css']
})
export class UserSearchComponent implements OnInit {

  uiUsers: any[] = [];
  p: number = 1;
  total: number = 0;

  constructor(private router: Router, private _toastrService: ToastrService, private _userService: UserService
    , private _sharedService: SharedService
  ) { }

  ngOnInit(): void {
    this.getBranchUsers();
  }

  getBranchUsers()
  {
    this._userService.getUsers(this._sharedService.applicationUser.branchId).subscribe((data: any) => {
      if (data) {
        if (data.statusCode == 200 && data.data.data) {
          var users = data.data.data;
          //this.uiUsers = users;
          if (users != null && users.length > 0) {
            this.uiUsers = users.map((user: any) => (
              {
                ...user,
                status: this.getUserStatus(user.isActive)
              }))
          }

        }
      }
    })
  }
  
  getUserStatus(isActive: boolean)
  {
    if (isActive) {
      return "Active";
    }
    else
    {
      return "In-Active";
    }
  }

  addNewUser()
  {
    let dtObject: IGeneralDTO = {
      route: "user",
      action: "newRecord",
      id: 0,
      maxId: 0,
    }

    this._userService.setDTO(dtObject);
    this.configClick("user");
  }

  pageChangeEvent(event: number) {
    this.p = event;
  }
 
  delete(uiUser:any)
  {
    if (uiUser.id > 0) {
      this._userService.userIdToDelete = uiUser.id;
    }
  }

  edit(uiUser:any)
  {
    let dtObject: IGeneralDTO = {
      route: "user",
      action: "editRecord",
      id: uiUser.id,
      maxId: 0,
    }
    this._userService.setDTO(dtObject);

    this.configClick("user");
  }


  onDelete()
  {
    let userIdToDelete = this._userService.userIdToDelete;
    if (userIdToDelete > 0) {
      this._userService.deleteUser(this._sharedService.applicationUser.branchId, userIdToDelete).subscribe((data: any) => {
        console.log(data);
        if (data) {
          // show message
          this._toastrService.success('User deleted.', 'Success!');
          this.getBranchUsers();
        }
      })
    }
  }

  cancelDelete()
  {
    this._userService.userIdToDelete = -1;
  }

  setTodaysLimit(uiUser: any)
  {
    let dtObject: IGeneralDTO = {
      route: "user",
      action: "editRecord",
      id: uiUser.id,
      maxId: 0,
    }
    this._userService.setDTO(dtObject);

    this.configClick("daily-role");
  }

  configClick(routeValue: string) {
    sessionStorage.setItem("configMenu", routeValue);
    this.router.navigate(['/app/' + routeValue]);
  }
  
}
