import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-app-router',
  templateUrl: './app-router.component.html',
  styleUrls: ['./app-router.component.css']
})
export class AppRouterComponent implements OnInit, AfterViewInit{

  constructor(private router: Router) { }

  ngOnInit(): void {
    
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
