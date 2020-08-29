import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Account } from '../data/account';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(private http: HttpClient) { }

  getUserAccounts(userId: number): Observable<any> {
    return this.http.get(`api/account/${userId}`);
  }

  createAccount(account: Account): Observable<any> {
    return this.http.post('api/account', account);
  }
}
