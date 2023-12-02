import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralLedgerMasterListComponent } from './general-ledger-master-list.component';

describe('GeneralLedgerMasterListComponent', () => {
  let component: GeneralLedgerMasterListComponent;
  let fixture: ComponentFixture<GeneralLedgerMasterListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeneralLedgerMasterListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralLedgerMasterListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
