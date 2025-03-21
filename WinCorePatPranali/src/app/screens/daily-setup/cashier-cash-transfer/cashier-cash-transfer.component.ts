import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { retry } from 'rxjs';
import { DailtSetupDeclarations } from 'src/app/common/daily-setup-declarations';
import { UiUserRole } from 'src/app/common/models/common-ui-models';
import { UserRoleHeper } from 'src/app/common/utils/user-role-helper';
import { DailySetupService } from 'src/app/services/daily-setup/daily-setup.service';
import { SharedService } from 'src/app/services/shared.service';
import { UserService } from 'src/app/services/users/user.service';

@Component({
  selector: 'app-cashier-cash-transfer',
  templateUrl: './cashier-cash-transfer.component.html',
  styleUrls: ['./cashier-cash-transfer.component.css']
})
export class CashierCashTransferComponent implements OnInit {

  cashMainCashierForm!: FormGroup;
  cashSubCashierForm!: FormGroup;
  denominationNotes: any[] = [];
  UserId: number = 0;
  uiCashiers: any[] = [];
  isPayment = true;
  selectedUserId = 0;
  uiTransactionTypes: any[] = [];
  selectedTransactionType: string = "";

  mainCashierDenominations: any[] = [];
  mainCashierCashBalance: any[] = [];

  subCashierDenominations: any[] = [];
  subCashierCashBalance: any[] = [];

  constructor(private _sharedService: SharedService, private _userService: UserService,
    private _dailySetupService: DailySetupService, private _toastrService: ToastrService
  ) { }

  ngOnInit(): void {
    this.UserId = this._sharedService.applicationUser.id;
    this.uiTransactionTypes = DailtSetupDeclarations.transactionTypes;
    this.selectedTransactionType = this.uiTransactionTypes[0].code;
    this.cashMainCashierForm = new FormGroup({
      totalMainCashOpenAmountText: new FormControl("0", []),
    });

    this.cashSubCashierForm = new FormGroup({
      totalSubCashOpenAmountText: new FormControl("0", []),
    });

    this.retrieveDenominations();
    this.getBranchUsers();
    // retrive cash shatus
    this.getMainCashierCashStatus(this.UserId);
    UserRoleHeper.initialiseUserRoles(this._sharedService.applicationUser);
  }

  isMainCashierUser() {
    return UserRoleHeper.isMainCashierUser();
  }

  getBranchUsers() {
    this.uiCashiers = [];
    this.selectedUserId = 0;
    this._userService.getUsers(this._sharedService.applicationUser.branchId).subscribe((data: any) => {
      if (data) {
        if (data.statusCode == 200 && data.data.data) {
          var users = data.data.data;
          //this.uiUsers = users;
          if (users != null && users.length > 0) {
            this.uiCashiers = users.filter((u: any) => u.id != this.UserId && (u.todayAccess == UiUserRole.MAIN_CASHIER ||
              u.todayAccess == UiUserRole.SUB_CASHIER));
            if (this.uiCashiers && this.uiCashiers.length) {
              this.selectedUserId = this.uiCashiers[0].id;
              this.getSubCashierCashStatus(this.uiCashiers[0].id);
            }
          }
        }
      }
    })
  }

  getMainCashierCashStatus(userId: number) {
    if (userId > 0) {
      this.mainCashierDenominations = [];

      this._dailySetupService.getCashStatus(userId).subscribe((data: any) => {
        if (data) {
          this.mainCashierCashBalance = data.data.data;

          this.denominationNotes.forEach((d: any) => {
            let csDenomination: any = {
              denomination_id: d.denomination_id,
              denomination_Value: d.denomination_Value,
              denomination_Label: d.denomination_Label,
              total: 0,
              quantity: 0,
            };

            if (this.mainCashierCashBalance && this.mainCashierCashBalance.length) {
              let balance = this.mainCashierCashBalance.filter((c: any) => c.denominationId == csDenomination.denomination_id);
              if (balance && balance.length) {
                csDenomination.quantity = balance[0].balanceQuantity;
                csDenomination.total = parseInt(csDenomination.denomination_Value) * parseInt(csDenomination.quantity)
              }
            }

            this.mainCashierDenominations.push(csDenomination);
          });

          let totalAmount = 0;
          this.mainCashierDenominations.forEach((d: any) => {
            if (d.total) {
              totalAmount = totalAmount + parseFloat(d.total);
            }
          })

          this.cashMainCashierForm.patchValue({
            totalMainCashOpenAmountText: new Intl.NumberFormat('en-IN', { style: 'decimal' }).format(totalAmount)
          })
        }
      })
    }
  }

