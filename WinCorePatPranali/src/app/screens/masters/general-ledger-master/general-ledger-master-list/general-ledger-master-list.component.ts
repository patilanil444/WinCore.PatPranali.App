import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { IGeneralLedgerDTO } from 'src/app/common/models/common-ui-models';
import { GeneralLedgerService } from 'src/app/services/masters/general-ledger/general-ledger.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-general-ledger-master-list',
  templateUrl: './general-ledger-master-list.component.html',
  styleUrls: ['./general-ledger-master-list.component.css']
})
export class GeneralLedgerMasterListComponent implements OnInit {

  uiGeneralLedgers: any[] = [];
  p: number = 1;
  total: number = 0;
  constructor(private router: Router, private _generalLedgerService: GeneralLedgerService,
    private _sharedService: SharedService, private _toastrService: ToastrService) { }

  ngOnInit(): void {
    this.getGeneralLedgers();
  }

  getGeneralLedgers(){
    this._generalLedgerService.getGeneralLedgers(this._sharedService.applicationUser.branchId).subscribe((data: any) => {
      console.log(data);
      if (data) {
        this.uiGeneralLedgers = data.data.data;
        this.total = this.uiGeneralLedgers.length;
        if (this.uiGeneralLedgers) {
          this.uiGeneralLedgers.map((ledger, i) => {
            ledger.hasBranchesYN = ledger.hasBranches ? "Yes" : "No";
          });
        }
      }
    })
  }

  pageChangeEvent(event: number) {
    this.p = event;
    this.getGeneralLedgers();
  }

  add(route:any)
  {
    let maxId = 1;
    const ids = this.uiGeneralLedgers.map(gl => {
      return gl.id;
    })
    maxId = Math.max(...ids);

    let dtObject: IGeneralLedgerDTO = {
      route: route,
      action: "newRecord",
      id: 0,
      maxId: maxId,
    }

    this._generalLedgerService.setDTO(dtObject);

    this.configClick("general-ledger");
  }

  edit(uiGeneralLedger: any) {
    let dtObject: IGeneralLedgerDTO = {
      route: "general-ledger",
      action: "editRecord",
      id: uiGeneralLedger.id,
      maxId: 0,
    }
    this._generalLedgerService.setDTO(dtObject);

    this.configClick("general-ledger");
  }

  delete(uiGeneralLedger: any) {
    if (uiGeneralLedger.id > 0) {
      this._generalLedgerService.generalLedgerIdToDelete = uiGeneralLedger.id;
    }
  }

  onDelete()
  {
    let generalLedgerIdToDelete = this._generalLedgerService.generalLedgerIdToDelete;
    if (generalLedgerIdToDelete > 0) {
      this._generalLedgerService.deleteGeneralLedger(generalLedgerIdToDelete).subscribe((data: any) => {
        console.log(data);
        if (data) {
          // show message
          this._toastrService.success('General ledger deleted.', 'Success!');
          this.getGeneralLedgers();
        }
      })
    }
  }

  cancelDelete()
  {
    this._generalLedgerService.generalLedgerIdToDelete = -1;
  }

  configClick(routeValue: string) {
    sessionStorage.setItem("configMenu", routeValue);
    this.router.navigate(['/app/' + routeValue]);
  }

}
