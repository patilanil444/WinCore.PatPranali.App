import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-standing-instructions-form',
  templateUrl: './standing-instructions-form.component.html',
  styleUrls: ['./standing-instructions-form.component.css']
})
export class StandingInstructionsFormComponent implements OnInit {

  standingInstructionsForm!: FormGroup;

  uiFilteredGeneralLedgers : any = [];
  uiBranches : any = [];
  isResetAccountSearch = true;

  constructor() { }

  ngOnInit(): void {
  }


  getAccounts(accountData:any)
  {
    
  }
}
