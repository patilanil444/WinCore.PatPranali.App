import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchMasterListComponent } from './branch-master-list.component';

describe('BranchMasterListComponent', () => {
  let component: BranchMasterListComponent;
  let fixture: ComponentFixture<BranchMasterListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BranchMasterListComponent]
    });
    fixture = TestBed.createComponent(BranchMasterListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
