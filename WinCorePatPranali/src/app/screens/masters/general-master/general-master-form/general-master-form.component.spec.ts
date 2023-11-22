import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralMasterFormComponent } from './general-master-form.component';

describe('GeneralMasterFormComponent', () => {
  let component: GeneralMasterFormComponent;
  let fixture: ComponentFixture<GeneralMasterFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GeneralMasterFormComponent]
    });
    fixture = TestBed.createComponent(GeneralMasterFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
