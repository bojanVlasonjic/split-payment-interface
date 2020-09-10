import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageSplitComponent } from './manage-split.component';

describe('ManageSplitComponent', () => {
  let component: ManageSplitComponent;
  let fixture: ComponentFixture<ManageSplitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageSplitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageSplitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
