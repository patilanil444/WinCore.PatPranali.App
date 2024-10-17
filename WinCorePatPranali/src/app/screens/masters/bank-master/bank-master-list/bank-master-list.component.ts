import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { IGeneralDTO } from 'src/app/common/models/common-ui-models';
import { BankMasterService } from 'src/app/services/masters/bank-master/bank-master.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-bank-master-list',
  templateUrl: './bank-master-list.component.html',
  styleUrls: ['./bank-master-list.component.css']
})
export class BankMasterListComponent {

  uiBanks: any[] = [];
  p: number = 1;
  total: number = 0;
  constructor(private router: Router, private _bankMasterService: BankMasterService,
    private _sharedService: SharedService, private _toastrService: ToastrService) { }

  ngOnInit(): void {
    this.getBanks();
  }

  getBanks(){
    this._bankMasterService.getBanks().subscribe((data: any) => {
      console.log(data);
      if (data) {
        this.uiBanks = data.data.data;
        this.total = this.uiBanks.length;
        if (this.uiBanks) {
          this.uiBanks.map((bank, i) => {
            bank.activeText = bank.active == 1 ? "Active" : "InActive";
          });
        }
      }
    })
  }

  pageChangeEvent(event: number) {
    this.p = event;
    //this.getBanks();
  }

  add(route:any)
  {
    let maxId = 1;
    const ids = this.uiBanks.map(gl => {
      return gl.bankId;
    })
    maxId = Math.max(...ids);

    let dtObject: IGeneralDTO = {
      route: route,
      action: "newRecord",
      id: 0,
      maxId: maxId,
      models: this.uiBanks
    }

    this._bankMasterService.setDTO(dtObject);

    this.configClick("bank");
    //this._sharedService.bankEmitter.emit(maxId);
  }

  edit(uiBank: any) {

    let dtObject: IGeneralDTO = {
      route: "bank",
      action: "editRecord",
      id: uiBank.bankId,
      maxId: 0,
      models: this.uiBanks
    }
    this._bankMasterService.setDTO(dtObject);

    this.configClick("bank");
  }

  delete(uiBank: any) {
    if (uiBank.bankId > 0) {
      this._bankMasterService.bankIdToDelete = uiBank.bankId;
    }
  }

  onDelete()
  {
    let bankIdToDelete = this._bankMasterService.bankIdToDelete;
    if (bankIdToDelete > 0) {
      this._bankMasterService.deleteBank(bankIdToDelete).subscribe((data: any) => {
        console.log(data);
        if (data) {
          // show message
          this._toastrService.success('Bank deleted.', 'Success!');
          this.getBanks();
        }
      })
    }
  }

  cancelDelete()
  {
    this._bankMasterService.bankIdToDelete = -1;
  }

  configClick(routeValue: string) {
    sessionStorage.setItem("configMenu", routeValue);
    this.router.navigate(['/app/' + routeValue]);
  }

}
