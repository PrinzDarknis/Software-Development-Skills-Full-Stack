import { Component, OnInit } from '@angular/core';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Router } from '@angular/router';

import { Book } from '../../models';
import { BookService } from '../../services/book.service';

@Component({
  selector: 'app-book-search',
  templateUrl: './book-search.component.html',
  styleUrls: ['./book-search.component.css'],
})
export class BookSearchComponent implements OnInit {
  isCollapse: boolean = true;
  book: Book = {
    tags: ['harem', 'katze'],
  };

  constructor(
    private flashMessage: FlashMessagesService,
    private bookService: BookService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  onSearchSubmit() {
    // Trim
    if (this.book.title) this.book.title = this.book.title.trim();
    if (this.book.author) this.book.author = this.book.author.trim();
    if (this.book.publischer)
      this.book.publischer = this.book.publischer.trim();
    if (this.book.ISBN10) this.book.ISBN10 = this.book.ISBN10.trim();
    if (this.book.ISBN13) this.book.ISBN13 = this.book.ISBN13.trim();
    if (this.book.category) this.book.category = this.book.category.trim();
    if (this.book.series) this.book.series = this.book.series.trim();
    if (this.book.language) this.book.language = this.book.language.trim();

    // Validate
    let error = this.bookService.validateBook(this.book);
    if (error) {
      this.flashMessage.show(`Invalide Input: ${error.join('. ')}.`, {
        cssClass: 'alert-danger',
        timeout: 5000,
      });
      return false;
    } else {
      this.router.navigate(['/products'], { queryParams: this.book });
      // let book = this.book;
      // Export Tags because Array
      // let tags = book.tags;
      // delete book.tags;

      // Object to Querry String, Source: https://attacomsian.com/blog/javascript-convert-object-to-query-string-parameters
      // var query = Object.keys(book)
      //   .map(function (key) {
      //     return `${encodeURIComponent(key)}=${encodeURIComponent(book[key])}`;
      //   })
      //   .join('&');

      // if (tags) {
      //   tags.forEach((tag) => {
      //     query += `&tags[]=${encodeURIComponent(tag)}`;
      //   });
      // }

      // this.router.navigateByUrl(`/books?${query}`);
    }
  }

  clearForm() {
    this.book = {};
  }
}
