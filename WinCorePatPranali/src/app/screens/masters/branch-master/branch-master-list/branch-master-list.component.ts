import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IGeneralDTO } from 'src/app/common/models/common-ui-models';
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

  constructor(private router: Router, private _branchMasterService: BranchMasterService) { }


  ngOnInit(): void {
    this.getBranches();
  }

  getBranches(){
    this._branchMasterService.getBranches().subscribe((data: any) => {
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

    let maxId = 1;
    const ids = this.uiBranches.map(gl => {
      return gl.id;
    })
    maxId = Math.max(...ids);

    let dtObject: IGeneralDTO = {
      route: route,
      action: "newRecord",
      id: 0,
      maxId: maxId,
    }

    this._branchMasterService.setDTO(dtObject);
    this.configClick("branch");
  }

  edit(uiBranch: any) {
    let dtObject: IGeneralDTO = {
      route: "general-ledger",
      action: "editRecord",
      id: uiBranch.id,
      maxId: 0,
    }
    this._branchMasterService.setDTO(dtObject);

    this.configClick("branch");
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
