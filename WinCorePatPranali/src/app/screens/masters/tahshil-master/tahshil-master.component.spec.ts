import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TahshilMasterComponent } from './tahshil-master.component';

describe('TahshilMasterComponent', () => {
  let component: TahshilMasterComponent;
  let fixture: ComponentFixture<TahshilMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TahshilMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TahshilMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
