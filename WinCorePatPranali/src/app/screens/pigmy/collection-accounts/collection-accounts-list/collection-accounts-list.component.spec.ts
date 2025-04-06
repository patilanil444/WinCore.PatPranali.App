import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionAccountsListComponent } from './collection-accounts-list.component';

describe('CollectionAccountsListComponent', () => {
  let component: CollectionAccountsListComponent;
  let fixture: ComponentFixture<CollectionAccountsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CollectionAccountsListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectionAccountsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
