import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DistrictMasterFormComponent } from './district-master-form.component';

describe('DistrictMasterFormComponent', () => {
  let component: DistrictMasterFormComponent;
  let fixture: ComponentFixture<DistrictMasterFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DistrictMasterFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DistrictMasterFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
