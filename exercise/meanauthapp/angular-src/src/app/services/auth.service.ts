import { Injectable, isDevMode } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';

import { User, APIResponse } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  authToken: any;
  user: any;

  apiServer = ''; // API Server = host Server
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  jwtHelper = new JwtHelperService();

  constructor(private http: HttpClient) {
    if (isDevMode()) {
      this.apiServer = 'http://localhost'; // in Dev Angular uses own Port
    }
  }

  registerUser(user: User) {
    return this.http
      .post<APIResponse>(
        `${this.apiServer}/users/register`,
        user,
        this.httpOptions
      )
      .pipe(catchError(this.errorHandler));
  }

  authenticateUser(user) {
    return this.http
      .post<APIResponse>(
        `${this.apiServer}/users/authenticate`,
        user,
        this.httpOptions
      )
      .pipe(catchError(this.errorHandler));
  }

  getProfile() {
    this.loadToken();
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.authToken,
    });
    return this.http.get<APIResponse>(`${this.apiServer}/users/profile`, {
      headers,
    });
  }

  storeUserData(token, user) {
    // id_token: angular loces by defauld there for the token
    localStorage.setItem('id_token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this.authToken = token;
    this.user = user;
  }

  logout() {
    this.authToken = null;
    this.user = null;
    localStorage.clear();
  }

  loggedIn() {
    this.loadToken();
    return !this.jwtHelper.isTokenExpired(this.authToken);
  }

  private loadToken() {
    const token = localStorage.getItem('id_token');
    this.authToken = token;
  }

  // Extract Body on Error
  private errorHandler(err) {
    return of(err.error);
  }
}
