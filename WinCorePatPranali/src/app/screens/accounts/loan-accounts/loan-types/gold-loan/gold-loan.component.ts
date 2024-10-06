import { DatePipe, formatDate } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AccountDeclarations } from 'src/app/common/account-declarations';
import { AccountsService } from 'src/app/services/accounts/accounts/accounts.service';

@Component({
  selector: 'app-gold-loan',
  templateUrl: './gold-loan.component.html',
  styleUrls: ['./gold-loan.component.css']
})
export class GoldLoanComponent implements OnInit {

  constructor(private _accountsService: AccountsService, private _toastrService: ToastrService,) { }

  goldForm!: FormGroup;
  goldLoanForm!: FormGroup;
  uigoldTypes: any[] = [];
  uiAddedGolds: any[] = [];

  uiGoldItems: any[] = [];
  uiChangesInInterestRateYN: any[] = [];

  @Input() uiDirectors: any[] = [];
  @Output() goldLoanDetails = new EventEmitter<any>();
  
  p_gold: number = 1;
  total_golds: number = 0;

  ngOnInit(): void {

    this.uiChangesInInterestRateYN = AccountDeclarations.changesInInterestRateYN;

    this.goldForm = new FormGroup({
      receiptNo: new FormControl("", [Validators.required]),
      goldType: new FormControl(0, [Validators.required]),
      grossWeight: new FormControl("", [Validators.required]),
      netWeight: new FormControl("", [Validators.required]),
      ratePerGram: new FormControl("", [Validators.required]),
      amount: new FormControl("", []),
    });

    this.goldLoanForm = new FormGroup({
      totalAmount: new FormControl(0, []),
    });

    this.getGoldTypes().then(result => {

    });
  }

  getGoldTypes() {
    return new Promise((resolve, reject) => {
      this._accountsService.getGoldTypes().subscribe((data: any) => {
        console.log(data);
        if (data) {
          this.uigoldTypes = data.data.data;
          this.goldForm.patchValue({
            goldType: this.uigoldTypes[0].id,
          })
          resolve(true);
        }
        else {
          resolve(false);
        }
      })
    })
  }

  calculateTotalAmount() {
    // validate gross and net weight
    if (this.netWeight.value && this.grossWeight.value) {
      if (parseFloat(this.grossWeight.value) < this.netWeight.value) {
        this._toastrService.error('Gross weight can not be less than net weight.', 'Error!');
        return;
      }
    }

    // calculate total amount
    if (this.netWeight.value && this.ratePerGram.value) {
      if (this.netWeight.value > 0 && this.ratePerGram.value > 0) {
        this.goldForm.patchValue({
          amount: parseFloat(this.netWeight.value) * parseFloat(this.ratePerGram.value),
        })
      }
      else {
        this.goldForm.patchValue({
          amount: 0,
        })
      }
    }
  }

  validGoldLoanForm() {
    if (this.goldForm.invalid) {
      for (const control of Object.keys(this.goldForm.controls)) {
        this.goldForm.controls[control].markAsTouched();
      }
      return false;
    }
    return true;
  }

  addGold() {
    if (this.validGoldLoanForm()) {

      let goldTypes = this.uigoldTypes.filter(gt => gt.id == this.goldType.value);
      if (goldTypes && goldTypes.length) {
        let goldItem = {
          receiptNo: this.receiptNo.value,
          goldType: this.goldType.value,
          goldTypeText: goldTypes[0].name,
          grossWeight: this.grossWeight.value,
          netWeight: this.netWeight.value,
          ratePerGram: this.ratePerGram.value,
          amount: (parseFloat(this.ratePerGram.value) * parseFloat(this.netWeight.value)).toFixed(2),
          //paidDate : formatDate(new Date(this.paidDate.value), 'yyyy-MM-dd', 'en')
        };

        this.uiAddedGolds.push(goldItem);

        this.calculateTotalGoldAmount();

        this.goldLoanDetails.emit(this.uiAddedGolds);

        this.clearGold();
      }
    }
    else {
      this._toastrService.error('Please enter mandatory fields in gold details.', 'Error!');
    }
  }

  calculateTotalGoldAmount() {
    let totalLoanAmount = 0;
    this.uiAddedGolds.forEach(item => {
      if (item.status != "D") {
        totalLoanAmount = totalLoanAmount + parseFloat(item.amount);
      }
    });

    this.goldLoanForm.patchValue({
      totalAmount: totalLoanAmount
    })
  }

  clearGold() {
    this.goldForm.patchValue({
      receiptNo: "",
      goldType: this.uigoldTypes[0].id,
      grossWeight: "",
      netWeight: "",
      ratePerGram: "",
      amount: "",
    });
  }
  goldIndexToDelete = 0;

  deleteGold(uiAddedGold: any, index: number) {
    if (uiAddedGold) {
      this.goldIndexToDelete = index;
    }
  }

  cancelDelete() {
    this.goldIndexToDelete = -1;
  }

  onDelete() {
    let goldIndexToDelete = this.goldIndexToDelete;
    if (goldIndexToDelete > -1) {

      let gold = this.uiAddedGolds[goldIndexToDelete];
      this.uiAddedGolds.splice(goldIndexToDelete, 1);
      if (gold) {
        gold.status = "D";
      }

      this.calculateTotalGoldAmount();
    }
  }

  ///

  get receiptNo() {
    return this.goldForm.get('receiptNo')!;
  }
  get goldType() {
    return this.goldForm.get('goldType')!;
  }
  get grossWeight() {
    return this.goldForm.get('grossWeight')!;
  }
  get netWeight() {
    return this.goldForm.get('netWeight')!;
  }
  get ratePerGram() {
    return this.goldForm.get('ratePerGram')!;
  }
  get amount() {
    return this.goldForm.get('amount')!;
  }

  get totalAmount() {
    return this.goldLoanForm.get('totalAmount')!;
  }

}
