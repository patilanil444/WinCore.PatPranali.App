import { HttpHeaders } from '@angular/common/http';
import { UiStaticType } from './models/common-ui-models';

export class GlobleDeclarations
{
  static apiBaseURL = "http://localhost:7230/";

  static addInterestToBal = [new UiStaticType(1, "Y", "Yes"), 
  new UiStaticType(2, "N", "No"),
  new UiStaticType(3, "Q", "2 Quarter principalise"),
  new UiStaticType(4, "E", "After expiry seperate")];

  static interestPostings = [new UiStaticType(1, "M", "Monthly"),
   new UiStaticType(2, "Q", "Quarterly"), 
   new UiStaticType(3, "H", "Half Yearly"), 
   new UiStaticType(4, "Y", "Yearly"), 
   new UiStaticType(5, "I", "Time of Installmanet"), 
   new UiStaticType(6, "A", "At the time of Maturity")];

  static rateForSpecials = [new UiStaticType(1, "S", "Same"), new UiStaticType(2, "E", "Extra/Less")];
  
  static calculateInterestAfter = [new UiStaticType(1, "N", "No Inerest after maturity"),
  new UiStaticType(2, "S", "Interest after maturity with same rate"),
  new UiStaticType(3, "Y", "Interest after maturity as on rate")];
  
  static maturityAtTheTimeOf = [new UiStaticType(1, "S", "Same type"),
  new UiStaticType(2, "D", "On completed days"),
  new UiStaticType(3, "M", "On completed months"),
  new UiStaticType(4, "B", "On months and days")];

  static calculateProvision01 = [new UiStaticType(1, "N", "No provision after expiry"),
  new UiStaticType(2, "S", "After expiry provision with same rate"),
  new UiStaticType(3, "F", "After expiry provision with fixed rate"),
  new UiStaticType(4, "Y", "After expiry provision with as on rate")];

  static calculateProvision02 = [new UiStaticType(1, "S", "With same type"),
  new UiStaticType(2, "D", "On completed days"),
  new UiStaticType(3, "M", "On completed months"),
  new UiStaticType(4, "B", "On months and days"),
  new UiStaticType(5, "C", "Current type")];

  static calculatePayable = [new UiStaticType(1, "N", "No payable"),
  new UiStaticType(2, "Y", "As per calculation"),
  new UiStaticType(3, "C", "As per RBI chart"),
  new UiStaticType(4, "F", "Fixed payable amount"),
  new UiStaticType(5, "M", "In multiple of")];

  static installmentPenal = [new UiStaticType(1, "N", "No installment penal"),
  new UiStaticType(2, "D", "Penal on days"),
  new UiStaticType(3, "M", "Penal on months")];

  static riCumulative01 = [new UiStaticType(1, "M", "Monthly cumulative"),
  new UiStaticType(2, "Q", "Quarterly cumulative"),
  new UiStaticType(3, "H", "Half yearly cumulative"),
  new UiStaticType(4, "Y", "Yearly cumulative"),
  new UiStaticType(5, "P", "Plain")];

  static installmentPenalAfter = [new UiStaticType(1, "D", "Days"),
  new UiStaticType(2, "M", "Months"),
  new UiStaticType(3, "I", "Installments")];

  static interestCalculationType = [new UiStaticType(1, "D", "Day wise"),
  new UiStaticType(2, "F", "Fort-night"),
  new UiStaticType(3, "M", "Monthly cumulative"),
  new UiStaticType(4, "Q", "Quarterly cumulative"),
  new UiStaticType(5, "B", "Month and Day wise")];

  static interestAfterMaturity = [new UiStaticType(1, "N", "No interest after maturity"),
  new UiStaticType(2, "S", "Interest after maturity with Same-Rate"),
  new UiStaticType(3, "E", "Interest after maturity with Extra-Rate")];

  static installmentCalculation = [new UiStaticType(1, "P", "Plain interest"),
  new UiStaticType(2, "R", "Reducing balance"),
  new UiStaticType(3, "C", "Compunding interest"),
  new UiStaticType(4, "Q", "Plain monthly interest"),
  new UiStaticType(5, "F", "Fort-nightly interest")];

  static extraInterestForCC = [new UiStaticType(1, "Y", "Yes"),
  new UiStaticType(2, "N", "No")];

  private static GetHeader() {
    const headers = new HttpHeaders();
    headers.set('Content-Type', 'application/json; charset=utf-8');
    return headers;
  }

  public static getHeaderOptions() {
    let header = this.GetHeader();
    return { headers: header };
  }
}