import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PassingInfoComponent } from './passing-info.component';

describe('PassingInfoComponent', () => {
  let component: PassingInfoComponent;
  let fixture: ComponentFixture<PassingInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PassingInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PassingInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