  getSubCashierCashStatus(userId: number) {
    if (userId > 0) {
      this.subCashierDenominations = [];
      this._dailySetupService.getCashStatus(userId).subscribe((data: any) => {
        if (data) {
          this.subCashierCashBalance = data.data.data;

          this.denominationNotes.forEach((d: any) => {
            let csDenomination: any = {
              denomination_id: d.denomination_id,
              denomination_Value: d.denomination_Value,
              denomination_Label: d.denomination_Label,
              total: 0,
              quantity: 0,
            };
            if (this.subCashierCashBalance && this.subCashierCashBalance.length) {
              let balance = this.subCashierCashBalance.filter((c: any) => c.denominationId == csDenomination.denomination_id);
              if (balance && balance.length) {
                csDenomination.quantity = balance[0].balanceQuantity;
                csDenomination.total = parseInt(csDenomination.denomination_Value) * parseInt(csDenomination.quantity)
              }
            }

            this.subCashierDenominations.push(csDenomination);
          })

          let totalAmount = 0;
          this.subCashierDenominations.forEach((d: any) => {
            if (d.total) {
              totalAmount = totalAmount + parseFloat(d.total);
            }
          })

          this.cashSubCashierForm.patchValue({
            totalSubCashOpenAmountText: new Intl.NumberFormat('en-IN', { style: 'decimal' }).format(totalAmount)
          })
        }
      })
    }
  }


  retrieveDenominations() {
    this.denominationNotes = this._sharedService.uiDenominatons;
  }

  clear() {

    this.selectedTransactionType = this.uiTransactionTypes[0].code;

    this.subCashierDenominations.forEach((d: any) => {
      d.total = "0";
      d.quantity = "0"
    })

    this.cashMainCashierForm.patchValue({
      totalMainCashOpenAmountText: "0"
    })

    this.cashSubCashierForm.patchValue({
      totalSubCashOpenAmountText: "0"
    })
  }

  changeTransactionType(event: any) {
    if (event) {
      if (this.selectedTransactionType == 'P') {
        this.isPayment = true;

        this.subCashierDenominations = this.subCashierDenominations.map((d: any) => ({
          ...d,
          quantity: 0,
          total: 0
        }));

        this.cashSubCashierForm.patchValue({
          totalSubCashOpenAmountText: new Intl.NumberFormat('en-IN', { style: 'decimal' }).format(0)
        })

        this.getMainCashierCashStatus(this.UserId);
      }
      else {
        this.isPayment = false;

        this.mainCashierDenominations = this.mainCashierDenominations.map((d: any) => ({
          ...d,
          quantity: 0,
          total: 0
        }));

        this.cashMainCashierForm.patchValue({
          totalMainCashOpenAmountText: new Intl.NumberFormat('en-IN', { style: 'decimal' }).format(0)
        })
        this.getSubCashierCashStatus(this.selectedUserId);
      }
    }
  }

  changeUser(event: any) {
    if (this.selectedUserId > 0 && this.selectedTransactionType == 'R') {
      this.getSubCashierCashStatus(this.selectedUserId);
    }
    else
    {
      this.subCashierDenominations.forEach((d: any) => {
        d.total = "0";
        d.quantity = "0"
      })
    }
  }

  changeMainCashierDenominationAmount(index: number) {
    let denominationNote = this.mainCashierDenominations[index];
    if (denominationNote) {
      let quantity = denominationNote.quantity;
      denominationNote.total = parseInt(denominationNote.denomination_Value) * parseInt(quantity);
      if (isNaN(parseFloat(denominationNote.total))) {
        denominationNote.total = "";
      }
    }

    let totalAmount = 0;
    this.mainCashierDenominations.forEach((d: any) => {
      if (d.total) {
        totalAmount = totalAmount + parseFloat(d.total);
      }
    })

    this.cashMainCashierForm.patchValue({
      totalMainCashOpenAmountText: new Intl.NumberFormat('en-IN', { style: 'decimal' }).format(totalAmount)
    })
  }

