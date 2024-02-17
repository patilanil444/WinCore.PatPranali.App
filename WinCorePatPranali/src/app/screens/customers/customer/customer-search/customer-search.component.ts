import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { IGeneralDTO } from 'src/app/common/models/common-ui-models';
import { CustomerService } from 'src/app/services/customers/customer/customer.service';

@Component({
  selector: 'app-customer-search',
  templateUrl: './customer-search.component.html',
  styleUrls: ['./customer-search.component.css']
})
export class CustomerSearchComponent implements OnInit {

  searchForm!: FormGroup;

  uiCustomers: any[] = [];
  p: number = 1;
  total: number = 0;
  constructor(private router: Router, private _toastrService: ToastrService, 
    private _customerService: CustomerService) { }

  ngOnInit(): void {
    this.searchForm = new FormGroup({
      customerNumber: new FormControl("", []),
      customerName: new FormControl("", []),
      customerPAN: new FormControl("", []),
      customerAadhar: new FormControl("", []),
      customerPhone: new FormControl("", [])
    });
  }

  pageChangeEvent(event: number) {
    this.p = event;
  }

  searchCustomer()
  {
    this.uiCustomers = [];
     if (this.customerNumber.value > 0 || 
      this.customerName.value.length > 0 || 
      this.customerPAN.value.length > 0 || 
      this.customerAadhar.value.length > 0 || 
      this.customerPhone.value.length > 0) {

      let customerSearchModel = {
        Id: this.customerNumber.value == null || this.customerNumber.value == ""? 0: parseInt(this.customerNumber.value),
        FirstName: this.customerName.value,
        PAN: this.customerPAN.value,
        Aadhar: this.customerAadhar.value,
        Phone: this.customerPhone.value
      };

      this._customerService.getCustomersOnSearch(customerSearchModel).subscribe((data: any) => {
        if (data!=null && data.data.data !=null) {
          let customers = data.data.data;
          if (customers!=null && customers.length>0) {
            this.uiCustomers = customers.map((cust: any) => (
              { 
                id: cust.id,
                firstName: cust.firstName,
                middleName: cust.middleName,
                lastName: cust.lastName,
                pan: cust.pan,
                aadhar: cust.aadhar,
                phone: cust.phone,
                status: this.getCustomerStatus(cust.status) 
              })) 
          }
        }
      })
     }
     else 
     {
      this._toastrService.info('Enter customer details to search.', 'Information!');
     }
  }

  getCustomerStatus(status: string)
  {
    if (status=="I") {
      return "In-Active";
    }
    if (status=="A") {
      return "Active";
    }
    if (status=="D") {
      return "Deleted";
    }
    return "";
  }

  clear()
  {
    this.searchForm.patchValue({
      customerNumber: "",
      customerName: "",
      customerPAN: "",
      customerAadhar: "",
      customerPhone: "",
    });
  }

  edit(uiCustomer:any)
  {
    let dtObject: IGeneralDTO = {
      route: "customer",
      action: "editRecord",
      id: uiCustomer.id,
      maxId: 0,
    }
    this._customerService.setDTO(dtObject);

    this.configClick("customer");
  }

  delete(uiCustomer:any)
  {
    if (uiCustomer.id > 0) {
      this._customerService.customerIdToDelete = uiCustomer.id;
    }
  }

  onDelete()
  {
    let customerIdToDelete = this._customerService.customerIdToDelete;
    if (customerIdToDelete > 0) {
      this._customerService.deleteCustomer(customerIdToDelete).subscribe((data: any) => {
        console.log(data);
        if (data) {
          this._toastrService.success('customer deleted.', 'Success!');
          this.searchCustomer();
        }
      })
    }
  }

  cancelDelete()
  {
    this._customerService.customerIdToDelete = -1;
  }

  addNewCustomer()
  {
    this._customerService.customerIdToDelete = -1;
    this.configClick("customer");
  }

  configClick(routeValue: string) {
    sessionStorage.setItem("configMenu", routeValue);
    this.router.navigate(['/app/'+ routeValue]);
  }

  get customerNumber() {
    return this.searchForm.get('customerNumber')!;
  }
  get customerName() {
    return this.searchForm.get('customerName')!;
  }
  get customerPAN() {
    return this.searchForm.get('customerPAN')!;
  }
  get customerAadhar() {
    return this.searchForm.get('customerAadhar')!;
  }
  get customerPhone() {
    return this.searchForm.get('customerPhone')!;
  }
}
