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
import { LoanDetailsComponent } from '../screens/accounts/loan-accounts/loan-details/loan-details.component';
import { CashierTransactionSummaryComponent } from '../screens/transactions/cashier-transactions/cashier-transaction-summary/cashier-transaction-summary.component';
import { CounterTransactionSummaryComponent } from '../screens/transactions/counter-transactions/counter-transaction-summary/counter-transaction-summary.component';
import { VoucherPassingSummaryComponent } from '../screens/transactions/voucher-passing/voucher-passing-summary/voucher-passing-summary.component';
import { StartOfWorkSummaryComponent } from '../screens/transactions/start-of-work/start-of-work-summary/start-of-work-summary.component';
import { AuthGuard } from '../common/auth-guard/auth.guard';

const routes: Routes = [
  {
    path: '', component: AppRouterComponent,
    resolve:
    {
      masterData: MasterDataResolverService,
    },
    children:
      [{
        path: 'home', component: HomeComponent, //canActivate: [AuthGuard]
      },
      { path: 'deposit-accounts', component: DepositAccountsComponent, canActivate: [AuthGuard] },
      { path: 'saving-accounts', component: SavingAccountsComponent, canActivate: [AuthGuard] },
      { path: 'loan-accounts', component: LoanAccountsComponent, canActivate: [AuthGuard] },
      { path: 'other-accounts', component: OtherAccountsComponent, canActivate: [AuthGuard] },
      { path: 'bank', component: BankMasterFormComponent, canActivate: [AuthGuard] },
      { path: 'banks', component: BankMasterComponent, canActivate: [AuthGuard] },
      { path: 'branch', component: BranchMasterFormComponent, canActivate: [AuthGuard] },
      { path: 'branches', component: BranchMasterComponent, canActivate: [AuthGuard] },
      { path: 'priority', component: PriorityFormComponent, canActivate: [AuthGuard] },
      { path: 'priorities', component: PriorityComponent, canActivate: [AuthGuard] },
      { path: 'master-list', component: GeneralMasterComponent, canActivate: [AuthGuard] },
      { path: 'general-master', component: GeneralMasterFormComponent, canActivate: [AuthGuard] },
      { path: 'general-ledger-list', component: GeneralLedgerMasterListComponent, canActivate: [AuthGuard] },
      { path: 'general-ledger', component: GeneralLedgerMasterFormComponent, canActivate: [AuthGuard] },
      { path: 'deposit-interest', component: DepositInterestStructureComponent, canActivate: [AuthGuard] },
      { path: 'loan-interest', component: LoanInterestStructureComponent, canActivate: [AuthGuard] },
      { path: 'gl-interest-parameters', component: GLInterestParameterComponent, canActivate: [AuthGuard] },
      { path: 'profile', component: BankProfileMasterComponent, canActivate: [AuthGuard] },
      { path: 'district', component: DistrictMasterFormComponent, canActivate: [AuthGuard] },
      { path: 'districts', component: DistrictMasterComponent, canActivate: [AuthGuard] },
      { path: 'tahsil', component: TahshilMasterFormComponent, canActivate: [AuthGuard] },
      { path: 'tahsils', component: TahshilMasterComponent, canActivate: [AuthGuard] },
      { path: 'customer', component: CustomerFormComponent, canActivate: [AuthGuard] },
      { path: 'customer-search', component: CustomerSearchComponent, canActivate: [AuthGuard] },
      { path: 'member-list', component: MemberSearchComponent, canActivate: [AuthGuard] },
      { path: 'member', component: MemberFormComponent, canActivate: [AuthGuard] },
      { path: 'account-search', component: AccountSearchComponent, canActivate: [AuthGuard] },
      { path: 'user-search', component: UserSearchComponent, canActivate: [AuthGuard] },
      { path: 'user', component: UserComponent, canActivate: [AuthGuard] },
      { path: 'role-access', component: RoleAccessComponent, canActivate: [AuthGuard] },
      { path: 'activity', component: UserActivityComponent, canActivate: [AuthGuard] },
      { path: 'daily-role', component: UserDailyRoleComponent, canActivate: [AuthGuard] },
      { path: 'opening-balance', component: OpeningBalanceComponent, canActivate: [AuthGuard] },
      { path: 'balance-cert', component: BalanceCertificateComponent, canActivate: [AuthGuard] },
      { path: 'cheque-request', component: ChequeBookRequestComponent, canActivate: [AuthGuard] },
      { path: 'cheque-book-issue', component: ChequeBookIssueComponent, canActivate: [AuthGuard] },
      { path: 'loan-details', component: LoanDetailsComponent, canActivate: [AuthGuard] },
      // { path: 'saving-transactions', component: SavingTransactionsComponent, canActivate: [AuthGuard] },
      // { path: 'fd-transactions', component: FixDepositTransactionsComponent, canActivate: [AuthGuard] },
      // { path: 'pigmy-transactions', component: PigmyTransactionsComponent , canActivate: [AuthGuard]},
      { path: 'cashier-transactions', component: CashierTransactionSummaryComponent, canActivate: [AuthGuard] },
      { path: 'counter-transactions', component: CounterTransactionSummaryComponent, canActivate: [AuthGuard] },
      { path: 'voucher-passing', component: VoucherPassingSummaryComponent, canActivate: [AuthGuard] },
      { path: 'day-start', component: StartOfWorkSummaryComponent, canActivate: [AuthGuard] },
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
