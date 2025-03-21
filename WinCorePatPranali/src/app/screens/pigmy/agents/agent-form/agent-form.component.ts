import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxDropdownConfig } from 'ngx-select-dropdown';
import { ToastrService } from 'ngx-toastr';
import { IGeneralDTO, UiUserRole } from 'src/app/common/models/common-ui-models';
import { GeneralLedgerService } from 'src/app/services/masters/general-ledger/general-ledger.service';
import { PigmyMasterService } from 'src/app/services/pigmy/pigmy-master/pigmy-master.service';
import { SharedService } from 'src/app/services/shared.service';
import { UserService } from 'src/app/services/users/user.service';

interface IPigmyAgentModel {
  Id: number;
  BranchCode: number;
  Name: string;
  AgentNumber: string;
  PigmyGL: number;
  CollectionGL: number;
  CommGL: number;
  CommAccountId: string;
  UserId: number;
  CreatedBy: number;
}


@Component({
  selector: 'app-agent-form',
  templateUrl: './agent-form.component.html',
  styleUrls: ['./agent-form.component.css']
})
export class AgentFormComponent implements OnInit {

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
  
  agentForm!: FormGroup;
  id!: number;
  maxId!: number;
  showPassword: boolean = false;
  dto: IGeneralDTO = {} as IGeneralDTO;
  isAddMode!: boolean;
  uiUsers: any[] = [];

  uiAllGeneralLedgers: any[] = [];
  uiPigmyGeneralLedgers: any[] = [];

  constructor(private router: Router, private route: ActivatedRoute, private _sharedService: SharedService,
    private _pigmyMasterService: PigmyMasterService, private _toastrService: ToastrService,
    private _userService: UserService, private _generalLedgerService: GeneralLedgerService) { }

  ngOnInit(): void {

    this.agentForm = new FormGroup({
      agentId: new FormControl("", []),
      agentNumber: new FormControl("", [Validators.required]),
      userId: new FormControl("", [Validators.required]),
      pigmyGL: new FormControl("", [Validators.required]),
      collectionGL: new FormControl("", [Validators.required]),
      commGL: new FormControl(0, [Validators.required]),
      commAccountId: new FormControl("", [Validators.required])
    });

    this.getGeneralLedgers().then(() => {
      this.getUsers().then(() => {
        this.loadForm();
      })
    })
  }

  loadForm() {
    this._pigmyMasterService.getDTO().subscribe(obj => this.dto = obj);
    if (this.dto.id >= 0) {
      this.id = this.dto.id;
      if (this.dto.id == 0) {
        this.getMaxAgentNumber().then(() => {
          this.isAddMode = true;
          this.maxId = this.dto.maxId;
        })
      }
      else {
        this.isAddMode = false;
        // edit a record
        this._pigmyMasterService.getAgent(this._sharedService.applicationUser.branchId, this.dto.id).subscribe((data: any) => {
          if (data) {
            if (data.statusCode == 200 && data.data.data) {
              var agent = data.data.data;
              this.agentForm.patchValue({
                agentId: agent.id,
                agentNumber: agent.agentNumber,
                pigmyGL: this.bindPigmyGLValue(agent.pigmyGL),
                collectionGL: this.bindGLValue(agent.collectionGL),
                commGL: this.bindGLValue(agent.commGL),
                commAccountId: agent.accountNumber,
                userId: agent.userId,
              });
            }
          }
        })
      }
    }
    else {
      this.configClick('pigmy-agent-list');
    }
  }

  bindGLValue(glValue: number)
  {
    let filteredGLs = this.uiAllGeneralLedgers.filter(gl=>gl.code == glValue);
    if (filteredGLs && filteredGLs.length) {
      return filteredGLs[0];
    }
  }

