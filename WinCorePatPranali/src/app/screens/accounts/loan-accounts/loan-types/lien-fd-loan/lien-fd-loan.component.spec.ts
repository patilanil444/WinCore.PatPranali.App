import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LienFdLoanComponent } from './lien-fd-loan.component';

describe('LienFdLoanComponent', () => {
  let component: LienFdLoanComponent;
  let fixture: ComponentFixture<LienFdLoanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LienFdLoanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LienFdLoanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
