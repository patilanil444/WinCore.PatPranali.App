import { UiStaticType } from "./models/common-ui-models";

export class TransactionsDeclarations
{
    static transactionTypes = [new UiStaticType(1, "C", "Credit"),
    new UiStaticType(2, "D", "Debit")];

    static voucherTransactionTypes = [new UiStaticType(1, "R", "Receipt"),
        new UiStaticType(2, "D", "Payment")];

}