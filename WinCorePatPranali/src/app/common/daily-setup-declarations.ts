import { UiStaticType } from "./models/common-ui-models";

export class DailtSetupDeclarations
{
    static transactionTypes = [new UiStaticType(1, "P", "Payment"),
        new UiStaticType(2, "R", "Receipt")];

}