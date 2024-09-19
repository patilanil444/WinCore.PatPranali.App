import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChequeBookIssueComponent } from './cheque-book-issue.component';

describe('ChequeBookIssueComponent', () => {
  let component: ChequeBookIssueComponent;
  let fixture: ComponentFixture<ChequeBookIssueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChequeBookIssueComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChequeBookIssueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
