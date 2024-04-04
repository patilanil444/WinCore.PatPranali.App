import { UiStaticType } from "./models/common-ui-models";

export class BranchDeclarations
{
    static hoYN = [new UiStaticType(1, "Y", "Yes"),
    new UiStaticType(2, "N", "No")];

    static clearingYN = [new UiStaticType(1, "Y", "Yes"),
    new UiStaticType(2, "N", "No")];

    static regionalLang = [new UiStaticType(1, "E", "English"),
    new UiStaticType(2, "M", "Marathi"),
    new UiStaticType(3, "H", "Hindi")];

    static dailyAuthYN = [new UiStaticType(1, "Y", "Yes"),
    new UiStaticType(2, "N", "No")];

    static softwareType = [new UiStaticType(1, "O", "Online"),
    new UiStaticType(2, "S", "Semi Online"),
    new UiStaticType(3, "B", "Backoffice")];

    static clearingMemberYN = [new UiStaticType(1, "Y", "Yes"),
    new UiStaticType(2, "N", "No")];

    static cashierTransactionsYN = [new UiStaticType(1, "Y", "Yes"),
    new UiStaticType(2, "N", "No")];

}