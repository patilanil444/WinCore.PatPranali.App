import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-vehicle-loan',
  templateUrl: './vehicle-loan.component.html',
  styleUrls: ['./vehicle-loan.component.css']
})
export class VehicleLoanComponent implements OnInit {

  constructor() { }

  vehicleLoanForm!: FormGroup;

  ngOnInit(): void {
    this.vehicleLoanForm = new FormGroup({
      registerNumber: new FormControl("", []),
      manufacturer: new FormControl("", []),
      model: new FormControl("", []),
      engineNumber: new FormControl("", []),
      chasisNumber: new FormControl("", []),
      invoiceAmount: new FormControl("", []),
      dealer: new FormControl("", []),
    });
  }


  
  get registerNumber() {
    return this.vehicleLoanForm.get('registerNumber')!;
  }
  get manufacturer() {
    return this.vehicleLoanForm.get('manufacturer')!;
  }
  get model() {
    return this.vehicleLoanForm.get('model')!;
  }
  get engineNumber() {
    return this.vehicleLoanForm.get('engineNumber')!;
  }
  get chasisNumber() {
    return this.vehicleLoanForm.get('chasisNumber')!;
  }
  get invoiceAmount() {
    return this.vehicleLoanForm.get('invoiceAmount')!;
  }
  get dealer() {
    return this.vehicleLoanForm.get('dealer')!;
  }
}
