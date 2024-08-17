import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BackOfficeEntryComponent } from './back-office-entry.component';

describe('BackOfficeEntryComponent', () => {
  let component: BackOfficeEntryComponent;
  let fixture: ComponentFixture<BackOfficeEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BackOfficeEntryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BackOfficeEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
