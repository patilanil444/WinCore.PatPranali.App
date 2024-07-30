import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDailyRoleComponent } from './user-daily-role.component';

describe('UserDailyRoleComponent', () => {
  let component: UserDailyRoleComponent;
  let fixture: ComponentFixture<UserDailyRoleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserDailyRoleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserDailyRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
