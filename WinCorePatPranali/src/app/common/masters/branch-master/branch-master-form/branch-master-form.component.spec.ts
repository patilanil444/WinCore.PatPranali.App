import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchMasterFormComponent } from './branch-master-form.component';

describe('BranchMasterFormComponent', () => {
  let component: BranchMasterFormComponent;
  let fixture: ComponentFixture<BranchMasterFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BranchMasterFormComponent]
    });
    fixture = TestBed.createComponent(BranchMasterFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
