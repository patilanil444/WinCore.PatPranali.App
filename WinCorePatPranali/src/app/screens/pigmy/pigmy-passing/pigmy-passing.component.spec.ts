import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PigmyPassingComponent } from './pigmy-passing.component';

describe('PigmyPassingComponent', () => {
  let component: PigmyPassingComponent;
  let fixture: ComponentFixture<PigmyPassingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PigmyPassingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PigmyPassingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
