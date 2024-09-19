import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccSearchComponent } from './acc-search.component';

describe('AccSearchComponent', () => {
  let component: AccSearchComponent;
  let fixture: ComponentFixture<AccSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccSearchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
