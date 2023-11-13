import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bank-master-list',
  templateUrl: './bank-master-list.component.html',
  styleUrls: ['./bank-master-list.component.css']
})
export class BankMasterListComponent {

  
  constructor(private router: Router) { }

  configClick(routeValue: string) {
    sessionStorage.setItem("configMenu", routeValue);
    this.router.navigate(['/app/'+ routeValue]);
  }

}
