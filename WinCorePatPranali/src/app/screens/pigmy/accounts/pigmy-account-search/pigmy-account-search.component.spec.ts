import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PigmyAccountSearchComponent } from './pigmy-account-search.component';

describe('PigmyAccountSearchComponent', () => {
  let component: PigmyAccountSearchComponent;
  let fixture: ComponentFixture<PigmyAccountSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PigmyAccountSearchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PigmyAccountSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
