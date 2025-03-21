import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PigmyCollectionInfoComponent } from './pigmy-collection-info.component';

describe('PigmyCollectionInfoComponent', () => {
  let component: PigmyCollectionInfoComponent;
  let fixture: ComponentFixture<PigmyCollectionInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PigmyCollectionInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PigmyCollectionInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
