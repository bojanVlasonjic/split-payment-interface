import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  /** Dummy authentication service */

  constructor() { }

  getAuthenticatedUser(): number {
    return +window.localStorage.getItem('userId');
  }

  setAuthenticatedUser(id: number) {
    window.localStorage.setItem('userId', id.toString());
  }
}
