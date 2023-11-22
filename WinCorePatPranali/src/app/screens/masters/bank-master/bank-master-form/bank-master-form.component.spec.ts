import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankMasterFormComponent } from './bank-master-form.component';

describe('BankMasterFormComponent', () => {
  let component: BankMasterFormComponent;
  let fixture: ComponentFixture<BankMasterFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BankMasterFormComponent]
    });
    fixture = TestBed.createComponent(BankMasterFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
