import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TahshilMasterListComponent } from './tahshil-master-list.component';

describe('TahshilMasterListComponent', () => {
  let component: TahshilMasterListComponent;
  let fixture: ComponentFixture<TahshilMasterListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TahshilMasterListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TahshilMasterListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
