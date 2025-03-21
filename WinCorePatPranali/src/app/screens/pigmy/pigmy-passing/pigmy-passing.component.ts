import { formatDate } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxDropdownConfig } from 'ngx-select-dropdown';
import { ToastrService } from 'ngx-toastr';
import { GeneralLedgerService } from 'src/app/services/masters/general-ledger/general-ledger.service';
import { PigmyAccountService } from 'src/app/services/pigmy/pigmy-account/pigmy-account.service';
import { PigmyMasterService } from 'src/app/services/pigmy/pigmy-master/pigmy-master.service';
import { SharedService } from 'src/app/services/shared.service';
import { PigmyCollectionInfoComponent } from '../pigmy-collection-info/pigmy-collection-info.component';

@Component({
  selector: 'app-pigmy-passing',
  templateUrl: './pigmy-passing.component.html',
  styleUrls: ['./pigmy-passing.component.css']
})
export class PigmyPassingComponent implements OnInit {

  pigmyPassingForm!: FormGroup;
  @ViewChild('pigmyCollectionModal', {static: false}) pigmyCollectionModal: PigmyCollectionInfoComponent

  configAgent: NgxDropdownConfig = {
    displayKey: "name",
    height: "auto",
    search: true,
    placeholder: "Select Agent",
    searchPlaceholder: "Search by name...",
    limitTo: 0,
    customComparator: undefined,
    noResultsFound: "No results found",
    moreText: "more",
    clearOnSelection: false,
    inputDirection: "ltr",
    enableSelectAll: false,
  };

  uiPigmyAgents: any[] = [];
  uiAllGeneralLedgers: any[] = [];

  uiPigmyCollections:any[] = [];
  uiPigmyDailyCollections:any[] = [];

  pigmyCollection = 0;
  pigmySubmitted = 0;

  constructor(private router: Router, private _sharedService: SharedService, private _toastrService: ToastrService,
    private _pigmyMasterService: PigmyMasterService, private _pigmyAccountService: PigmyAccountService,
    private _generalLedgerService: GeneralLedgerService) { }

  ngOnInit(): void {

    this.pigmyPassingForm = new FormGroup({
      pigmyAgent: new FormControl("", []),
      pigmyFromDate: new FormControl(formatDate(new Date(Date.now()), 'yyyy-MM-dd', 'en'), [], []),
      pigmyToDate: new FormControl(formatDate(new Date(Date.now()), 'yyyy-MM-dd', 'en'), [], []),
    });

    this.getPigmyAgents().then(() => {
      this.getGeneralLedgers();
    })
  }

  getGeneralLedgers() {
      this._generalLedgerService.getGeneralLedgers(this._sharedService.applicationUser.branchId).subscribe((data: any) => {
        if (data && data.data.data) {
          this.uiAllGeneralLedgers = data.data.data;
        }
      })
  }

  
  getPigmyAgents() {
    return new Promise((resolve, reject) => {
      this.uiPigmyAgents = [];
      this._pigmyMasterService.getBranchAgents(this._sharedService.applicationUser.branchId).subscribe((data: any) => {
        if (data) {
          if (data.statusCode == 200 && data.data.data) {
            var agents = data.data.data;
            if (agents && agents.length) {
              this.uiPigmyAgents = agents;

              this.uiPigmyAgents.map((pa: any, i: any) => {
                pa.name = pa.agentNumber + "-" + pa.name;
              });
            }
            resolve(true);
          }
        }
      })
    })
  }

  showCollections()
  {
    this.uiPigmyCollections = [];
    if (this.pigmyFromDate.value && this.pigmyToDate.value && this.pigmyAgent.value.id > 0) {
      
      if (this.pigmyFromDate.value > this.pigmyToDate.value) {
        this._toastrService.error('From date cannot be greater than to date.', 'Error!');
        return;
      }

      let agentDetails = this.pigmyAgent.value;
     
      this.getPigmyCollection();
      
    }
    else
    {
      this._toastrService.error('Please select date and agent.', 'Error!');
    }
  }

