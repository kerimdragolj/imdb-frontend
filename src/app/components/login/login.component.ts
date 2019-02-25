import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  isLogged;
  email;
  password;

  constructor(
    private userService: UsersService,
    private router: Router,
    private toast: ToastrService
  ) {
    this.isLogged = this.userService.isLoggedIn();
  }

  ngOnInit() {
    if(this.isLogged) {
      this.router.navigate(['/']);
    }
  }

  login() {
    if(this.email && this.password) {
      this.userService.login(this.email, this.password).subscribe(res => {
        this.userService.storeData(res.accessToken);
        this.toast.success('Login', 'SUCCESSFULL', { timeOut: 800 });
      }, err => {
        this.toast.error('Login', 'UNSUCCESSFULL');
        console.error(err);
      })
    }
  }

  reset() {
    this.email = '';
    this.password = '';
  }

}
