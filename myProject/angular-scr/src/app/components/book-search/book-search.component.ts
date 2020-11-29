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
  book: Book = {};
  tags: string[];
  selected = {};

  constructor(
    private flashMessage: FlashMessagesService,
    private bookService: BookService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.bookService.getTags().subscribe((tags) => (this.tags = tags));
  }

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

    // insert Tags
    this.book.tags = [];
    for (const [key, value] of Object.entries(this.selected)) {
      if (value) this.book.tags.push(key);
    }

    // Clear empty Values
    this.book = this.bookService.clearBook(this.book);

    // Validate
    let execute = (error) => {
      if (error) {
        this.flashMessage.show(`Invalide Input: ${error.join('. ')}.`, {
          cssClass: 'alert-danger',
          timeout: 5000,
        });
      } else {
        this.router.navigate(['/books'], { queryParams: this.book });
      }
    };
    this.bookService.validateBook(this.book, execute);
  }

  clearForm() {
    this.book = {};
    console.log(this.selected);
  }
}
