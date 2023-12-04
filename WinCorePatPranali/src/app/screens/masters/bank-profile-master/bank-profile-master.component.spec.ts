import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankProfileMasterComponent } from './bank-profile-master.component';

describe('BankProfileMasterComponent', () => {
  let component: BankProfileMasterComponent;
  let fixture: ComponentFixture<BankProfileMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BankProfileMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BankProfileMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