  getPigmyCollection()
  {
    this.uiPigmyCollections = [];
    let pigmyCollectionRequest = {
      BranchCode: this._sharedService.applicationUser.branchId,
      AgentId: this.pigmyAgent.value.id,
      PigmyFromDate: this.pigmyFromDate.value.toString(),
      PigmyToDate: this.pigmyToDate.value.toString()
    };
    this._pigmyAccountService.getPigmyCollections(pigmyCollectionRequest).subscribe((data: any) => {
      if (data) {
        if (data.statusCode == 200 && data.data.data) {
          var collections = data.data.data;
          if (collections && collections.length) {

            let cols:any = this.groupDataByDate(collections);

            if (cols && cols.length) {
              cols.forEach((c:any) => {
                this.uiPigmyCollections.push({
                  pigmyDate: formatDate(new Date(c.pigmyDate), 'yyyy-MM-dd', 'en'),
                  pigmyCollectionMasterId: c.pigmyCollectionMasterId,
                  totalCollection: c.pigmyCollections.reduce((accumulator:any, currentItem:any) => {
                    return accumulator + currentItem.pigmyAmount;
                  }, 0),
                  pigmyCollections: c.pigmyCollections,
                  pigmyCollection : c.pigmyCollection,
                  totalPigmySubmitted: c.totalPigmySubmitted,
                  commisionAmount: 0,
                });
              });
            }
            

            // this.uiPigmyCollections.forEach(col => {
            //   col.pigmyDate = formatDate(new Date(col.pigmyDate), 'yyyy-MM-dd', 'en');
            //   col.totalCollection = col.pigmyCollections.reduce((sum:any, col:any) => sum + col.pigmyAmount, 0);
            //   col.commision = 0;
            //   // let intRate = 0;
            //   // let totalCommission = 0
            //   // if (this.uiAllGeneralLedgers && this.uiAllGeneralLedgers.length) {
            //   //   let agentCommGL = this.uiAllGeneralLedgers.filter(gl=> gl.code == agentDetails.commGL)
            //   //   if (agentCommGL && agentCommGL.length) {
            //   //       intRate = agentCommGL[0].int_Rate;
            //   //   }
            //   // }

            //   // totalCommission = totalCommission + col.pigmyCollections.sum()
            // });
          }
        }
      }
    })
  }

  groupDataByDate(collections:any) {

    let pCollections:any[] = [];
    let groupedData = collections.reduce((acc:any, item:any) => {
      // Check if the pigmyDate already exists in the accumulator

      const fCollections = pCollections.filter(c => c.pigmyDate === item.pigmyDate);
      if (fCollections && fCollections.length == 0) {
        // If not, initialize an empty array for that date
        pCollections.push({
          pigmyDate: item.pigmyDate,
          pigmyCollectionMasterId: item.id,
          pigmyCollections: [...item.pigmyCollections],
          pigmyCollection: item.totalCollection,
          totalPigmySubmitted: item.submittedTotalCollection,
        });
      }
      else if(fCollections && fCollections.length > 0)
      {
        fCollections[0].pigmyCollections.push(...item.pigmyCollections)
      }
    }, {});

    return pCollections;
  }  

  viewCollection(uiPigmyCollection: any)
  {
    this.uiPigmyDailyCollections =  [];
    if (uiPigmyCollection) {
      this.pigmyCollection = uiPigmyCollection.pigmyCollection;
      this.pigmySubmitted = uiPigmyCollection.totalPigmySubmitted;
      this.uiPigmyDailyCollections = uiPigmyCollection.pigmyCollections;
      this.pigmyCollectionModal.open();
    }
  }

  passCollection(uiPigmyCollection: any) {
    if (uiPigmyCollection) {
      if (uiPigmyCollection.pigmyCollection == uiPigmyCollection.totalPigmySubmitted) {
        let pigmyCollectionMasterId = uiPigmyCollection.pigmyCollectionMasterId;

        let passCollectionRequest = {
          PigmyCollectionMasterId: pigmyCollectionMasterId,
          PassedByUser: this._sharedService.applicationUser.id,
          BranchCode: this._sharedService.applicationUser.branchId,
          AgentAccountId: parseInt(this.pigmyAgent.value.commAccountId),
          AgentAcountGL: parseInt(this.pigmyAgent.value.agentAccountGLCode),
          PigmyCollections: uiPigmyCollection.pigmyCollections
        };

        this._pigmyAccountService.passPigmyCollection(passCollectionRequest).subscribe((data: any) => {
          if (data && data.data.data) {
            this.getPigmyCollection();
          }
        })
      }
      else {
        this._toastrService.error('Pigmy collection amount and submission amount not matching.', 'Error!');
      }
    }
  }
  
  clearAll()
  {
    this.uiPigmyCollections = [];
  }


  get pigmyAgent() {
    return this.pigmyPassingForm.get('pigmyAgent')!;
  }

  get pigmyFromDate() {
    return this.pigmyPassingForm.get('pigmyFromDate')!;
  }

  get pigmyToDate() {
    return this.pigmyPassingForm.get('pigmyToDate')!;
  }

}
