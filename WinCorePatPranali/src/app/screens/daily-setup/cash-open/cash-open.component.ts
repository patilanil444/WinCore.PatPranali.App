import { CurrencyPipe } from '@angular/common';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CashStatusModalComponent } from 'src/app/common/directives/cash-status/cash-status-modal/cash-status-modal.component';
import { UserRoleHeper } from 'src/app/common/utils/user-role-helper';
import { DailySetupService } from 'src/app/services/daily-setup/daily-setup.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-cash-open',
  templateUrl: './cash-open.component.html',
  styleUrls: ['./cash-open.component.css'],
  providers: [CurrencyPipe]
})
export class CashOpenComponent implements OnInit {

  cashOpenForm!: FormGroup;
  denominationNotes: any[] = [];
  UserId: number = 0;

  @Input() canLoadData: boolean;
  @ViewChild('cashStatusModal', { static: false }) cashStatusModal: CashStatusModalComponent

  constructor(private _sharedService: SharedService, private _toastrService: ToastrService,
    private _dailySetupService: DailySetupService
  ) { }

  ngOnInit(): void {
    this.UserId = this._sharedService.applicationUser.id;
    this.cashOpenForm = new FormGroup({
      totalCashOpenAmountText: new FormControl("0", []),
    });

    this.canLoadData = !this.canLoadData;
    this.retrieveDenominations();
    UserRoleHeper.initialiseUserRoles(this._sharedService.applicationUser);
  }

  isMainCashierUser() {
    return UserRoleHeper.isMainCashierUser();
  }

  retrieveDenominations() {
    let denominations = this._sharedService.uiDenominatons;
    denominations.forEach((d: any) => {
      if (d) {
        d.total = 0;
        d.quantity = 0;
      }
    });

    this.denominationNotes = denominations;
  }

  onAmountChange(value: any, index: number) {
    // Here you can handle any additional processing of the amount
    this.denominationNotes[index].total = value;
  }

  changeDenominationAmount(index: number) {
    let denominationNote = this.denominationNotes[index];
    if (denominationNote) {
      let quantity = denominationNote.quantity;
      denominationNote.total = parseInt(denominationNote.denomination_Value) * parseInt(quantity);
      //denominationNote.Total = new Intl.NumberFormat('en-IN',{ style: 'decimal' }).format(parseInt(denominationNote.denomination_Value) * parseInt(quantity));
      if (isNaN(parseFloat(denominationNote.total))) {
        denominationNote.total = "";
      }
    }

    let totalAmount = 0;
    this.denominationNotes.forEach((d: any) => {
      if (d.total) {
        totalAmount = totalAmount + parseFloat(d.total);
      }
    })

    this.cashOpenForm.patchValue({
      totalCashOpenAmountText: new Intl.NumberFormat('en-IN', { style: 'decimal' }).format(totalAmount)
    })
    //this.numberToIndianCurrencyWords(totalAmount);
  }

  clear() {
    this.denominationNotes.forEach((d: any) => {
      d.total = "0";
      d.quantity = "0"
    })

    this.cashOpenForm.patchValue({
      totalCashOpenAmountText: "0"
    })
  }

  // // Function to convert the number to Indian currency format
  // numberToIndianCurrencyWords(num: number): string {
  //   if (num === 0) return 'Zero Rupees';

  //   const belowTwenty = [
  //     'Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
  //     'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen',
  //     'Eighteen', 'Nineteen'
  //   ];

  //   const tens = [
  //     '', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'
  //   ];

  //   const units = [
  //     '', 'Hundred', 'Thousand', 'Lakh', 'Crore'
  //   ];

  //   const helper = (num: number, unitIndex: number): string => {
  //     if (num === 0) return '';
  //     if (num < 20) return belowTwenty[num] + ' ' + (unitIndex ? units[unitIndex] : '');
  //     if (num < 100) return tens[Math.floor(num / 10)] + ' ' + helper(num % 10, unitIndex);
  //     return belowTwenty[Math.floor(num / 100)] + ' Hundred ' + helper(num % 100, unitIndex + 1);
  //   };

  //   // Start building the words from the highest unit (Crore) and down
  //   let words = '';
  //   let unitIndex = 4; // Starting from Crore

  //   while (num > 0) {
  //     const unitValue = num % 1000;
  //     if (unitValue > 0) {
  //       words = helper(unitValue, unitIndex) + ' ' + words;
  //     }
  //     num = Math.floor(num / 1000);
  //     unitIndex--;
  //   }

  //   return words.trim() + ' Rupees';
  // }

  cashStatus() {
    this.cashStatusModal.open();
  }

  isValidCashOpening(): boolean {
    if (!this.denominationNotes || this.denominationNotes.length === 0) {
      return false;
    }
  
    let isValidQuantity = true;
    let total = 0;
  
    for (let d of this.denominationNotes) {
      const quantity = parseInt(d.quantity, 10);
      
      // Validate if quantity is a valid number
      if (isNaN(quantity)) {
        isValidQuantity = false;
      } else {
        total += parseFloat(d.total); // Accumulate total if quantity is valid
      }
    }
  
    // Return true if all quantities are valid and the total is computed
    return  total > 0  && isValidQuantity;
  }

  saveOpenCash() {

    if (this.isValidCashOpening()) {

      let cashOpeningBalances: any[] = [];
      this.denominationNotes.forEach((d: any) => {
        let cashOpeningBalance = {
          UserId: this._sharedService.applicationUser.id,
          TransactionDate: this._sharedService.getWorkOperationDate(),
          DenominationId: d.denomination_id,
          OpenQuantity: d.quantity
        };
        cashOpeningBalances.push(cashOpeningBalance);
      })

      this._dailySetupService.saveCashOpening(cashOpeningBalances).subscribe((data: any) => {

        if (data) {
          if (data.data.data && data.data.data.retId > 0) {
            this._toastrService.success("Cash opened successfully!", "Success");
            this.canLoadData = !this.canLoadData;
            this.clear();
          }
          else if (data.data.data && data.data.data.retId == -1) {
            this._toastrService.error("Cash is already opened for the day!", 'Error!');
          }
          else {
            this._toastrService.error("Error saving Cash!", 'Error!');
          }
        }
      })
    }
    else
    {
      this._toastrService.error("Please enter valid cash quantity!", 'Error!');
    }
  }

  get totalCashOpenAmountText() {
    return this.cashOpenForm.get('totalCashOpenAmountText')!;
  }
}
