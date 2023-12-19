import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IGeneralDTO } from 'src/app/common/models/common-ui-models';
import { PriorityMasterService } from 'src/app/services/masters/priority-master/priority-master.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-priority-list',
  templateUrl: './priority-list.component.html',
  styleUrls: ['./priority-list.component.css']
})
export class PriorityListComponent {

  uiPriorities: any[] = [];
  p: number = 1;
  total: number = 0;
  constructor(private router: Router, private _priorityMasterService: PriorityMasterService,
    private _sharedService: SharedService) { }

  ngOnInit(): void {
    this.getPriorities();
  }

  getPriorities(){
    this._priorityMasterService.getPriorities(this._sharedService.applicationUser.branchId).subscribe((data: any) => {
      console.log(data);
      if (data) {
        this.uiPriorities = data.data.data;
        this.total = this.uiPriorities.length;
      }
    })
  }

  pageChangeEvent(event: number) {
    this.p = event;
    this.getPriorities();
  }

  add(route:any)
  {
    let maxId = 1;
    const ids = this.uiPriorities.map(gl => {
      return gl.id;
    })
    maxId = Math.max(...ids);

    let dtObject: IGeneralDTO = {
      route: route,
      action: "newRecord",
      id: 0,
      maxId: maxId,
    }

    this._priorityMasterService.setDTO(dtObject);
    this.configClick("priority");
  }

  edit(uiPriority: any) {

    let dtObject: IGeneralDTO = {
      route: "general-ledger",
      action: "editRecord",
      id: uiPriority.id,
      maxId: 0,
    }
    this._priorityMasterService.setDTO(dtObject);

    this.configClick("priority");
  }

  delete(uiPriority: any) {
    if (uiPriority.id > 0) {
      this._priorityMasterService.priorityIdToDelete = uiPriority.id;
    }
  }

  onDelete()
  {
    let priorityIdToDelete = this._priorityMasterService.priorityIdToDelete;
    if (priorityIdToDelete > 0) {
      this._priorityMasterService.deletePriority(priorityIdToDelete).subscribe((data: any) => {
        console.log(data);
        if (data) {
          // show message
          this.getPriorities();
        }
      })
    }
  }

  cancelDelete()
  {
    this._priorityMasterService.priorityIdToDelete = -1;
  }

  configClick(routeValue: string) {
    sessionStorage.setItem("configMenu", routeValue);
    this.router.navigate(['/app/'+ routeValue]);
  }
}
