import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PaymentSplit } from '../data/payment-split';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentSplitService {

  constructor(private http: HttpClient) { }

  createPaymentSplit(paySplit: PaymentSplit): Observable<any> {
    return this.http.post('api/payment-split', paySplit);
  }

  updatePaymentSplit(paySplit: PaymentSplit): Observable<any> {
    return this.http.put('api/payment-split', paySplit);
  }
}
