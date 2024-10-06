import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanSecurityComponent } from './loan-security.component';

describe('LoanSecurityComponent', () => {
  let component: LoanSecurityComponent;
  let fixture: ComponentFixture<LoanSecurityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoanSecurityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoanSecurityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
