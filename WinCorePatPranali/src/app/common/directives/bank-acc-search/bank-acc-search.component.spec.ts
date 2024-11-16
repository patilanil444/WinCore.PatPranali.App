import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankAccSearchComponent } from './bank-acc-search.component';

describe('BankAccSearchComponent', () => {
  let component: BankAccSearchComponent;
  let fixture: ComponentFixture<BankAccSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BankAccSearchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BankAccSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
