import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppRouterComponent } from './app-router.component';

describe('AppRouterComponent', () => {
  let component: AppRouterComponent;
  let fixture: ComponentFixture<AppRouterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AppRouterComponent]
    });
    fixture = TestBed.createComponent(AppRouterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
