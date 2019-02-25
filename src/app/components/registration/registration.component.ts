import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { UsersService } from '../../services/users.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {
  fullname = '';
  email = '';
  password = '';
  confirmPassword = '';

  constructor(
    private usersService: UsersService,
    private toast: ToastrService,
    private router: Router
  ) {}

  ngOnInit() {
    this.reset();
  }

  register() {
    if (this.passwordsMatch()) {
      let user = {
        fullname: this.fullname,
        email: this.email,
        password: this.password
      }
      this.usersService.create(user).subscribe(res => {
        this.toast.success('Registration', 'SUCCESSFUL');
        setTimeout(() => { this.router.navigate(['/login'])}, 1000);
        this.reset();
      }, err => {
        this.toast.error('Registration', 'UNSUCCESSFUL');
        console.error('Error at registration: ' + err);
      })
    } else {
      this.toast.error('Check if you filled all field correctly', 'UNSUCCESSFUL');
      return false;
    }
  }

  passwordsMatch() {
    if (this.password == this.confirmPassword) return true;
    else return false;
  }

  reset() {
    this.fullname = '';
    this.email = '';
    this.password = '';
    this.confirmPassword = '';
  }

}
