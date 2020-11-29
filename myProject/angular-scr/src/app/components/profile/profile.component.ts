import { Component, OnInit } from '@angular/core';

import { UserService } from '../../services/user.service';
import { User } from '../../models';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  user: User;

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.userService.getProfile().subscribe((data) => {
      if (data.success) this.user = data.user;
    });
  }
}
