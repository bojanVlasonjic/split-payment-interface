import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentFlowComponent } from './payment-flow.component';

describe('PaymentFlowComponent', () => {
  let component: PaymentFlowComponent;
  let fixture: ComponentFixture<PaymentFlowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentFlowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentFlowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
