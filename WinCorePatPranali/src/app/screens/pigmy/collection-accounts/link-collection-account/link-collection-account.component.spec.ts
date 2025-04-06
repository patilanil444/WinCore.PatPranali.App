import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkCollectionAccountComponent } from './link-collection-account.component';

describe('LinkCollectionAccountComponent', () => {
  let component: LinkCollectionAccountComponent;
  let fixture: ComponentFixture<LinkCollectionAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LinkCollectionAccountComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkCollectionAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
