import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralMasterListComponent } from './general-master-list.component';

describe('GeneralMasterListComponent', () => {
  let component: GeneralMasterListComponent;
  let fixture: ComponentFixture<GeneralMasterListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GeneralMasterListComponent]
    });
    fixture = TestBed.createComponent(GeneralMasterListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
