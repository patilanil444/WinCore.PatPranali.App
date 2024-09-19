import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BalanceCertificateComponent } from './balance-certificate.component';

describe('BalanceCertificateComponent', () => {
  let component: BalanceCertificateComponent;
  let fixture: ComponentFixture<BalanceCertificateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BalanceCertificateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BalanceCertificateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
