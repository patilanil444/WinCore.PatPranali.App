import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OverdraftAllotmentComponent } from './overdraft-allotment.component';

describe('OverdraftAllotmentComponent', () => {
  let component: OverdraftAllotmentComponent;
  let fixture: ComponentFixture<OverdraftAllotmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OverdraftAllotmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OverdraftAllotmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
