import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxDropdownConfig } from 'ngx-select-dropdown';
import { ToastrService } from 'ngx-toastr';
import { PigmyAccountService } from 'src/app/services/pigmy/pigmy-account/pigmy-account.service';
import { PigmyMasterService } from 'src/app/services/pigmy/pigmy-master/pigmy-master.service';
import { SharedService } from 'src/app/services/shared.service';

export interface IPigmyCollectionMasterModel {
  Id: number;
  BranchCode: number;
  PigmyAgentId: number;
  PigmyDate: number;
  IsPassed: number;
  PassedByUser: number;
  TotalCollection: number;
  SubmittedTotalCollection: number;
  CreatedBy: number;
  PigmyCollections: IPigmyCollectionModel[];
}

export interface IPigmyCollectionModel {
  Id: number;
  PigmyCollectionMasterId: number;
  PigmyAccountId: number;
  PigmyAmount: number;
}


@Component({
  selector: 'app-pigmy-entry',
  templateUrl: './pigmy-entry.component.html',
  styleUrls: ['./pigmy-entry.component.css']
})
export class PigmyEntryComponent implements OnInit {

  pigmyEntriesForm!: FormGroup;

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
  uiPigmyAccounts: any[] = [];

  totalDailyPigmyCollection = 0;


  isAddMode = false;
  constructor(private router: Router, private _sharedService: SharedService, private _toastrService: ToastrService,
    private _pigmyMasterService: PigmyMasterService, private _pigmyAccountService: PigmyAccountService) { }

  ngOnInit(): void {

    this.pigmyEntriesForm = new FormGroup({
      pigmyAgent: new FormControl("", []),
      pigmyDate: new FormControl(formatDate(new Date(Date.now()), 'yyyy-MM-dd', 'en'), [], []),
      pigmyCollection: new FormControl("", [])
    });

    this.getPigmyAgents();
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
              // this.summaryForm.patchValue({
              //   pigmyAgent: this.uiPigmyAgents[0],
              // });
            }
            resolve(true);
          }
        }
      })
    })
  }


  showAccounts() {

    // Show if Pigmy is collected for selected date

    this.totalDailyPigmyCollection = 0;
    this.uiPigmyAccounts = [];
    if (this.pigmyDate.value && this.pigmyAgent.value.id > 0) {
      // Show all account of pigmy agent
      this._pigmyAccountService.getPigmyAccountsByAgent(this.pigmyAgent.value.id,
        formatDate(this.pigmyDate.value, 'yyyy-MM-dd', 'en')).subscribe((data: any) => {
          if (data) {
            if (data.statusCode == 200 && data.data.data) {
              var accounts = data.data.data;

              if (accounts && accounts.length) {
                let isPassed = accounts.filter((ac: any) => ac.isPassed == true);
                if (isPassed != null && isPassed.length == 0) {

                  this.uiPigmyAccounts = accounts;

                  let totalCollection = this.uiPigmyAccounts[0].totalCollection; 
                  this.pigmyEntriesForm.patchValue({
                    pigmyCollection: totalCollection > 0 ? totalCollection: 0
                  });
                  this.uiPigmyAccounts.forEach(acc => {
                    this.totalDailyPigmyCollection = this.totalDailyPigmyCollection + parseFloat(acc.pigmyAmount);
                  });
                }
                else {
                  this._toastrService.info('Pigmy is already passed for this agent and date.', 'Info!');
                }
              }
            }
          }
        })
    }
    else {
      this._toastrService.error('Please select date, agent and total collection cash.', 'Error!');
    }
  }

  removeEntry(index: number)
  {
    if (index > -1) {
      this.uiPigmyAccounts[index].pigmyAmount = 0;
    }
    this.calculateDailyTotal();
  }

  onAmountClick(index: number)
  {
    if (index > -1) {
      if (this.uiPigmyAccounts[index].pigmyAmount == 0) {
        this.uiPigmyAccounts[index].pigmyAmount = "";
      }
      this.calculateDailyTotal();
    }
  }

  onAmountBlur()
  {
    this.calculateDailyTotal();
  }

  calculateDailyTotal()
  {
    this.totalDailyPigmyCollection = 0;
    this.uiPigmyAccounts.forEach(acc => {
      if (acc.pigmyAmount) {
        this.totalDailyPigmyCollection = this.totalDailyPigmyCollection + parseFloat(acc.pigmyAmount);
      }
    });
  }

  clearAll()
  {
    this.uiPigmyAccounts = [];
    this.totalDailyPigmyCollection = 0;
    this.pigmyEntriesForm.patchValue({
      pigmyCollection: 0
    });
  }

  isValidCollection()
  {
    if (this.uiPigmyAccounts.length > 0 && this.totalDailyPigmyCollection > 0 && parseFloat(this.pigmyCollection.value) > 0) {
      if (this.totalDailyPigmyCollection > parseFloat(this.pigmyCollection.value)) {
        return false;
      }
      
      return true;
    }
    return false;
  }

  SavePigmyEntries()
  {
    // validate all tabs
    if (!this.isValidCollection()) {
      this._toastrService.error('Please enter valid collection amounts.', 'Error!');
      return;
    }

    // add values into model
    let collectionModel = {} as IPigmyCollectionMasterModel;
    collectionModel.BranchCode = this._sharedService.applicationUser.branchId;
    collectionModel.PigmyAgentId =parseInt(this.pigmyAgent.value.id.toString());
    collectionModel.CreatedBy = this._sharedService.applicationUser.id;
    collectionModel.PigmyDate = this.pigmyDate.value.toString();
    collectionModel.TotalCollection = parseFloat(this.pigmyCollection.value.toString());
    collectionModel.PigmyCollections = [];

    let pigmyModel = {} as IPigmyCollectionModel;
    this.uiPigmyAccounts.forEach(acc => {
      pigmyModel = {} as IPigmyCollectionModel;
      pigmyModel.Id = acc.id;
      pigmyModel.PigmyAccountId = acc.accountsId;
      pigmyModel.PigmyAmount = parseFloat(acc.pigmyAmount);
      
      collectionModel.PigmyCollections.push(pigmyModel);
    });

    this._pigmyAccountService.savePigmyCollection(collectionModel).subscribe((data: any) => {

      if (data) {
        if (data.data.data && data.data.data.retId > 0) {
          if (data.data.data.status == "SUCCESS") {
            this._toastrService.success(data.data.data.message, 'Success!');
            this.clearAll();
            //this.configClick("account-search");
          }
          else {
            this._toastrService.success("Error saving pigmy collections!", 'Error!');
          }

          // this.loadForm();
        }
      }
    })
  }

  get pigmyAgent() {
    return this.pigmyEntriesForm.get('pigmyAgent')!;
  }

  get pigmyDate() {
    return this.pigmyEntriesForm.get('pigmyDate')!;
  }

  get pigmyCollection() {
    return this.pigmyEntriesForm.get('pigmyCollection')!;
  }
}
