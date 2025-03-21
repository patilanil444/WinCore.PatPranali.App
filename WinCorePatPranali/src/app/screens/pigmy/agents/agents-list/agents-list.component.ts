import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { IGeneralDTO } from 'src/app/common/models/common-ui-models';
import { PigmyMasterService } from 'src/app/services/pigmy/pigmy-master/pigmy-master.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-agents-list',
  templateUrl: './agents-list.component.html',
  styleUrls: ['./agents-list.component.css']
})
export class AgentsListComponent implements OnInit {

  uiAgents: any[] = [];
  p: number = 1;
  total: number = 0;

  constructor(private router: Router, private _toastrService: ToastrService, private _pigmyMasterService: PigmyMasterService
    , private _sharedService: SharedService
  ) { }

  ngOnInit(): void {
    this.getBranchAgents();
  }

  getBranchAgents()
  {
    this._pigmyMasterService.getBranchAgents(this._sharedService.applicationUser.branchId).subscribe((data: any) => {
      if (data) {
        if (data.statusCode == 200 && data.data.data) {
          var agents = data.data.data;
          if (agents != null && agents.length > 0) {
            this.uiAgents = agents.map((user: any) => (
              {
                ...user,
                statusText: this.getAgentStatus(user.status),
              }))
          }

        }
      }
    })
  }
  
  getAgentStatus(isActive: boolean)
  {
    if (isActive) {
      return "Active";
    }
    else
    {
      return "In-Active";
    }
  }


  addNewAgent()
  {
    let dtObject: IGeneralDTO = {
      route: "user",
      action: "newRecord",
      id: 0,
      maxId: 0,
      models: this.uiAgents
    }

    this._pigmyMasterService.setDTO(dtObject);
    this.configClick("pigmy-agent");
  }

  pageChangeEvent(event: number) {
    this.p = event;
  }
 
  delete(uiUser:any)
  {
    if (uiUser.id > 0) {
      this._pigmyMasterService.agentIdToDelete = uiUser.id;
    }
  }

  edit(uiUser:any)
  {
    let dtObject: IGeneralDTO = {
      route: "user",
      action: "editRecord",
      id: uiUser.id,
      maxId: 0,
      models: this.uiAgents
    }
    this._pigmyMasterService.setDTO(dtObject);

    this.configClick("pigmy-agent");
  }


  onDelete()
  {
    // let agentIdToDelete = this._pigmyMasterService.agentIdToDelete;
    // if (agentIdToDelete > 0) {
    //   this._pigmyMasterService.deleteAgents(this._sharedService.applicationUser.branchId, agentIdToDelete).subscribe((data: any) => {
       
    //     if (data) {
    //       // show message
    //       this._toastrService.success('Agent deleted.', 'Success!');
    //       this.getBranchAgents();
    //     }
    //   })
    // }
  }

  cancelDelete()
  {
    this._pigmyMasterService.agentIdToDelete = -1;
  }

  configClick(routeValue: string) {
    sessionStorage.setItem("configMenu", routeValue);
    this.router.navigate(['/app/' + routeValue]);
  }

}
