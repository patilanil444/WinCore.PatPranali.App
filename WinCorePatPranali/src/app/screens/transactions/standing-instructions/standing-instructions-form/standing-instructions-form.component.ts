import { DatePipe, formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { ToastrService } from 'ngx-toastr';
import { IGeneralDTO } from 'src/app/common/models/common-ui-models';
import { TransactionsDeclarations } from 'src/app/common/transaction-declarations';
import { UserRoleHeper } from 'src/app/common/utils/user-role-helper';
import { BranchMasterService } from 'src/app/services/masters/branch-master/branch-master.service';
import { GeneralLedgerService } from 'src/app/services/masters/general-ledger/general-ledger.service';
import { SharedService } from 'src/app/services/shared.service';
import { StandingInstructionService } from 'src/app/services/transactions/standing-instructions/standing-instruction.service';

interface IInstructionModel {
  Id: number;
  InstructionNo: number;
  BranchCode: number;
  ExecutionDate: Date;
  ExecutionTimes: number;
  InterestYN: boolean;
  InstructionAmount: number;
  ExecutionCycleDays: number;
  ExecutionCycleMonths: number;
  ExecutionCycleYears: number;
  Particulars: string;
  DebitGLId: number;
  DebitAccountId: number;
  DebitCustomerName: string;
  DebitAccountNumber: string;
  DebitAccountType: string;
  CreditGLId: number;
  CreditAccountId: number;
  CreditCustomerName: string;
  CreditAccountNumber: string;
  CreditAccountType: string;
  InstructionExecutedNo: number;
  Status: number;
  CreatedBy: number;
}

@Component({
  selector: 'app-standing-instructions-form',
  templateUrl: './standing-instructions-form.component.html',
  styleUrls: ['./standing-instructions-form.component.css']
})
export class StandingInstructionsFormComponent implements OnInit {

  datepickerConfig: BsDatepickerConfig;
  standingInstructionsForm!: FormGroup;

  uiFilteredGeneralLedgers: any = [];
  uiBranches: any = [];
  uiAllGeneralLedgers: any = [];
  uiDebitBankAccount: any = [];
  uiCreditBankAccount: any = [];

  uiTransactionDenominations: any = [];
  uiInstructionStatuses: any[] = [];
  isResetAccountSearch = true;
  maxDate!: Date;
  uiInterestOptions: any[] = [];
  dto: IGeneralDTO = {} as IGeneralDTO;
  id!: number;
  maxId!: number;
  isAddMode!: boolean;

  constructor(private router: Router, private _branchMasterService: BranchMasterService, 
    private _toastrService: ToastrService,
    private _generalLedgerService: GeneralLedgerService, private _sharedService: SharedService,
    private _standingInstructionService: StandingInstructionService, private datePipe: DatePipe) { }

  ngOnInit(): void {

    this.uiInterestOptions = TransactionsDeclarations.uiYesNo;
    this.uiInstructionStatuses = TransactionsDeclarations.uiInstructionStatuses;

    this.standingInstructionsForm = new FormGroup({
      instructionNo: new FormControl("", []),
      executionDate: new FormControl(formatDate(new Date(Date.now()), 'yyyy-MM-dd', 'en'), [Validators.required]),
      interestYN: new FormControl(this.uiInterestOptions[0].code, []),
      amount: new FormControl("", [Validators.required]),
      particulars: new FormControl("", []),
      executionTimes: new FormControl("", [Validators.required]),
      executionCycleDays: new FormControl("", []),
      executionCycleMonths: new FormControl("", []),
      executionCycleYears: new FormControl("", []),
      debitGLId: new FormControl("", []),
      debitAccountId: new FormControl("", []),
      creditGLId: new FormControl("", []),
      creditAccountId: new FormControl("", []),
      status: new FormControl(this.uiInstructionStatuses[0].code, []),
      cancelDate: new FormControl("", []),

      debitCustomerName: new FormControl("", []),
      debitAccountNumber: new FormControl("", []),
      debitAccountType: new FormControl("", []),

      creditCustomerName: new FormControl("", []),
      creditAccountNumber: new FormControl("", []),
      creditAccountType: new FormControl("", []),
    });

    this.cancelDate.disable();

    this.datepickerConfig = this._sharedService.getDatepickerConfig();
    this.maxDate = new Date();

    
    this.getGeneralLedgers().then(() => {
      this.getBranches().then(() => {
        this.loadForm();
      })
    })
    UserRoleHeper.initialiseUserRoles(this._sharedService.applicationUser);
  }

  isAdministratorUser() {
    return UserRoleHeper.isAdministratorUser();
  }

  isCashierUser() {
    return UserRoleHeper.isCashierUser();
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

            this.uiFilteredGeneralLedgers = this.uiAllGeneralLedgers.filter((gl: any) => gl.glGroup == 'D' || gl.glGroup == 'L');

            resolve(true);
          }
        }
        else {
          resolve(false);
        }
      })
    })
  }

  getBranches() {
    return new Promise((resolve, reject) => {
      this._branchMasterService.getBranches().subscribe((data: any) => {
        if (data) {
          this.uiBranches = data.data.data;
          resolve(true);
        }
        else {
          resolve(false);
        }
      })
    })
  }

  getDebitAccounts(accountsData: any) {
    let bankAccounts = accountsData;
    if (bankAccounts && bankAccounts.length) {
      this.uiDebitBankAccount = bankAccounts[0];

      this.standingInstructionsForm.patchValue({
        debitCustomerName: this.uiDebitBankAccount.custName,
        debitAccountNumber: this.uiDebitBankAccount.accountNo,
        debitAccountId: this.uiDebitBankAccount.accountsId,
        debitGLId: this.uiDebitBankAccount.code1,
        debitAccountType: this.uiDebitBankAccount.accountType,
      })
    }
    else {
      this.standingInstructionsForm.patchValue({
        debitCustomerName: "",
        debitAccountNumber: "",
        debitAccountType: "",
        debitAccountId: 0,
        debitGLId: 0,
      })
    }
  }

  getCreditAccounts(accountsData: any) {
    let bankAccounts = accountsData;
    if (bankAccounts && bankAccounts.length) {
      this.uiCreditBankAccount = bankAccounts[0];

      this.standingInstructionsForm.patchValue({
        creditCustomerName: this.uiCreditBankAccount.custName,
        creditAccountNumber: this.uiCreditBankAccount.accountNo,
        creditAccountId: this.uiCreditBankAccount.accountsId,
        creditGLId: this.uiCreditBankAccount.code1,
        creditAccountType: this.uiCreditBankAccount.accountType,
      })
    }
    else {
      this.standingInstructionsForm.patchValue({
        creditCustomerName: "",
        creditAccountNumber: "",
        creditAccountType: "",
        creditAccountId: 0,
        creditGLId: 0,  
      })
    }
  }

 loadForm() {

    this._standingInstructionService.getDTO().subscribe((obj: any) => this.dto = obj);
    if (this.dto) {

      this.id = this.dto.id;
      if (this.dto.id == 0 || this.dto.id == undefined) {
        // Add Mode
        this.isAddMode = true;

        // TODO:
        this._standingInstructionService.getMaxInstructionId(this._sharedService.applicationUser.branchId).subscribe((data: any) => {
          let maxInstructionId = data.data.data;
          this.maxId = maxInstructionId;
          this.standingInstructionsForm.patchValue({
            instructionNo: this._sharedService.applicationUser.branchId + this.maxId.toString().padStart(6, '0'),
          });
        });
      }
      else {
        // Edit Mode
        this.isAddMode = false;
        this._standingInstructionService.getStandingInstructionById(this._sharedService.applicationUser.branchId, this.dto.id).subscribe((data: any) => {

          if (data) {
            var instruction = data;

            this.standingInstructionsForm.patchValue({
              instructionNo: instruction.instructionNo,
              executionDate: new Date(instruction.executionDate),
              interestYN: instruction.interestYN ? this.uiInterestOptions[0].code : this.uiInterestOptions[1].code,
              status: instruction.status? instruction.status == 1 ? this.uiInstructionStatuses[0].code :
                (instruction.status == 2 ? this.uiInstructionStatuses[1].code : this.uiInstructionStatuses[2].code) : this.uiInstructionStatuses[0].code,
              amount: instruction.instructionAmount,
              particulars: instruction.particulars,
              executionTimes: instruction.executionTimes,
              executionCycleDays: instruction.executionCycleDays,
              executionCycleMonths: instruction.executionCycleMonths,
              executionCycleYears: instruction.executionCycleYears,
              debitAccountId: instruction.debitAccountId,
              creditAccountId: instruction.creditAccountId,
              //cancelDate: instruction.cancelDate ? new Date(instruction.cancelDate) : null,
              debitCustomerName: instruction.debitCustomerName,
              debitAccountNumber: instruction.debitAccountNumber,
              debitAccountType: instruction.debitAccountType,
              creditCustomerName: instruction.creditCustomerName,
              creditAccountNumber: instruction.creditAccountNumber,
              creditAccountType: instruction.creditAccountType,
              debitGLId: instruction.debitGLId,
              creditGLId: instruction.creditGLId,
            });
          }
        })
      }
    }
  }

  validInstructionForm()
  {
    if (this.standingInstructionsForm.invalid) {
      for (const control of Object.keys(this.standingInstructionsForm.controls)) {
        this.standingInstructionsForm.controls[control].markAsTouched();
      }
      return false;
    }
    return true;
  }

  saveInstruction() {
    if (!this.validInstructionForm()) {
      this._toastrService.error('Standing instructions form has errors.', 'Error!');
      return;
    }

    if (this.debitAccountId.value <= 0 || this.creditAccountId.value <= 0) {
      this._toastrService.error('Please select both debit and credit accounts.', 'Error!');
      return;
    }

    let instructionModel = {} as IInstructionModel;
    instructionModel.Id = this.dto.id;
    instructionModel.InstructionNo = this.instructionNo.value;
    instructionModel.BranchCode = this._sharedService.applicationUser.branchId;
    instructionModel.ExecutionDate = new Date(this.executionDate.value.toString());
    instructionModel.InterestYN = this.interestYN.value == "Y" ? true : false;
    instructionModel.InstructionAmount = parseFloat(this.amount.value ? this.amount.value.toString() : "0");
    instructionModel.ExecutionTimes = parseFloat(this.executionTimes.value ? this.executionTimes.value.toString() : "0");
    instructionModel.ExecutionCycleDays = parseFloat(this.executionCycleDays.value ? this.executionCycleDays.value.toString() : "0");
    instructionModel.ExecutionCycleMonths = parseFloat(this.executionCycleMonths.value ? this.executionCycleMonths.value.toString() : "0");
    instructionModel.ExecutionCycleYears = parseFloat(this.executionCycleYears.value ? this.executionCycleYears.value.toString() : "0");
    instructionModel.Particulars = this.particulars.value ? this.particulars.value.toString() : "";
    instructionModel.DebitGLId = parseFloat(this.debitGLId.value ? this.debitGLId.value.toString() : "0");
    instructionModel.DebitAccountId = parseFloat(this.debitAccountId.value ? this.debitAccountId.value.toString() : "0");
    instructionModel.CreditGLId = parseFloat(this.creditGLId.value ? this.creditGLId.value.toString() : "0");
    instructionModel.CreditAccountId = parseFloat(this.creditAccountId.value ? this.creditAccountId.value.toString() : "0");
    instructionModel.InstructionExecutedNo = 0;
    instructionModel.Status = this.status.value == "A" ? 1 : (this.status.value == "C" ? 2 : 3);
    instructionModel.CreatedBy = this._sharedService.applicationUser.id;

    this._standingInstructionService.saveStandingInstruction(instructionModel).subscribe((data: any) => {
      if (data) {
        if (data.statusCode == 200 && data.data.data.retId > 0) {
          this._toastrService.success('Standing instruction saved.', 'Success!');
          this.clearInstruction();
          this.loadForm();
        }
      }
    })
  }

  clearInstruction() {
    this.standingInstructionsForm.reset();
    this.standingInstructionsForm.patchValue({
      executionDate: formatDate(new Date(Date.now()), 'yyyy-MM-dd', 'en'),
      interestYN: this.uiInterestOptions[0].code,
      cancelYN: this.uiInterestOptions[1].code,
    });
    this.cancelDate.disable();
    this.isResetAccountSearch = true;
  }

  configClick(routeValue: string) {
    sessionStorage.setItem("configMenu", routeValue);
    this.router.navigate(['/app/' + routeValue]);
  }

  get instructionNo() {
    return this.standingInstructionsForm.get('instructionNo')!;
  }

  get executionDate() {
    return this.standingInstructionsForm.get('executionDate')!;
  }

  get interestYN() {
    return this.standingInstructionsForm.get('interestYN')!;
  }

  get amount() {
    return this.standingInstructionsForm.get('amount')!;
  }

  get particulars() {
    return this.standingInstructionsForm.get('particulars')!;
  }

  get executionTimes() {
    return this.standingInstructionsForm.get('executionTimes')!;
  }
  get executionCycleDays() {
    return this.standingInstructionsForm.get('executionCycleDays')!;
  }

  get executionCycleMonths() {
    return this.standingInstructionsForm.get('executionCycleMonths')!;
  }

  get executionCycleYears() {
    return this.standingInstructionsForm.get('executionCycleYears')!;
  }

  get debitGLId() {
    return this.standingInstructionsForm.get('debitGLId')!;
  }
  get debitAccountId() {
    return this.standingInstructionsForm.get('debitAccountId')!;
  }

  get creditGLId() {
    return this.standingInstructionsForm.get('creditGLId')!;
  }
  get creditAccountId() {
    return this.standingInstructionsForm.get('creditAccountId')!;
  }
  get status() {
    return this.standingInstructionsForm.get('status')!;
  }
  get cancelDate() {
    return this.standingInstructionsForm.get('cancelDate')!;
  }
  get debitCustomerName() {
    return this.standingInstructionsForm.get('debitCustomerName')!;
  }
  get debitAccountNumber() {
    return this.standingInstructionsForm.get('debitAccountNumber')!;
  }
  get debitAccountType() {
    return this.standingInstructionsForm.get('debitAccountType')!;
  }
  get creditCustomerName() {
    return this.standingInstructionsForm.get('creditCustomerName')!;
  }
  get creditAccountNumber() {
    return this.standingInstructionsForm.get('creditAccountNumber')!;
  }
  get creditAccountType() {
    return this.standingInstructionsForm.get('creditAccountType')!;
  }

}
