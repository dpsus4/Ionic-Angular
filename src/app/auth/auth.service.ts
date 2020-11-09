import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _userIsAuthenticated = true;
  private _userId = 'xyz';

  get userIsAuthenticated() {
    return this._userIsAuthenticated;
  }

  get userId() {
    return this._userId;
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
