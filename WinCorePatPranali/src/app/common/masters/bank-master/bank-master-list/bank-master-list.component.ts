import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { BankMasterService } from 'src/app/services/common/bank-master/bank-master.service';
import { SharedService } from 'src/app/services/common/shared.service';

@Component({
  selector: 'app-bank-master-list',
  templateUrl: './bank-master-list.component.html',
  styleUrls: ['./bank-master-list.component.css']
})
export class BankMasterListComponent {

  @ViewChild('deleteModal') deleteModel:any
  uiBanks: any[] = [];
  p: number = 1;
  total: number = 0;
  constructor(private router: Router, private _bankMasterService: BankMasterService,
    private _sharedService: SharedService) { }

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
            bank.hasBranchesYN = bank.hasBranches ? "Yes" : "No";
          });
        }
      }
    })
  }

  pageChangeEvent(event: number) {
    this.p = event;
    this.getBanks();
  }

  add(route:any)
  {
    const ids = this.uiBanks.map(bank => {
      return bank.id;
    })
    let maxId = Math.max(...ids);

    this.configClick("new-bank/"+ maxId);
    //this._sharedService.bankEmitter.emit(maxId);
  }

  edit(uiBank: any) {
    this.configClick("edit-bank/"+ uiBank.id);
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
