import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppRouterRoutingModule } from './app-router-routing.module';
import { AppRouterComponent } from './app-router.component';
import { HomeComponent } from '../home/home.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker'
import { DepositAccountsComponent } from '../screens/accounts/deposit-accounts/deposit-accounts.component';
import { LoanAccountsComponent } from '../screens/accounts/loan-accounts/loan-accounts.component';
import { PriorityFormComponent } from '../screens/masters/priority/priority-form/priority-form.component';
import { PriorityListComponent } from '../screens/masters/priority/priority-list/priority-list.component';
import { PriorityComponent } from '../screens/masters/priority/priority.component';
import { GeneralMasterComponent } from '../screens/masters/general-master/general-master.component';
import { GeneralMasterFormComponent } from '../screens/masters/general-master/general-master-form/general-master-form.component';
import { GeneralMasterListComponent } from '../screens/masters/general-master/general-master-list/general-master-list.component';
import { BranchMasterComponent } from '../screens/masters/branch-master/branch-master.component';
import { BranchMasterFormComponent } from '../screens/masters/branch-master/branch-master-form/branch-master-form.component';
import { BranchMasterListComponent } from '../screens/masters/branch-master/branch-master-list/branch-master-list.component';
import { BankMasterComponent } from '../screens/masters/bank-master/bank-master.component';
import { BankMasterFormComponent } from '../screens/masters/bank-master/bank-master-form/bank-master-form.component';
import { BankMasterListComponent } from '../screens/masters/bank-master/bank-master-list/bank-master-list.component';
import { GeneralLedgerMasterComponent } from '../screens/masters/general-ledger-master/general-ledger-master.component';
import { GeneralLedgerMasterListComponent } from '../screens/masters/general-ledger-master/general-ledger-master-list/general-ledger-master-list.component';
import { GeneralLedgerMasterFormComponent } from '../screens/masters/general-ledger-master/general-ledger-master-form/general-ledger-master-form.component';
import { DepositInterestStructureComponent } from '../screens/masters/deposit-interest-structure/deposit-interest-structure.component';
import { LoanInterestStructureComponent } from '../screens/masters/loan-interest-structure/loan-interest-structure.component';
import { GLInterestParameterComponent } from '../screens/masters/gl-interest-parameter/gl-interest-parameter.component';
import { BankProfileMasterComponent } from '../screens/masters/bank-profile-master/bank-profile-master.component';
import { FilterPipe } from '../common/directives/filterPipe';
import { SelectDropDownModule } from 'ngx-select-dropdown';
import { DistrictMasterComponent } from '../screens/masters/district-master/district-master.component';
import { DistrictMasterFormComponent } from '../screens/masters/district-master/district-master-form/district-master-form.component';
import { DistrictMasterListComponent } from '../screens/masters/district-master/district-master-list/district-master-list.component';
import { TahshilMasterComponent } from '../screens/masters/tahshil-master/tahshil-master.component';
import { TahshilMasterListComponent } from '../screens/masters/tahshil-master/tahshil-master-list/tahshil-master-list.component';
import { TahshilMasterFormComponent } from '../screens/masters/tahshil-master/tahshil-master-form/tahshil-master-form.component';
import { CustomerFormComponent } from '../screens/customers/customer/customer-form/customer-form.component';
import { CustomerSearchComponent } from '../screens/customers/customer/customer-search/customer-search.component';
import { MemberSearchComponent } from '../screens/customers/member/member-search/member-search.component';
import { MemberFormComponent } from '../screens/customers/member/member-form/member-form.component';
import { CustSearchComponent } from '../common/directives/cust-search/cust-search.component';
import { AccountSearchComponent } from '../screens/accounts/account-search/account-search.component';
import { SavingAccountsComponent } from '../screens/accounts/saving-accounts/saving-accounts.component';

@NgModule({
  declarations: [
    AppRouterComponent,
    DepositAccountsComponent,
    LoanAccountsComponent,
    HomeComponent,
    PriorityFormComponent,
    PriorityListComponent,
    PriorityComponent,
    GeneralMasterComponent,
    GeneralMasterFormComponent,
    GeneralMasterListComponent,
    BranchMasterComponent,
    BranchMasterFormComponent,
    BranchMasterListComponent,
    BankMasterComponent,
    BankMasterFormComponent,
    BankMasterListComponent,
    GeneralLedgerMasterComponent,
    GeneralLedgerMasterListComponent,
    GeneralLedgerMasterFormComponent,
    DepositInterestStructureComponent,
    LoanInterestStructureComponent,
    GLInterestParameterComponent,
    BankProfileMasterComponent,
    FilterPipe,
    DistrictMasterComponent,
    DistrictMasterFormComponent,
    DistrictMasterListComponent,
    TahshilMasterComponent,
    TahshilMasterListComponent,
    TahshilMasterFormComponent,
    CustomerFormComponent,
    CustomerSearchComponent,
    MemberSearchComponent,
    MemberFormComponent,
    CustSearchComponent,
    AccountSearchComponent,
    SavingAccountsComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    AppRouterRoutingModule,
    NgxPaginationModule,
    BsDatepickerModule.forRoot(),
    SelectDropDownModule,
  ],
  providers: [],// Toastr providers
})
export class AppRouterModule { }
