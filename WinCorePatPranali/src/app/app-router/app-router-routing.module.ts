import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DepositAccountsComponent } from '../screens/deposit-accounts/deposit-accounts.component';
import { NotFoundComponent } from '../not-found/not-found.component';
import { LoanAccountsComponent } from '../screens/loan-accounts/loan-accounts.component';
import { PriorityComponent } from '../common/masters/priority/priority.component';
import { HomeComponent } from '../home/home.component';
import { AppRouterComponent } from './app-router.component';
import { GeneralMasterComponent } from '../common/masters/general-master/general-master.component';
import { BranchMasterComponent } from '../common/masters/branch-master/branch-master.component';
import { BankMasterComponent } from '../common/masters/bank-master/bank-master.component';
import { BankMasterFormComponent } from '../common/masters/bank-master/bank-master-form/bank-master-form.component';
import { BranchMasterFormComponent } from '../common/masters/branch-master/branch-master-form/branch-master-form.component';
import { PriorityFormComponent } from '../common/masters/priority/priority-form/priority-form.component';
import { GeneralMasterFormComponent } from '../common/masters/general-master/general-master-form/general-master-form.component';


// const routes: Routes = [
//   {path: 'home', component: HomeComponent },
//   {path: 'deposit-accounts', component: DepositAccountsComponent },
//   {path: 'loan-accounts', component: LoanAccountsComponent },
//   {path: 'priority', component: PriorityComponent },
//   {path: 'general', component: GenaralMasterComponent },
//   {path: '', redirectTo: 'configurations', pathMatch: 'full'},
//   { path: '**', component: NotFoundComponent },
// ];

const routes: Routes = [
  {
    path: '', component: AppRouterComponent, children: [
      { path: 'home', component: HomeComponent },
      { path: 'deposit-accounts', component: DepositAccountsComponent },
      { path: 'loan-accounts', component: LoanAccountsComponent },
      { path: 'new-bank', component: BankMasterFormComponent },
      { path: 'banks', component: BankMasterComponent },
      { path: 'new-branch', component: BranchMasterFormComponent },
      { path: 'branches', component: BranchMasterComponent },
      { path: 'new-priority', component: PriorityFormComponent },
      { path: 'priorities', component: PriorityComponent },
      { path: 'new-general-master', component: GeneralMasterFormComponent },
      { path: 'general-master', component: GeneralMasterComponent },
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
