import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppRouterRoutingModule } from './app-router-routing.module';
import { AppRouterComponent } from './app-router.component';
import { DepositAccountsComponent } from '../screens/deposit-accounts/deposit-accounts.component';
import { LoanAccountsComponent } from '../screens/loan-accounts/loan-accounts.component';
import { PriorityComponent } from '../common/masters/priority/priority.component';
import { HomeComponent } from '../home/home.component';
import { PriorityFormComponent } from '../common/masters/priority/priority-form/priority-form.component';
import { PriorityListComponent } from '../common/masters/priority/priority-list/priority-list.component';
import { GeneralMasterComponent } from '../common/masters/general-master/general-master.component';
import { GeneralMasterFormComponent } from '../common/masters/general-master/general-master-form/general-master-form.component';
import { GeneralMasterListComponent } from '../common/masters/general-master/general-master-list/general-master-list.component';
import { BranchMasterComponent } from '../common/masters/branch-master/branch-master.component';
import { BranchMasterListComponent } from '../common/masters/branch-master/branch-master-list/branch-master-list.component';
import { BranchMasterFormComponent } from '../common/masters/branch-master/branch-master-form/branch-master-form.component';
import { BankMasterComponent } from '../common/masters/bank-master/bank-master.component';
import { BankMasterFormComponent } from '../common/masters/bank-master/bank-master-form/bank-master-form.component';
import { BankMasterListComponent } from '../common/masters/bank-master/bank-master-list/bank-master-list.component';


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
    AppRouterRoutingModule
  ]
})
export class AppRouterModule { }
