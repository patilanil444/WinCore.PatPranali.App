import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from '../services/shared.service';
import { UiUserRole } from '../common/models/common-ui-models';
import { AuthService } from '../services/auth/auth.service';
import { WorkOperationsService } from '../services/transactions/work-operations/work-operations.service';
import { DatePipe, formatDate } from '@angular/common';

@Component({
  selector: 'app-app-router',
  templateUrl: './app-router.component.html',
  styleUrls: ['./app-router.component.css'],
  providers: [DatePipe]
})
export class AppRouterComponent implements OnInit, AfterViewInit {

  userName: string = "";
  userRole: string = "";

  isCustomerExpanded = false;
  isAccountsExpanded = false;
  isMastersExpanded = false;
  isUsersExpanded = false;
  isRegistersExpanded = false;
  isTransactionExpanded = false;
  isDailySetupExpanded = false;
  isPigmyWorkExpanded = false;

  isSidebarEnabled = true;

  constructor(private router: Router, private activatedRoute: ActivatedRoute,
    private _sharedService: SharedService, private _authService: AuthService, 
    private _workOperationsService: WorkOperationsService, private datePipe: DatePipe) { }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((response: any) => {
      this._sharedService.uiAllMasters = this.activatedRoute.snapshot.data['masterData'].masters.data.data
      this._sharedService.uiAllStates = this.activatedRoute.snapshot.data['masterData'].states.data.data
      this._sharedService.uiAllDistricts = this.activatedRoute.snapshot.data['masterData'].districts.data.data
      this._sharedService.uiAllTalukas = this.activatedRoute.snapshot.data['masterData'].talukas.data.data
      this._sharedService.uiAllVillages = this.activatedRoute.snapshot.data['masterData'].villages.data.data
      this._sharedService.uiCurrencies = this.activatedRoute.snapshot.data['masterData'].currencies.data.data
      this._sharedService.uiGLTypesAndGroups = this.activatedRoute.snapshot.data['masterData'].glTypesAndGroups.data.data
      this._sharedService.uiDenominatons = this.activatedRoute.snapshot.data['masterData'].denominations.data.data
    });

    let configMenu = sessionStorage.getItem("configMenu");
    if (configMenu != null && configMenu.length > 0) {
      this.configClick(configMenu);
    }
    else {
      this.configClick('home');
    }

    this.setApplicationUser();
    this.getOpenDay();
  }

  getOpenDay()
  {
    this._workOperationsService.getOpenDays(this._sharedService.applicationUser.branchId).subscribe((data: any) => {
      let uiOpenDay = data.data.data;
      if (uiOpenDay && uiOpenDay.id > 0) {
        let openDay = uiOpenDay.workingDate;
        openDay = formatDate(new Date(openDay), 'yyyy-MM-dd', 'en');

        this._sharedService.setWorkOperationDate(openDay);
      }
      else
      {
        this._sharedService.setWorkOperationDate("");
      }
    })
  }

  getWorkOperationDate()
  {
    let operationDate = this._sharedService.getWorkOperationDate();

    return this.datePipe.transform(operationDate, 'dd-MM-yyyy');
  }

  setApplicationUser() {
    let accessToken = localStorage.getItem('accessToken')
    if (accessToken) {
      if (this._authService.isTokenExpired(accessToken)) {
        this._authService.refreshToken().then(result => {
          if (result) {
            accessToken = localStorage.getItem('accessToken')
            this._authService.decodeToken(accessToken? accessToken:"");
            if (this._sharedService.applicationUser) {
              this.setUserTitle();
            }
          }
        }).catch(error => {
          //alert("Error");
        });
      }
      else
      {
        this._authService.decodeToken(accessToken);
        if (this._sharedService.applicationUser) {
          this.setUserTitle();
        }
      }
    }
    else
    {
      this.logout();
    }
  }

  setUserTitle() {
    this.userName = this._sharedService.applicationUser.userName;
    let role = UiUserRole[this._sharedService.applicationUser.todayAccess];
    this.userRole = role.replace("_", " ");
  }

  logout(): void {
    this._authService.logout();
    this.router.navigate(['/login']);
  }

  configClick(routeValue: string) {
    sessionStorage.setItem("configMenu", routeValue);
    this.router.navigate(['/app/' + routeValue]);
  }

  clickMenu(menu: string) {
    if (menu == 'customers') {
      this.isCustomerExpanded = !this.isCustomerExpanded;
    }
    else if (menu == 'accounts') {
      this.isAccountsExpanded = !this.isAccountsExpanded;
    }
    else if (menu == 'transactions') {
      this.isTransactionExpanded = !this.isTransactionExpanded;
    }
    else if (menu == 'dailySetup') {
      this.isDailySetupExpanded = !this.isDailySetupExpanded;
    }
    else if (menu == 'registers') {
      this.isRegistersExpanded = !this.isRegistersExpanded;
    }
    else if (menu == 'masters') {
      this.isMastersExpanded = !this.isMastersExpanded;
    }
    else if (menu == 'users') {
      this.isUsersExpanded = !this.isUsersExpanded;
    }
    else if (menu == 'pigmy') {
      this.isPigmyWorkExpanded = !this.isPigmyWorkExpanded;
    }
  }

  sidebarClick() {
    this.isSidebarEnabled = !this.isSidebarEnabled;
  }

  isMenuSelected(routeValue: string) {
    let configMenu = sessionStorage.getItem("configMenu");
    return (configMenu === routeValue);
  }

  ngAfterViewInit(): void {
  }

}
