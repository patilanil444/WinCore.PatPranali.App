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
import { AuthGuard } from '../common/auth-guard/auth.guard';
import { UiUserRole } from '../common/models/common-ui-models';
import { BeginDayComponent } from '../screens/daily-setup/begin-day/begin-day.component';
import { CashOpenComponent } from '../screens/daily-setup/cash-open/cash-open.component';
import { CashierCashTransferComponent } from '../screens/daily-setup/cashier-cash-transfer/cashier-cash-transfer.component';
import { PigmyAccountSearchComponent } from '../screens/pigmy/accounts/pigmy-account-search/pigmy-account-search.component';
import { PigmyAccountFormComponent } from '../screens/pigmy/accounts/pigmy-account-form/pigmy-account-form.component';
import { AgentsListComponent } from '../screens/pigmy/agents/agents-list/agents-list.component';
import { AgentFormComponent } from '../screens/pigmy/agents/agent-form/agent-form.component';
import { PigmyEntryComponent } from '../screens/pigmy/pigmy-entry/pigmy-entry.component';
import { PigmyPassingComponent } from '../screens/pigmy/pigmy-passing/pigmy-passing.component';
import { CollectionAccountsListComponent } from '../screens/pigmy/collection-accounts/collection-accounts-list/collection-accounts-list.component';
import { LinkCollectionAccountComponent } from '../screens/pigmy/collection-accounts/link-collection-account/link-collection-account.component';
import { StandingInstructionsListComponent } from '../screens/transactions/standing-instructions/standing-instructions-list/standing-instructions-list.component';
import { PendingVouchersComponent } from '../screens/transactions/pending-vouchers/pending-vouchers.component';

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
      {
        path: 'deposit-accounts', component: DepositAccountsComponent, canActivate: [AuthGuard],
        data: {
          roles: [UiUserRole.MANAGER, UiUserRole.GENERAL_MANAGER, UiUserRole.ASSISTENT_MANAGER,
          UiUserRole.PASSING_OFFICER, UiUserRole.CLERK, UiUserRole.DEPOSIT_OFFICER]
        }
      },
      {
        path: 'saving-accounts', component: SavingAccountsComponent, canActivate: [AuthGuard],
        data: {
          roles: [UiUserRole.MANAGER, UiUserRole.GENERAL_MANAGER, UiUserRole.PASSING_OFFICER,
          UiUserRole.CLERK, UiUserRole.ASSISTENT_MANAGER]
        }
      },
      {
        path: 'loan-accounts', component: LoanAccountsComponent, canActivate: [AuthGuard],
        data: {
          roles: [UiUserRole.MANAGER, UiUserRole.GENERAL_MANAGER, UiUserRole.PASSING_OFFICER,
          UiUserRole.CLERK, UiUserRole.LOAN_OFFICER, UiUserRole.ASSISTENT_MANAGER]
        }
      },
      {
        path: 'other-accounts', component: OtherAccountsComponent, canActivate: [AuthGuard],
        data: {
          roles: [UiUserRole.MANAGER, UiUserRole.GENERAL_MANAGER, UiUserRole.PASSING_OFFICER,
          UiUserRole.CLERK, UiUserRole.ASSISTENT_MANAGER]
        }
      },
      {
        path: 'bank', component: BankMasterFormComponent, canActivate: [AuthGuard],
        data: {
          roles: [UiUserRole.MANAGER, UiUserRole.GENERAL_MANAGER, UiUserRole.ASSISTENT_MANAGER]
        }
      },
      { path: 'banks', component: BankMasterComponent, canActivate: [AuthGuard],
        data: {
          roles: [UiUserRole.MANAGER, UiUserRole.GENERAL_MANAGER, UiUserRole.ASSISTENT_MANAGER]
        }
      },
      { path: 'branch', component: BranchMasterFormComponent, canActivate: [AuthGuard],
        data: {
          roles: [UiUserRole.MANAGER, UiUserRole.GENERAL_MANAGER, UiUserRole.ASSISTENT_MANAGER]
        }
       },
      { path: 'branches', component: BranchMasterComponent, canActivate: [AuthGuard],
        data: {
          roles: [UiUserRole.MANAGER, UiUserRole.GENERAL_MANAGER, UiUserRole.ASSISTENT_MANAGER]
        }
       },
      { path: 'priority', component: PriorityFormComponent, canActivate: [AuthGuard],
        data: {
          roles: [UiUserRole.MANAGER, UiUserRole.GENERAL_MANAGER, UiUserRole.ASSISTENT_MANAGER]
        }
       },
      { path: 'priorities', component: PriorityComponent, canActivate: [AuthGuard],
        data: {
          roles: [UiUserRole.MANAGER, UiUserRole.GENERAL_MANAGER, UiUserRole.ASSISTENT_MANAGER]
        }
       },
      { path: 'master-list', component: GeneralMasterComponent, canActivate: [AuthGuard],
        data: {
          roles: [UiUserRole.MANAGER, UiUserRole.GENERAL_MANAGER, UiUserRole.ASSISTENT_MANAGER]
        }
       },
      { path: 'general-master', component: GeneralMasterFormComponent, canActivate: [AuthGuard],
        data: {
          roles: [UiUserRole.MANAGER, UiUserRole.GENERAL_MANAGER, UiUserRole.ASSISTENT_MANAGER]
        }
       },
      { path: 'general-ledger-list', component: GeneralLedgerMasterListComponent, canActivate: [AuthGuard],
        data: {
          roles: [UiUserRole.MANAGER, UiUserRole.GENERAL_MANAGER, UiUserRole.ASSISTENT_MANAGER]
        }
       },
      { path: 'general-ledger', component: GeneralLedgerMasterFormComponent, canActivate: [AuthGuard],
        data: {
          roles: [UiUserRole.MANAGER, UiUserRole.GENERAL_MANAGER, UiUserRole.ASSISTENT_MANAGER]
        }
       },
      { path: 'deposit-interest', component: DepositInterestStructureComponent, canActivate: [AuthGuard],
        data: {
          roles: [UiUserRole.MANAGER, UiUserRole.GENERAL_MANAGER, UiUserRole.ASSISTENT_MANAGER]
        }
       },
      { path: 'loan-interest', component: LoanInterestStructureComponent, canActivate: [AuthGuard],
        data: {
          roles: [UiUserRole.MANAGER, UiUserRole.GENERAL_MANAGER, UiUserRole.ASSISTENT_MANAGER]
        }
       },
      { path: 'gl-interest-parameters', component: GLInterestParameterComponent, canActivate: [AuthGuard],
        data: {
          roles: [UiUserRole.MANAGER, UiUserRole.GENERAL_MANAGER, UiUserRole.ASSISTENT_MANAGER]
        }
       },
      { path: 'profile', component: BankProfileMasterComponent, canActivate: [AuthGuard],
        data: {
          roles: [UiUserRole.MANAGER, UiUserRole.GENERAL_MANAGER, UiUserRole.ASSISTENT_MANAGER]
        }
       },
      { path: 'district', component: DistrictMasterFormComponent, canActivate: [AuthGuard],
        data: {
          roles: [UiUserRole.MANAGER, UiUserRole.GENERAL_MANAGER, UiUserRole.ASSISTENT_MANAGER]
        }
       },
      { path: 'districts', component: DistrictMasterComponent, canActivate: [AuthGuard],
        data: {
          roles: [UiUserRole.MANAGER, UiUserRole.GENERAL_MANAGER, UiUserRole.ASSISTENT_MANAGER]
        }
       },
      { path: 'tahsil', component: TahshilMasterFormComponent, canActivate: [AuthGuard],
        data: {
          roles: [UiUserRole.MANAGER, UiUserRole.GENERAL_MANAGER, UiUserRole.ASSISTENT_MANAGER]
        }
       },
      { path: 'tahsils', component: TahshilMasterComponent, canActivate: [AuthGuard],
        data: {
          roles: [UiUserRole.MANAGER, UiUserRole.GENERAL_MANAGER, UiUserRole.ASSISTENT_MANAGER]
        }
       },
      { path: 'customer', component: CustomerFormComponent, canActivate: [AuthGuard],
        data: {
          roles: [UiUserRole.MANAGER, UiUserRole.GENERAL_MANAGER, UiUserRole.ASSISTENT_MANAGER, 
            UiUserRole.CLERK]
        }
       },
      { path: 'customer-search', component: CustomerSearchComponent, canActivate: [AuthGuard],
        data: {
          roles: [UiUserRole.MANAGER, UiUserRole.GENERAL_MANAGER, UiUserRole.ASSISTENT_MANAGER, 
            UiUserRole.CLERK]
        }
       },
      { path: 'member-list', component: MemberSearchComponent, canActivate: [AuthGuard],
        data: {
          roles: [UiUserRole.MANAGER, UiUserRole.GENERAL_MANAGER, UiUserRole.ASSISTENT_MANAGER, 
            UiUserRole.CLERK]
        }
       },
      { path: 'member', component: MemberFormComponent, canActivate: [AuthGuard],
        data: {
          roles: [UiUserRole.MANAGER, UiUserRole.GENERAL_MANAGER, UiUserRole.ASSISTENT_MANAGER, 
            UiUserRole.CLERK]
        }
       },
      { path: 'account-search', component: AccountSearchComponent, canActivate: [AuthGuard],
        data: {
          roles: [UiUserRole.MANAGER, UiUserRole.GENERAL_MANAGER, UiUserRole.ASSISTENT_MANAGER, 
            UiUserRole.CLERK, UiUserRole.LOAN_OFFICER, UiUserRole.DEPOSIT_OFFICER, UiUserRole.PASSING_OFFICER]
        }
       },
      { path: 'user-search', component: UserSearchComponent, canActivate: [AuthGuard],
        data: {
          roles: [UiUserRole.MANAGER, UiUserRole.GENERAL_MANAGER, UiUserRole.ASSISTENT_MANAGER]
        }
       },
      { path: 'user', component: UserComponent, canActivate: [AuthGuard],
        data: {
          roles: [UiUserRole.MANAGER, UiUserRole.GENERAL_MANAGER, UiUserRole.ASSISTENT_MANAGER]
        }
       },
      { path: 'role-access', component: RoleAccessComponent, canActivate: [AuthGuard],
        data: {
          roles: [UiUserRole.MANAGER, UiUserRole.GENERAL_MANAGER, UiUserRole.ASSISTENT_MANAGER]
        }
       },
      { path: 'activity', component: UserActivityComponent, canActivate: [AuthGuard],
        data: {
          roles: [UiUserRole.MANAGER, UiUserRole.GENERAL_MANAGER, UiUserRole.ASSISTENT_MANAGER]
        }
       },
      { path: 'daily-role', component: UserDailyRoleComponent, canActivate: [AuthGuard],
        data: {
          roles: [UiUserRole.MANAGER, UiUserRole.GENERAL_MANAGER, UiUserRole.ASSISTENT_MANAGER]
        }
       },
      { path: 'opening-balance', component: OpeningBalanceComponent, canActivate: [AuthGuard],
        data: {
          roles: [UiUserRole.MANAGER, UiUserRole.GENERAL_MANAGER, UiUserRole.ASSISTENT_MANAGER]
        }
       },
      { path: 'balance-cert', component: BalanceCertificateComponent, canActivate: [AuthGuard] ,
        data: {
          roles: [UiUserRole.MANAGER, UiUserRole.GENERAL_MANAGER, UiUserRole.ASSISTENT_MANAGER]
        }
      },
      { path: 'cheque-request', component: ChequeBookRequestComponent, canActivate: [AuthGuard],
        data: {
          roles: [UiUserRole.MANAGER, UiUserRole.GENERAL_MANAGER, UiUserRole.ASSISTENT_MANAGER]
        }
       },
      { path: 'cheque-book-issue', component: ChequeBookIssueComponent, canActivate: [AuthGuard],
        data: {
          roles: [UiUserRole.MANAGER, UiUserRole.GENERAL_MANAGER, UiUserRole.ASSISTENT_MANAGER]
        }
       },
      { path: 'loan-details', component: LoanDetailsComponent, canActivate: [AuthGuard],
        data: {
          roles: [UiUserRole.MANAGER, UiUserRole.GENERAL_MANAGER, UiUserRole.ASSISTENT_MANAGER, 
            UiUserRole.LOAN_OFFICER, UiUserRole.PASSING_OFFICER]
        }
       },
      { path: 'cashier-transactions', component: CashierTransactionSummaryComponent, canActivate: [AuthGuard],
        data: {
          roles: [UiUserRole.MANAGER, UiUserRole.GENERAL_MANAGER, UiUserRole.ASSISTENT_MANAGER,
            UiUserRole.MAIN_CASHIER, UiUserRole.SUB_CASHIER
          ]
        }
       },
      { path: 'counter-transactions', component: CounterTransactionSummaryComponent, canActivate: [AuthGuard],
        data: {
          roles: [UiUserRole.MANAGER, UiUserRole.GENERAL_MANAGER, UiUserRole.ASSISTENT_MANAGER,
            UiUserRole.CLERK,
          ]
        }
       },
      { path: 'voucher-passing', component: VoucherPassingSummaryComponent, canActivate: [AuthGuard],
        data: {
          roles: [UiUserRole.MANAGER, UiUserRole.GENERAL_MANAGER, UiUserRole.ASSISTENT_MANAGER,
             UiUserRole.PASSING_OFFICER
          ]
        }
       },
       { path: 'pending-vouchers', component: PendingVouchersComponent, canActivate: [AuthGuard],
        data: {
          roles: [UiUserRole.MANAGER, UiUserRole.GENERAL_MANAGER, UiUserRole.ASSISTENT_MANAGER,
             UiUserRole.PASSING_OFFICER
          ]
        }
       },
      { path: 'begin-day', component: BeginDayComponent, canActivate: [AuthGuard],
        data: {
          roles: [UiUserRole.MANAGER, UiUserRole.GENERAL_MANAGER, UiUserRole.ASSISTENT_MANAGER]
        }
       },
       { path: 'cash-open', component: CashOpenComponent, canActivate: [AuthGuard],
        data: {
          roles: [UiUserRole.MANAGER, UiUserRole.GENERAL_MANAGER, UiUserRole.ASSISTENT_MANAGER,
            UiUserRole.MAIN_CASHIER
          ]
        }
       },
       { path: 'cashier-cash-transfer', component: CashierCashTransferComponent, canActivate: [AuthGuard],
        data: {
          roles: [UiUserRole.MANAGER, UiUserRole.GENERAL_MANAGER, UiUserRole.MAIN_CASHIER
            // UiUserRole.ASSISTENT_MANAGER,
          ]
        }
       },
       { path: 'pigmy-account-serach', component: PigmyAccountSearchComponent, canActivate: [AuthGuard],
        data: {
          roles: [UiUserRole.MANAGER, UiUserRole.GENERAL_MANAGER, UiUserRole.ASSISTENT_MANAGER, UiUserRole.CLERK, UiUserRole.OPERATOR
          ]
        }
       },
       { path: 'pigmy-account', component: PigmyAccountFormComponent, canActivate: [AuthGuard],
        data: {
          roles: [UiUserRole.MANAGER, UiUserRole.GENERAL_MANAGER, UiUserRole.ASSISTENT_MANAGER, UiUserRole.CLERK, UiUserRole.OPERATOR
          ]
        }
       },
       { path: 'pigmy-agent-list', component: AgentsListComponent, canActivate: [AuthGuard],
        data: {
          roles: [UiUserRole.MANAGER, UiUserRole.GENERAL_MANAGER, UiUserRole.ASSISTENT_MANAGER, UiUserRole.CLERK, UiUserRole.OPERATOR
          ]
        }
       },
       { path: 'pigmy-agent', component: AgentFormComponent, canActivate: [AuthGuard],
        data: {
          roles: [UiUserRole.MANAGER, UiUserRole.GENERAL_MANAGER, UiUserRole.ASSISTENT_MANAGER, UiUserRole.CLERK, UiUserRole.OPERATOR
          ]
        }
       },
       { path: 'pigmy-entry', component: PigmyEntryComponent, canActivate: [AuthGuard],
        data: {
          roles: [UiUserRole.MANAGER, UiUserRole.GENERAL_MANAGER, UiUserRole.ASSISTENT_MANAGER, 
            UiUserRole.CLERK, UiUserRole.OPERATOR, UiUserRole.PIGMY_AGENT
          ]
        }
       },
       { path: 'pigmy-passing', component: PigmyPassingComponent, canActivate: [AuthGuard],
        data: {
          roles: [UiUserRole.MANAGER, UiUserRole.GENERAL_MANAGER, UiUserRole.ASSISTENT_MANAGER, 
            UiUserRole.CLERK, UiUserRole.OPERATOR, UiUserRole.PASSING_OFFICER
          ]
        }
       },
       { path: 'collection-accounts', component: CollectionAccountsListComponent, canActivate: [AuthGuard],
        data: {
          roles: [UiUserRole.MANAGER, UiUserRole.GENERAL_MANAGER, UiUserRole.ASSISTENT_MANAGER, 
            UiUserRole.CLERK, UiUserRole.OPERATOR, UiUserRole.PASSING_OFFICER
          ]
        }
       },
       { path: 'link-collection-account', component: LinkCollectionAccountComponent, canActivate: [AuthGuard],
        data: {
          roles: [UiUserRole.MANAGER, UiUserRole.GENERAL_MANAGER, UiUserRole.ASSISTENT_MANAGER, 
            UiUserRole.CLERK, UiUserRole.OPERATOR, UiUserRole.PASSING_OFFICER
          ]
        }
       },
       { path: 'standing-instructions', component: StandingInstructionsListComponent, canActivate: [AuthGuard],
        data: {
          roles: [UiUserRole.MANAGER, UiUserRole.GENERAL_MANAGER, UiUserRole.ASSISTENT_MANAGER, 
            UiUserRole.CLERK, UiUserRole.OPERATOR, UiUserRole.PASSING_OFFICER
          ]
        }
       },
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
