import { Component, OnInit } from '@angular/core';
import { FlashMessagesService } from 'angular2-flash-messages';
import { ActivatedRoute, Router } from '@angular/router';

import { Book } from '../../models';
import { BookService } from '../../services/book.service';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.css'],
})
export class BooksComponent implements OnInit {
  books: Book[];

  constructor(
    private flashMessage: FlashMessagesService,
    private bookService: BookService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      let filter: Book = { ...params };
      if (filter.tags && !Array.isArray(filter.tags))
        filter.tags = [filter.tags];
      filter = this.bookService.clearBook(filter);

      let execute = (error) => {
        if (error) {
          this.flashMessage.show(`Invalide Input: ${error.join('. ')}.`, {
            cssClass: 'alert-danger',
            timeout: 5000,
          });
          this.router.navigate(['/PageNotFound']);
        } else {
          this.bookService.getBooks(filter).subscribe((res) => {
            if (res.success) {
              let result = <Book[]>res.result;
              if (result.length > 0) this.books = result;
            } else {
              this.flashMessage.show(`Cann't get Books: ${res.msg}.`, {
                cssClass: 'alert-danger',
                timeout: 5000,
              });
            }
          });
        }
      };

      this.bookService.validateBook(filter, execute);
    });
  }
}
