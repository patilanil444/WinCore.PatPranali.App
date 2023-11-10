import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PriorityFormComponent } from './priority-form.component';

describe('PriorityFormComponent', () => {
  let component: PriorityFormComponent;
  let fixture: ComponentFixture<PriorityFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PriorityFormComponent]
    });
    fixture = TestBed.createComponent(PriorityFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
