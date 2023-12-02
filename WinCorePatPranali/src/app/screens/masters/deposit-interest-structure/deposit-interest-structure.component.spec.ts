import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepositInterestStructureComponent } from './deposit-interest-structure.component';

describe('DepositInterestStructureComponent', () => {
  let component: DepositInterestStructureComponent;
  let fixture: ComponentFixture<DepositInterestStructureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DepositInterestStructureComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DepositInterestStructureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
