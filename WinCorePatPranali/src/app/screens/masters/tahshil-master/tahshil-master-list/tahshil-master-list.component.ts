import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { IGeneralDTO } from 'src/app/common/models/common-ui-models';
import { TahshilMasterService } from 'src/app/services/masters/tahshil-master/tahshil-master.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-tahshil-master-list',
  templateUrl: './tahshil-master-list.component.html',
  styleUrls: ['./tahshil-master-list.component.css']
})
export class TahshilMasterListComponent implements OnInit {

  uiTahshils: any[] = [];
  p: number = 1;
  total: number = 0;
  constructor(private router: Router, private _tahshilMasterService: TahshilMasterService,
    private _sharedService: SharedService, private _toastrService: ToastrService) { }

  ngOnInit(): void {
    this.getTahsils();
  }

  getTahsils(){
    this._tahshilMasterService.getTahsils().subscribe((data: any) => {
      console.log(data);
      if (data) {
        this.uiTahshils = data.data.data;
        this.total = this.uiTahshils.length;
      }
    })
  }

  pageChangeEvent(event: number) {
    this.p = event;
    //this.getTahsils();
  }


  add(route:any)
  {
    let maxId = 1;
    const ids = this.uiTahshils.map((gl:any) => {
      return gl.id;
    })
    maxId = Math.max(...ids);

    let dtObject: IGeneralDTO = {
      route: route,
      action: "newRecord",
      id: 0,
      maxId: maxId,
    }

    this._tahshilMasterService.setDTO(dtObject);
    this.configClick("tahsil");
  }

  edit(uiTahshil: any) {

    let dtObject: IGeneralDTO = {
      route: "tahsil",
      action: "editRecord",
      id: uiTahshil.id,
      maxId: 0,
    }
    this._tahshilMasterService.setDTO(dtObject);

    this.configClick("tahsil");
  }

  delete(uiTahshil: any) {
    if (uiTahshil.id > 0) {
      this._tahshilMasterService.tahshilIdToDelete = uiTahshil.id;
    }
  }

  onDelete()
  {
    let priorityIdToDelete = this._tahshilMasterService.tahshilIdToDelete;
    if (priorityIdToDelete > 0) {
      this._tahshilMasterService.deleteTahsil(priorityIdToDelete).subscribe((data: any) => {
        console.log(data);
        if (data) {
          this._toastrService.success('Tahsil deleted.', 'Success!');
          // show message
          this.getTahsils();
        }
      })
    }
  }

  cancelDelete()
  {
    this._tahshilMasterService.tahshilIdToDelete = -1;
  }

  configClick(routeValue: string) {
    sessionStorage.setItem("configMenu", routeValue);
    this.router.navigate(['/app/'+ routeValue]);
  }

}
