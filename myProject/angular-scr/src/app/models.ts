export interface User {
  name: string;
  username: string;
  email: string;
  password?: string;
  role?: string;
}

export interface APIResponse {
  success: boolean;
  msg: string;
  user: User;
  token: string;
  result: Book | Book[];
  error: [
    {
      msg: string;
      param: string;
    }
  ];
}

export interface Book {
  _id?: string;
  title?: string;
  author?: string;
  publischer?: string;
  year?: Number;
  ISBN10?: string;
  ISBN13?: string;
  category?: string;
  series?: string;
  language?: string;
  tags?: string[];
}

// Source: Derek Kurth @ https://stackoverflow.com/questions/11104439/how-do-i-check-if-an-input-contains-an-isbn-using-javascript
export function validateISBN(str) {
  var sum, weight, digit, check, i;

  str = str.replace(/[^0-9X]/gi, '');

  if (str.length != 10 && str.length != 13) {
    return false;
  }

  if (str.length == 13) {
    sum = 0;
    for (i = 0; i < 12; i++) {
      digit = parseInt(str[i]);
      if (i % 2 == 1) {
        sum += 3 * digit;
      } else {
        sum += digit;
      }
    }
    check = (10 - (sum % 10)) % 10;
    return check == str[str.length - 1];
  }

  if (str.length == 10) {
    weight = 10;
    sum = 0;
    for (i = 0; i < 9; i++) {
      digit = parseInt(str[i]);
      sum += weight * digit;
      weight--;
    }
    check = (11 - (sum % 11)) % 11;
    if (check == 10) {
      check = 'X';
    }
    return check == str[str.length - 1].toUpperCase();
  }
}

export function queryFromBook(book: Book): string {
  //Export Tags because Array
  let tags = book.tags;
  delete book.tags;

  //Object to Querry String, Source: https://attacomsian.com/blog/javascript-convert-object-to-query-string-parameters
  var query = Object.keys(book)
    .map(function (key) {
      return `${encodeURIComponent(key)}=${encodeURIComponent(book[key])}`;
    })
    .join('&');

  if (tags) {
    tags.forEach((tag) => {
      query += `&tags[]=${encodeURIComponent(tag)}`;
    });
  }

  return query;
}
