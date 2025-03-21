import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PigmyEntryComponent } from './pigmy-entry.component';

describe('PigmyEntryComponent', () => {
  let component: PigmyEntryComponent;
  let fixture: ComponentFixture<PigmyEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PigmyEntryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PigmyEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
