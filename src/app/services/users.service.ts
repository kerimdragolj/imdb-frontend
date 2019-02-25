import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { JwtHelper, tokenNotExpired } from 'angular2-jwt';
import { Router } from "@angular/router";
import { AppSettings } from '../app.settings';
import 'rxjs/add/operator/map';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class UsersService {
  private jwtHelper: JwtHelper = new JwtHelper();
  private dataSource = new BehaviorSubject<any>(false)
  isLogged = this.dataSource.asObservable();

  constructor(
    private http: Http,
    private router: Router,
  ) {
    if(this.isLoggedIn()) {
      this.dataSource.next(true);
    }
  }

  login(email, password) {
    var user = {
      strategy: 'local',
      email: email,
      password: password
    }
    return this.http.post(AppSettings.API_ENDPOINT + '/authentication', user).map(res => res.json());
  }

  storeData(token) {
    localStorage.setItem('feathers-jwt', token);
    this.jwtHelper.decodeToken(token).userId

    this.getUser(this.jwtHelper.decodeToken(token).userId).subscribe(res => {
      localStorage.setItem('user', JSON.stringify(res));
      this.dataSource.next(true);
      setTimeout(() => { this.router.navigate(['/']) }, 1000);
    }, err => {
      console.error('Error in user service at loading logged user data: ' + err);
    })
  }

  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('feathers-jwt');
    this.dataSource.next(false);
  }

  isLoggedIn() {
    return tokenNotExpired('feathers-jwt');
  }

  getUser(id) {
    let header = new Headers();
    let token = localStorage.getItem('feathers-jwt');
    header.append('Content-Type', 'application/json');
    header.append('Authorization', 'bearer ' + token);

    return this.http.get(AppSettings.API_ENDPOINT + '/users/' + id , { headers: header}).map(res => res.json());
  }

  findAllUsers() {
    let header = new Headers();
    let token = localStorage.getItem('feathers-jwt');
    header.append('Content-Type', 'application/json');
    header.append('Authorization', 'bearer ' + token);

    return this.http.get(AppSettings.API_ENDPOINT + '/users', { headers: header}).map(res => res.json());
  }

  create(user) {
    let header = new Headers();
    header.append('Content-Type', 'application/json');

    return this.http.post(AppSettings.API_ENDPOINT + '/users', user, { headers: header}).map(res => res.json());
  }

  update(user, id) {
    let header = new Headers();
    let token = localStorage.getItem('feathers-jwt');
    header.append('Content-Type', 'application/json');
    header.append('Authorization', 'bearer ' + token);

    return this.http.patch(AppSettings.API_ENDPOINT + '/users/' + id, user, { headers: header}).map(res => res.json());
  }

  delete(id) {
    let header = new Headers();
    let token = localStorage.getItem('feathers-jwt');
    header.append('Content-Type', 'application/json');
    header.append('Authorization', 'bearer ' + token);

    return this.http.get(AppSettings.API_ENDPOINT + '/users/' + id, { headers: header}).map(res => res.json());
  }
}