  bindPigmyGLValue(glValue: number)
  {
    let filteredGLs = this.uiPigmyGeneralLedgers.filter(gl=>gl.code == glValue);
    if (filteredGLs && filteredGLs.length) {
      return filteredGLs[0];
    }
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


            this.uiPigmyGeneralLedgers = this.uiAllGeneralLedgers.filter(gl => gl.glGroup == 'D' && gl.glType == 'P');

            resolve(true);
          }
        }
        else {
          resolve(false);
        }
      })
    })
  }

  getMaxAgentNumber() {
    return new Promise((resolve, reject) => {
      this._pigmyMasterService.getMaxAgentNumber(this._sharedService.applicationUser.branchId).subscribe((data: any) => {
        if (data) {
          let agentNum = data.data.data;
          if (agentNum) {
            this.agentForm.patchValue({
              agentNumber: agentNum,
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

  getUsers() {
    return new Promise((resolve, reject) => {
      this._userService.getUsers(this._sharedService.applicationUser.branchId).subscribe((data: any) => {
        if (data) {
          if (data.statusCode == 200 && data.data.data) {
            var users = data.data.data;
            let pigmyUsers = users.filter((u: any) => u.access == UiUserRole.PIGMY_AGENT);
            if (pigmyUsers && pigmyUsers.length) {
              this.uiUsers = pigmyUsers;

              this.agentForm.patchValue({
                userId: this.uiUsers[0].id,
              });
            }
            resolve(true);
          }
        }
      })
    })
  }

  validateAccountNumber()
  {
    if (this.commAccountId.value && this.commAccountId.value.length) {
      this._pigmyMasterService.validateAccountNumber(this._sharedService.applicationUser.branchId,
         this.commAccountId.value).subscribe((data: any) => {
        if (data) {
          let value = data.data.data;
          if (value == true) {
            this._toastrService.success("Account is valid!", 'Sucess!');
          }
          else
          {
            this._toastrService.error("Account not valid!", 'Error!');
          }
        }
      })
    }
  }

  public isAgentExists(): boolean {
    let userId = this.userId.value;
    let branchIndex = this.dto.models.findIndex(b=>b.userId == userId && b.id != this.dto.id);
    if (branchIndex > -1) {
      return true;
    }
    return false;
  }


  public validateForm(): boolean {

    if (this.agentForm.invalid) {
      for (const control of Object.keys(this.agentForm.controls)) {
        this.agentForm.controls[control].markAsTouched();
      }
      return false;
    }
    return true;
  }

  public clear(): void {
    this.agentForm.patchValue({
      agentId: 0,
      agentNumber: "",
      name: "",
      pigmyGL: 0,
      collectionGL: 0,
      commGL: 0,
      commAccountId: 0,
      userId: 0,
    });
  }

  saveAgent() {
    if (this.validateForm()) {

      if (this.isAgentExists()) {
        this._toastrService.error('Details for selected agent already exists.', 'Error!');
        return;
      }

      let agentModel = {} as IPigmyAgentModel;

      agentModel.Id = this.dto.id;
      agentModel.BranchCode = this._sharedService.applicationUser.branchId;
      agentModel.AgentNumber = this.agentNumber.value.toString();
      agentModel.PigmyGL = parseInt(this.pigmyGL.value.code);
      agentModel.CollectionGL = parseInt(this.collectionGL.value.code);
      agentModel.CommGL = parseInt(this.commGL.value.code);
      agentModel.CommAccountId = this.commAccountId.value;
      agentModel.UserId = parseInt(this.userId.value.toString());
      agentModel.CreatedBy = this._sharedService.applicationUser.id;

      this._pigmyMasterService.saveAgent(agentModel).subscribe((data: any) => {

        if (data) {
          if (data.statusCode == 200 && data.data.data && data.data.data.retId > 0) {
            if (data.data.data.status == "SUCCESS") {
              this._toastrService.success("Agent saved successfully.", 'Success!');
              this.clear();
              this.configClick("pigmy-agent-list");
            }
            else {
              this._toastrService.error("Error saving agent!", 'Error!');
            }
          }
        }
      })
    }
    else
    {
      this._toastrService.error("Please enter required details!", 'Error!');
    }
  }

  configClick(routeValue: string) {
    sessionStorage.setItem("configMenu", routeValue);
    this.router.navigate(['/app/' + routeValue]);
  }

  get agentId() {
    return this.agentForm.get('agentId')!;
  }

  get agentNumber() {
    return this.agentForm.get('agentNumber')!;
  }

  get pigmyGL() {
    return this.agentForm.get('pigmyGL')!;
  }

  get collectionGL() {
    return this.agentForm.get('collectionGL')!;
  }

  get commGL() {
    return this.agentForm.get('commGL')!;
  }

  get commAccountId() {
    return this.agentForm.get('commAccountId')!;
  }

  get userId() {
    return this.agentForm.get('userId')!;
  }
}
