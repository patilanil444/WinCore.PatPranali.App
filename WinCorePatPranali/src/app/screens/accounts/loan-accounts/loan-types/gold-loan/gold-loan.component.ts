import { DatePipe, formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AccountsService } from 'src/app/services/accounts/accounts/accounts.service';

@Component({
  selector: 'app-gold-loan',
  templateUrl: './gold-loan.component.html',
  styleUrls: ['./gold-loan.component.css']
})
export class GoldLoanComponent implements OnInit {

  constructor(private _accountsService: AccountsService,private _toastrService: ToastrService,) { }

  goldLoanForm!: FormGroup;
  uigoldTypes: any[] = [];
  uiAddedGolds: any[] = [];

  p_gold: number = 1;
  total_golds: number = 0;

  ngOnInit(): void {
    this.goldLoanForm = new FormGroup({
      receiptNo: new FormControl("", [Validators.required]),
      goldType: new FormControl(0, [Validators.required]),
      grossWeight: new FormControl("", [Validators.required]),
      netWeight: new FormControl("", [Validators.required]),
      ratePerGram: new FormControl("", [Validators.required]),
      periodInMonths: new FormControl("", [Validators.required]),
      paidDate: new FormControl(formatDate(new Date(Date.now()), 'yyyy-MM-dd', 'en'), []),
      //expiryDate: new FormControl(formatDate(new Date(Date.now()), 'yyyy-MM-dd', 'en'), []),
      expiryDate: new FormControl(new DatePipe('en-US').transform(new Date(Date.now()), 'dd/MM/yyyy'), []),

      
      // amount: new FormControl("", []),
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
          this.goldLoanForm.patchValue({
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

  validGoldLoanForm() {
    if (this.goldLoanForm.invalid) {
      for (const control of Object.keys(this.goldLoanForm.controls)) {
        this.goldLoanForm.controls[control].markAsTouched();
      }
      return false;
    }
    return true;
  }

  addGold()
  { 
    if (this.validGoldLoanForm()) {

      let goldTypes = this.uigoldTypes.filter(gt=>gt.id == this.goldType.value);
      if (goldTypes && goldTypes.length) {
        let goldItem = {
          receiptNo: this.receiptNo.value,
          goldType: this.goldType.value,
          goldTypeText: goldTypes[0].name,
          grossWeight: this.grossWeight.value,
          netWeight: this.netWeight.value,
          ratePerGram: this.ratePerGram.value,
          amount: (parseFloat(this.ratePerGram.value) * parseFloat(this.netWeight.value)).toFixed(2),
          paidDate : formatDate(new Date(this.paidDate.value), 'yyyy-MM-dd', 'en')
        };
  
        this.uiAddedGolds.push(goldItem);
      }
    }
    else
    {
      this._toastrService.error('Please enter mandatory fields in gold details.', 'Error!');
    }
  }

  clearGold()
  {

  }

  deleteGold(uiAddedGold: any, index: number)
  {

  }

  get periodInMonths() {
    return this.goldLoanForm.get('periodInMonths')!;
  }
  get expiryDate() {
    return this.goldLoanForm.get('expiryDate')!;
  }
  get receiptNo() {
    return this.goldLoanForm.get('receiptNo')!;
  }
  get goldType() {
    return this.goldLoanForm.get('goldType')!;
  }
  get grossWeight() {
    return this.goldLoanForm.get('grossWeight')!;
  }
  get netWeight() {
    return this.goldLoanForm.get('netWeight')!;
  }
  get ratePerGram() {
    return this.goldLoanForm.get('ratePerGram')!;
  }
  // get amount() {
  //   return this.goldLoanForm.get('amount')!;
  // }
  get paidDate() {
    return this.goldLoanForm.get('paidDate')!;
  }
}
