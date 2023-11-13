import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-general-master-list',
  templateUrl: './general-master-list.component.html',
  styleUrls: ['./general-master-list.component.css']
})
export class GeneralMasterListComponent {
  constructor(private router: Router) { }

  configClick(routeValue: string) {
    sessionStorage.setItem("configMenu", routeValue);
    this.router.navigate(['/app/'+ routeValue]);
  }
}
