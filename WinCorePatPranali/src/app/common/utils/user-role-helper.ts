import { UiUserRole } from "../models/common-ui-models";

export class UserRoleHeper {
    static isManager = false;
    static isClerkOperator = false;
    static isMainCashier = false;
    static isSubCashier = false;
    static isPassingOfficer = false;
    static isLoanOfficer = false;
    static isDepositOfficer = false;
    static isPigmyAgent = false;
    static isRecoveryOfficer = false;
    static isSuperUser = false;

    static initialiseUserRoles(applicationUser: any) {
        this.isManager = applicationUser.todayAccess == UiUserRole.MANAGER ||
            applicationUser.todayAccess == UiUserRole.GENERAL_MANAGER || applicationUser.todayAccess == UiUserRole.ASSISTENT_MANAGER;
        this.isClerkOperator = applicationUser.todayAccess == UiUserRole.CLERK;
        this.isMainCashier = applicationUser.todayAccess == UiUserRole.MAIN_CASHIER;
        this.isSubCashier = applicationUser.todayAccess == UiUserRole.SUB_CASHIER;
        this.isPassingOfficer = applicationUser.todayAccess == UiUserRole.PASSING_OFFICER;
        this.isLoanOfficer = applicationUser.todayAccess == UiUserRole.LOAN_OFFICER;
        this.isDepositOfficer = applicationUser.todayAccess == UiUserRole.DEPOSIT_OFFICER;
        this.isPigmyAgent = applicationUser.todayAccess == UiUserRole.PIGMY_AGENT;
        this.isRecoveryOfficer = applicationUser.todayAccess == UiUserRole.RECOVERY_OFFICER;
        this.isSuperUser = applicationUser.isSuperUser;
    }

    static isUserSuperUser() {
        return this.isSuperUser;
    }

    static isAdministratorUser() {
        return this.isUserSuperUser() || this.isManager;
    }

    static isOperatorUser() {
        return this.isAdministratorUser() || this.isClerkOperator;
    }

    static isCashierUser() {
        return this.isAdministratorUser() || this.isMainCashier || this.isSubCashier;
    }

    static isMainCashierUser() {
        return this.isAdministratorUser() || this.isMainCashier;
    }

    static isPassingOfficerUser() {
        return this.isAdministratorUser() || this.isPassingOfficer;
    }

    static isLoanOfficerUser() {
        return this.isAdministratorUser() || this.isLoanOfficer;
    }

    static isDepositOfficerUser() {
        return this.isAdministratorUser() || this.isDepositOfficer;
    }

    static isPigmyAgentUser() {
        return this.isAdministratorUser() || this.isPigmyAgent;
    }

    static isRecoveryOfficerUser() {
        return this.isAdministratorUser() || this.isRecoveryOfficer;
    }

}