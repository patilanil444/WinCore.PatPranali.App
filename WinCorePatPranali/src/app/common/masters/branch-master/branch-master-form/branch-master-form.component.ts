import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-branch-master-form',
  templateUrl: './branch-master-form.component.html',
  styleUrls: ['./branch-master-form.component.css']
})
export class BranchMasterFormComponent {
  constructor(private router: Router) { }

  configClick(routeValue: string) {
    sessionStorage.setItem("configMenu", routeValue);
    this.router.navigate(['/app/'+ routeValue]);
  }
}
