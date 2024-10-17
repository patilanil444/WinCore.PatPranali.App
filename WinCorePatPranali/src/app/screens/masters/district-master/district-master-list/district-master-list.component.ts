import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { IGeneralDTO } from 'src/app/common/models/common-ui-models';
import { DistrictMasterService } from 'src/app/services/masters/district-master/district-master.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-district-master-list',
  templateUrl: './district-master-list.component.html',
  styleUrls: ['./district-master-list.component.css']
})
export class DistrictMasterListComponent implements OnInit {

  uiDistricts: any[] = [];
  p: number = 1;
  total: number = 0;
  constructor(private router: Router, private _districtMasterService: DistrictMasterService,
    private _sharedService: SharedService, private _toastrService: ToastrService) { }

  ngOnInit(): void {
    this.getDistricts();
  }

  getDistricts(){
    this._districtMasterService.getDistricts().subscribe((data: any) => {
      console.log(data);
      if (data) {
        this.uiDistricts = data.data.data;
        this.total = this.uiDistricts.length;
      }
    })
  }

  pageChangeEvent(event: number) {
    this.p = event;
   // this.getDistricts();
  }


  add(route:any)
  {
    let maxId = 1;
    const ids = this.uiDistricts.map((gl:any) => {
      return gl.id;
    })
    maxId = Math.max(...ids);

    let dtObject: IGeneralDTO = {
      route: route,
      action: "newRecord",
      id: 0,
      maxId: maxId,
      models: this.uiDistricts
    }

    this._districtMasterService.setDTO(dtObject);
    this.configClick("district");
  }

  edit(uiDistrict: any) {

    let dtObject: IGeneralDTO = {
      route: "district",
      action: "editRecord",
      id: uiDistrict.id,
      maxId: 0,
      models: this.uiDistricts
    }
    this._districtMasterService.setDTO(dtObject);

    this.configClick("district");
  }

  delete(uiDistrict: any) {
    if (uiDistrict.id > 0) {
      this._districtMasterService.districtIdToDelete = uiDistrict.id;
    }
  }

  onDelete()
  {
    let priorityIdToDelete = this._districtMasterService.districtIdToDelete;
    if (priorityIdToDelete > 0) {
      this._districtMasterService.deleteDistrict(priorityIdToDelete).subscribe((data: any) => {
        console.log(data);
        if (data) {
          this._toastrService.success('District deleted.', 'Success!');
          // show message
          this.getDistricts();
        }
      })
    }
  }

  cancelDelete()
  {
    this._districtMasterService.districtIdToDelete = -1;
  }

  configClick(routeValue: string) {
    sessionStorage.setItem("configMenu", routeValue);
    this.router.navigate(['/app/'+ routeValue]);
  }
}
