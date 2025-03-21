import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PigmyAccountFormComponent } from './pigmy-account-form.component';

describe('PigmyAccountFormComponent', () => {
  let component: PigmyAccountFormComponent;
  let fixture: ComponentFixture<PigmyAccountFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PigmyAccountFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PigmyAccountFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
