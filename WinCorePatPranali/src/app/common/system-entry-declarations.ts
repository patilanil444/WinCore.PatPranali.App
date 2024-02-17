import { UiStaticType } from "./models/common-ui-models";

export class SystemEntryDeclarations
{
    static dayOpenGeneral = [new UiStaticType(1, "Y", "Yes"), 
    new UiStaticType(2, "N", "No")];

    static standingInstructionGeneral = [new UiStaticType(1, "N", "No"),
    new UiStaticType(2, "Y", "Yes")];

    static actualProfitGeneral = [new UiStaticType(1, "N", "No"),
    new UiStaticType(2, "Y", "Yes")];

    static photoSignatureGeneral = [new UiStaticType(1, "N", "No"),
    new UiStaticType(2, "Y", "Yes")];

    static photoExtentionsGeneral = [new UiStaticType(1, "B", "bmp"), 
    new UiStaticType(2, "I", "ico"),
    new UiStaticType(3, "C", "cur"),
    new UiStaticType(4, "R", "rle"),
    new UiStaticType(5, "W", "wmf"),
    new UiStaticType(6, "E", "emf"),
    new UiStaticType(7, "G", "gif"),
    new UiStaticType(8, "J", "jpg")];

    static clearingGeneral = [new UiStaticType(1, "N", "No"),
    new UiStaticType(2, "Y", "Yes")];

    static clearingMemberGeneral = [new UiStaticType(1, "Y", "Direct"), 
    new UiStaticType(2, "I", "Indirect")];

    static dailyAuthorisationGeneral = [new UiStaticType(1, "Y", "Yes"), 
    new UiStaticType(2, "N", "No")];

    static softwareTypeGeneral = [new UiStaticType(1, "B", "Back Office"), 
    new UiStaticType(2, "S", "Direct Passing"), 
    new UiStaticType(3, "O", "Online")];

    static softwareLanguageGeneral = [new UiStaticType(1, "E", "English"), 
    new UiStaticType(2, "M", "Other")];

    static bankTypeGeneral = [new UiStaticType(1, "P", "Patsanstha"), 
    new UiStaticType(2, "B", "Bank")];

    static sharesLanguageGeneral = [new UiStaticType(1, "E", "English"), 
    new UiStaticType(2, "M", "Other")];


    static addReceivableInBalanceLoan = [new UiStaticType(1, "Y", "Yes"), 
    new UiStaticType(2, "N", "No")];

    static automaticTransferEntryLoan = [new UiStaticType(1, "Y", "Yes"), 
    new UiStaticType(2, "N", "No")];

    static calcInterestAtReceiptLoan = [new UiStaticType(1, "Y", "Yes"), 
    new UiStaticType(2, "N", "No")];

    static treatPenalAsInterestLoan = [new UiStaticType(1, "I", "Interest"), 
    new UiStaticType(2, "P", "Penal")];

    static calcInterestOnReceivablesLoan = [new UiStaticType(1, "Y", "Yes"), 
    new UiStaticType(2, "N", "No")];

    static loanInterestLoan = [new UiStaticType(1, "D", "Day"), 
    new UiStaticType(2, "M", "Month & Day")];


    static pigmyCalcTypeDeposit = [new UiStaticType(1, "M", "Minimum Balance"), 
    new UiStaticType(2, "P", "Monthly Balance")];

    static pigmyMonthlyBalanceDeposit = [new UiStaticType(1, "F", "First Day Of Each Month"), 
    new UiStaticType(2, "L", "Last Day Of Each Month"),
    new UiStaticType(3, "O", "Opening Day Of Each Month")];

    static pigmyBalanceTypeDeposit = [new UiStaticType(1, "O", "Opening Balance"), 
    new UiStaticType(2, "C", "Closing Balance")];

    static recurringMonthlyBalanceDeposit = [new UiStaticType(1, "F", "First Day Of Each Month"), 
    new UiStaticType(2, "L", "Last Day Of Each Month"),
    new UiStaticType(3, "L", "10th day Of Each Month"),
    new UiStaticType(4, "O", "Opening Day Of Each Month")];

    static recurringCalcIntOnDemandDeposit = [new UiStaticType(1, "Y", "Yes"), 
    new UiStaticType(2, "N", "No")];

    static recurringBalanceTypeDeposit = [new UiStaticType(1, "O", "Opening Balance"), 
    new UiStaticType(2, "C", "Closing Balance")];

    static fdintCalcTypeDeposit = [new UiStaticType(1, "D", "Completed Days Only"), 
    new UiStaticType(2, "M", "Completed Months Only"),
    new UiStaticType(3, "B", "Completed Months And Remaining Days")];

    static fdMonthlyDiscountRateDeposit = [new UiStaticType(1, "Y", "Yes"), 
    new UiStaticType(2, "N", "No")];

    static riIntCalcTypeDeposit = [new UiStaticType(1, "D", "Days"), 
    new UiStaticType(2, "M", "Months")];

    static riPrematureIntCalcDeposit = [new UiStaticType(1, "I", "Reinvestment Type"), 
    new UiStaticType(2, "F", "Fixed Deposit Type"),
    new UiStaticType(3, "D", "Before 1 year Fixed Deposit Type")];

    static autoDRIntDeposit = [new UiStaticType(1, "Y", "Yes"), 
    new UiStaticType(2, "N", "No")];
}