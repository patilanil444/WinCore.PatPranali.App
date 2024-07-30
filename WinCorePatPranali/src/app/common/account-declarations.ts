import { UiStaticType } from "./models/common-ui-models";

export class AccountDeclarations
{
    static employeeTypes = [
    new UiStaticType(1, "O", "Other"), 
    new UiStaticType(2, "S", "Staff"),
    new UiStaticType(3, "D", "Director")];

     static form60YN = [new UiStaticType(1, "Y", "Yes"),
    new UiStaticType(2, "N", "No")];

     static form61YN = [new UiStaticType(1, "Y", "Yes"),
    new UiStaticType(2, "N", "No")];

    static tdsYN = [new UiStaticType(1, "Y", "Yes"),
    new UiStaticType(2, "N", "No")];

    static installmentTypes = [new UiStaticType(1, "D", "Daily"),
    new UiStaticType(2, "W", "Weekly"),
    new UiStaticType(3, "M", "Monthly"),
    new UiStaticType(4, "Q", "Quarterly"),
    new UiStaticType(5, "H", "Half Yearly"),
    new UiStaticType(6, "Y", "Yearly")];

    static renewalTypes = [new UiStaticType(1, "Y", "Yes"),
    new UiStaticType(2, "N", "No")];

    static changesInInterestRateYN = [new UiStaticType(1, "Y", "Yes"),
    new UiStaticType(2, "N", "No")];
    
}