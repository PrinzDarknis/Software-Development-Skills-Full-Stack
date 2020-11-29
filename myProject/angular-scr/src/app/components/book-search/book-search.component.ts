import { Component, OnInit } from '@angular/core';
import { FlashMessagesService } from 'angular2-flash-messages';
import { ActivatedRoute, Router } from '@angular/router';

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
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Load available Tags
    this.bookService.getTags().subscribe((tags) => {
      this.tags = tags;
    });

    // Load Values from URL
    this.route.queryParams.subscribe((params) => {
      let filter: Book = { ...params };
      if (filter.tags && !Array.isArray(filter.tags))
        filter.tags = [filter.tags];
      filter = this.bookService.clearBook(filter);

      this.book = filter;

      // Tags
      if (filter.tags) {
        filter.tags.forEach((tag) => {
          this.selected[tag] = true;
        });
      }
    });
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
    this.selected = {};
  }
}
