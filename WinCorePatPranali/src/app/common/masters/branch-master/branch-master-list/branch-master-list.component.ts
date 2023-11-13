import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-branch-master-list',
  templateUrl: './branch-master-list.component.html',
  styleUrls: ['./branch-master-list.component.css']
})
export class BranchMasterListComponent {

  constructor(private router: Router) { }

  configClick(routeValue: string) {
    sessionStorage.setItem("configMenu", routeValue);
    this.router.navigate(['/app/'+ routeValue]);
  }
}
