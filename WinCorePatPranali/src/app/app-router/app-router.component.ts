import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BranchMasterService } from '../services/common/branch-master/branch-master.service';
import { SharedService } from '../services/common/shared.service';

@Component({
  selector: 'app-app-router',
  templateUrl: './app-router.component.html',
  styleUrls: ['./app-router.component.css']
})
export class AppRouterComponent implements OnInit, AfterViewInit{

  constructor(private router: Router, private _branchMasterService:BranchMasterService,
    private _sharedService:SharedService) { }

  ngOnInit(): void {
    
    let configMenu = sessionStorage.getItem("configMenu");
    if (configMenu != null && configMenu.length > 0) {
      this.configClick(configMenu);
    }
    else {
      this.configClick('home');
    }

    this.getStates();
    this.getDistricts();
    this.getTahshils();
  }

  getStates()
  {
    this._branchMasterService.getStates().subscribe((data: any) => {
      if (data) {
        if (data.statusCode == 200 && data.data.data) {
          this._sharedService.uiAllStates = data.data.data;
        }
      }
    })
  }

  getDistricts()
  {
    this._branchMasterService.getDistricts().subscribe((data: any) => {
      if (data) {
        if (data.statusCode == 200 && data.data.data) {
          this._sharedService.uiAllDistricts = data.data.data;
        }
      }
    })
  }

  getTahshils()
  {
    this._branchMasterService.getTahshils().subscribe((data: any) => {
      if (data) {
        if (data.statusCode == 200 && data.data.data) {
          this._sharedService.uiAllTahshils = data.data.data;
        }
      }
    })
  }

  configClick(routeValue: string) {
    sessionStorage.setItem("configMenu", routeValue);
    this.router.navigate(['/app/'+ routeValue]);
  }

  isMenuSelected(routeValue: string)
  {
    let configMenu = sessionStorage.getItem("configMenu");
    return (configMenu === routeValue);
  }

  ngAfterViewInit(): void {
  }
}
