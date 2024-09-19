import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoAccSearchComponent } from './auto-acc-search.component';

describe('AutoAccSearchComponent', () => {
  let component: AutoAccSearchComponent;
  let fixture: ComponentFixture<AutoAccSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AutoAccSearchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AutoAccSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
