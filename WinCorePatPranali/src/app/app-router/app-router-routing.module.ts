import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from '../not-found/not-found.component';
import { HomeComponent } from '../home/home.component';
import { AppRouterComponent } from './app-router.component';
import { DepositAccountsComponent } from '../screens/accounts/deposit-accounts/deposit-accounts.component';
import { LoanAccountsComponent } from '../screens/accounts/loan-accounts/loan-accounts.component';
import { BankMasterFormComponent } from '../screens/masters/bank-master/bank-master-form/bank-master-form.component';
import { BankMasterComponent } from '../screens/masters/bank-master/bank-master.component';
import { BranchMasterFormComponent } from '../screens/masters/branch-master/branch-master-form/branch-master-form.component';
import { BranchMasterComponent } from '../screens/masters/branch-master/branch-master.component';
import { PriorityFormComponent } from '../screens/masters/priority/priority-form/priority-form.component';
import { PriorityComponent } from '../screens/masters/priority/priority.component';
import { GeneralMasterComponent } from '../screens/masters/general-master/general-master.component';
import { GeneralMasterFormComponent } from '../screens/masters/general-master/general-master-form/general-master-form.component';
import { GeneralLedgerMasterListComponent } from '../screens/masters/general-ledger-master/general-ledger-master-list/general-ledger-master-list.component';
import { GeneralLedgerMasterFormComponent } from '../screens/masters/general-ledger-master/general-ledger-master-form/general-ledger-master-form.component';
import { DepositInterestStructureComponent } from '../screens/masters/deposit-interest-structure/deposit-interest-structure.component';
import { LoanInterestStructureComponent } from '../screens/masters/loan-interest-structure/loan-interest-structure.component';
import { GLInterestParameterComponent } from '../screens/masters/gl-interest-parameter/gl-interest-parameter.component';
import { BankProfileMasterComponent } from '../screens/masters/bank-profile-master/bank-profile-master.component';
import { DistrictMasterFormComponent } from '../screens/masters/district-master/district-master-form/district-master-form.component';
import { DistrictMasterComponent } from '../screens/masters/district-master/district-master.component';
import { TahshilMasterFormComponent } from '../screens/masters/tahshil-master/tahshil-master-form/tahshil-master-form.component';
import { TahshilMasterComponent } from '../screens/masters/tahshil-master/tahshil-master.component';
import { CustomerFormComponent } from '../screens/customers/customer-form/customer-form.component';
import { CustomerSearchComponent } from '../screens/customers/customer-search/customer-search.component';

const routes: Routes = [
  {
    path: '', component: AppRouterComponent, children: [
      { path: 'home', component: HomeComponent },
      { path: 'deposit-accounts', component: DepositAccountsComponent },
      { path: 'loan-accounts', component: LoanAccountsComponent },
      { path: 'bank', component: BankMasterFormComponent },
      { path: 'banks', component: BankMasterComponent },
      { path: 'branch', component: BranchMasterFormComponent },
      { path: 'branches', component: BranchMasterComponent },
      { path: 'priority', component: PriorityFormComponent },
      { path: 'priorities', component: PriorityComponent },
      { path: 'master-list', component: GeneralMasterComponent },
      { path: 'general-master', component: GeneralMasterFormComponent },
      { path: 'general-ledger-list', component: GeneralLedgerMasterListComponent },
      { path: 'general-ledger', component: GeneralLedgerMasterFormComponent },
      { path: 'deposit-interest', component: DepositInterestStructureComponent },
      { path: 'loan-interest', component: LoanInterestStructureComponent },
      { path: 'gl-interest-parameters', component: GLInterestParameterComponent },
      { path: 'profile', component: BankProfileMasterComponent },
      { path: 'district', component: DistrictMasterFormComponent },
      { path: 'districts', component: DistrictMasterComponent },
      { path: 'tahsil', component: TahshilMasterFormComponent },
      { path: 'tahsils', component: TahshilMasterComponent },
      { path: 'customer', component: CustomerFormComponent },
      { path: 'customer-search', component: CustomerSearchComponent },
      { path: '**', component: NotFoundComponent },
      { path: '', redirectTo: 'projects', pathMatch: 'full' },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppRouterRoutingModule { }
