import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashStatusModalComponent } from './cash-status-modal.component';

describe('CashStatusModalComponent', () => {
  let component: CashStatusModalComponent;
  let fixture: ComponentFixture<CashStatusModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CashStatusModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CashStatusModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
