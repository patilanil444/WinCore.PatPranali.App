import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralLedgerMasterComponent } from './general-ledger-master.component';

describe('GeneralLedgerMasterComponent', () => {
  let component: GeneralLedgerMasterComponent;
  let fixture: ComponentFixture<GeneralLedgerMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeneralLedgerMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralLedgerMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
