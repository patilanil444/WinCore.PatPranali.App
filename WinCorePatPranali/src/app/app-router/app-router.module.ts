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
import { UserSearchComponent } from '../screens/users/user-search/user-search.component';
import { UserComponent } from '../screens/users/user/user.component';
import { RoleAccessComponent } from '../screens/users/role-access/role-access.component';
import { UserActivityComponent } from '../screens/users/user-activity/user-activity.component';
import { UserDailyRoleComponent } from '../screens/users/user-daily-role/user-daily-role.component';
import { VehicleLoanComponent } from '../screens/accounts/loan-accounts/loan-types/vehicle-loan/vehicle-loan.component';
import { GoldLoanComponent } from '../screens/accounts/loan-accounts/loan-types/gold-loan/gold-loan.component';
import { OtherAccountsComponent } from '../screens/accounts/other-accounts/other-accounts.component';
import { LienFdLoanComponent } from '../screens/accounts/loan-accounts/loan-types/lien-fd-loan/lien-fd-loan.component';
import { OpeningBalanceComponent } from '../screens/accounts/opening-balance/opening-balance.component';
import { AccSearchComponent } from '../common/directives/acc-search/acc-search.component';
import { BalanceCertificateComponent } from '../screens/accounts/balance-certificate/balance-certificate.component';
import { BackOfficeEntryComponent } from '../screens/transactions/back-office-entry/back-office-entry.component';
import { ChequeBookRequestComponent } from '../screens/registers/cheque-book-request/cheque-book-request.component';
import { ChequeBookIssueComponent } from '../screens/registers/cheque-book-issue/cheque-book-issue.component';
// import { AutocompleteComponent } from '../common/directives/autocomplete/autocomplete.component';
import { AutoAccSearchComponent } from '../common/directives/auto-acc-search/auto-acc-search.component';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { LoanDetailsComponent } from '../screens/accounts/loan-accounts/loan-details/loan-details.component';
import { LoanSecurityComponent } from '../screens/accounts/loan-accounts/loan-types/loan-security/loan-security.component';
import { CashCreditLoanComponent } from '../screens/accounts/loan-accounts/loan-types/cash-credit-loan/cash-credit-loan.component';
import { FixDepositTransactionsComponent } from '../screens/transactions/fix-deposit-transactions/fix-deposit-transactions.component';
import { PigmyTransactionsComponent } from '../screens/transactions/pigmy-transactions/pigmy-transactions.component';
import { DenominationsComponent } from '../common/directives/denominations/denominations.component';
import { CashierTransactionSummaryComponent } from '../screens/transactions/cashier-transactions/cashier-transaction-summary/cashier-transaction-summary.component';
import { CashierCashReceiptComponent } from '../screens/transactions/cashier-transactions/cashier-cash-receipt/cashier-cash-receipt.component';
import { CashierCashPaymentComponent } from '../screens/transactions/cashier-transactions/cashier-cash-payment/cashier-cash-payment.component';
import { CashierCashExchangeComponent } from '../screens/transactions/cashier-transactions/cashier-cash-exchange/cashier-cash-exchange.component';
import { CounterCashPaymentComponent } from '../screens/transactions/counter-transactions/counter-cash-payment/counter-cash-payment.component';
import { CounterTransactionSummaryComponent } from '../screens/transactions/counter-transactions/counter-transaction-summary/counter-transaction-summary.component';
import { CashVoucherPassingComponent } from '../screens/transactions/voucher-passing/cash-voucher-passing/cash-voucher-passing.component';
import { TransferVoucherPassingComponent } from '../screens/transactions/voucher-passing/transfer-voucher-passing/transfer-voucher-passing.component';
import { OverdraftAllotmentComponent } from '../screens/transactions/voucher-passing/overdraft-allotment/overdraft-allotment.component';
import { ChequeBookPassingComponent } from '../screens/transactions/voucher-passing/cheque-book-passing/cheque-book-passing.component';
import { VoucherPassingSummaryComponent } from '../screens/transactions/voucher-passing/voucher-passing-summary/voucher-passing-summary.component';
import { BankAccSearchComponent } from '../common/directives/bank-acc-search/bank-acc-search.component';
import { MessageBoxComponent } from '../common/directives/message-box/message-box.component';
import { PassingInfoComponent } from '../screens/transactions/voucher-passing/passing-info/passing-info.component';
import { CounterTransferComponent } from '../screens/transactions/counter-transactions/counter-transfer/counter-transfer.component';
import { AccountSelectorComponent } from '../screens/transactions/counter-transactions/account-selector/account-selector.component';
import { ConfirmBoxComponent } from '../common/directives/confirm-box/confirm-box.component';
import { BeginDayComponent } from '../screens/daily-setup/begin-day/begin-day.component';
import { CalenderViewComponent } from '../common/directives/calender-view/calender-view.component';
import { CashOpenComponent } from '../screens/daily-setup/cash-open/cash-open.component';
import { CashierCashTransferComponent } from '../screens/daily-setup/cashier-cash-transfer/cashier-cash-transfer.component';
import { CashStatusComponent } from '../common/directives/cash-status/cash-status.component';
import { CashStatusModalComponent } from '../common/directives/cash-status/cash-status-modal/cash-status-modal.component';
import { AgentsListComponent } from '../screens/pigmy/agents/agents-list/agents-list.component';
import { AgentFormComponent } from '../screens/pigmy/agents/agent-form/agent-form.component';
import { PigmyEntryComponent } from '../screens/pigmy/pigmy-entry/pigmy-entry.component';
import { PigmyAccountFormComponent } from '../screens/pigmy/accounts/pigmy-account-form/pigmy-account-form.component';
import { PigmyAccountSearchComponent } from '../screens/pigmy/accounts/pigmy-account-search/pigmy-account-search.component';
import { PigmyPassingComponent } from '../screens/pigmy/pigmy-passing/pigmy-passing.component';
import { PigmyCollectionInfoComponent } from '../screens/pigmy/pigmy-collection-info/pigmy-collection-info.component';
import { CollectionAccountsListComponent } from '../screens/pigmy/collection-accounts/collection-accounts-list/collection-accounts-list.component';
import { LinkCollectionAccountComponent } from '../screens/pigmy/collection-accounts/link-collection-account/link-collection-account.component';
import { StandingInstructionsListComponent } from '../screens/transactions/standing-instructions/standing-instructions-list/standing-instructions-list.component';
import { StandingInstructionsFormComponent } from '../screens/transactions/standing-instructions/standing-instructions-form/standing-instructions-form.component';

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
    OtherAccountsComponent,
    UserSearchComponent,
    UserComponent,
    RoleAccessComponent,
    UserActivityComponent,
    UserDailyRoleComponent,
    VehicleLoanComponent,
    GoldLoanComponent,
    LienFdLoanComponent,
    OpeningBalanceComponent,
    AccSearchComponent,
    BalanceCertificateComponent,
    BackOfficeEntryComponent,
    ChequeBookRequestComponent,
    ChequeBookIssueComponent,
    // AutocompleteComponent,
    AutoAccSearchComponent,
    LoanDetailsComponent,
    LoanSecurityComponent,
    CashCreditLoanComponent,
    FixDepositTransactionsComponent,
    PigmyTransactionsComponent,
    DenominationsComponent,
    CashierTransactionSummaryComponent,
    CashierCashReceiptComponent,
    CashierCashPaymentComponent,
    CashierCashExchangeComponent,
    CounterCashPaymentComponent,
    CounterTransactionSummaryComponent,
    CounterCashPaymentComponent,
    CounterTransferComponent,
    CashVoucherPassingComponent,
    TransferVoucherPassingComponent,
    OverdraftAllotmentComponent,
    ChequeBookPassingComponent,
    VoucherPassingSummaryComponent,
    BankAccSearchComponent,
    MessageBoxComponent,
    PassingInfoComponent,
    AccountSelectorComponent,
    ConfirmBoxComponent,
    BeginDayComponent,
    CalenderViewComponent,
    CashOpenComponent,
    CashierCashTransferComponent,
    CashStatusComponent,
    CashStatusModalComponent,
    AgentsListComponent,
    AgentFormComponent,
    AccountSearchComponent,
    PigmyAccountSearchComponent,
    PigmyAccountFormComponent,
    PigmyEntryComponent,
    PigmyPassingComponent,
    PigmyCollectionInfoComponent,
    CollectionAccountsListComponent,
    LinkCollectionAccountComponent,
    StandingInstructionsListComponent,
    StandingInstructionsFormComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    AppRouterRoutingModule,
    NgxPaginationModule,
    BsDatepickerModule.forRoot(),
    SelectDropDownModule, AutocompleteLibModule
  ],
  providers: [],// Toastr providers
})
export class AppRouterModule { }
