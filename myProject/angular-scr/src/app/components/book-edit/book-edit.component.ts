import { Component, OnInit } from '@angular/core';
import { FlashMessagesService } from 'angular2-flash-messages';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

import { Book } from '../../models';
import { BookService } from '../../services/book.service';

@Component({
  selector: 'app-book-edit',
  templateUrl: './book-edit.component.html',
  styleUrls: ['./book-edit.component.css'],
})
export class BookEditComponent implements OnInit {
  id: string;
  book: Book = {};
  tags: string[];
  selected = {};

  constructor(
    private flashMessage: FlashMessagesService,
    private bookService: BookService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');

    if (!this.id)
      this.router.navigate(['PageNotFound'], { skipLocationChange: true });

    // Load available Tags
    this.bookService.getTags().subscribe((tags) => {
      this.tags = tags;
    });

    if (!this.isCreate()) {
      // Load Book
      this.bookService.getBook(this.id).subscribe((res) => {
        if (res.success) {
          this.book = <Book>res.result;

          // extract Tags
          if (this.book.tags) {
            this.book.tags.forEach((tag) => {
              this.selected[tag] = true;
            });
          }
        } else {
          this.router.navigate(['PageNotFound'], { skipLocationChange: true });
        }
      });
    }
  }

  save() {
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

    // Validate
    let execute = (error) => {
      if (error) {
        this.flashMessage.show(`Invalide Input: ${error.join('. ')}.`, {
          cssClass: 'alert-danger',
          timeout: 5000,
        });
      } else {
        if (this.isCreate()) {
          // Create
          this.bookService.createBook(this.book).subscribe((res) => {
            if (res.success) {
              // Navigate
              this.router.navigate([`/books/${(<Book>res.result)._id}`]);
            } else {
              let msg = (res.msg || res) + ':';
              if (res.error) {
                res.error.forEach((err) => {
                  msg += `${err.param}, `;
                });
              }

              this.flashMessage.show(`Couldn't save Data: ${msg}`, {
                cssClass: 'alert-danger',
                timeout: 5000,
              });
            }
          });
        } else {
          // Update
          this.bookService.saveBook(this.book, this.id).subscribe((res) => {
            if (res.success) {
              // Navigate
              this.router.navigate([`/books/${this.id}`]);
            } else {
              this.flashMessage.show(`Couldn't save Data: ${res.msg || res}.`, {
                cssClass: 'alert-danger',
                timeout: 5000,
              });
            }
          });
        }
      }
    };
    this.bookService.validateBook(this.book, execute);
  }

  cancle() {
    this.location.back();
  }

  private isCreate(): boolean {
    return this.id == 'new';
  }
}
