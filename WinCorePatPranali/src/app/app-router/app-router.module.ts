import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppRouterRoutingModule } from './app-router-routing.module';
import { AppRouterComponent } from './app-router.component';
import { HomeComponent } from '../home/home.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
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
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    AppRouterRoutingModule,
    NgxPaginationModule
  ]
})
export class AppRouterModule { }
