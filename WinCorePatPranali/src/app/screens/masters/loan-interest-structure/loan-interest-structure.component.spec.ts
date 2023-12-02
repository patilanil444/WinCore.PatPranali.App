import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanInterestStructureComponent } from './loan-interest-structure.component';

describe('LoanInterestStructureComponent', () => {
  let component: LoanInterestStructureComponent;
  let fixture: ComponentFixture<LoanInterestStructureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoanInterestStructureComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoanInterestStructureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
