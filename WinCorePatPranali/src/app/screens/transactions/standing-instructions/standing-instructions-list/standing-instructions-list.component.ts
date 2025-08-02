import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxDropdownConfig } from 'ngx-select-dropdown';
import { ToastrService } from 'ngx-toastr';
import { IGeneralDTO, UiEnumGeneralMaster } from 'src/app/common/models/common-ui-models';
import { TransactionsDeclarations } from 'src/app/common/transaction-declarations';
import { UserRoleHeper } from 'src/app/common/utils/user-role-helper';
import { AccountsService } from 'src/app/services/accounts/accounts/accounts.service';
import { GeneralLedgerService } from 'src/app/services/masters/general-ledger/general-ledger.service';
import { SharedService } from 'src/app/services/shared.service';
import { StandingInstructionService } from 'src/app/services/transactions/standing-instructions/standing-instruction.service';

@Component({
  selector: 'app-standing-instructions-list',
  templateUrl: './standing-instructions-list.component.html',
  styleUrls: ['./standing-instructions-list.component.css']
})
export class StandingInstructionsListComponent implements OnInit {

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
  
  StandingInstructionForm!: FormGroup;
  uiInstructionStatuses: any[] = [];
  voucherTransactionSummary: any = {};
  uiInstructionDetails: any[] = [];
  uiDueInstructionDetails: any[] = [];
  uiAllGeneralLedgers: any = [];
  p: number = 1;
  total: number = 0;

  constructor(private router: Router, private _toastrService: ToastrService, private _sharedService: SharedService,
    private _standingInstructionService: StandingInstructionService, private _generalLedgerService: GeneralLedgerService,
  private datePipe: DatePipe) { }

  ngOnInit(): void {
    this.uiInstructionStatuses = TransactionsDeclarations.uiInstructionStatuses;

    this.StandingInstructionForm = new FormGroup({
      instructionStatus: new FormControl(this.uiInstructionStatuses[0].code, []),
      generalLedger: new FormControl(null, [])
    });

    //this.getBranches();
    UserRoleHeper.initialiseUserRoles(this._sharedService.applicationUser);

    this.getGeneralLedgers();
  }

   pageChangeEvent(event: number) {
    this.p = event;
    //this.getBranches();
  }

  getGeneralLedgers() {
    return new Promise((resolve, reject) => {
      this._generalLedgerService.getGeneralLedgers(this._sharedService.applicationUser.branchId).subscribe((data: any) => {
        if (data) {
          this.uiAllGeneralLedgers = data.data.data;
          if (this.uiAllGeneralLedgers) {

            this.uiAllGeneralLedgers.map((gl: any, i: any) => {
              gl.glName = gl.code + "-" + gl.glName;
            });

            resolve(true);
          }
        }
        else {
          resolve(false);
        }
      })
    })
  }

  addNewInstruction() {
    this.configClick('standing-instruction');
  }


  configClick(routeValue: string) {
    sessionStorage.setItem("configMenu", routeValue);
    this.router.navigate(['/app/' + routeValue]);
  }

  isAdministratorUser() {
    return UserRoleHeper.isAdministratorUser();
  }

  isPassingOfficerUser() {
    return UserRoleHeper.isPassingOfficerUser();
  }

  retrieveMasters(uiEnumGeneralMaster: UiEnumGeneralMaster) {
    let mastersData = this._sharedService.uiAllMasters.filter((m: any) => m.identifier == uiEnumGeneralMaster);
    if (mastersData && mastersData.length) {
      let masters = mastersData.filter((m: any) => m.identifier == uiEnumGeneralMaster);
      return masters[0].codeTables;
    }
    return [];
  }

  fetchInstructions() {

    const glId = this.generalLedger.value?.code;
    const instructionStatus = this.instructionStatus.value == "A" ? 1 : (this.instructionStatus.value == "C" ? 2 : 3);

    this.uiInstructionDetails = [];
    this._standingInstructionService.getStandingInstructions(this._sharedService.applicationUser.branchId,
      glId || 0, instructionStatus || 0
     ).subscribe((data: any) => {
      let instructionModels = data.data.data;
      if (instructionModels) {
        this.uiInstructionDetails = instructionModels.map((ins: any) => ({
          ...ins,
          instructionAmount: parseFloat(ins.instructionAmount).toFixed(2),
          executionDate: this.datePipe.transform(ins.executionDate, 'dd-MM-yyyy')
        }));
      } else {
        this._toastrService.error('No standing instructions found for the selected status.', 'Warning!');
      }
    });
  }

  fetchDueInstructions() {

    this.uiDueInstructionDetails = [];
    this._standingInstructionService.getDueStandingInstructions(this._sharedService.applicationUser.branchId
     ).subscribe((data: any) => {
      let instructionModels = data.data.data;
      if (instructionModels) {
        this.uiDueInstructionDetails = instructionModels.map((ins: any) => ({
          ...ins,
          instructionAmount: parseFloat(ins.instructionAmount).toFixed(2),
          executionDate: this.datePipe.transform(ins.executionDate, 'dd-MM-yyyy'),
          dueDate: this.datePipe.transform(ins.dueDate, 'dd-MM-yyyy')
        }));
      } else {
        this._toastrService.error('No standing instructions found for the selected status.', 'Warning!');
      }
    });
  }

  edit(uiInstructionDetail: any) {
     let dtObject: IGeneralDTO = {
          route: "standing-instruction",
          action: "editRecord",
          id: uiInstructionDetail.id,
          maxId: 0,
          models: this.uiInstructionDetails
        }
    this._standingInstructionService.setDTO(dtObject);
    this.configClick('standing-instruction');
  }

  execute(uiInstructionDetail: any) {
    let executeInstructionRequest = {
      BranchCode: this._sharedService.applicationUser.branchId,
      InstructionId: uiInstructionDetail.id,
      UserId: this._sharedService.applicationUser.id,
    }

    this._standingInstructionService.executeStandingInstruction(executeInstructionRequest).subscribe((data: any) => {
      let result = data.data.data;
      if (result) {
        this._toastrService.success('Standing instruction executed successfully.', 'Success!');
        this.fetchDueInstructions();
      } else {
        this._toastrService.error('Failed to execute standing instruction.', 'Error!');
      }
    });

  }

  clearSearch() {
    this.uiInstructionDetails = [];
    this.StandingInstructionForm.reset();
    this.StandingInstructionForm.get('instructionStatus')?.setValue(this.uiInstructionStatuses[0].code);
    this.StandingInstructionForm.get('generalLedger')?.setValue(null);
  }

  get instructionStatus() {
    return this.StandingInstructionForm.get('instructionStatus')!;
  }
  get generalLedger() {
    return this.StandingInstructionForm.get('generalLedger')!;
  }
}
