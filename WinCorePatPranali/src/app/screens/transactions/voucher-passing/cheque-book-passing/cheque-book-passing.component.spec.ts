import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChequeBookPassingComponent } from './cheque-book-passing.component';

describe('ChequeBookPassingComponent', () => {
  let component: ChequeBookPassingComponent;
  let fixture: ComponentFixture<ChequeBookPassingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChequeBookPassingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChequeBookPassingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
