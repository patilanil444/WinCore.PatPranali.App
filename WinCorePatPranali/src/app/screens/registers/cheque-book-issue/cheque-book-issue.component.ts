import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { IGeneralDTO } from 'src/app/common/models/common-ui-models';
import { CustomerService } from 'src/app/services/customers/customer/customer.service';
import { GeneralLedgerService } from 'src/app/services/masters/general-ledger/general-ledger.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-cheque-book-issue',
  templateUrl: './cheque-book-issue.component.html',
  styleUrls: ['./cheque-book-issue.component.css']
})
export class ChequeBookIssueComponent implements OnInit {

  bookIssueForm!: FormGroup;
  id!: number;
  maxId!: number;
  dto: IGeneralDTO = {} as IGeneralDTO;
  p: number = 1;
  total: number = 0;

 

  uiChequeRequests :any[] = [];
  uiAllGeneralLedgers:any[] = [];
  uiSavingGeneralLedgers:any[] = [];
  uiAccounts:any[] = [];

  newCode!: string;
  isAddMode!: boolean;
  constructor(private router: Router, private route: ActivatedRoute, private _generalLedgerService: GeneralLedgerService, 
    private _sharedService: SharedService, private _toastrService: ToastrService,private _customerService: CustomerService) {
  }

  ngOnInit(): void {

    this.bookIssueForm = new FormGroup({
      serialNumber: new FormControl("", []),
      chequeNumFrom: new FormControl("", [Validators.required]),
      chequeNumTo: new FormControl("", [Validators.required]),
      issuedCheques: new FormControl("", [Validators.required]),
      restrictedCheques: new FormControl("", [Validators.required]),
      executedCheques: new FormControl("", [Validators.required]),
    });

    this.chequeNumFrom.disable();
    this.chequeNumTo.disable();
    this.issuedCheques.disable();
    this.restrictedCheques.disable();
    this.executedCheques.disable();

    this.getGeneralLedgers().then(result => {
      if (result) {
        //this.loadForm();
      }
    }).catch(error => {
      this._toastrService.error('Error loading general ledgers', 'Warning!');
    });
  }

  pageChangeEvent(event: number) {
    this.p = event;
  }

  getGeneralLedgers() {
    return new Promise((resolve, reject) => {
      this._generalLedgerService.getGeneralLedgers(this._sharedService.applicationUser.branchId).subscribe((data: any) => {
        console.log(data);
        if (data) {
          this.uiAllGeneralLedgers = data.data.data;
          if (this.uiAllGeneralLedgers) {

            this.uiAllGeneralLedgers.map((gl: any, i: any) => {
              gl.glName = gl.code + "-" + gl.glName;
            });
            this.uiSavingGeneralLedgers = this.uiAllGeneralLedgers.filter(gl => gl.glGroup == 'D' && gl.glType == 'S');
            resolve(true);
          }
        }
        else {
          resolve(false);
        }
      })
    })
  }


  getAccounts(accountsData: any) {
    this.uiAccounts = accountsData;
  }

  getCustomersForJoint(event:any)
  {

  }

  selectAccount(accountId: number)
  {
    
  }

  showBookDetails()
  {

  }

  get serialNumber() {
    return this.bookIssueForm.get('serialNumber')!;
  }

  get numberOfCheques() {
    return this.bookIssueForm.get('numberOfCheques')!;
  }

  get chequeNumFrom() {
    return this.bookIssueForm.get('chequeNumFrom')!;
  }

  get chequeNumTo() {
    return this.bookIssueForm.get('chequeNumTo')!;
  }

  get issuedCheques() {
    return this.bookIssueForm.get('issuedCheques')!;
  }

  get restrictedCheques() {
    return this.bookIssueForm.get('restrictedCheques')!;
  }

  get executedCheques() {
    return this.bookIssueForm.get('executedCheques')!;
  }

  showNonLinkedBooks()
  {

  }

  public saveRequest(): void {
    // if (this.validateForm()) {
    //   let districtModel = {} as IDistrictServerModel;

    //   districtModel.DistrictName = this.name.value.toString();
    //   districtModel.StateId = this.stateId.value.toString();
    //   districtModel.CreatedBy = "";
    //   districtModel.UpdatedBy = "";
      
    //   console.log(districtModel);

    //   if (this.isAddMode) {
    //     this._districtMasterService.createDistrict(districtModel).subscribe((data: any) => {
    //       console.log(data);
    //       if (data) {
    //         if (data.statusCode == 200 && data.data.data > 1) {
    //           this.toastrService.success('District added.', 'Success!');
    //           this.configClick("districts");
    //         }
    //       }
    //     })
    //   }
    //   else  
    //   {
    //     this._districtMasterService.updateDistrict(this.dto.id, districtModel).subscribe((data: any) => {
    //       console.log(data);
    //       if (data) {
    //         if (data.statusCode == 200 && data.data.data > 1) {
    //           this.toastrService.success('District updated.', 'Success!');
    //           this.configClick("districts");
    //         }
    //       }
    //     })
    //   }

    // }
  }

  public validateForm(): boolean {

    if (this.bookIssueForm.invalid) {
      for (const control of Object.keys(this.bookIssueForm.controls)) {
        this.bookIssueForm.controls[control].markAsTouched();
      }
      return false;
    }
    return true;
  }

  public clear(): void {
    this.bookIssueForm.patchValue({
      serialNumber :"",
      chequeNumFrom: "",
      chequeNumTo: "",
      issuedCheques: "",
      restrictedCheques: "",
      executedCheques: ""
    });
  }

  configClick(routeValue: string) {
    sessionStorage.setItem("configMenu", routeValue);
    this.router.navigate(['/app/' + routeValue]);
  }

}
