import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import { UserService } from './user.service';
import { Book, APIResponse, validateISBN, queryFromBook } from '../models';

@Injectable({
  providedIn: 'root',
})
export class BookService implements OnInit {
  private tags: string[];

  constructor(private userService: UserService, private http: HttpClient) {}

  ngOnInit(): void {
    this.loadTagsFromServer();
  }

  getTags(): Observable<string[]> {
    if (!this.tags) return this.loadTagsFromServer();
    return of(this.tags);
  }

  getBook(id: string): Observable<APIResponse> {
    return this.http
      .get<APIResponse>(
        `${this.userService.apiServer}/api/books/${id}`,
        this.userService.httpOptions
      )
      .pipe(catchError(this.errorHandler));
  }

  getBooks(filter: Book): Observable<APIResponse> {
    let params = queryFromBook(filter);
    return this.http
      .get<APIResponse>(
        `${this.userService.apiServer}/api/books?${params}`,
        this.userService.httpOptions
      )
      .pipe(catchError(this.errorHandler));
  }

  saveBook(book: Book, id: string): Observable<APIResponse> {
    return this.http
      .patch<APIResponse>(
        `${this.userService.apiServer}/api/books/${id}`,
        book,
        this.userService.httpOptions
      )
      .pipe(catchError(this.errorHandler));
  }

  createBook(book: Book): Observable<APIResponse> {
    return this.http
      .post<APIResponse>(
        `${this.userService.apiServer}/api/books/`,
        book,
        this.userService.httpOptions
      )
      .pipe(catchError(this.errorHandler));
  }

  deleteBook(id: string): Observable<APIResponse> {
    return this.http
      .delete<APIResponse>(
        `${this.userService.apiServer}/api/books/${id}`,
        this.userService.httpOptions
      )
      .pipe(catchError(this.errorHandler));
  }

  // callback because, needs to wait for Tags
  validateBook(book: Book, callback): void {
    let validate = (tags) => {
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
      if (book.tags)
        book.tags.forEach((tag) => {
          if (!tags.includes(tag)) errors.push(`Invalide Tag [${tag}]`);
        });

      if (errors.length > 0) return callback(errors);
      else return callback(null);
    };

    if (!this.tags) this.loadTagsFromServer().subscribe(validate);
    else validate(this.tags);
  }

  clearBook(book: Book): Book {
    let newBook = {};

    // Clear empty Values
    Object.keys(book).forEach((key) => {
      if (book[key]) newBook[key] = book[key];
    });

    // Tags
    return newBook;
  }

  private loadTagsFromServer(): Observable<string[]> {
    let obgs = this.http
      .get<APIResponse>(
        `${this.userService.apiServer}/api/books/tags`,
        this.userService.httpOptions
      )
      .pipe(catchError(this.errorHandler));
    obgs.subscribe((tags) => (this.tags = tags));
    return obgs;
  }

  // Extract Body on Error
  private errorHandler(err) {
    console.log(err);

    return of(err.error);
  }
}
