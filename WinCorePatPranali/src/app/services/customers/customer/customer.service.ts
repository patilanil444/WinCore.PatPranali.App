import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { GlobleDeclarations } from 'src/app/common/globle-declarations';
import { IGeneralDTO } from 'src/app/common/models/common-ui-models';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  serviceBaseURL = "";

  customerIdToDelete = -1;
  constructor(private http: HttpClient) { }

  private dto = new BehaviorSubject<IGeneralDTO>({} as IGeneralDTO);
  setDTO(object: any) {
    this.dto.next(object);
  }
  getDTO() {
    return this.dto.asObservable();
  }

  getAllCustomers(branchId: number) {
    let options = GlobleDeclarations.getHeaderOptions();
    return this.http.get(GlobleDeclarations.apiBaseURL + "api/customer/customers?id=" + branchId, options);
  }

  getCustomersOnSearch(customerModel: any) {
    let options = GlobleDeclarations.getHeaderOptions();
    return this.http.post(GlobleDeclarations.apiBaseURL + "api/customer/search-customer", customerModel, options);
  }

  getCustomer(id: number): any {
    let options = GlobleDeclarations.getHeaderOptions();
    return this.http.get(GlobleDeclarations.apiBaseURL + "api/customer/customer?id=" + id, options);
  }

  getMaxCustomerId(branchId: number): any {
    let options = GlobleDeclarations.getHeaderOptions();
    return this.http.get(GlobleDeclarations.apiBaseURL + "api/customer/max-customer-no?branchCode=" + branchId, options);
  }

  createCustomer(customerModel: any): any {
    let options = GlobleDeclarations.getHeaderOptions();
    return this.http.post(GlobleDeclarations.apiBaseURL + "api/customer/create-customer", customerModel, options);
  }

  updateCustomer(id: number, customerModel: any): any {
    let options = GlobleDeclarations.getHeaderOptions();
    return this.http.post(GlobleDeclarations.apiBaseURL + "api/customer/update-customer?id=" + id, customerModel, options);
  }

  deleteCustomer(id: number): any {
    let options = GlobleDeclarations.getHeaderOptions();
    return this.http.delete(GlobleDeclarations.apiBaseURL + "api/customer/delete-customer?id=" + id, options);
  }

  isAadharExists(id: number, aadhar: string): any {
    let options = GlobleDeclarations.getHeaderOptions();
    return this.http.get(GlobleDeclarations.apiBaseURL + "api/customer/is-aadhar-exists?id=" + id + ", aadhar=" + aadhar, options);
  }

  isPANExists(id: number, pan: string): any {
    let options = GlobleDeclarations.getHeaderOptions();
    return this.http.get(GlobleDeclarations.apiBaseURL + "api/customer/is-pan-exists?id=" + id + ", pan=" + pan, options);
  }

  uploadDocument(uplaodCustomerDocument: FormData,): any {
    let options = GlobleDeclarations.getHeaderOptions();
    return this.http.post(GlobleDeclarations.apiBaseURL + "api/customer/upload-document", uplaodCustomerDocument, options);
  }

}
