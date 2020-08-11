import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PaymentFlowComponent } from './components/payment-flow/payment-flow.component';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'payment-flow',
    pathMatch: 'full'
  },
  {
    path: 'payment-flow',
    component: PaymentFlowComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
