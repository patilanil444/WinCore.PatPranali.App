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
  uiGeneralMasters: any[] = [];
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
    this._generalMasterService.getAllGeneralMasters(this.masterId).subscribe((data: any) => {
      if (data) {
        this.uiGeneralMasters = data.data.data;
      }
    })
  }

  showMasterList() {
    this.uiGeneralMasters = [];
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
      constantNo : 0,
      masterId: this.masterId,
      masterType: this.uiMasters.filter(m => m.id == this.masterId)[0].constName,
      fullName: "",
      shortName: ""
    }

    this._sharedService.setDTO(dtObject);
    this.configClick(route);
  }

  edit(uiGeneralMaster: any) {
    let dtObject: IGeneralMasterDTO = {
      route: "general-master",
      action: "editRecord",
      id: uiGeneralMaster.constId,
      maxId: 0,
      constantNo : uiGeneralMaster.constantNo,
      masterId: this.masterId,
      masterType: this.uiMasters.filter(m => m.id == this.masterId)[0].constName,
      fullName: uiGeneralMaster.constantname,
      shortName: uiGeneralMaster.shortName
    }
    
    this._sharedService.setDTO(dtObject);
    this.configClick("general-master");
  }

  delete(uiGeneralMaster: any) {
    if (uiGeneralMaster.constId > 0) {
      this._generalMasterService.generalMasterIdToDelete = uiGeneralMaster.constId; 
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
