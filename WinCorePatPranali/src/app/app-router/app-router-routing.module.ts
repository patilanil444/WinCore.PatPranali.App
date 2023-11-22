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

const routes: Routes = [
  {
    path: '', component: AppRouterComponent, children: [
      { path: 'home', component: HomeComponent },
      { path: 'deposit-accounts', component: DepositAccountsComponent },
      { path: 'loan-accounts', component: LoanAccountsComponent },
      { path: 'new-bank/:maxId', component: BankMasterFormComponent },
      { path: 'edit-bank/:id', component: BankMasterFormComponent },
      { path: 'banks', component: BankMasterComponent },
      { path: 'new-branch/:maxId', component: BranchMasterFormComponent },
      { path: 'edit-branch/:id', component: BranchMasterFormComponent },
      { path: 'branches', component: BranchMasterComponent },
      { path: 'new-priority/:maxId', component: PriorityFormComponent },
      { path: 'edit-priority/:id', component: PriorityFormComponent },
      { path: 'priorities', component: PriorityComponent },
      { path: 'master-list', component: GeneralMasterComponent },
      { path: 'general-master', component: GeneralMasterFormComponent },
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
