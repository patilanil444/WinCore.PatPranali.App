import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { UserRoleHeper } from 'src/app/common/utils/user-role-helper';
import { SharedService } from 'src/app/services/shared.service';
import { WorkOperationsService } from 'src/app/services/transactions/work-operations/work-operations.service';

@Component({
  selector: 'app-begin-day',
  templateUrl: './begin-day.component.html',
  styleUrls: ['./begin-day.component.css']
})
export class BeginDayComponent implements OnInit {

  uiOpenDay:any = {};
  areDaysOpen = false;

  constructor(private _toastrService: ToastrService,
    private _workOperationsService: WorkOperationsService, private _sharedService: SharedService, ) { }
  dtStartDay = formatDate(new Date(Date.now()), 'yyyy-MM-dd', 'en');
  
  ngOnInit(): void {

    // Check if any day is open. If yes, disable everything
    this.checkDayOpen();
    UserRoleHeper.initialiseUserRoles(this._sharedService.applicationUser);
  }

  isAdministratorUser() {
    return UserRoleHeper.isAdministratorUser();
  }

  checkDayOpen()
  {
    this.areDaysOpen = false;

    this._workOperationsService.getOpenDays(this._sharedService.applicationUser.branchId).subscribe((data: any) => {
      this.uiOpenDay = data.data.data;
      if (this.uiOpenDay && this.uiOpenDay.id > 0) {
        let openDay = this.uiOpenDay.workingDate;
        openDay = formatDate(new Date(openDay), 'yyyy-MM-dd', 'en')

        this.areDaysOpen = true;
       
        this._toastrService.error('Please close the day: '+ openDay + ' before opening new day.' , 'Error!');
      }
    })
  }

  getSelectedDate(event:any)
  {
    if (event) {
      let selectedDate = new Date(event.year, event.month, event.day);
      this.dtStartDay = formatDate(selectedDate, 'yyyy-MM-dd', 'en');
    }
  }

  saveBeginDay()
  {
    if (!this.areDaysOpen) {

      let dateSelected = new Date(this.dtStartDay);
      let todaysDate = new Date();
      if (dateSelected.getFullYear() == todaysDate.getFullYear() &&
        dateSelected.getMonth() == todaysDate.getMonth() && 
        dateSelected.getDate() == todaysDate.getDate()) {
          let workOperation = {
            BranchId: this._sharedService.applicationUser.branchId,
            WorkingDate: this.dtStartDay,
            ActualDate: new Date(),
            CreatedBy: this._sharedService.applicationUser.id,
          }
    
          this._workOperationsService.openDay(workOperation).subscribe((data: any) => {
           
            if (data) {
              if (data.data.data && data.data.data.retId > 0) {
                if (data.data.data.status == "SUCCESS") {
                  this._toastrService.success("Day opened successfully. Please unlock the users.", 'Success!');
                }
                else {
                  this._toastrService.error("Error saving transaction!", 'Error!');
                }
              }
              else if (data.data.data && data.data.data.retId == 0) {
                this._toastrService.error(data.data.data.message, 'Error!');
              }
            }
          })
      }
      else
      {
        this._toastrService.error("Working day cannot be in past or future!", 'Error!');
      }
    }
  }
}
