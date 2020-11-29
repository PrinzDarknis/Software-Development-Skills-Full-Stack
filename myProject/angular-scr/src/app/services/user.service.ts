import { Injectable, isDevMode } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';

import { User, APIResponse } from '../models';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  authToken: string;
  user: User;

  apiServer = '';
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };
  jwtHelper = new JwtHelperService();

  constructor(private http: HttpClient) {
    if (isDevMode()) {
      this.apiServer = 'http://localhost'; // in Dev Angular uses own Port
    }

    this.loadToken();
  }

  registerUser(user: User): Observable<APIResponse> {
    return this.http
      .post<APIResponse>(
        `${this.apiServer}/api/users/register`,
        user,
        this.httpOptions
      )
      .pipe(catchError(this.errorHandler));
  }

  getProfile(): Observable<APIResponse> {
    this.loadToken();
    return this.http
      .get<APIResponse>(`${this.apiServer}/api/users/profile`, this.httpOptions)
      .pipe(catchError(this.errorHandler));
  }

  loginUser(username: string, password: string): Observable<APIResponse> {
    return this.http
      .post<APIResponse>(
        `${this.apiServer}/api/users/authenticate`,
        { username, password },
        this.httpOptions
      )
      .pipe(
        tap((res) => {
          // Save Data
          localStorage.setItem('jwt', res.token);
          localStorage.setItem('user', JSON.stringify(res.user));
          this.authToken = res.token;
          this.user = res.user;
        }),
        catchError(this.errorHandler)
      );
  }

  logout(): void {
    this.authToken = null;
    this.user = null;
    localStorage.clear();
    this.httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
  }

  loggedIn(): boolean {
    return !this.jwtHelper.isTokenExpired(this.authToken);
  }

  private loadToken(): void {
    let token = localStorage.getItem('jwt');
    this.authToken = token;

    if (this.loggedIn()) {
      this.httpOptions.headers = new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: this.authToken,
      });
    }

    try {
      let user = localStorage.getItem('user');
      this.user = JSON.parse(user);
    } catch {}
  }

  // Extract Body on Error
  private errorHandler(err) {
    return of(err.error);
  }
}
