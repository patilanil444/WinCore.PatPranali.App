import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bank-master-form',
  templateUrl: './bank-master-form.component.html',
  styleUrls: ['./bank-master-form.component.css']
})
export class BankMasterFormComponent {
  constructor(private router: Router) { }

  configClick(routeValue: string) {
    sessionStorage.setItem("configMenu", routeValue);
    this.router.navigate(['/app/'+ routeValue]);
  }
}
