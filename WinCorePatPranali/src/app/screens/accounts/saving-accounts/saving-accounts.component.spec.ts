import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SavingAccountsComponent } from './saving-accounts.component';

describe('SavingAccountsComponent', () => {
  let component: SavingAccountsComponent;
  let fixture: ComponentFixture<SavingAccountsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SavingAccountsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SavingAccountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
