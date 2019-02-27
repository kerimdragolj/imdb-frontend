import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { AppSettings } from '../app.settings';
import 'rxjs/add/operator/map';

@Injectable()
export class RatingService {

  constructor(
    private http: Http
  ) { }

  getOne(id) {
    let header = new Headers();
    header.append('Content-Type', 'application/json');
    header.append('Authorization', 'bearer ' + localStorage.getItem('feathers-jwt'));

    return this.http.get(AppSettings.API_ENDPOINT + '/ratings/' + id, { headers: header }).map(res => res.json());
  }


  edit(id, data) {
    let header = new Headers();
    header.append('Content-Type', 'application/json');
    header.append('Authorization', 'bearer ' + localStorage.getItem('feathers-jwt'));
    
    return this.http.patch(AppSettings.API_ENDPOINT + '/ratings/' + id, data, { headers: header }).map(res => res.json());
  }

  delete(id) {
    let header = new Headers();
    header.append('Content-Type', 'application/json');
    header.append('Authorization', 'bearer ' + localStorage.getItem('feathers-jwt'));

    return this.http.get(AppSettings.API_ENDPOINT + '/ratings/' + id, { headers: header }).map(res => res.json());
  }

  create(value, userId, movieShowId, tab) {
    let header = new Headers();
    header.append('Content-Type', 'application/json');
    header.append('Authorization', 'bearer ' + localStorage.getItem('feathers-jwt'));

    let rating = {
      rating: value,
      userId: userId,
      movieId: null,
      showId: null,
    }

    if(tab == 'movies') {
      rating.movieId = movieShowId;
      return this.http.post(AppSettings.API_ENDPOINT + '/ratings', rating, { headers: header }).map(res => res.json());
    } else {
      rating.showId = movieShowId;
      return this.http.post(AppSettings.API_ENDPOINT + '/ratings', rating, { headers: header }).map(res => res.json());
    }
  }

}
