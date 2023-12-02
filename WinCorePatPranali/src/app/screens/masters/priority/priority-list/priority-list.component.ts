import { Component } from '@angular/core';
import { Router } from '@angular/router';
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
    const ids = this.uiPriorities.map(priority => {
      return priority.id;
    })
    let maxId = Math.max(...ids);

    this.configClick("new-priority/"+ maxId);
    //this._sharedService.bankEmitter.emit(maxId);
  }

  edit(uiPriority: any) {
    this.configClick("edit-priority/"+ uiPriority.id);
  }

  delete(uiPriority: any) {
    if (uiPriority.id > 0) {
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
