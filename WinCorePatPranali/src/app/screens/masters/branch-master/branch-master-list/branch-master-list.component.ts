import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BranchMasterService } from 'src/app/services/masters/branch-master/branch-master.service';

@Component({
  selector: 'app-branch-master-list',
  templateUrl: './branch-master-list.component.html',
  styleUrls: ['./branch-master-list.component.css']
})
export class BranchMasterListComponent {

  uiBranches: any[] = [];
  p: number = 1;
  total: number = 0;

  constructor(private router: Router, private _bankMasterService: BranchMasterService) { }


  ngOnInit(): void {
    this.getBranches();
  }

  getBranches(){
    this._bankMasterService.getBranches().subscribe((data: any) => {
      console.log(data);
      if (data) {
        this.uiBranches = data.data.data;
        this.total = this.uiBranches.length;
        if (this.uiBranches) {
          this.uiBranches.map((branch, i) => {
            branch.hasBranchesYN = branch.hasBranches ? "Yes" : "No";
          });
        }
      }
    })
  }

  pageChangeEvent(event: number) {
    this.p = event;
    this.getBranches();
  }

  add(route:any)
  {
    const ids = this.uiBranches.map(branch => {
      return branch.id;
    })
    let maxId = Math.max(...ids);

    this.configClick("new-branch/"+ maxId);
  }

  edit(uiBank: any) {
    this.configClick("edit-branch/"+ uiBank.id);
  }

  delete(uiBank: any) {
    if (uiBank.id > 0) {
      alert("Hi");
      //this.deleteModel.open();
      ///this.deleteModel.nativeElement.className = 'modal fade show';
      // TODO: confirmation for delete 
    }
  }

  configClick(routeValue: string) {
    sessionStorage.setItem("configMenu", routeValue);
    this.router.navigate(['/app/'+ routeValue]);
  }
}
