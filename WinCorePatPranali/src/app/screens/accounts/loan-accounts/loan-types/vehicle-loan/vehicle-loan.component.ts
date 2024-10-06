import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

export interface UiVehicle {
  id: number,
  registerNumber: string,
  manufacturer: string,
  model: string,
  engineNumber: string,
  chasisNumber: string,
  invoiceAmount: string,
  dealer: string,
  status: string
}


@Component({
  selector: 'app-vehicle-loan',
  templateUrl: './vehicle-loan.component.html',
  styleUrls: ['./vehicle-loan.component.css']
})
export class VehicleLoanComponent implements OnInit {

  constructor() { }

  vehicleLoanForm!: FormGroup;
  uiVehicles: any[] = [];
  p_vehicle: number = 1;
  total_Vehicles: number = 0;
  vehicleIndexToDelete = -1;
  @Output() vehicleDetails = new EventEmitter<any>();


  ngOnInit(): void {
    this.vehicleLoanForm = new FormGroup({
      registerNumber: new FormControl("", [Validators.required]),
      manufacturer: new FormControl("", [Validators.required]),
      model: new FormControl("", [Validators.required]),
      engineNumber: new FormControl("", [Validators.required]),
      chasisNumber: new FormControl("", [Validators.required]),
      invoiceAmount: new FormControl("", [Validators.required]),
      dealer: new FormControl("", [Validators.required]),
    });
  }
  
  validVehicleForm() {
    if (this.vehicleLoanForm.invalid) {
      for (const control of Object.keys(this.vehicleLoanForm.controls)) {
        this.vehicleLoanForm.controls[control].markAsTouched();
      }
      return false;
    }
    return true;
  }


  addVehicle() {
    if (this.validVehicleForm()) {

      let vehicleIndex = this.uiVehicles.findIndex(vehicle =>
        vehicle.engineNumber.toLowerCase() == this.engineNumber.value.toLowerCase() ||
        vehicle.chasisNumber.toLowerCase() == this.chasisNumber.value.toLowerCase());

      if (vehicleIndex > -1) {
        let uiVehicle = this.uiVehicles[vehicleIndex];

        //uiSecurity.customerId = this.selectedCustomerId;
        uiVehicle.registerNumber = this.registerNumber.value.toString();
        uiVehicle.manufacturer = this.manufacturer.value.toString();
        uiVehicle.model = this.model.value.toString();
        uiVehicle.engineNumber = this.engineNumber.value.toString();
        uiVehicle.chasisNumber = this.chasisNumber.value.toString();
        uiVehicle.invoiceAmount = this.invoiceAmount.value.toString();
        uiVehicle.dealer = this.dealer.value.toString();
        uiVehicle.status = 'M';
      }
      else {
        let uiVehicle = {} as UiVehicle;
        uiVehicle.id = 0;
        uiVehicle.registerNumber = this.registerNumber.value.toString();
        uiVehicle.manufacturer = this.manufacturer.value.toString();
        uiVehicle.model = this.model.value.toString();
        uiVehicle.engineNumber = this.engineNumber.value.toString();
        uiVehicle.chasisNumber = this.chasisNumber.value.toString();
        uiVehicle.invoiceAmount = this.invoiceAmount.value.toString();
        uiVehicle.dealer = this.dealer.value.toString();
        uiVehicle.status = 'A';
        this.uiVehicles.push(uiVehicle);
      }

      this.vehicleDetails.emit(this.uiVehicles);

      this.clearVehicle();
    }
  }

  editVehicle(uiVehicle: any, index: number) {
    this.vehicleLoanForm.patchValue({
      registerNumber: uiVehicle.registerNumber,
      manufacturer: uiVehicle.manufacturer,
      model: uiVehicle.model,
      engineNumber: uiVehicle.engineNumber,
      chasisNumber: uiVehicle.chasisNumber,
      invoiceAmount: uiVehicle.invoiceAmount,
      dealer: uiVehicle.dealer,
    });
  }

  deleteVehicle(uiVehicle: any, index: number) {
    if (uiVehicle) {
      this.vehicleIndexToDelete = index;
      uiVehicle.status = 'D';
    }
  }

  clearVehicle() {
    this.vehicleLoanForm.patchValue({
      registerNumber: "",
      manufacturer: "",
      model: "",
      engineNumber: "",
      chasisNumber: "",
      invoiceAmount:"",
      dealer: ""
    });
  }

  cancelDelete()
  {
    this.vehicleIndexToDelete = -1;
  }
  
  onDelete()
  {
    let vehicleIndexToDelete = this.vehicleIndexToDelete;
    if (vehicleIndexToDelete > -1) {

      let gold = this.uiVehicles[vehicleIndexToDelete];
      this.uiVehicles.splice(vehicleIndexToDelete, 1);
      if (gold) {
        gold.status = "D";
      }
    }
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
