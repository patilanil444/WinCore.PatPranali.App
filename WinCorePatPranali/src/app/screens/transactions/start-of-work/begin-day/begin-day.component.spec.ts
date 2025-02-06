import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BeginDayComponent } from './begin-day.component';

describe('BeginDayComponent', () => {
  let component: BeginDayComponent;
  let fixture: ComponentFixture<BeginDayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BeginDayComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BeginDayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
