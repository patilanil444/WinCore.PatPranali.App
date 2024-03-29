import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { IGeneralMasterDTO } from 'src/app/common/models/common-ui-models';
import { GeneralMasterService } from 'src/app/services/masters/general-master/general-master.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-general-master-list',
  templateUrl: './general-master-list.component.html',
  styleUrls: ['./general-master-list.component.css']
})
export class GeneralMasterListComponent {

  uiMasters: any[] = [];
  uiBranchGeneralMasters: any[] = [];
  p: number = 1;
  total: number = 0;

  masterId: number = 0;
  constructor(private router: Router, private _generalMasterService: GeneralMasterService,
    private _sharedService: SharedService, private _toastrService: ToastrService) { }

  ngOnInit(): void {
    this.getMasters();
  }

  getMasters(){
    this._generalMasterService.getMastersList().subscribe((data: any) => {
      console.log(data);
      if (data) {
        this.uiMasters = data.data.data;
        if (this.uiMasters) {
          this.masterId = this.uiMasters[0].id;
        }
      }
    })
  }

  getBranchGeneralMasters(){
    let branchGeneralMasterModel = {
      GeneralMasterId: this.masterId,
      BranchId: this._sharedService.applicationUser.branchId
    }
    this._generalMasterService.getAllGeneralMasters(branchGeneralMasterModel).subscribe((data: any) => {
      if (data) {
        this.uiBranchGeneralMasters = data.data.data;
      }
    })
  }

  showMasterList() {
    this.uiBranchGeneralMasters = [];
    if (this.masterId > 0) {
      this.getBranchGeneralMasters();
    }
  }

  pageChangeEvent(event: number) {
    this.p = event;
    //this.getBanks();
  }

  add(route: any) {
    let dtObject: IGeneralMasterDTO = {
      route: route,
      action: "newRecord",
      id: 0,
      maxId: 0,
      masterId: this.masterId,
      masterType: this.uiMasters.filter(m => m.id == this.masterId)[0].masterName
    }

    this._sharedService.setDTO(dtObject);
    this.configClick(route);
  }

  edit(uiBranchGeneralMaster: any) {
    let dtObject: IGeneralMasterDTO = {
      route: "general-master",
      action: "editRecord",
      id: uiBranchGeneralMaster.id,
      maxId: 0,
      masterId: this.masterId,
      masterType: this.uiMasters.filter(m => m.id == this.masterId)[0].masterName
    }
    
    this._sharedService.setDTO(dtObject);
    this.configClick("general-master");
  }

  delete(uiGeneralMaster: any) {
    if (uiGeneralMaster.id > 0) {
      this._generalMasterService.generalMasterIdToDelete = uiGeneralMaster.id; 
    }
  }

  onDelete()
  {
    let generalMasterIdToDelete = this._generalMasterService.generalMasterIdToDelete;
    if (generalMasterIdToDelete > 0) {
      this._generalMasterService.deleteGeneralMaster(generalMasterIdToDelete).subscribe((data: any) => {
        console.log(data);
        if (data) {
          // show message
          this._toastrService.success('General master deleted.', 'Success!');
          this.getBranchGeneralMasters();
        }
      })
    }
  }

  cancelDelete()
  {
    this._generalMasterService.generalMasterIdToDelete = -1;
  }

  configClick(routeValue: string) {
    sessionStorage.setItem("configMenu", routeValue);
    this.router.navigate(['/app/' + routeValue]);
  }
}
