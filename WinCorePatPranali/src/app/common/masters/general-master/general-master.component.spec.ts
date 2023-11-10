import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralMasterComponent } from './general-master.component';

describe('GeneralMasterComponent', () => {
  let component: GeneralMasterComponent;
  let fixture: ComponentFixture<GeneralMasterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GeneralMasterComponent]
    });
    fixture = TestBed.createComponent(GeneralMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
