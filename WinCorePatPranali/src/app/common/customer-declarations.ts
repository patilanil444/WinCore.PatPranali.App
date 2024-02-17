import { UiStaticType } from "./models/common-ui-models";

export class CustomerDeclarations
{
    static titles = [new UiStaticType(1, "M", "Mr."), 
    new UiStaticType(2, "R", "Mrs."),
    new UiStaticType(3, "I", "Miss"),
    new UiStaticType(4, "S", "Ms."),
    new UiStaticType(5, "D", "Dr."),
    new UiStaticType(6, "P", "Prof.")];

    static genders = [new UiStaticType(1, "M", "Male"),
    new UiStaticType(2, "F", "Female"),
    new UiStaticType(3, "O", "Other")];

    static maritalStatuses = [new UiStaticType(1, "S", "Single"),
    new UiStaticType(2, "M", "Married"),
    new UiStaticType(3, "O", "Other")];

    static statuses = [new UiStaticType(1, "A", "Active"),
    new UiStaticType(2, "I", "Inactive"),
    new UiStaticType(3, "D", "Deleted")];

    static educations = [new UiStaticType(1, "U", "Under-graduate"),
    new UiStaticType(2, "G", "Graduate"),
    new UiStaticType(3, "P", "Post-graduate"),
    new UiStaticType(4, "S", "School")];

    static tdsApplicables = [new UiStaticType(1, "N", "Not applicable"),
    new UiStaticType(2, "A", "Applicable")];

    static tdsPrintings = [new UiStaticType(1, "S", "Seperate"),
    new UiStaticType(2, "A", "Applicable")];

    static form60YN = [new UiStaticType(1, "Y", "Yes"),
    new UiStaticType(2, "N", "No")];

    static form61YN = [new UiStaticType(1, "Y", "Yes"),
    new UiStaticType(2, "N", "No")];

    static customerTypes = [new UiStaticType(1, "R", "Regular"),
    new UiStaticType(2, "P", "Permanent")];

    static addressTypes = [new UiStaticType(1, "C", "Correspondence"),
    new UiStaticType(2, "P", "Permanent")];

    static documents = [new UiStaticType(1, "A", "Aadhar card"),
    new UiStaticType(2, "P", "PAN card"),
    new UiStaticType(3, "H", "Photo"),
    new UiStaticType(4, "S", "Signature"),
    new UiStaticType(5, "D", "Address Proof"),
    new UiStaticType(6, "I", "Id Proof"),
    new UiStaticType(7, "O", "Other")];
}