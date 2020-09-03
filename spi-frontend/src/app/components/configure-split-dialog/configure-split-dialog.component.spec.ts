import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigureSplitDialogComponent } from './configure-split-dialog.component';

describe('ConfigureSplitDialogComponent', () => {
  let component: ConfigureSplitDialogComponent;
  let fixture: ComponentFixture<ConfigureSplitDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigureSplitDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigureSplitDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
