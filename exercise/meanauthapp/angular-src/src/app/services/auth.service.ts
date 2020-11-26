import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { User, APIResponse } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  authToken: any;
  user: any;

  apiServer = 'http://localhost';
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  constructor(private http: HttpClient) {}

  registerUser(user: User) {
    return this.http.post<APIResponse>(
      `${this.apiServer}/users/register`,
      user,
      this.httpOptions
    );
  }
}
