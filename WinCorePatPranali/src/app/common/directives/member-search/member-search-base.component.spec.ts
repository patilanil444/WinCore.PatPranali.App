import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberSearchBaseComponent } from './member-search-base.component';

describe('MemberSearchComponent', () => {
  let component: MemberSearchBaseComponent;
  let fixture: ComponentFixture<MemberSearchBaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MemberSearchBaseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberSearchBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
