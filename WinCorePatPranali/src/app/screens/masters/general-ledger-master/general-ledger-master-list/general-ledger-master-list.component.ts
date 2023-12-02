import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
    private _sharedService: SharedService) { }

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
          this.uiGeneralLedgers.map((bank, i) => {
            bank.hasBranchesYN = bank.hasBranches ? "Yes" : "No";
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
    this.configClick("edit-bank/"+ uiGeneralLedger.id);
  }

  delete(uiGeneralLedger: any) {
    if (uiGeneralLedger.id > 0) {
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
