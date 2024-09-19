import { DatePipe, formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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

  constructor(private _accountsService: AccountsService,private _toastrService: ToastrService,) { }

  goldLoanForm!: FormGroup;
  uigoldTypes: any[] = [];
  uiAddedGolds: any[] = [];
  uiChangesInInterestRateYN: any[] = [];

  p_gold: number = 1;
  total_golds: number = 0;

  ngOnInit(): void {

    this.uiChangesInInterestRateYN = AccountDeclarations.changesInInterestRateYN;
    
    this.goldLoanForm = new FormGroup({
      receiptNo: new FormControl("", [Validators.required]),
      goldType: new FormControl(0, [Validators.required]),
      grossWeight: new FormControl("", [Validators.required]),
      netWeight: new FormControl("", [Validators.required]),
      ratePerGram: new FormControl("", [Validators.required]),
      periodInMonths: new FormControl("", [Validators.required]),
      paidDate: new FormControl(formatDate(new Date(Date.now()), 'yyyy-MM-dd', 'en'), []),
      //expiryDate: new FormControl(formatDate(new Date(Date.now()), 'yyyy-MM-dd', 'en'), []),
      maturityDate: new FormControl(formatDate(new Date(Date.now()), 'yyyy-MM-dd', 'en', 'dd/MM/yyyy'), []),
      
      // amount: new FormControl("", []),
    });

    this.maturityDate.disable();

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

  modifyMaturityDate()
  {
    if (this.paidDate.value && this.periodInMonths.value) {
      if (!isNaN(parseInt(this.periodInMonths.value)) && parseInt(this.periodInMonths.value) > 0) {
        let paidDate = new Date(this.paidDate.value);
        paidDate.setMonth(paidDate.getMonth() + parseInt(this.periodInMonths.value));
        
        this.goldLoanForm.patchValue({
          maturityDate: formatDate(paidDate, 'yyyy-MM-dd', 'en'),
        })
      }
      else
      {
        this._toastrService.warning('Invalid period or paid date!.', 'Warning!');
      }
    }
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
  get maturityDate() {
    return this.goldLoanForm.get('maturityDate')!;
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
  
  get changesInInterestApplicable() {
    return this.goldLoanForm.get('changesInInterestApplicable')!;
  }
}
