import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IGeneralMasterDTO } from 'src/app/common/models/common-ui-models';
import { SharedService } from 'src/app/services/common/shared.service';
import { GeneralMasterService } from 'src/app/services/general-master/general-master.service';

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
    private _sharedService: SharedService) { }

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
    this.router.navigate(['/app/' + routeValue]);
  }
}
