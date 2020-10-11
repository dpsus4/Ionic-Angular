import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _userIsAuthenticated = false;

  get userIsAuthenticated() {
    return this._userIsAuthenticated;
  }

  set userIsAuthenticated(value: boolean) {
    this._userIsAuthenticated = value;
  }

  constructor() { }

  login() {
    this.userIsAuthenticated = true;
  }

  logout() {
    this.userIsAuthenticated = false;
  }
}
