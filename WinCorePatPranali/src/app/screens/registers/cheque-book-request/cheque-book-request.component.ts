import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { IGeneralDTO } from 'src/app/common/models/common-ui-models';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-cheque-book-request',
  templateUrl: './cheque-book-request.component.html',
  styleUrls: ['./cheque-book-request.component.css']
})
export class ChequeBookRequestComponent implements OnInit {

  chequeRequestForm!: FormGroup;
  id!: number;
  maxId!: number;
  dto: IGeneralDTO = {} as IGeneralDTO;
  p: number = 1;
  total: number = 0;

  uiChequeRequests :any[] = [];

  newCode!: string;
  isAddMode!: boolean;
  constructor(private router: Router, private route: ActivatedRoute,
    private _sharedService: SharedService, private toastrService: ToastrService) {
  }

  ngOnInit(): void {

    this.chequeRequestForm = new FormGroup({
      serialNumber: new FormControl("", []),
      numberOfCheques: new FormControl("", [Validators.required]),
      chequeNumFrom: new FormControl("", [Validators.required]),
      chequeNumTo: new FormControl("", [Validators.required]),
    });

    this.serialNumber.disable();
    this.chequeNumFrom.disable();
    this.chequeNumTo.disable();

    // this._districtMasterService.getDTO().subscribe(obj => this.dto = obj);
    // if (this.dto) {
    //   this.id = this.dto.id;
    //   if (this.dto.id == 0) {
    //     this.isAddMode = true;
    //     this.maxId = this.dto.maxId;
    //     this.districtForm.patchValue({
    //       code: this.maxId + 1,
    //     });
    //   }
    //   else  
    //   {
    //     this.isAddMode = false;
    //     this._districtMasterService.getDistrict(this.dto.id).subscribe((data: any) => {
    //       console.log(data);
    //       if (data) {
    //         if (data.statusCode == 200 && data.data.data) {
    //           var district = data.data.data;
    //           this.districtForm.patchValue({
    //             code: district.id,
    //             name: district.districtName,
    //             stateId: district.stateId
    //           });
    //         }
    //       }
    //     })
    //   }
    // }
  }

  pageChangeEvent(event: number) {
    this.p = event;
  }

  get serialNumber() {
    return this.chequeRequestForm.get('serialNumber')!;
  }

  get numberOfCheques() {
    return this.chequeRequestForm.get('numberOfCheques')!;
  }

  get chequeNumFrom() {
    return this.chequeRequestForm.get('chequeNumFrom')!;
  }

  get chequeNumTo() {
    return this.chequeRequestForm.get('chequeNumTo')!;
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

    if (this.chequeRequestForm.invalid) {
      for (const control of Object.keys(this.chequeRequestForm.controls)) {
        this.chequeRequestForm.controls[control].markAsTouched();
      }
      return false;
    }
    return true;
  }

  public clear(): void {
    this.chequeRequestForm.patchValue({
      serialNumber: "",
      numberOfCheques: "",
      chequeNumFrom: "",
      chequeNumTo: "",
    });
  }

  configClick(routeValue: string) {
    sessionStorage.setItem("configMenu", routeValue);
    this.router.navigate(['/app/' + routeValue]);
  }
}
