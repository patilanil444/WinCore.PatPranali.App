import { UiStaticType } from "./models/common-ui-models";

export class TransactionsDeclarations
{
    static transactionTypes = [new UiStaticType(1, "C", "Credit"),
    new UiStaticType(2, "D", "Debit")];

    static voucherTransactionTypes = [new UiStaticType(1, "R", "Receipt"),
        new UiStaticType(2, "D", "Payment")];

    static uiInstructionStatuses = [new UiStaticType(1, "A", "Active"),
    new UiStaticType(2, "C", "Cancelled"),
    new UiStaticType(3, "S", "Suspended")];

     static uiYesNo = [new UiStaticType(1, "Y", "Yes"),
    new UiStaticType(2, "N", "No")];

}