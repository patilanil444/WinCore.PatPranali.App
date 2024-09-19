import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtherAccountsComponent } from './other-accounts.component';

describe('OtherAccountsComponent', () => {
  let component: OtherAccountsComponent;
  let fixture: ComponentFixture<OtherAccountsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OtherAccountsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OtherAccountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
