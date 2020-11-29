import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Book } from '../../models';
import { BookService } from '../../services/book.service';

@Component({
  selector: 'app-book-details',
  templateUrl: './book-details.component.html',
  styleUrls: ['./book-details.component.css'],
})
export class BookDetailsComponent implements OnInit {
  book: Book = {};

  constructor(
    private bookService: BookService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    let id = this.route.snapshot.paramMap.get('id');
    if (!id)
      this.router.navigate(['PageNotFound'], { skipLocationChange: true });

    this.bookService.getBook(id).subscribe((res) => {
      if (res.success) {
        this.book = <Book>res.result;
      } else {
        this.router.navigate(['PageNotFound'], { skipLocationChange: true });
      }
    });
  }
}
