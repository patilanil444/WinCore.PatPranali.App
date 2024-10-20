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
import { CustomerFormComponent } from '../screens/customers/customer/customer-form/customer-form.component';
import { CustomerSearchComponent } from '../screens/customers/customer/customer-search/customer-search.component';
import { MemberSearchComponent } from '../screens/customers/member/member-search/member-search.component';
import { MemberFormComponent } from '../screens/customers/member/member-form/member-form.component';
import { MasterDataResolverService } from '../common/resolvers/master-data-resolver.service';
import { AccountSearchComponent } from '../screens/accounts/account-search/account-search.component';
import { SavingAccountsComponent } from '../screens/accounts/saving-accounts/saving-accounts.component';
import { UserActivityComponent } from '../screens/users/user-activity/user-activity.component';
import { RoleAccessComponent } from '../screens/users/role-access/role-access.component';
import { UserComponent } from '../screens/users/user/user.component';
import { UserSearchComponent } from '../screens/users/user-search/user-search.component';
import { UserDailyRoleComponent } from '../screens/users/user-daily-role/user-daily-role.component';
import { OtherAccountsComponent } from '../screens/accounts/other-accounts/other-accounts.component';
import { OpeningBalanceComponent } from '../screens/accounts/opening-balance/opening-balance.component';
import { BalanceCertificateComponent } from '../screens/accounts/balance-certificate/balance-certificate.component';
import { ChequeBookRequestComponent } from '../screens/registers/cheque-book-request/cheque-book-request.component';
import { ChequeBookIssueComponent } from '../screens/registers/cheque-book-issue/cheque-book-issue.component';
// import { LoanDetailsComponent } from '../screens/accounts/loan-details/loan-details.component';

const routes: Routes = [
  {
    path: '', component: AppRouterComponent, 
    resolve:
    {
      masterData: MasterDataResolverService,
    }, 
    children: 
    [{
        path: 'home', component: HomeComponent
      },
      { path: 'deposit-accounts', component: DepositAccountsComponent },
      { path: 'saving-accounts', component: SavingAccountsComponent },
      { path: 'loan-accounts', component: LoanAccountsComponent },
      { path: 'other-accounts', component: OtherAccountsComponent },
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
      { path: 'member-list', component: MemberSearchComponent },
      { path: 'member', component: MemberFormComponent },
      { path: 'account-search', component: AccountSearchComponent },
      { path: 'user-search', component: UserSearchComponent },
      { path: 'user', component: UserComponent },
      { path: 'role-access', component: RoleAccessComponent },
      { path: 'activity', component: UserActivityComponent },
      { path: 'daily-role', component: UserDailyRoleComponent },
      { path: 'opening-balance', component: OpeningBalanceComponent },
      { path: 'balance-cert', component: BalanceCertificateComponent },
      { path: 'cheque-request', component: ChequeBookRequestComponent },
      { path: 'cheque-book-issue', component: ChequeBookIssueComponent },
      // { path: 'loan-details', component: LoanDetailsComponent },
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
