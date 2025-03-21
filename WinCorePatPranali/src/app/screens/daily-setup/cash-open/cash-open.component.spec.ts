import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashOpenComponent } from './cash-open.component';

describe('CashOpenComponent', () => {
  let component: CashOpenComponent;
  let fixture: ComponentFixture<CashOpenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CashOpenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CashOpenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
