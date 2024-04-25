import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from '../services/shared.service';

@Component({
  selector: 'app-app-router',
  templateUrl: './app-router.component.html',
  styleUrls: ['./app-router.component.css']
})
export class AppRouterComponent implements OnInit, AfterViewInit{

  constructor(private router: Router, private activatedRoute: ActivatedRoute,
    private _sharedService: SharedService) { }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((response: any) => {
      this._sharedService.uiAllMasters = this.activatedRoute.snapshot.data['masterData'].masters.data.data
      this._sharedService.uiAllStates =  this.activatedRoute.snapshot.data['masterData'].states.data.data
      this._sharedService.uiAllDistricts = this.activatedRoute.snapshot.data['masterData'].districts.data.data
      this._sharedService.uiAllTalukas =this.activatedRoute.snapshot.data['masterData'].talukas.data.data
      this._sharedService.uiAllVillages =this.activatedRoute.snapshot.data['masterData'].villages.data.data
      this._sharedService.uiCurrencies =this.activatedRoute.snapshot.data['masterData'].currencies.data.data
      this._sharedService.uiGLTypesAndGroups = this.activatedRoute.snapshot.data['masterData'].glTypesAndGroups.data.data
    });


    let configMenu = sessionStorage.getItem("configMenu");
    if (configMenu != null && configMenu.length > 0) {
      this.configClick(configMenu);
    }
    else {
      this.configClick('home');
    }
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
