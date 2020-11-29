import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';

import { UserService } from './user.service';
import { User, APIResponse } from '../models';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  constructor(private userService: UserService, private http: HttpClient) {}

  // Extract Body on Error
  private errorHandler(err) {
    return of(err.error);
  }
}
