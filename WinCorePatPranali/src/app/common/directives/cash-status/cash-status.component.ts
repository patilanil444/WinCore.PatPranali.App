import { Component, ElementRef, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DailySetupService } from 'src/app/services/daily-setup/daily-setup.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-cash-status',
  templateUrl: './cash-status.component.html',
  styleUrls: ['./cash-status.component.css']
})
export class CashStatusComponent implements OnInit  {

  cashStatusForm!: FormGroup;
  denominationNotes: any[] = [];
  cashStatusDenominations: any[] = [];
  @Input() UserId: number;
  @Input() canLoadData: boolean;

  uiCashBalance: any[] = [];

  constructor(private _sharedService: SharedService, private _dailySetupService: DailySetupService) { }

  ngOnInit(): void {
    this.cashStatusForm = new FormGroup({
      totalCashOpenAmountText: new FormControl("", [])
    });

    this.retrieveDenominations();
    // retrieve cash status as per user
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['canLoadData']) {
      //if (this.canLoadData) {
        this.getCashStatus();
      //}
    }
  }

  retrieveDenominations() {

    let denominations = this._sharedService.uiDenominatons;
    this.denominationNotes = [];

    denominations.forEach((d: any) => {
      let newDenomination = {
        denomination_id: d.denomination_id,
        denomination_Value: d.denomination_Value,
        denomination_Label: d.denomination_Label,
        total: 0,
        quantity: 0,
      };
      this.denominationNotes.push(newDenomination);
    });
  }

  getCashStatus() {
    let userId = this.UserId;

    if (userId > 0) {
      this.cashStatusDenominations = [];
      this._dailySetupService.getCashStatus(userId).subscribe((data: any) => {
        if (data) {
          this.uiCashBalance = data.data.data;
          if (this.uiCashBalance && this.uiCashBalance.length) {
            this.denominationNotes.forEach((d: any) => {
              let csDenomination = d;
              let balance = this.uiCashBalance.filter((c: any) => c.denominationId == csDenomination.denomination_id);
              if (balance && balance.length) {
                csDenomination.quantity = balance[0].balanceQuantity;
                csDenomination.total = parseInt(csDenomination.denomination_Value) * parseInt(d.quantity)
              }
              else {
                csDenomination.quantity = 0;
                csDenomination.total = 0;
              }

              this.cashStatusDenominations.push(csDenomination);
            })
          }
          else {
            this.denominationNotes.forEach((d: any) => {
              let csDenomination = d;
              csDenomination.quantity = 0;
              csDenomination.total = 0;

              this.cashStatusDenominations.push(csDenomination);
            })
          }

          let totalAmount = 0;
          this.cashStatusDenominations.forEach((d: any) => {
            if (d.total) {
              totalAmount = totalAmount + parseFloat(d.total);
            }
          })

          this.cashStatusForm.patchValue({
            totalCashOpenAmountText: new Intl.NumberFormat('en-IN', { style: 'decimal' }).format(totalAmount)
          })
        }
      })
    }

  }

  get totalCashOpenAmountText() {
    return this.cashStatusForm.get('totalCashOpenAmountText')!;
  }
}
