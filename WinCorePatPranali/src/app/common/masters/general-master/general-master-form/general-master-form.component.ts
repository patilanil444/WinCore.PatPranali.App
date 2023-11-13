import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-general-master-form',
  templateUrl: './general-master-form.component.html',
  styleUrls: ['./general-master-form.component.css']
})
export class GeneralMasterFormComponent {
  constructor(private router: Router) { }

  configClick(routeValue: string) {
    sessionStorage.setItem("configMenu", routeValue);
    this.router.navigate(['/app/'+ routeValue]);
  }
}
