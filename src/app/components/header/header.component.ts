import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  isLogged: boolean = false;
  user;

  constructor(
    private usersService: UsersService
  ) { }

  ngOnInit() {
    this.usersService.isLogged.subscribe(res => {
      this.isLogged = res;
      if (this.isLogged) {
        this.user = JSON.parse(localStorage.getItem('user'));
      }
    }, err => {
      console.error('Error in header subscribe: ' + err)
    })
  }

  logout() {
    this.usersService.logout();
  }

}
