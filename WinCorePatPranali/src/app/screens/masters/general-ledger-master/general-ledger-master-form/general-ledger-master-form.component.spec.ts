import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralLedgerMasterFormComponent } from './general-ledger-master-form.component';

describe('GeneralLedgerMasterFormComponent', () => {
  let component: GeneralLedgerMasterFormComponent;
  let fixture: ComponentFixture<GeneralLedgerMasterFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeneralLedgerMasterFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralLedgerMasterFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
