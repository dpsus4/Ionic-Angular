import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { map, tap } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { User } from "./user.model";

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  localId: string;
  expiresIn: string;
  registered?: boolean;
}

@Injectable({
  providedIn: "root",
})
export class AuthService {
  // private _userIsAuthenticated = true;
  private _user = new BehaviorSubject<User>(null);
  // private _token = new BehaviorSubject<string>();

  get userIsAuthenticated() {
    return this._user.asObservable().pipe(map((user) => !!user.token));
  }

  get userId() {
    return this._user.asObservable().pipe(
      map((user) => {
        if (user) {
          return user.id;
        } else {
          return null;
        }
      })
    );
    // return this._user.asObservable().pipe(
    //   map((user) => {
    //     if (user) {
    //       return !!user.token;
    //     } else {
    //       return false;
    //     }
    //   })
    // );
  }

  // set userIsAuthenticated(value: boolean) {
  //   this._userIsAuthenticated = value;
  // }

  constructor(private http: HttpClient) {}

  signup(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(``, {
        email: email,
        password: password,
        returnSecureToken: true,
      })
      .pipe(tap(this.setUserData.bind(this)));
  }

  login(email: string, password: string) {
    return this.http
      .post<AuthResponseData>("" + environment.firebaseAPIKey, {
        email: email,
        password: password,
      })
      .pipe(tap(this.setUserData.bind(this)));
  }

  logout() {
    this._user.next(null);
  }

  private setUserData(userData: AuthResponseData) {
    const expirationTime = new Date(
      new Date().getTime() + +userData.expiresIn * 1000
    );
    this._user.next(
      new User(
        userData.localId,
        userData.email,
        userData.idToken,
        expirationTime
      )
    );
  }
}
