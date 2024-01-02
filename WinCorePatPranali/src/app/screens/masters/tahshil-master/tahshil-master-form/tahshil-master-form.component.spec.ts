import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TahshilMasterFormComponent } from './tahshil-master-form.component';

describe('TahshilMasterFormComponent', () => {
  let component: TahshilMasterFormComponent;
  let fixture: ComponentFixture<TahshilMasterFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TahshilMasterFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TahshilMasterFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
