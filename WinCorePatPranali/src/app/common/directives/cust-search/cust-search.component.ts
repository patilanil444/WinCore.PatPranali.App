import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { CustomerDeclarations } from '../../customer-declarations';
import { CustomerService } from 'src/app/services/customers/customer/customer.service';
import { SharedService } from 'src/app/services/shared.service';
import { ToastrService } from 'ngx-toastr';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-cust-search',
  templateUrl: './cust-search.component.html',
  styleUrls: ['./cust-search.component.css']
})
export class CustSearchComponent implements OnInit {

  searchForm!: FormGroup;
  uiCustomerSearchBy: any[] = [];
  uiCustomers: any[] = [];
  @Output() customers  = new EventEmitter<any>();

  constructor( private _customerService: CustomerService, private _sharedService: SharedService,
    private _toastrService: ToastrService) { }

  ngOnInit(): void {
    this.uiCustomerSearchBy = CustomerDeclarations.customerSearchBy;
    this.searchForm = new FormGroup({
      searchBy: new FormControl(this.uiCustomerSearchBy[0].code, []),
      searchText: new FormControl("", []),
    });
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
         if (data != null && data.data.data != null) {
           let customers = data.data.data;
           if (customers != null && customers.length > 0) {
             this.uiCustomers = customers.map((cust: any) => (
               {
                 id: cust.customerId,
                 custName: cust.custName,
                 customerCodeStr: cust.customerCodeStr,
                 pan: cust.panNo,
                 aadhar: cust.aadharno,
                 mobile: cust.mobileno,
                 joinDate: formatDate(new Date(cust.custOpenDate), 'yyyy-MM-dd', 'en'),
                 status: this.getCustomerStatus(cust.active)
               }))
           }
         }
         this.customers.emit(this.uiCustomers);
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

  get searchBy() {
    return this.searchForm.get('searchBy')!;
  }
  get searchText() {
    return this.searchForm.get('searchText')!;
  }

}