  changeSubCashierDenominationAmount(index: number) {
    let denominationNote = this.subCashierDenominations[index];
    if (denominationNote) {
      let quantity = denominationNote.quantity;
      denominationNote.total = parseInt(denominationNote.denomination_Value) * parseInt(quantity);
      if (isNaN(parseFloat(denominationNote.total))) {
        denominationNote.total = "";
      }
    }

    let totalAmount = 0;
    this.subCashierDenominations.forEach((d: any) => {
      if (d.total) {
        totalAmount = totalAmount + parseFloat(d.total);
      }
    })

    this.cashSubCashierForm.patchValue({
      totalSubCashOpenAmountText: new Intl.NumberFormat('en-IN', { style: 'decimal' }).format(totalAmount)
    })
  }

  isValidCashTransfer(denominationNotes: any): boolean {
    if (denominationNotes && denominationNotes.length === 0) {
      return false;
    }

    let isValidQuantity = true;
    let total = 0;

    for (let d of denominationNotes) {
      const quantity = parseInt(d.quantity, 10);

      // Validate if quantity is a valid number
      if (isNaN(quantity)) {
        isValidQuantity = false;
      } else {
        total += parseFloat(d.total); // Accumulate total if quantity is valid
      }
    }

    // Return true if all quantities are valid and the total is computed
    return total > 0 && isValidQuantity;
  }

  transferCash() {
    let cashTransferDetails: any = {
      FromCashierUserId: 0,
      ToCashierUserId: 0,
      CashDenominationBalances: []
    };

    let isValidSave = false;
    if (this.selectedTransactionType == 'P') {
      // Save for payment
      if (this.isValidCashTransfer(this.subCashierDenominations)) {
        cashTransferDetails.FromCashierUserId = this._sharedService.applicationUser.id;
        cashTransferDetails.ToCashierUserId = this.selectedUserId;

        this.subCashierDenominations.forEach((d: any) => {
          let cashDenominationBalance = {
            UserId: this.UserId,
            TransactionDate: this._sharedService.getWorkOperationDate(),
            DenominationId: d.denomination_id,
            OpenQuantity: d.quantity,
            BalanceQuantity: 0,
            DebitQuantity: 0,
            CreditQuantity: 0
          };

          cashTransferDetails.CashDenominationBalances.push(cashDenominationBalance);
        })

        isValidSave = true;
      }
      else {
        this._toastrService.error("Please enter valid cash quantity!", 'Error!');
      }
    }
    else {
      // Save for receipt
      if (this.isValidCashTransfer(this.mainCashierDenominations)) {
        cashTransferDetails.FromCashierUserId = this.selectedUserId;
        cashTransferDetails.ToCashierUserId = this._sharedService.applicationUser.id;
        this.mainCashierDenominations.forEach((d: any) => {
          let cashDenominationBalance = {
            UserId: this.UserId,
            TransactionDate: this._sharedService.getWorkOperationDate(),
            DenominationId: d.denomination_id,
            OpenQuantity: d.quantity,
            BalanceQuantity: 0,
            DebitQuantity: 0,
            CreditQuantity: 0
          };

          cashTransferDetails.CashDenominationBalances.push(cashDenominationBalance);
        })
        isValidSave = true;
      }
      else {
        this._toastrService.error("Please enter valid cash quantity!", 'Error!');
      }
    }

    if (isValidSave) {
      this._dailySetupService.saveCashTransfer(cashTransferDetails).subscribe((data: any) => {

        if (data) {
          if (data.data.data && data.data.data.retId > 0) {
            this._toastrService.success("Cash transfered successfully!", "Success");
  
            // Logic to reset page to payment mode
            this.isPayment = true;
            this.subCashierDenominations = this.subCashierDenominations.map((d: any) => ({
              ...d,
              quantity: 0,
              total: 0
            }));
            this.cashSubCashierForm.patchValue({
              totalSubCashOpenAmountText: new Intl.NumberFormat('en-IN', { style: 'decimal' }).format(0)
            })
            this.getMainCashierCashStatus(this.UserId);
  
          }
          else {
            this._toastrService.error("Error saving Cash!", 'Error!');
          }
        }
      })
    }
  }

  get totalMainCashOpenAmountText() {
    return this.cashMainCashierForm.get('totalMainCashOpenAmountText')!;
  }

  get totalSubCashOpenAmountText() {
    return this.cashSubCashierForm.get('totalSubCashOpenAmountText')!;
  }

}
