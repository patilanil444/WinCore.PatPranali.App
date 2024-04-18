import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CustomerDeclarations } from 'src/app/common/customer-declarations';
import { IGeneralDTO } from 'src/app/common/models/common-ui-models';
import { CustomerService } from 'src/app/services/customers/customer/customer.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-customer-search',
  templateUrl: './customer-search.component.html',
  styleUrls: ['./customer-search.component.css']
})
export class CustomerSearchComponent implements OnInit {

  searchForm!: FormGroup;

  uiCustomers: any[] = [];

  uiCustomerSearchBy: any[] = [];
  p: number = 1;
  total: number = 0;
  constructor(private router: Router, private _toastrService: ToastrService, 
    private _customerService: CustomerService, private _sharedService: SharedService ) { }

  ngOnInit(): void {

    this.uiCustomerSearchBy = CustomerDeclarations.customerSearchBy;
    this.searchForm = new FormGroup({
      searchBy: new FormControl(this.uiCustomerSearchBy[0].code, []),
      searchText: new FormControl("", []),
    });
  }

  pageChangeEvent(event: number) {
    this.p = event;
  }

  searchCustomer()
  {
    this.uiCustomers = [];
     if (this.searchText.value.length > 0) {

      let customerSearchModel = {
        searchBy: this.searchBy.value,
        searchText: this.searchText.value,
        branchCode: this._sharedService.applicationUser.branchId
      };

      this._customerService.getCustomersOnSearch(customerSearchModel).subscribe((data: any) => {
        if (data!=null && data.data.data !=null) {
          let customers = data.data.data;
          if (customers!=null && customers.length>0) {
            this.uiCustomers = customers.map((cust: any) => (
              { 
                id: cust.customerId,
                custName: cust.custName,
                pan: cust.panNo,
                aadhar: cust.aadharno,
                mobile: cust.mobileno,
                status: this.getCustomerStatus(cust.active) 
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

  getCustomerStatus(status: number)
  {
    if (status == 1) {
      return "Active";
    }
    else
    {
      return "In-Active";
    }
  }

  clear()
  {
    this.searchForm.patchValue({
      searchBy: this.uiCustomerSearchBy[0].code,
      searchText: ""
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
    this._customerService.setDTO({});
    this.configClick("customer");
  }

  configClick(routeValue: string) {
    sessionStorage.setItem("configMenu", routeValue);
    this.router.navigate(['/app/'+ routeValue]);
  }

  get searchBy() {
    return this.searchForm.get('searchBy')!;
  }
  get searchText() {
    return this.searchForm.get('searchText')!;
  }
}
