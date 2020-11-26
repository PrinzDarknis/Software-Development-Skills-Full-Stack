import { Component, OnInit } from '@angular/core';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Router } from '@angular/router';

import { ValidateService } from '../../services/validate.service';
import { AuthService } from '../../services/auth.service';
import { User } from '../../interfaces';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  name: string;
  username: string;
  email: string;
  password: string;

  constructor(
    private validateService: ValidateService,
    private flashMessage: FlashMessagesService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  onRegisterSubmit() {
    const user: User = {
      name: this.name,
      username: this.username,
      email: this.email,
      password: this.password,
    };

    // Require Fields
    if (!this.validateService.validateRegister(user)) {
      this.flashMessage.show('Please fill in all fields', {
        cssClass: 'alert-danger',
        timeout: 3000,
      });
      return false;
    }

    // Check Email
    if (!this.validateService.validateEmail(user.email)) {
      this.flashMessage.show('Please use a valide email', {
        cssClass: 'alert-danger',
        timeout: 3000,
      });
      return false;
    }

    // Register User
    this.authService.registerUser(user).subscribe((data) => {
      console.log(data);

      if (data.success) {
        this.flashMessage.show('You are now registered and can log in', {
          cssClass: 'alert-success',
          timeout: 3000,
        });
        this.router.navigate(['/login']);
      } else {
        this.flashMessage.show('Something went wrong', {
          cssClass: 'alert-danger',
          timeout: 3000,
        });
        this.router.navigate(['/register']);
      }
    });
  }
}
