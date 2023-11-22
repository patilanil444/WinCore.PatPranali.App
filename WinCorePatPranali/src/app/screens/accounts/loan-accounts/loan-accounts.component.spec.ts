import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanAccountsComponent } from './loan-accounts.component';

describe('LoanAccountsComponent', () => {
  let component: LoanAccountsComponent;
  let fixture: ComponentFixture<LoanAccountsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoanAccountsComponent]
    });
    fixture = TestBed.createComponent(LoanAccountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
