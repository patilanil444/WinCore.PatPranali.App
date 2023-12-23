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

    static photoExtentionsGeneral = [new UiStaticType(1, "0", "bmp"), 
    new UiStaticType(2, "1", "ico"),
    new UiStaticType(3, "2", "cur"),
    new UiStaticType(4, "3", "rle"),
    new UiStaticType(5, "4", "wmf"),
    new UiStaticType(6, "5", "emf"),
    new UiStaticType(7, "6", "gif"),
    new UiStaticType(8, "7", "jpg")];

    static clearingGeneral = [new UiStaticType(1, "N", "No"),
    new UiStaticType(2, "Y", "Yes")];

    static clearingMemberGeneral = [new UiStaticType(1, "Y", "Direct"), 
    new UiStaticType(2, "I", "Indirect")];

    static dailyAuthorisationGeneral = [new UiStaticType(1, "Y", "Yes"), 
    new UiStaticType(2, "N", "No")];

    static softwareTypeGeneral = [new UiStaticType(1, "B", "Back Office"), 
    new UiStaticType(2, "S", "Direct Passing"), 
    new UiStaticType(2, "O", "Online")];

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

}