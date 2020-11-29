import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';

import { UserService } from './user.service';
import { Book, User, APIResponse, validateISBN } from '../models';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  constructor(private userService: UserService, private http: HttpClient) {}

  validateBook(book: Book): string[] | null {
    let errors = [];

    // ISBN10
    if (book.ISBN10)
      if (book.ISBN10.length != 10 || !validateISBN(book.ISBN10))
        errors.push('Invalide ISBN10');

    // ISBN13
    if (book.ISBN13)
      if (book.ISBN13.length != 13 || !validateISBN(book.ISBN13))
        errors.push('Invalide ISBN13');

    // Tags

    if (errors.length > 0) return errors;
    else return null;
  }

  // Extract Body on Error
  private errorHandler(err) {
    return of(err.error);
  }
}
