import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxDropdownConfig } from 'ngx-select-dropdown';
import { ToastrService } from 'ngx-toastr';
import { UiEnumAccountStatus, UiEnumGeneralMaster } from 'src/app/common/models/common-ui-models';
import { GeneralLedgerService } from 'src/app/services/masters/general-ledger/general-ledger.service';
import { PigmyMasterService } from 'src/app/services/pigmy/pigmy-master/pigmy-master.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-collection-accounts-list',
  templateUrl: './collection-accounts-list.component.html',
  styleUrls: ['./collection-accounts-list.component.css']
})
export class CollectionAccountsListComponent implements OnInit {

  collectionAccountForm!: FormGroup;

  config: NgxDropdownConfig = {
    displayKey: "glName",
    height: "auto",
    search: true,
    placeholder: "Select GL",
    searchPlaceholder: "Search GL by name...",
    limitTo: 0,
    customComparator: undefined,
    noResultsFound: "No results found",
    moreText: "more",
    clearOnSelection: false,
    inputDirection: "ltr",
    enableSelectAll: false,
  };

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
  uiGeneralLedgers: any[] = [];
  uiPigmyAccounts: any[] = [];
  uiAccountTypes: any[] = [];

  constructor(private router: Router, private _sharedService: SharedService, private _toastrService: ToastrService,
    private _generalLedgerService: GeneralLedgerService, private _pigmyMasterService: PigmyMasterService) { }

  ngOnInit(): void {

    this.collectionAccountForm = new FormGroup({
      pigmyAgent: new FormControl("", []),
      generalLedger: new FormControl("", [])
    });

    this.uiAccountTypes = this.retrieveMasters(UiEnumGeneralMaster.ACTYPE);

    this.getPigmyAgents();

    // this.getGeneralLedgers().then(result => {
    //   if (result) {
    //     this.getPigmyAgents();
    //   }
    // }).catch(error => {
    //   this._toastrService.error('Error loading general ledgers', 'Error!');
    // });
  }

  retrieveMasters(uiEnumGeneralMaster: UiEnumGeneralMaster) {
    let mastersData = this._sharedService.uiAllMasters.filter((m: any) => m.identifier == uiEnumGeneralMaster);
    if (mastersData && mastersData.length) {
      let masters = mastersData.filter((m: any) => m.identifier == uiEnumGeneralMaster);
      return masters[0].codeTables;
    }
    return [];
  }

  getGeneralLedgers() {
    return new Promise((resolve, reject) => {
      this._generalLedgerService.getGeneralLedgers(this._sharedService.applicationUser.branchId).subscribe((data: any) => {

        if (data) {
          this.uiGeneralLedgers = data.data.data;
          if (this.uiGeneralLedgers) {

            this.uiGeneralLedgers.map((gl: any, i: any) => {
              gl.glName = gl.code + "-" + gl.glName;
            });

            this.uiGeneralLedgers = this.uiGeneralLedgers.filter(gl => gl.glGroup == 'D' && gl.glType != 'P');
            resolve(true);
          }
        }
        else {
          resolve(false);
        }
      })
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

  showAccounts()
  {
    this.uiPigmyAccounts = [];
    if (this.pigmyAgent.value.id > 0) {
      this._pigmyMasterService.getLinkedAgentCollectionAccounts(this._sharedService.applicationUser.branchId).subscribe((data: any) => {
        if (data) {
          if (data.statusCode == 200 && data.data.data) {
            var agentAccounts = data.data.data;
            if (agentAccounts && agentAccounts.length) {

              this.uiPigmyAccounts = agentAccounts.map((acc: any) => (
                {
                  ...acc,
                  //accountType: this.getAccountType(acc.accountType),
                  status: this.getStatus(acc.accountStatus)
                }))
            }
          }
        }
      })
    }
    else
    {
      this._toastrService.error('Select agent to see linked accounts', 'Error!');
    }
   
  }

  getStatus(status: number) {
    if (status == UiEnumAccountStatus.OPEN) {
      return "Open";
    }
    else if (status == UiEnumAccountStatus.FREEZE) {
      return "Freeze";
    }
    else if (status == UiEnumAccountStatus.DORMANT) {
      return "Dormant";
    }
    else if (status == UiEnumAccountStatus.CLOSE) {
      return "Closed";
    }
    return "";
  }

  // getAccountType(status: number) {

    
  //   if (status == UiEnumAccountStatus.OPEN) {
  //     return "Open";
  //   }
  //   else if (status == UiEnumAccountStatus.FREEZE) {
  //     return "Freeze";
  //   }
  //   else if (status == UiEnumAccountStatus.DORMANT) {
  //     return "Dormant";
  //   }
  //   else if (status == UiEnumAccountStatus.CLOSE) {
  //     return "Closed";
  //   }
  //   return "";
  // }

  delete(uiAccount:any)
  {
    if (uiAccount.id > 0) {
      this._pigmyMasterService.CollectionAccountToDelete = uiAccount.id;
    }
  }

  onDelete()
  {
    let LinkIdToDelete = this._pigmyMasterService.CollectionAccountToDelete;
   
    
    if (LinkIdToDelete > 0) {
      let deleteAgentCollectionLinkModel ={
        AgentCollectionLinkId: LinkIdToDelete,
        ModifiedBy: this._sharedService.applicationUser.id
      };

      this._pigmyMasterService.deleteLinkedAccount(deleteAgentCollectionLinkModel).subscribe((data: any) => {
       
        if (data) {
          this._toastrService.success('Linked Account deleted', 'Success!');
          this.showAccounts();
        }
      })
    }
  }

  cancelDelete()
  {
    this._pigmyMasterService.CollectionAccountToDelete = -1;
  }

  linkNewAccount()
  {
    this.configClick("link-collection-account");
  }

  configClick(routeValue: string) {
    sessionStorage.setItem("configMenu", routeValue);
    this.router.navigate(['/app/' + routeValue]);
  }

  get generalLedger() {
    return this.collectionAccountForm.get('generalLedger')!;
  }
  get pigmyAgent() {
    return this.collectionAccountForm.get('pigmyAgent')!;
  }
}
