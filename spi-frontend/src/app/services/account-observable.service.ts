import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { Account } from '../data/account';

@Injectable({
  providedIn: 'root'
})
export class AccountObservableService {

  private accSubject: Subject<Account>; 

  constructor() {
    this.accSubject = new Subject<Account>();
  }

  sendAccount(acc: Account): void {
    this.accSubject.next(acc);
  }

  resetForm(): void {
    this.accSubject.next(null);
  }

  getAccount(): Observable<any> {
    return this.accSubject.asObservable();
  }

}
