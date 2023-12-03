import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GeneralLedgerService } from 'src/app/services/masters/general-ledger/general-ledger.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-gl-interest-parameter',
  templateUrl: './gl-interest-parameter.component.html',
  styleUrls: ['./gl-interest-parameter.component.css']
})
export class GLInterestParameterComponent implements OnInit {

  uiGeneralLedgers: any[] = [];
  generalLedgerId = 0;

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
        if (this.uiGeneralLedgers) {
          this.generalLedgerId = this.uiGeneralLedgers[0].id;
        }
      }
    })
  }

  showInfo()
  {

  }

  saveParameter()
  {

  }

  clear()
  {
    
  }

}
