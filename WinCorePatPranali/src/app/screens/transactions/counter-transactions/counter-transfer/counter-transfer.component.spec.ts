import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CounterTransferComponent } from './counter-transfer.component';

describe('CounterTransferComponent', () => {
  let component: CounterTransferComponent;
  let fixture: ComponentFixture<CounterTransferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CounterTransferComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CounterTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
